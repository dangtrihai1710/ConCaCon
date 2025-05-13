// server/routes/cvs.js
const express = require('express');
const router = express.Router();
const CV = require('../models/CV');
const { auth, candidate } = require('../middleware/auth');

// @route   GET /api/cvs
// @desc    Lấy danh sách CV của người dùng
// @access  Private (Candidate only)
router.get('/', auth, candidate, async (req, res) => {
  try {
    const cvs = await CV.find({ userId: req.user.id })
      .sort({ updatedAt: -1 });
    
    res.json(cvs);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// @route   GET /api/cvs/:id
// @desc    Lấy chi tiết CV
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const cv = await CV.findById(req.params.id);
    
    if (!cv) {
      return res.status(404).json({ message: 'Không tìm thấy CV' });
    }
    
    // Kiểm tra quyền sở hữu hoặc nhà tuyển dụng có thể xem CV của ứng viên
    if (cv.userId.toString() !== req.user.id && req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Không có quyền xem CV này' });
    }
    
    res.json(cv);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Không tìm thấy CV' });
    }
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// @route   POST /api/cvs
// @desc    Tạo CV mới
// @access  Private (Candidate only)
router.post('/', auth, candidate, async (req, res) => {
  try {
    const { templateId, content } = req.body;
    
    // Tạo CV mới
    const cv = new CV({
      userId: req.user.id,
      templateId,
      content
    });
    
    await cv.save();
    
    res.status(201).json(cv);
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

// @route   PUT /api/cvs/:id
// @desc    Cập nhật CV
// @access  Private (Candidate only)
router.put('/:id', auth, candidate, async (req, res) => {
  try {
    const { templateId, content } = req.body;
    
    // Tìm CV
    const cv = await CV.findById(req.params.id);
    
    if (!cv) {
      return res.status(404).json({ message: 'Không tìm thấy CV' });
    }
    
    // Kiểm tra quyền sở hữu
    if (cv.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Không có quyền cập nhật CV này' });
    }
    
    // Cập nhật CV
    const updatedCV = await CV.findByIdAndUpdate(
      req.params.id,
      {
        templateId: templateId || cv.templateId,
        content: content || cv.content,
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    res.json(updatedCV);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Không tìm thấy CV' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      res.status(400).json({ message: messages.join(', ') });
    } else {
      res.status(500).json({ message: 'Lỗi server' });
    }
  }
});

// @route   DELETE /api/cvs/:id
// @desc    Xóa CV
// @access  Private (Candidate only)
router.delete('/:id', auth, candidate, async (req, res) => {
  try {
    // Tìm CV
    const cv = await CV.findById(req.params.id);
    
    if (!cv) {
      return res.status(404).json({ message: 'Không tìm thấy CV' });
    }
    
    // Kiểm tra quyền sở hữu
    if (cv.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Không có quyền xóa CV này' });
    }
    
    await cv.deleteOne();
    
    res.json({ message: 'Xóa CV thành công' });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Không tìm thấy CV' });
    }
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;