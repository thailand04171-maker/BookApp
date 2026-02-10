const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (buffer, folder = "") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "image",
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      )
      .end(buffer);
  });
};

module.exports = uploadToCloudinary;
