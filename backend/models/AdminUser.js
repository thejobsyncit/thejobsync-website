const mongoose = require('mongoose');

const adminUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'Administrator' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.AdminUser || mongoose.model('AdminUser', adminUserSchema);
