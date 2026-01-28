const bcrypt = require("bcrypt");
const User = require("../models/User");
const Otp = require("../models/Otp");
const sendOtpEmail = require("../utils/sendOtpEmail");


exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    /* 1️⃣ validate */
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    /* 2️⃣ check email */
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    /* 3️⃣ hash password */
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    /* 4️⃣ create user (ยังไม่ verified) */
    const user = await User.create({
      email,
      password: hashedPassword,
      isVerified: false
    });

    /* 5️⃣ generate OTP */
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.create({
      userId: user._id,
      otp: otpCode,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 นาที
    });

    /* 6️⃣ (optional) ส่ง OTP ทาง email ตรงนี้ */
    await sendOtpEmail(email, otpCode);

    res.status(201).json({
      message: "Register success. Please verify OTP",
      userId: user._id
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({
      message: "Server error"
    });
  }
};

//LOGIN (SESSION)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    // 🔥 SET SESSION
    req.session.user = {
      id: user._id,
      email: user.email
    };

    res.json({
      message: "Login success",
      user: {
        id: user._id,
        email: user.email
      }
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({
      message: "Server error"
    });
  }
};

/* =====================
   LOGOUT
===================== */
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("LOGOUT ERROR:", err);
      return res.status(500).json({
        message: "Logout failed"
      });
    }

    res.clearCookie("connect.sid", { path: "/" });

    res.json({
      message: "Logout success"
    });
  });
};

/* =====================
   CHECK AUTH (OPTIONAL)
===================== */
exports.me = (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({
      message: "Unauthorized"
    });
  }

  res.json({
    user: req.session.user
  });
};
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found");
      return res.status(400).json({ message: "User not found" });
    }

    const otpRecord = await Otp.findOne({ userId: user._id });

    if (!otpRecord) {
      console.log("❌ OTP not found");
      return res.status(400).json({ message: "OTP not found" });
    }

    // ⏰ check expire
    if (otpRecord.expiresAt < new Date()) {
      console.log("❌ OTP expired");
      return res.status(400).json({ message: "OTP expired" });
    }

    // 🔢 check match
    if (otpRecord.otp !== otp) {
      console.log("❌ OTP incorrect");
      return res.status(400).json({ message: "OTP incorrect" });
    }

    // ✅ SUCCESS
    user.isVerified = true;
    await user.save();
    await Otp.deleteOne({ _id: otpRecord._id });

    console.log("✅ OTP verified successfully for:", email);

    res.json({ message: "OTP verified successfully" });

  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // ลบ OTP เก่า
    await Otp.deleteMany({ userId: user._id });

    // สร้าง OTP ใหม่
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.create({
      userId: user._id,
      otp: newOtp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });

    console.log("🔁 Resent OTP:", newOtp);

    // 👉 ส่ง email ตรงนี้
    await sendOtpEmail(email, newOtp);

    res.json({ message: "OTP resent successfully" });

  } catch (err) {
    console.error("RESEND OTP ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
