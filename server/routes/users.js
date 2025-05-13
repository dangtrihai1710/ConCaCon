// server/routes/users.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// @route   POST /api/users/register
// @desc    Đăng ký người dùng mới
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Kiểm tra email đã tồn tại
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }

    // Tạo người dùng mới
    user = new User({
      email,
      password,
      role: role || 'candidate'
    });

    // Lưu người dùng (mật khẩu sẽ được hash qua middleware)
    await user.save();

    // Tạo token
    const token = user.getSignedJwtToken();

    // Không trả về password
    const userResponse = {
      id: user._id,
      email: user.email,
      role: user.role,
      profile: user.profile
    };

    res.status(201).json({
      success: true,
      user: userResponse,
      token
    });
  } catch (error) {
    console.error(error.message);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      res.status(400).json({ message: messages.join(', ') });
    } else {
      res.status(500).json({ message: 'Lỗi server' });
    }
  }
});

// @route   POST /api/users/login
// @desc    Đăng nhập người dùng
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra email và password
    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' });
    }

    // Kiểm tra người dùng tồn tại
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    // Kiểm tra mật khẩu
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    // Tạo token
    const token = user.getSignedJwtToken();

    // Không trả về password
    const userResponse = {
      id: user._id,
      email: user.email,
      role: user.role,
      profile: user.profile
    };

    res.json({
      success: true,
      user: userResponse,
      token
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// @route   GET /api/users/profile
// @desc    Lấy thông tin profile người dùng
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    // req.user đã được set từ middleware auth
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// @route   PUT /api/users/profile
// @desc    Cập nhật thông tin profile người dùng
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    
    // Cập nhật thông tin
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { 
        'profile.name': name,
        'profile.phone': phone,
        'profile.address': address
      },
      { new: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// @route   PUT /api/users/avatar
// @desc    Cập nhật avatar người dùng
// @access  Private
router.put('/avatar', auth, async (req, res) => {
  try {
    const { avatar } = req.body;
    
    if (!avatar) {
      return res.status(400).json({ message: 'Vui lòng cung cấp URL avatar' });
    }
    
    // Cập nhật avatar
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { 'profile.avatar': avatar },
      { new: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// @route   PUT /api/users/password
// @desc    Đổi mật khẩu người dùng
// @access  Private
router.put('/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đủ thông tin' });
    }
    
    // Lấy user với password
    const user = await User.findById(req.user.id).select('+password');
    
    // Kiểm tra mật khẩu hiện tại
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });
    }
    
    // Cập nhật mật khẩu mới
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;