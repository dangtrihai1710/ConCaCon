// server/routes/applications.js
const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const CV = require('../models/CV');
const { auth, recruiter, candidate } = require('../middleware/auth');

// @route   GET /api/applications
// @desc    Lấy danh sách đơn ứng tuyển của người dùng (candidate) hoặc nhà tuyển dụng (recruiter)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role === 'candidate') {
      // Lấy danh sách đơn ứng tuyển của ứng viên
      const applications = await Application.find({ userId: req.user.id })
        .sort({ appliedDate: -1 })
        .populate({
          path: 'job',
          populate: { path: 'company' }
        })
        .populate('cv');
      
      res.json(applications);
    } else if (req.user.role === 'recruiter') {
      // Lấy danh sách công ty của nhà tuyển dụng
      const jobs = await Job.find({ user: req.user.id });
      const jobIds = jobs.map(job => job._id);
      
      // Lấy danh sách đơn ứng tuyển cho các việc làm của nhà tuyển dụng
      const applications = await Application.find({ jobId: { $in: jobIds } })
        .sort({ appliedDate: -1 })
        .populate({
          path: 'candidate',
          select: '_id profile.name profile.avatar email'
        })
        .populate('job')
        .populate('cv');
      
      res.json(applications);
    } else {
      return res.status(403).json({ message: 'Không có quyền truy cập' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// @route   GET /api/applications/:id
// @desc    Lấy chi tiết đơn ứng tuyển
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate({
        path: 'candidate',
        select: '_id profile.name profile.avatar email profile.phone profile.address'
      })
      .populate({
        path: 'job',
        populate: { path: 'company' }
      })
      .populate('cv');
    
    if (!application) {
      return res.status(404).json({ message: 'Không tìm thấy đơn ứng tuyển' });
    }
    
    // Kiểm tra quyền truy cập
    if (req.user.role === 'candidate' && application.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Không có quyền xem đơn ứng tuyển này' });
    }
    
    if (req.user.role === 'recruiter') {
      // Kiểm tra xem công việc có thuộc về nhà tuyển dụng không
      const job = await Job.findById(application.jobId);
      if (!job || job.user.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Không có quyền xem đơn ứng tuyển này' });
      }
    }
    
    res.json(application);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Không tìm thấy đơn ứng tuyển' });
    }
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// @route   POST /api/applications
// @desc    Ứng tuyển công việc
// @access  Private (Candidate only)
router.post('/', auth, candidate, async (req, res) => {
  try {
    const { jobId, cvId, coverLetter } = req.body;
    
    // Kiểm tra công việc có tồn tại
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Không tìm thấy công việc' });
    }
    
    // Kiểm tra CV có tồn tại và thuộc về ứng viên
    const cv = await CV.findOne({ _id: cvId, userId: req.user.id });
    if (!cv) {
      return res.status(400).json({ message: 'CV không hợp lệ' });
    }
    
    // Kiểm tra ứng viên đã ứng tuyển công việc này chưa
    const applicationExists = await Application.findOne({
      userId: req.user.id,
      jobId
    });
    
    if (applicationExists) {
      return res.status(400).json({ message: 'Bạn đã ứng tuyển công việc này rồi' });
    }
    
    // Tạo đơn ứng tuyển mới
    const application = new Application({
      userId: req.user.id,
      jobId,
      cvId,
      coverLetter
    });
    
    await application.save();
    
    res.status(201).json({
      success: true,
      message: 'Ứng tuyển thành công',
      application
    });
  } catch (error) {
    console.error(error.message);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      res.status(400).json({ message: messages.join(', ') });
    } else if (error.kind === 'ObjectId') {
      res.status(404).json({ message: 'Không tìm thấy công việc hoặc CV' });
    } else {
      res.status(500).json({ message: 'Lỗi server' });
    }
  }
});

// @route   PUT /api/applications/:id
// @desc    Cập nhật trạng thái đơn ứng tuyển (dành cho nhà tuyển dụng)
// @access  Private (Recruiter only)
router.put('/:id', auth, recruiter, async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    // Tìm đơn ứng tuyển
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Không tìm thấy đơn ứng tuyển' });
    }
    
    // Kiểm tra quyền truy cập (công việc thuộc về nhà tuyển dụng)
    const job = await Job.findById(application.jobId);
    if (!job || job.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Không có quyền cập nhật đơn ứng tuyển này' });
    }
    
    // Cập nhật trạng thái
    application.status = status || application.status;
    application.notes = notes || application.notes;
    application.updatedAt = Date.now();
    
    await application.save();
    
    res.json(application);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Không tìm thấy đơn ứng tuyển' });
    }
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// @route   DELETE /api/applications/:id
// @desc    Hủy đơn ứng tuyển (dành cho ứng viên)
// @access  Private (Candidate only)
router.delete('/:id', auth, candidate, async (req, res) => {
  try {
    // Tìm đơn ứng tuyển
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Không tìm thấy đơn ứng tuyển' });
    }
    
    // Kiểm tra quyền truy cập
    if (application.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Không có quyền hủy đơn ứng tuyển này' });
    }
    
    await application.deleteOne();
    
    res.json({ message: 'Đã hủy đơn ứng tuyển' });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Không tìm thấy đơn ứng tuyển' });
    }
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// @route   GET /api/applications/job/:jobId
// @desc    Lấy danh sách đơn ứng tuyển cho một công việc (dành cho nhà tuyển dụng)
// @access  Private (Recruiter only)
router.get('/job/:jobId', auth, recruiter, async (req, res) => {
  try {
    // Kiểm tra công việc có thuộc về nhà tuyển dụng không
    const job = await Job.findOne({
      _id: req.params.jobId,
      user: req.user.id
    });
    
    if (!job) {
      return res.status(404).json({ message: 'Không tìm thấy công việc hoặc bạn không có quyền truy cập' });
    }
    
    // Lấy danh sách đơn ứng tuyển
    const applications = await Application.find({ jobId: req.params.jobId })
      .sort({ appliedDate: -1 })
      .populate({
        path: 'candidate',
        select: '_id profile.name profile.avatar email'
      })
      .populate('cv');
    
    res.json(applications);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Không tìm thấy công việc' });
    }
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;