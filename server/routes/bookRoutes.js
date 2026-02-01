const express = require("express");
const router = express.Router();

const {
  createBook,
  getBooks,
  deleteBook,
  getDashboardData,
  getBookBysearch,
  getMyBooksFromBookCodes,
} = require("../controllers/bookController");

const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

// ➕ Add book (ต้อง login)
router.post(
  "/",
  auth, // 🔥 สำคัญมาก
  upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "pdf", maxCount: 1 }
  ]),
  createBook
);

// 📊 Dashboard
router.get("/dashboard", auth, getDashboardData);

// 📚 Get all books (ต้อง login)
router.get("/", auth, getBooks);

// 🔎 Get books owned by current logged-in user (from BookCodes)
router.get("/my-books", auth, getMyBooksFromBookCodes);

// ❌ Delete book (ต้อง login)
router.delete("/:id", auth, deleteBook);

// 🔍 Search books (ต้องอยู่ท้ายสุดเพื่อไม่ให้ conflict กับ route อื่น)
router.get("/search/:query", getBookBysearch);

module.exports = router;
