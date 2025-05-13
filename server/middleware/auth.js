// server/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware xác thực
const auth = async (req, res, next) => {
  try {
    // Kiểm tra header Authorization
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Không tìm thấy token xác thực' });
    }

    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'concacon_secret_key');
    
    // Tìm user với id từ token và kiểm tra xem token có trong mảng tokens không
    const user = await User.findById(decoded.id);
    
    if (!user) {
      throw new Error();
    }

    // Lưu thông tin người dùng vào request để sử dụng trong các controllers
    req.user = user;
    req.token = token;
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Vui lòng đăng nhập để tiếp tục' });
  }
};

// Middleware kiểm tra vai trò nhà tuyển dụng
const recruiter = (req, res, next) => {
  if (req.user && req.user.role === 'recruiter') {
    next();
  } else {
    res.status(403).json({ message: 'Chỉ nhà tuyển dụng mới có quyền truy cập' });
  }
};

// Middleware kiểm tra vai trò ứng viên
const candidate = (req, res, next) => {
  if (req.user && req.user.role === 'candidate') {
    next();
  } else {
    res.status(403).json({ message: 'Chỉ ứng viên mới có quyền truy cập' });
  }
};

module.exports = { auth, recruiter, candidate };