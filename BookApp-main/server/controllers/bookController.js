const Book = require("../models/Book");
const BookCodes = require("../models/BookCodes");
const cloudinary = require("../../config/cloudinary");
/**
 * ➕ Create Book
 * (ต้อง login ก่อน — ใช้ session)
 */
exports.createBook = async (req, res) => {
  try {
    // 🔐 check session
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.files?.pdf) {
      return res.status(400).json({
        message: "PDF file is missing",
      });
    }

    // 🔢 generate bookCode
    const lastBook = await Book.findOne({ bookCode: { $exists: true } })
      .sort({ createdAt: -1 })
      .select("bookCode");

    let nextNumber = 1;
    if (lastBook?.bookCode) {
      const lastNumber = parseInt(lastBook.bookCode.split("-")[1], 10);
      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }

    const bookCode = `BK-${String(nextNumber).padStart(4, "0")}`;

    const coverImage = req.files?.cover
      ? {
          url: req.files.cover[0].path,
          public_id: req.files.cover[0].filename,
        }
      : undefined; // ❗ ปล่อยให้ schema ใส่ default เอง

    const book = await Book.create({
      title: req.body.title?.trim(),
      bookCode,
      coverImage,
      pdfFile: {
        url: req.files.pdf[0].path,
        public_id: req.files.pdf[0].filename,
      },
      addedBy: req.session.user.id,
    });

    res.status(201).json({
      message: "Book created successfully",
      book,
    });
  } catch (err) {
    console.error("CREATE BOOK ERROR:", err);

    if (err.code === 11000) {
      return res.status(409).json({
        message: "Book code already exists",
      });
    }

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * 🔎 Get books owned by logged-in user from BookCodes
 */
exports.getMyBooksFromBookCodes = async (req, res) => {
  try {
        console.log("SESSION:", req.session); // 👈 ใส่บรรทัดนี้
    const userId = req.session?.user?.id || req.session?.userId || req.session?.user?._id;
    console.log("USERID:", userId); // 👈 ใส่บรรทัดนี้
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const codes = await BookCodes.find({ user: userId })
      .populate({ path: "bookId" })
      .sort({ createdAt: -1 })
      .lean();
    res.json(codes);
  } catch (err) {
    console.error("GET MY BOOKS FROM CODES ERROR:", err);
    res.status(500).json({ message: "Failed to fetch user books" });
  }
};

exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find({})
      .populate("addedBy", "email") // 🔥 แสดง email คนเพิ่ม
      .sort({ createdAt: -1 })
      .lean();

    res.json(books);
  } catch (err) {
    console.error("GET BOOKS ERROR 👉", err);
    res.status(500).json({ message: "Failed to fetch books" });
  }
};

/**
 * ❌ Delete Book
 */
exports.deleteBook = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // 🖼️ delete cover
    if (book.coverImage?.public_id) {
      await cloudinary.uploader.destroy(book.coverImage.public_id);
    }

    // 📄 delete pdf
    if (book.pdfFile?.public_id) {
      await cloudinary.uploader.destroy(book.pdfFile.public_id, {
        resource_type: "raw",
      });
    }

    await book.deleteOne();

    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error("DELETE BOOK ERROR:", err);
    res.status(500).json({ message: "Failed to delete book" });
  }
};

/**
 * 📊 Dashboard Data
 */
exports.getDashboardData = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.session.user.id;

    const totalBooks = await Book.countDocuments();
    const myBooks = await Book.countDocuments({ addedBy: userId });

    // 🕒 history (เฉพาะของตัวเอง)
    const history = await Book.find({ addedBy: userId })
      .populate("addedBy", "email")
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title createdAt");

    res.json({
      totalBooks,
      myBooks,
      history,
    });
  } catch (err) {
    console.error("DASHBOARD ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getBookBysearch = async (req, res) => {
  try {
    const { query } = req.params;
    if (!query || query.trim() === "") return res.json([]);

    // ตรวจสอบ session user
       console.log("SESSION:", req.session); // 👈
    const userId = req.session?.user?.id || req.session?.userId || req.session?.user?._id;
    console.log("USERID:", userId); // 👈
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // หา BookCodes ของ user แล้ว populate ข้อมูลหนังสือ
    const codes = await BookCodes.find({ user: userId }).populate("bookId").lean();

    const rx = new RegExp(query, "i");
    const matched = codes
      .filter((c) => c.bookId && rx.test(c.bookId.title))
      .map((c) => c.bookId);

    res.json(matched);
  } catch (err) {
    console.error("SEARCH BOOK ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
