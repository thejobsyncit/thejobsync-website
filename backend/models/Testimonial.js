const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  id: { type: Number },
  name: { type: String, required: true },
  role: { type: String, default: 'Client' },
  company: { type: String, default: 'Enterprise Partner' },
  avatar: { type: String, default: '' },
  rating: { type: Number, default: 5 },
  category: { type: String, default: 'IT Consulting' },
  quote: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema);
