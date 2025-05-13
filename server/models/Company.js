// server/models/Company.js
const mongoose = require('mongoose');

// Schema đánh giá công ty
const ReviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Vui lòng đánh giá công ty'],
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: [true, 'Vui lòng nhập tiêu đề đánh giá'],
    trim: true
  },
  position: {
    type: String,
    required: [true, 'Vui lòng nhập vị trí công việc']
  },
  employmentStatus: {
    type: String,
    enum: ['Đang làm việc', 'Đã nghỉ việc', 'Đã phỏng vấn'],
    default: 'Đã nghỉ việc'
  },
  pros: {
    type: String,
    required: [true, 'Vui lòng nhập ưu điểm']
  },
  cons: {
    type: String,
    required: [true, 'Vui lòng nhập nhược điểm']
  },
  comment: {
    type: String,
    required: [true, 'Vui lòng nhập nhận xét']
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Schema công ty
const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên công ty'],
    trim: true
  },
  logo: {
    type: String,
    default: '/default-company-logo.png'
  },
  coverImage: {
    type: String,
    default: '/default-company-cover.jpg'
  },
  description: {
    type: String,
    required: [true, 'Vui lòng nhập mô tả công ty']
  },
  size: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  industry: {
    type: String,
    required: [true, 'Vui lòng chọn ngành nghề']
  },
  location: {
    type: String,
    required: [true, 'Vui lòng nhập địa điểm']
  },
  // Liên kết với người dùng tạo công ty (nhà tuyển dụng)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Đánh giá và đánh giá trung bình
  reviews: [ReviewSchema],
  rating: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Cập nhật rating khi thêm/sửa/xóa đánh giá
CompanySchema.pre('save', function(next) {
  if (this.reviews && this.reviews.length > 0) {
    // Tính toán rating trung bình
    const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating = (total / this.reviews.length).toFixed(1);
  } else {
    this.rating = 0;
  }
  next();
});

// Tạo chỉ mục tìm kiếm 
CompanySchema.index({ name: 'text', description: 'text' });
CompanySchema.index({ location: 1 });
CompanySchema.index({ industry: 1 });

module.exports = mongoose.model('Company', CompanySchema);