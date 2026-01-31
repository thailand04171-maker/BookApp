const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
    console.log("MongoDB Connected to:", mongoose.connection.name);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
