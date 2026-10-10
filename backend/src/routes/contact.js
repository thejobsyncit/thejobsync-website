const express = require('express');
const nodemailer = require('nodemailer');
const supabase = require('../lib/supabaseClient');

const router = express.Router();

// Only builds a mail transporter when SMTP env vars are actually configured.
// No hardcoded credentials — email notifications are silently skipped
// if SMTP_HOST/SMTP_USER/SMTP_PASS are not set.
function getTransporter() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }
  const user = (process.env.SMTP_USER || '').trim();
  const pass = (process.env.SMTP_PASS || '').replace(/\s+/g, '');

  if (process.env.SMTP_HOST === 'smtp.gmail.com' || user.endsWith('@gmail.com')) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });
  }

  if (!process.env.SMTP_HOST) return null;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: (Number(process.env.SMTP_PORT) || 465) === 465,
    auth: { user, pass },
  });
}

const inquiryStore = require('../lib/inquiryStore');

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

  // 1. Always save to local store first so no inquiries are lost
  const localSaved = inquiryStore.saveInquiry(row);

  // 2. Try saving to Supabase if available (with 1s timeout)
  let dbData = localSaved;
  try {
    const insertPromise = supabase.from('inquiries').insert(row).select().single();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Supabase timeout')), 1000)
    );
    const { data, error } = await Promise.race([insertPromise, timeoutPromise]);
    if (!error && data) {
      dbData = data;
    }
  } catch (err) {
    // Supabase optional
  }

  // 3. Dispatch Email via Web3Forms (bypasses ISP & Zoho SMTP restrictions) or SMTP
  let emailSent = false;
  const web3Key = process.env.WEB3FORMS_ACCESS_KEY;

  if (web3Key) {
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: web3Key,
          subject: `Website Inquiry from ${row.name}`,
          from_name: 'The JobSync Website',
          name: row.name,
          email: row.email,
          phone: row.phone,
          message: row.message,
          submitted_at: row.date,
        }),
      });
      const result = await response.json();
      if (result.success) {
        emailSent = true;
        console.log('[Web3Forms] Email inquiry successfully delivered to your inbox!');
      } else {
        console.error('[Web3Forms ERROR]', result.message || 'Submission failed');
      }
    } catch (apiErr) {
      console.error('[Web3Forms Fetch Error]', apiErr.message);
    }
  }

  // Fallback to SMTP if Web3Forms is not configured
  if (!emailSent) {
    const transporter = getTransporter();
    if (transporter) {
      try {
        const recipient = process.env.CONTACT_EMAIL || process.env.SMTP_USER || 'hr@thejobsync.com';
        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER || 'hr@thejobsync.com',
          to: recipient,
          subject: `Website Inquiry from ${row.name}`,
          text: `Name: ${row.name}\nEmail: ${row.email}\nPhone: ${row.phone}\nMessage:\n${row.message}\n\nSubmitted: ${row.date}`,
        });
        emailSent = true;
        console.log(`[SMTP] Email successfully sent to ${recipient}`);
      } catch (mailErr) {
        console.error('[SMTP ERROR] Failed to send email:', mailErr.message);
      }
    }
  }

  res.status(200).json({
    success: true,
    message: 'Thank you! Your inquiry has been sent to hr@thejobsync.com.',
    emailDelivered: emailSent,
    data: dbData,
  });
});

module.exports = router;
