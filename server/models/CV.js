// server/models/CV.js
const mongoose = require('mongoose');

const CVSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  templateId: {
    type: String,
    enum: ['simple', 'modern', 'professional'],
    default: 'simple'
  },
  content: {
    personalInfo: {
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      address: { type: String, default: '' },
      title: { type: String, default: '' }
    },
    skills: [{ type: String }],
    experience: [{
      title: { type: String },
      company: { type: String },
      location: { type: String },
      startDate: { type: String },
      endDate: { type: String },
      current: { type: Boolean, default: false },
      description: { type: String }
    }],
    education: [{
      school: { type: String },
      degree: { type: String },
      field: { type: String },
      startDate: { type: String },
      endDate: { type: String },
      description: { type: String }
    }]
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware cập nhật ngày chỉnh sửa
CVSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model('CV', CVSchema);