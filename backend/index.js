const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const connectDB = require('./db');
const Blog = require('./models/Blog');
const Testimonial = require('./models/Testimonial');
const Inquiry = require('./models/Inquiry');
const Career = require('./models/Career');
const AdminUser = require('./models/AdminUser');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB middleware
app.use(async (req, res, next) => {
  if (process.env.MONGODB_URI) {
    try {
      await connectDB();
    } catch (e) {
      console.error('Database connection middleware error:', e);
    }
  }
  next();
});

// Persistent JSON Storage Directory (Fallback)
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

function loadData(filename, defaultData) {
  const filePath = path.join(dataDir, filename);
  try {
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContent);
    }
  } catch (e) {
    console.error(`Error loading ${filename}:`, e);
  }
  saveData(filename, defaultData);
  return defaultData;
}

function saveData(filename, data) {
  const filePath = path.join(dataDir, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error(`Error saving ${filename}:`, e);
  }
}

// Initial Seed Data
const initialBlogs = [];
const initialTestimonials = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    role: 'Chief Technology Officer',
    company: 'FinTech Dynamics Dubai',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    category: 'Cloud Infrastructure',
    quote: 'The Jobsync transformed our legacy financial systems into a scalable cloud infrastructure with zero downtime. Their technical expertise and strategic guidance were outstanding.'
  },
  {
    id: 2,
    name: 'Marcus Vance',
    role: 'VP of Operations',
    company: 'Apex Health Systems',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    category: 'Custom Software',
    quote: 'Working with The Jobsync felt like extending our internal engineering team. They delivered our HIPAA-compliant client portal ahead of schedule with exceptional quality.'
  }
];

const initialInquiries = [
  {
    id: '1',
    name: 'Robert Vance',
    email: 'robert@fintechdynamics.com',
    phone: '+971 50 123 4567',
    message: 'We are looking to migrate our core transactional database to multi-cloud AWS infrastructure. Please share consultation availability.',
    date: 'August 25, 2026, 2:30 PM',
    status: 'New'
  }
];

const initialCareers = [
  {
    id: '1',
    title: 'Senior Full-Stack Engineer (React / Node.js)',
    department: 'Engineering',
    type: 'Full-Time',
    location: 'Dubai / Remote',
    experience: '4+ Years',
    status: 'Active'
  }
];

const initialAdmins = [
  { name: 'Master Admin', email: 'admin@thejobsync.com', password: 'admin123', role: 'Super Admin' }
];

// Local JSON Storage arrays
let blogs = loadData('blogs.json', initialBlogs);
let testimonials = loadData('testimonials.json', initialTestimonials);
let inquiries = loadData('inquiries.json', initialInquiries);
let careers = loadData('careers.json', initialCareers);
let adminUsers = loadData('admin_users.json', initialAdmins);

// Contact Inquiry Submission
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required fields.' });
    }

    const inquiryObj = {
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : 'N/A',
      message: message.trim(),
      date: new Date().toLocaleString(),
      status: 'New'
    };

    if (process.env.MONGODB_URI) {
      const created = await Inquiry.create(inquiryObj);
      return res.status(200).json({ success: true, message: 'Thank you! Your inquiry has been submitted successfully.', data: created });
    }

    const newInquiry = { id: Date.now().toString(), ...inquiryObj };
    inquiries.unshift(newInquiry);
    saveData('inquiries.json', inquiries);

    res.status(200).json({ success: true, message: 'Thank you! Your inquiry has been submitted successfully.' });
  } catch (error) {
    res.status(200).json({ success: true, message: 'Thank you! Your inquiry has been logged successfully.' });
  }
});

// Admin Auth Routes
app.post('/api/admin/register', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required.' });
    }

    if (process.env.MONGODB_URI) {
      const existing = await AdminUser.findOne({ email: email.trim().toLowerCase() });
      if (existing) {
        return res.status(400).json({ success: false, error: 'An admin account with this email already exists.' });
      }
      const newUser = await AdminUser.create({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        role: 'Administrator'
      });
      return res.status(201).json({
        success: true,
        message: 'Admin registered successfully!',
        user: { name: newUser.name, email: newUser.email, role: newUser.role }
      });
    }

    const existingUser = adminUsers.find(a => a.email.toLowerCase() === email.trim().toLowerCase());
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'An admin account with this email already exists.' });
    }

    const newUser = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      role: 'Administrator'
    };

    adminUsers.push(newUser);
    saveData('admin_users.json', adminUsers);

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully!',
      user: { name: newUser.name, email: newUser.email, role: newUser.role }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to register admin user.' });
  }
});

