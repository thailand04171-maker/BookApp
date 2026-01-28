const express = require("express");
const router = express.Router();

const {
  createBook,
  getBooks,
  deleteBook,
  getDashboardData
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

// ❌ Delete book (ต้อง login)
router.delete("/:id", auth, deleteBook);

module.exports = router;
