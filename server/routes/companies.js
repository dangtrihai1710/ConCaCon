// server/routes/companies.js
const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const { auth, recruiter } = require('../middleware/auth');

// @route   GET /api/companies
// @desc    Lấy danh sách công ty
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Tạo query
    let query = {};
    
    // Lọc theo tên
    if (req.query.name) {
      query.name = { $regex: req.query.name, $options: 'i' };
    }
    
    // Lọc theo ngành nghề
    if (req.query.industry) {
      query.industry = req.query.industry;
    }
    
    // Lọc theo địa điểm
    if (req.query.location) {
      query.location = { $regex: req.query.location, $options: 'i' };
    }
    
    // Phân trang
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Tìm kiếm công ty
    const companies = await Company.find(query)
      .sort({ rating: -1 })
      .skip(skip)
      .limit(limit);
    
    // Đếm tổng số kết quả
    const total = await Company.countDocuments(query);
    
    res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      companies
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// @route   GET /api/companies/top
// @desc    Lấy danh sách công ty hàng đầu
// @access  Public
router.get('/top', async (req, res) => {
  try {
    const companies = await Company.find()
      .sort({ rating: -1 })
      .limit(3);
    
    res.json(companies);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// @route   GET /api/companies/:id
// @desc    Lấy chi tiết công ty
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    
    if (!company) {
      return res.status(404).json({ message: 'Không tìm thấy công ty' });
    }
    
    res.json(company);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Không tìm thấy công ty' });
    }
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// @route   POST /api/companies
// @desc    Tạo công ty mới
// @access  Private (Recruiter only)
router.post('/', auth, recruiter, async (req, res) => {
  try {
    const {
      name,
      logo,
      coverImage,
      description,
      size,
      website,
      industry,
      location
    } = req.body;
    
    // Kiểm tra công ty có tồn tại chưa
    let companyExists = await Company.findOne({ name });
    if (companyExists) {
      return res.status(400).json({ message: 'Công ty này đã tồn tại' });
    }
    
    // Tạo công ty mới
    const company = new Company({
      name,
      logo,
      coverImage,
      description,
      size,
      website,
      industry,
      location,
      userId: req.user.id
    });
    
    await company.save();
    
    res.status(201).json(company);
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

// @route   PUT /api/companies/:id
// @desc    Cập nhật thông tin công ty
// @access  Private (Recruiter only)
router.put('/:id', auth, recruiter, async (req, res) => {
  try {
    const {
      logo,
      coverImage,
      description,
      size,
      website,
      industry,
      location
    } = req.body;
    
    // Tìm công ty
    const company = await Company.findById(req.params.id);
    
    if (!company) {
      return res.status(404).json({ message: 'Không tìm thấy công ty' });
    }
    
    // Kiểm tra quyền sở hữu
    if (company.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Không có quyền cập nhật công ty này' });
    }
    
    // Cập nhật thông tin
    company.logo = logo || company.logo;
    company.coverImage = coverImage || company.coverImage;
    company.description = description || company.description;
    company.size = size || company.size;
    company.website = website || company.website;
    company.industry = industry || company.industry;
    company.location = location || company.location;
    
    const updatedCompany = await company.save();
    
    res.json(updatedCompany);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Không tìm thấy công ty' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      res.status(400).json({ message: messages.join(', ') });
    } else {
      res.status(500).json({ message: 'Lỗi server' });
    }
  }
});

// @route   POST /api/companies/:id/reviews
// @desc    Thêm đánh giá công ty
// @access  Private
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const {
      rating,
      title,
      position,
      employmentStatus,
      pros,
      cons,
      comment
    } = req.body;
    
    // Tìm công ty
    const company = await Company.findById(req.params.id);
    
    if (!company) {
      return res.status(404).json({ message: 'Không tìm thấy công ty' });
    }
    
    // Kiểm tra người dùng đã đánh giá chưa
    const alreadyReviewed = company.reviews.find(
      review => review.userId.toString() === req.user.id
    );
    
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Bạn đã đánh giá công ty này rồi' });
    }
    
    // Tạo đánh giá
    const review = {
      userId: req.user.id,
      rating: Number(rating),
      title,
      position,
      employmentStatus,
      pros,
      cons,
      comment,
      date: Date.now()
    };
    
    // Thêm vào mảng reviews
    company.reviews.push(review);
    
    // Cập nhật rating trung bình
    const total = company.reviews.reduce((sum, item) => sum + item.rating, 0);
    company.rating = (total / company.reviews.length).toFixed(1);
    
    await company.save();
    
    res.status(201).json({ message: 'Đánh giá đã được thêm' });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Không tìm thấy công ty' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      res.status(400).json({ message: messages.join(', ') });
    } else {
      res.status(500).json({ message: 'Lỗi server' });
    }
  }
});

// @route   GET /api/companies/recruiter/mycompanies
// @desc    Lấy danh sách công ty của nhà tuyển dụng
// @access  Private (Recruiter only)
router.get('/recruiter/mycompanies', auth, recruiter, async (req, res) => {
  try {
    const companies = await Company.find({ userId: req.user.id });
    
    res.json(companies);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;