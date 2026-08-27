const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, default: 'Engineering' },
  type: { type: String, default: 'Full-Time' },
  location: { type: String, default: 'Remote / Hybrid' },
  experience: { type: String, default: '2+ Years' },
  status: { type: String, default: 'Active' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Career || mongoose.model('Career', careerSchema);
