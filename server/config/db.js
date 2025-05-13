// server/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/concacon', {
      // Các options đã được deprecated trong Mongoose 6+
      // useNewUrlParser và useUnifiedTopology không cần thiết nữa
    });

    console.log(`MongoDB đã kết nối: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Lỗi: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;