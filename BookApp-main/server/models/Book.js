const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    bookCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    coverImage: {
      url: {
        type: String,
        default: "/images/default-cover.png",
      },
      public_id: {
        type: String,
        default: null,
      },
    },

    pdfFile: {
      url: String,
      public_id: String,
    },

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    }
  },
  {
    timestamps: true, // ✅ สร้าง createdAt / updatedAt ให้อัตโนมัติ
  },
);

module.exports = mongoose.model("Book", bookSchema);
