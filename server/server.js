// Cập nhật server.js để thêm route applications và utils
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Thiết lập môi trường
dotenv.config();

// Kết nối tới MongoDB
connectDB();

// Khởi tạo Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/cvs', require('./routes/cvs'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/utils', require('./routes/utils'));

// Route API gốc
app.get('/', (req, res) => {
  res.json({ message: 'Chào mừng đến với API ConCaCon!' });
});

// Xử lý lỗi
app.use((req, res, next) => {
  const error = new Error(`Không tìm thấy - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Cổng server
const PORT = process.env.PORT || 5000;

// Bắt đầu server
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});