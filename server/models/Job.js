// server/models/Job.js
const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Vui lòng nhập tiêu đề công việc'],
    trim: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  description: {
    type: String,
    required: [true, 'Vui lòng nhập mô tả công việc']
  },
  requirements: {
    type: String,
    required: [true, 'Vui lòng nhập yêu cầu công việc']
  },
  benefits: {
    type: String,
    default: ''
  },
  salary: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: 'VNĐ' }
  },
  location: {
    type: String,
    required: [true, 'Vui lòng nhập địa điểm làm việc']
  },
  industry: {
    type: String,
    required: [true, 'Vui lòng chọn ngành nghề']
  },
  level: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'Toàn thời gian'
  },
  postedDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'draft', 'closed'],
    default: 'active'
  },
  // Thêm trường user để liên kết với nhà tuyển dụng đã đăng tin
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

// Tự động thêm thông tin công ty khi truy vấn
JobSchema.virtual('company', {
  ref: 'Company',
  localField: 'companyId',
  foreignField: '_id',
  justOne: true
});

// Đảm bảo virtuals được bao gồm
JobSchema.set('toJSON', { virtuals: true });
JobSchema.set('toObject', { virtuals: true });

// Tạo chỉ mục để tối ưu tìm kiếm
JobSchema.index({ title: 'text', description: 'text' });
JobSchema.index({ location: 1 });
JobSchema.index({ industry: 1 });
JobSchema.index({ status: 1 });

module.exports = mongoose.model('Job', JobSchema);