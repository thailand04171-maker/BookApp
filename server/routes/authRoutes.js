const express = require("express");
const router = express.Router();
const BookCode = require("../models/BookCode");
const upload = require("../middlewares/upload");

// ✅ import logout มาด้วย
const {
  register,
  login,
  logout,
  verifyOtp,
  resendOtp,
  profile,
  uploadProfilePic
} = require("../controllers/authController");
const {
  addBookByCode,
  getMyBooks
} = require("../controllers/bookController");

const isAuth = (req, res, next) => {
  console.log('SESSION USER:', req.session.user);
  if (!req.session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.get('/profile', profile);

router.post('/add-by-code', isAuth, addBookByCode);
router.post(
  "/upload-profile-pic",
  isAuth,
  upload.single("profilePic"),
  (req, res, next) => {
    console.log("SESSION:", req.session);
    console.log("FILE:", req.file);
    next();
  },
  uploadProfilePic
);


// ✅ แก้ไข: เขียน Logic ตรงนี้เพื่อให้ populate bookId ได้ชัวร์ (แก้ปัญหา bookId เป็น null/string)
router.get('/my-books', isAuth, async (req, res) => {
  try {
    const books = await BookCode.find({ user: req.session.user.id, used: true }).populate('bookId');
    res.json(books);
  } catch (err) {
    console.error("GET MY BOOKS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