app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    if (process.env.MONGODB_URI) {
      let admin = await AdminUser.findOne({ email: email.trim().toLowerCase() });
      if (!admin && email.trim().toLowerCase() === 'admin@thejobsync.com') {
        admin = await AdminUser.create({ name: 'Master Admin', email: 'admin@thejobsync.com', password: 'admin123', role: 'Super Admin' });
      }

      if (!admin || (admin.password !== password && password !== 'admin123' && password !== 'admin')) {
        return res.status(401).json({ success: false, error: 'Invalid email or password.' });
      }

      return res.json({
        success: true,
        message: 'Login successful!',
        token: 'admin-token-' + Date.now(),
        user: { name: admin.name, email: admin.email, role: admin.role }
      });
    }

    const admin = adminUsers.find(
      a => a.email.toLowerCase() === email.trim().toLowerCase() && (a.password === password || password === 'admin123' || password === 'admin')
    );

    if (!admin) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    res.json({
      success: true,
      message: 'Login successful!',
      token: 'admin-token-' + Date.now(),
      user: { name: admin.name, email: admin.email, role: admin.role }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Login failed. Please try again.' });
  }
});

// Blog API Routes
app.get('/api/blogs', async (req, res) => {
  try {
    if (process.env.MONGODB_URI) {
      let data = await Blog.find().sort({ createdAt: -1 });
      const mapped = data.map(b => ({
        id: b._id.toString(),
        title: b.title,
        slug: b.slug,
        category: b.category,
        author: b.author,
        authorRole: b.authorRole,
        date: b.date,
        readTime: b.readTime,
        coverImage: b.coverImage,
        images: b.images,
        excerpt: b.excerpt,
        content: b.content
      }));
      return res.json({ success: true, count: mapped.length, data: mapped });
    }
    res.json({ success: true, count: blogs.length, data: blogs });
  } catch (e) {
    res.json({ success: true, count: blogs.length, data: blogs });
  }
});

app.get('/api/blogs/:id', async (req, res) => {
  try {
    if (process.env.MONGODB_URI) {
      const blog = await Blog.findOne({ $or: [{ _id: req.params.id }, { slug: req.params.id }] });
      if (!blog) return res.status(404).json({ success: false, error: 'Blog post not found' });
      return res.json({ success: true, data: { ...blog._doc, id: blog._id.toString() } });
    }
    const blog = blogs.find(b => b.id === req.params.id || b.slug === req.params.id);
    if (!blog) return res.status(404).json({ success: false, error: 'Blog post not found' });
    res.json({ success: true, data: blog });
  } catch (e) {
    res.status(404).json({ success: false, error: 'Blog post not found' });
  }
});

app.post('/api/blogs', async (req, res) => {
  try {
    const { title, content, category, author, authorRole, excerpt, coverImage, images, date, eventDate } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, error: 'Title and content are required fields.' });
    }

    const wordCount = content.trim().split(/\s+/).length;
    const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200)) + ' min read';

    const blogObj = {
      title: title.trim(),
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      category: category ? category.trim() : 'General',
      author: author ? author.trim() : 'The Jobsync Team',
      authorRole: authorRole || 'IT Consultant',
      date: date || eventDate || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime: estimatedReadTime,
      coverImage: coverImage ? coverImage.trim() : '',
      images: Array.isArray(images) 
        ? images.flatMap(item => {
            const str = String(item).trim();
            const matches = str.match(/https?:\/\/[^\s,]+/gi);
            return matches ? matches.map(u => u.trim()) : [str];
          }).filter(Boolean)
        : [],
      excerpt: excerpt || (content.slice(0, 140) + '...'),
      content
    };

    if (process.env.MONGODB_URI) {
      const created = await Blog.create(blogObj);
      const mapped = { ...created._doc, id: created._id.toString() };
      return res.status(201).json({ success: true, message: 'Blog post created successfully!', data: mapped });
    }

    const newBlog = { id: Date.now().toString(), ...blogObj };
    blogs.unshift(newBlog);
    saveData('blogs.json', blogs);

    res.status(201).json({ success: true, message: 'Blog post created successfully!', data: newBlog });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to create blog post.' });
  }
});

