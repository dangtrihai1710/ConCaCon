// server/routes/jobs.js
const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Company = require('../models/Company');
const { auth, recruiter } = require('../middleware/auth');

// @route   GET /api/jobs
// @desc    Lấy danh sách công việc có lọc
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Tạo query
    let query = {};
    
    // Lọc theo keyword (tìm kiếm trong title và description)
    if (req.query.keyword) {
      query.$or = [
        { title: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } }
      ];
    }
    
    // Lọc theo ngành nghề
    if (req.query.industry) {
      query.industry = req.query.industry;
    }
    
    // Lọc theo địa điểm
    if (req.query.location) {
      query.location = { $regex: req.query.location, $options: 'i' };
    }
    
    // Lọc theo lương
    if (req.query.salary) {
      const [min, max] = req.query.salary.split('-').map(Number);
      
      if (min && max) {
        // Tìm các công việc có mức lương chồng chéo với khoảng min-max
        query.$or = [
          { 'salary.min': { $lte: max }, 'salary.max': { $gte: min } },
          { 'salary.min': { $gte: min, $lte: max } },
          { 'salary.max': { $gte: min, $lte: max } }
        ];
      } else if (min) {
        // Tìm các công việc có mức lương tối đa >= min
        query['salary.max'] = { $gte: min };
      } else if (max) {
        // Tìm các công việc có mức lương tối thiểu <= max
        query['salary.min'] = { $lte: max };
      }
    }
    
    // Chỉ lấy các việc làm đang active
    query.status = 'active';
    
    // Phân trang
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Tìm kiếm công việc
    const jobs = await Job.find(query)
      .sort({ postedDate: -1 })
      .skip(skip)
      .limit(limit)
      .populate('company');
    
    // Đếm tổng số kết quả
    const total = await Job.countDocuments(query);
    
    res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      jobs
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// @route   GET /api/jobs/highlighted
// @desc    Lấy danh sách công việc nổi bật
// @access  Public
router.get('/highlighted', async (req, res) => {
  try {
    // Lấy các công việc mới nhất
    const jobs = await Job.find({ status: 'active' })
      .sort({ postedDate: -1 })
      .limit(4)
      .populate('company');
    
    res.json(jobs);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// @route   GET /api/jobs/:id
// @desc    Lấy chi tiết công việc
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('company');
    
    if (!job) {
      return res.status(404).json({ message: 'Không tìm thấy công việc' });
    }
    
    // Tìm các công việc tương tự (cùng ngành hoặc cùng công ty)
    const similarJobs = await Job.find({
      _id: { $ne: job._id }, // Không lấy công việc hiện tại
      status: 'active',
      $or: [
        { industry: job.industry },
        { companyId: job.companyId }
      ]
    })
    .limit(3)
    .populate('company');
    
    res.json({
      job,
      similarJobs
    });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Không tìm thấy công việc' });
    }
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// @route   POST /api/jobs
// @desc    Tạo công việc mới
// @access  Private (Recruiter only)
router.post('/', auth, recruiter, async (req, res) => {
  try {
    const {
      title,
      companyId,
      description,
      requirements,
      benefits,
      salary,
      location,
      industry,
      level,
      type
    } = req.body;
    
    // Kiểm tra companyId có thuộc về recruiter không
    const company = await Company.findOne({ _id: companyId, userId: req.user.id });
    
    if (!company) {
      return res.status(400).json({ message: 'Bạn không có quyền đăng tin cho công ty này' });
    }
    
    // Tạo việc làm mới
    const job = new Job({
      title,
      companyId,
      description,
      requirements,
      benefits,
      salary,
      location,
      industry,
      level,
      type,
      user: req.user.id
    });
    
    await job.save();
    
    res.status(201).json(job);
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

// @route   PUT /api/jobs/:id
// @desc    Cập nhật công việc
// @access  Private (Recruiter only)
router.put('/:id', auth, recruiter, async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      benefits,
      salary,
      location,
      industry,
      level,
      type,
      status
    } = req.body;
    
    // Tìm công việc
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Không tìm thấy công việc' });
    }
    
    // Kiểm tra quyền sở hữu
    if (job.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Không có quyền cập nhật công việc này' });
    }
    
    // Cập nhật thông tin
    job.title = title || job.title;
    job.description = description || job.description;
    job.requirements = requirements || job.requirements;
    job.benefits = benefits || job.benefits;
    job.salary = salary || job.salary;
    job.location = location || job.location;
    job.industry = industry || job.industry;
    job.level = level || job.level;
    job.type = type || job.type;
    job.status = status || job.status;
    
    const updatedJob = await job.save();
    
    res.json(updatedJob);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Không tìm thấy công việc' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      res.status(400).json({ message: messages.join(', ') });
    } else {
      res.status(500).json({ message: 'Lỗi server' });
    }
  }
});

// @route   DELETE /api/jobs/:id
// @desc    Xóa công việc
// @access  Private (Recruiter only)
router.delete('/:id', auth, recruiter, async (req, res) => {
  try {
    // Tìm công việc
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Không tìm thấy công việc' });
    }
    
    // Kiểm tra quyền sở hữu
    if (job.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Không có quyền xóa công việc này' });
    }
    
    await job.deleteOne();
    
    res.json({ message: 'Xóa công việc thành công' });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Không tìm thấy công việc' });
    }
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// @route   GET /api/jobs/recruiter/myjobs
// @desc    Lấy danh sách công việc của nhà tuyển dụng
// @access  Private (Recruiter only)
router.get('/recruiter/myjobs', auth, recruiter, async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user.id })
      .sort({ postedDate: -1 })
      .populate('company');
    
    res.json(jobs);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// @route   GET /api/jobs/company/:companyId
// @desc    Lấy danh sách công việc của công ty
// @access  Public
router.get('/company/:companyId', async (req, res) => {
  try {
    const jobs = await Job.find({ 
      companyId: req.params.companyId,
      status: 'active'
    })
    .sort({ postedDate: -1 })
    .populate('company');
    
    res.json(jobs);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Không tìm thấy công ty' });
    }
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;