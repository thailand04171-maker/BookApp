const Book = require("../models/Book");
const BookCode = require('../models/BookCode');

exports.addBookByCode = async (req, res) => {
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
    );

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
};

