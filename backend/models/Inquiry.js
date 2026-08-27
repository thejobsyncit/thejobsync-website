const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: 'N/A' },
  message: { type: String, required: true },
  date: { type: String },
  status: { type: String, enum: ['New', 'In Progress', 'Contacted', 'Resolved'], default: 'New' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema);
