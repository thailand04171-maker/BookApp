const express = require("express");
const router = express.Router();
const BookCode = require("../models/BookCode");
const upload = require("../middlewares/upload");
const auth = require("../middlewares/auth");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
// ✅ import logout มาด้วย
const isAuth = (req, res, next) => {
  console.log('SESSION USER:', req.session.user);
  if (!req.session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

router.post("/register", async (req, res) => {
  try {
    console.log("Enter  register");
    const { email, password } = req.body;

    /* 1️⃣ validate */
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    /* 2️⃣ check email */
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    /* 3️⃣ hash password */
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      password: hashedPassword,
    });
    console.log(user);
  
    res.status(201).json({
      message: "Register success. Please verify OTP",
      userId: user._id,
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
});
router.post("/login", async (req, res) => {
  console.log("enter login");
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // 🔥 SET SESSION
    req.session.user = {
      id: user._id,
      email: user.email,
      profilePic: user.profilePic || null,
    };
    console.log("✅ SET SESSION LOGIN SESSION:", req.session.user);
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    console.log("Check Token", token);
    res.json({
      message: "Login success",
      token,
      user: {
        id: user._id,
        email: user.email,
        profilePic: user.profilePic || null,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
});
router.post("/logout", (req, res) => {
  console.log("Enter logout");
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    console.log("🔥 SESSION DESTROYED");
    res.json({ message: "Logout success" });
  });
});
router.get('/profile', isAuth, async (req, res) => {
  console.log("Enter profile");
  try {
    console.log("📥 SESSION:", req.session);

    if (!req.session || !req.session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = req.session.user;

    const bookCount = await BookCode.countDocuments({
      user: user.id, // 🔥 ใช้ id จาก session
      used: true,
    });

    res.json({
      email: user.email,
      bookCount,
      profilePic: user.profilePic || null,
    });
  } catch (err) {
    console.error("PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post('/add-by-code', isAuth, async (req, res) => {
  console.log("Enter add");
  try {
    const userId = req.session?.user?.id; // 🔥 เอาขึ้นบนสุด
    const { code } = req.body;

    console.log('SESSION USER:', req.session.user);
    console.log('ADD BY USER:', userId);
    console.log('ADD BY CODE HIT:', code);

    if (!userId) {
      return res.status(401).json({ message: 'กรุณา login' });
    }

    if (!code) {
      return res.status(400).json({ message: 'กรุณากรอกรหัสหนังสือ' });
    }

    const bookCode = await BookCode.findOneAndUpdate(
      { code, used: false },
      {
        used: true,
        user: userId,
        usedAt: new Date(),
      },
      { new: true }
    ).populate('bookId'); // 🔥 Populate เพื่อดึงข้อมูลรูปและ PDF ทันที

    if (!bookCode) {
      return res.status(400).json({
        message: 'รหัสไม่ถูกต้อง หรือถูกใช้งานไปแล้ว',
      });
    }

    return res.json({
      message: 'เพิ่มหนังสือสำเร็จ',
      book: {
        bookId: bookCode.bookId,
        bookTitle: bookCode.bookTitle,
      },
    });
  } catch (err) {
    console.error('ADD BOOK ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.post("/upload-profile-pic",
  auth,
  upload.single("profilePic"),
  async (req, res) => {
    console.log("Enter upload-profile-pic");
    try {
      const userId = req.user.id; // มาจาก JWT
      console.log(userId)
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const result = await uploadToCloudinary(req.file.buffer, "User-Profile");

      const user = await User.findById(userId);
      user.profilePic = result.secure_url;
      await user.save();

      res.json({ profilePic: result.secure_url });
    } catch (err) {
      console.error(err);
      res.status(500).send('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  }
);
// ✅ แก้ไข: เขียน Logic ตรงนี้เพื่อให้ populate bookId ได้ชัวร์ (แก้ปัญหา bookId เป็น null/string)
router.get('/my-books', auth, async (req, res) => {
  try {
    const books = await BookCode.find({
      user: req.user.id,
      used: true
    }).populate('bookId');

    res.json(books);
  } catch (err) {
    console.error("GET MY BOOKS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

console.log("🔥 authRoutes loaded");
module.exports = router;