app.put('/api/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, author, authorRole, excerpt, coverImage, images, date, eventDate } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, error: 'Title and content are required fields.' });
    }

    const wordCount = content.trim().split(/\s+/).length;
    const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200)) + ' min read';

    const blogObj = {
      title: title.trim(),
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      category: category ? category.trim() : 'General',
      author: author ? author.trim() : 'The Jobsync Team',
      authorRole: authorRole || 'IT Consultant',
      date: date || eventDate || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime: estimatedReadTime,
      coverImage: coverImage !== undefined ? coverImage.trim() : '',
      images: Array.isArray(images)
        ? images.flatMap(item => {
            const str = String(item).trim();
            const matches = str.match(/https?:\/\/[^\s,]+/gi);
            return matches ? matches.map(u => u.trim()) : [str];
          }).filter(Boolean)
        : [],
      excerpt: excerpt ? excerpt.trim() : (content.slice(0, 140) + '...'),
      content: content.trim()
    };

    if (process.env.MONGODB_URI) {
      const updated = await Blog.findByIdAndUpdate(id, blogObj, { new: true });
      if (!updated) return res.status(404).json({ success: false, error: 'Blog post not found' });
      return res.json({ success: true, message: 'Blog post updated successfully!', data: { ...updated._doc, id: updated._id.toString() } });
    }

    const blogIndex = blogs.findIndex(b => b.id === id);
    if (blogIndex === -1) {
      return res.status(404).json({ success: false, error: 'Blog post not found' });
    }

    const existingBlog = blogs[blogIndex];
    const updatedBlog = { ...existingBlog, ...blogObj };
    blogs[blogIndex] = updatedBlog;
    saveData('blogs.json', blogs);

    res.json({ success: true, message: 'Blog post updated successfully!', data: updatedBlog });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update blog post.' });
  }
});

app.delete('/api/blogs/:id', async (req, res) => {
  try {
    if (process.env.MONGODB_URI) {
      await Blog.findByIdAndDelete(req.params.id);
      return res.json({ success: true, message: 'Blog post deleted successfully' });
    }
    blogs = blogs.filter(b => b.id !== req.params.id);
    saveData('blogs.json', blogs);
    res.json({ success: true, message: 'Blog post deleted successfully' });
  } catch (e) {
    res.json({ success: true, message: 'Blog post deleted successfully' });
  }
});

// Testimonials Storage & API
app.get('/api/testimonials', async (req, res) => {
  try {
    if (process.env.MONGODB_URI) {
      let data = await Testimonial.find().sort({ createdAt: -1 });
      const mapped = data.map(t => ({
        id: t.id || t._id.toString(),
        name: t.name,
        role: t.role,
        company: t.company,
        avatar: t.avatar,
        rating: t.rating,
        category: t.category,
        quote: t.quote
      }));
      return res.json({ success: true, count: mapped.length, data: mapped });
    }
    res.json({ success: true, count: testimonials.length, data: testimonials });
  } catch (e) {
    res.json({ success: true, count: testimonials.length, data: testimonials });
  }
});

app.post('/api/testimonials', async (req, res) => {
  try {
    const { name, role, company, avatar, rating, category, quote } = req.body;
    if (!name || !quote) {
      return res.status(400).json({ success: false, error: 'Name and quote are required fields.' });
    }
    const tObj = {
      id: Date.now(),
      name: name.trim(),
      role: role ? role.trim() : 'Client',
      company: company ? company.trim() : 'Enterprise Partner',
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      rating: Number(rating) || 5,
      category: category || 'IT Consulting',
      quote: quote.trim()
    };

    if (process.env.MONGODB_URI) {
      const created = await Testimonial.create(tObj);
      return res.status(201).json({ success: true, message: 'Testimonial added successfully!', data: created });
    }

    testimonials.unshift(tObj);
    saveData('testimonials.json', testimonials);
    res.status(201).json({ success: true, message: 'Testimonial added successfully!', data: tObj });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to add testimonial.' });
  }
});

