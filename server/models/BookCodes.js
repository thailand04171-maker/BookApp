const mongoose = require("mongoose");
const User = require("./User");

const bookCodesSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  bookTitle: {
    type: String,
    required: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model("BookCodes", bookCodesSchema);
