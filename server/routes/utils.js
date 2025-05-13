// server/routes/utils.js
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

// @route   GET /api/utils/industries
// @desc    Lấy danh sách ngành nghề
// @access  Public
router.get('/industries', (req, res) => {
  // Danh sách ngành nghề cố định
  const industries = [
    { id: 'it', name: 'Công nghệ thông tin' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'finance', name: 'Tài chính - Ngân hàng' },
    { id: 'education', name: 'Giáo dục - Đào tạo' },
    { id: 'retail', name: 'Bán lẻ' },
    { id: 'healthcare', name: 'Y tế - Dược phẩm' },
    { id: 'construction', name: 'Xây dựng' },
    { id: 'hospitality', name: 'Nhà hàng - Khách sạn' },
    { id: 'manufacturing', name: 'Sản xuất' },
    { id: 'logistics', name: 'Vận tải - Logistics' },
    { id: 'media', name: 'Truyền thông' },
    { id: 'engineering', name: 'Kỹ thuật' },
    { id: 'agriculture', name: 'Nông nghiệp' },
    { id: 'legal', name: 'Luật' },
    { id: 'tourism', name: 'Du lịch' }
  ];
  
  res.json(industries);
});

// @route   GET /api/utils/locations
// @desc    Lấy danh sách địa điểm
// @access  Public
router.get('/locations', (req, res) => {
  // Danh sách địa điểm cố định
  const locations = [
    { id: 'hcm', name: 'TP. Hồ Chí Minh' },
    { id: 'hanoi', name: 'Hà Nội' },
    { id: 'danang', name: 'Đà Nẵng' },
    { id: 'cantho', name: 'Cần Thơ' },
    { id: 'binhduong', name: 'Bình Dương' },
    { id: 'dongnai', name: 'Đồng Nai' },
    { id: 'hue', name: 'Huế' },
    { id: 'haiphong', name: 'Hải Phòng' },
    { id: 'quangninh', name: 'Quảng Ninh' },
    { id: 'khanhhoa', name: 'Khánh Hòa' },
    { id: 'nhatrang', name: 'Nha Trang' },
    { id: 'vungtau', name: 'Vũng Tàu' },
    { id: 'dalat', name: 'Đà Lạt' },
    { id: 'other', name: 'Tỉnh thành khác' }
  ];
  
  res.json(locations);
});

// @route   GET /api/utils/company-sizes
// @desc    Lấy danh sách quy mô công ty
// @access  Public
router.get('/company-sizes', (req, res) => {
  // Danh sách quy mô công ty
  const companySizes = [
    { id: 'under50', name: 'Dưới 50 nhân viên' },
    { id: '50-100', name: '50-100 nhân viên' },
    { id: '100-500', name: '100-500 nhân viên' },
    { id: '500-1000', name: '500-1000 nhân viên' },
    { id: 'over1000', name: 'Trên 1000 nhân viên' }
  ];
  
  res.json(companySizes);
});

// @route   GET /api/utils/job-levels
// @desc    Lấy danh sách cấp bậc công việc
// @access  Public
router.get('/job-levels', (req, res) => {
  // Danh sách cấp bậc công việc
  const jobLevels = [
    { id: 'intern', name: 'Thực tập sinh' },
    { id: 'fresher', name: 'Fresher' },
    { id: 'junior', name: 'Junior' },
    { id: 'middle', name: 'Middle' },
    { id: 'senior', name: 'Senior' },
    { id: 'leader', name: 'Team Leader' },
    { id: 'manager', name: 'Manager' },
    { id: 'director', name: 'Director' },
    { id: 'executive', name: 'C-Level Executive' }
  ];
  
  res.json(jobLevels);
});

// @route   GET /api/utils/job-types
// @desc    Lấy danh sách loại hình công việc
// @access  Public
router.get('/job-types', (req, res) => {
  // Danh sách loại hình công việc
  const jobTypes = [
    { id: 'fulltime', name: 'Toàn thời gian' },
    { id: 'parttime', name: 'Bán thời gian' },
    { id: 'contract', name: 'Hợp đồng' },
    { id: 'remote', name: 'Từ xa' },
    { id: 'freelance', name: 'Freelance' },
    { id: 'internship', name: 'Thực tập' }
  ];
  
  res.json(jobTypes);
});

module.exports = router;