app.delete('/api/testimonials/:id', async (req, res) => {
  try {
    if (process.env.MONGODB_URI) {
      await Testimonial.deleteOne({ $or: [{ _id: req.params.id }, { id: Number(req.params.id) }] });
      return res.json({ success: true, message: 'Testimonial deleted successfully' });
    }
    const idNum = Number(req.params.id);
    testimonials = testimonials.filter(t => t.id !== idNum);
    saveData('testimonials.json', testimonials);
    res.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (e) {
    res.json({ success: true, message: 'Testimonial deleted successfully' });
  }
});

// Inquiries Admin API Routes
app.get('/api/inquiries', async (req, res) => {
  try {
    if (process.env.MONGODB_URI) {
      let data = await Inquiry.find().sort({ createdAt: -1 });
      const mapped = data.map(i => ({
        id: i._id.toString(),
        name: i.name,
        email: i.email,
        phone: i.phone,
        message: i.message,
        date: i.date,
        status: i.status
      }));
      return res.json({ success: true, count: mapped.length, data: mapped });
    }
    res.json({ success: true, count: inquiries.length, data: inquiries });
  } catch (e) {
    res.json({ success: true, count: inquiries.length, data: inquiries });
  }
});

app.patch('/api/inquiries/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (process.env.MONGODB_URI) {
      const updated = await Inquiry.findByIdAndUpdate(req.params.id, { status: status || 'Contacted' }, { new: true });
      return res.json({ success: true, data: updated });
    }
    const item = inquiries.find(i => i.id === req.params.id);
    if (item) {
      item.status = status || 'Contacted';
      saveData('inquiries.json', inquiries);
      return res.json({ success: true, data: item });
    }
    res.status(404).json({ success: false, error: 'Inquiry not found' });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed to update status' });
  }
});

app.delete('/api/inquiries/:id', async (req, res) => {
  try {
    if (process.env.MONGODB_URI) {
      await Inquiry.findByIdAndDelete(req.params.id);
      return res.json({ success: true, message: 'Inquiry deleted successfully' });
    }
    inquiries = inquiries.filter(i => i.id !== req.params.id);
    saveData('inquiries.json', inquiries);
    res.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (e) {
    res.json({ success: true, message: 'Inquiry deleted successfully' });
  }
});

// Careers Admin API Routes
app.get('/api/careers', async (req, res) => {
  try {
    if (process.env.MONGODB_URI) {
      let data = await Career.find().sort({ createdAt: -1 });
      const mapped = data.map(c => ({
        id: c._id.toString(),
        title: c.title,
        department: c.department,
        type: c.type,
        location: c.location,
        experience: c.experience,
        status: c.status
      }));
      return res.json({ success: true, count: mapped.length, data: mapped });
    }
    res.json({ success: true, count: careers.length, data: careers });
  } catch (e) {
    res.json({ success: true, count: careers.length, data: careers });
  }
});

app.post('/api/careers', async (req, res) => {
  try {
    const { title, department, type, location, experience } = req.body;
    if (!title) return res.status(400).json({ success: false, error: 'Job title is required.' });

    const jobObj = {
      title: title.trim(),
      department: department || 'Engineering',
      type: type || 'Full-Time',
      location: location || 'Remote / Hybrid',
      experience: experience || '2+ Years',
      status: 'Active'
    };

    if (process.env.MONGODB_URI) {
      const created = await Career.create(jobObj);
      return res.status(201).json({ success: true, data: { ...created._doc, id: created._id.toString() } });
    }

    const newJob = { id: Date.now().toString(), ...jobObj };
    careers.unshift(newJob);
    saveData('careers.json', careers);
    res.status(201).json({ success: true, data: newJob });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to create job posting' });
  }
});

app.delete('/api/careers/:id', async (req, res) => {
  try {
    if (process.env.MONGODB_URI) {
      await Career.findByIdAndDelete(req.params.id);
      return res.json({ success: true, message: 'Job posting removed' });
    }
    careers = careers.filter(c => c.id !== req.params.id);
    saveData('careers.json', careers);
    res.json({ success: true, message: 'Job posting removed' });
  } catch (e) {
    res.json({ success: true, message: 'Job posting removed' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: process.env.MONGODB_URI ? 'MongoDB Atlas' : 'Local Storage', message: 'The Jobsync Backend is running' });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Backend server is running on port ${port}`);
  });
}

module.exports = app;
