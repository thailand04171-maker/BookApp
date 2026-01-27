const nodemailer = require("nodemailer");

const sendOtpEmail = async (toEmail, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // email ผู้ส่ง
      pass: process.env.EMAIL_PASS  // app password
    }
  });

  await transporter.sendMail({
    from: `"BookApp OTP" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Your OTP Code",
    html: `
      <h2>Your OTP Code</h2>
      <p>OTP ของคุณคือ:</p>
      <h1>${otp}</h1>
      <p>OTP นี้มีอายุ 5 นาที</p>
    `
  });
};

module.exports = sendOtpEmail;
