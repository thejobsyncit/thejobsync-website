const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true },
  category: { type: String, default: 'General' },
  author: { type: String, default: 'The Jobsync Team' },
  authorRole: { type: String, default: 'IT Consultant' },
  date: { type: String },
  readTime: { type: String },
  coverImage: { type: String, default: '' },
  images: [{ type: String }],
  excerpt: { type: String },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
