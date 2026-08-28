const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const blogsRouter = require('./routes/blogs');
const testimonialsRouter = require('./routes/testimonials');
const inquiriesRouter = require('./routes/inquiries');
const careersRouter = require('./routes/careers');
const adminRouter = require('./routes/admin');
const contactRouter = require('./routes/contact');
const healthRouter = require('./routes/health');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'The Jobsync Backend API',
    database: 'Supabase (PostgreSQL)',
    endpoints: [
      '/api/blogs',
      '/api/testimonials',
      '/api/inquiries',
      '/api/careers',
      '/api/contact',
      '/api/admin/login',
      '/api/admin/register',
      '/api/health',
    ],
  });
});

app.use('/api/blogs', blogsRouter);
app.use('/api/testimonials', testimonialsRouter);
app.use('/api/inquiries', inquiriesRouter);
app.use('/api/careers', careersRouter);
app.use('/api/admin', adminRouter);
app.use('/api/contact', contactRouter);
app.use('/api/health', healthRouter);

module.exports = app;
