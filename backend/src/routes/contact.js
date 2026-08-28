const express = require('express');
const nodemailer = require('nodemailer');
const supabase = require('../lib/supabaseClient');

const router = express.Router();

// Only builds a mail transporter when SMTP env vars are actually configured.
// No hardcoded credentials — email notifications are silently skipped
// if SMTP_HOST/SMTP_USER/SMTP_PASS are not set.
function getTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: (Number(process.env.SMTP_PORT) || 465) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

// POST /api/contact
router.post('/', async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required fields.' });
  }

  const row = {
    name: name.trim(),
    email: email.trim(),
    phone: phone ? phone.trim() : 'N/A',
    message: message.trim(),
    date: new Date().toLocaleString(),
    status: 'New',
  };

  const { data, error } = await supabase.from('inquiries').insert(row).select().single();
  if (error) {
    console.error('Contact insert error:', error.message);
  }

  const transporter = getTransporter();
  if (transporter) {
    transporter
      .sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
        subject: `Website Inquiry from ${row.name}`,
        text: `Name: ${row.name}\nEmail: ${row.email}\nPhone: ${row.phone}\nMessage:\n${row.message}\n\nSubmitted: ${row.date}`,
      })
      .catch((mailErr) => console.warn('Mail send failed:', mailErr.message));
  }

  res.status(200).json({
    success: true,
    message: 'Thank you! Your inquiry has been submitted successfully.',
    data: data || undefined,
  });
});

module.exports = router;
