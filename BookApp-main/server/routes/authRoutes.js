const express = require("express");
const router = express.Router();

// ✅ import logout มาด้วย
const {
  register,
  login,
  logout,
  verifyOtp,
  resendOtp,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

module.exports = router;
