const express = require("express");
const router = express.Router();

// ✅ import logout มาด้วย
const {
  register,
  login,
  logout,
  verifyOtp,
  resendOtp,
  profile
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
router.get('/my-books', isAuth, getMyBooks);


module.exports = router;
