const cloudinary = require("cloudinary").v2;

// This assumes you have cloudinary configured elsewhere, typically in your main server file
// using process.env variables for security.

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
