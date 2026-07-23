const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const nodemailer = require('nodemailer');

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required fields.' });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL || 'hr@thejobsync.com',
      subject: `Website Inquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nMessage:\n${message}\n\nSubmission Date & Time: ${new Date().toLocaleString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <div style="background-color: #1a73e8; color: #ffffff; padding: 20px; text-align: center;">
            <h2 style="margin: 0; font-size: 24px;">New Website Inquiry</h2>
            <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">The Jobsync IT Consulting</p>
          </div>
          <div style="padding: 30px; background-color: #ffffff; color: #333333;">
            <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">You have received a new message from your website's contact form. Here are the details:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; width: 30%; font-weight: bold; color: #555555;">Name</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; width: 70%;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555555;">Email</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee;"><a href="mailto:${email}" style="color: #1a73e8; text-decoration: none;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555555;">Phone</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee;">${phone || '<span style="color: #999;">Not provided</span>'}</td>
              </tr>
            </table>

            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; border-left: 4px solid #1a73e8; margin-bottom: 25px;">
              <h3 style="margin-top: 0; margin-bottom: 10px; font-size: 16px; color: #444444;">Message:</h3>
              <p style="margin: 0; line-height: 1.6; white-space: pre-wrap; font-family: inherit;">${message}</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee;">
              <p style="font-size: 12px; color: #888888; margin: 0;">Submission Date & Time: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    res.status(200).json({ success: true, message: 'Thank you! Your inquiry has been submitted successfully.' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: 'Failed to send email. Please try again later.' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'The Jobsync Backend is running' });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Backend server is running on port ${port}`);
  });
}

module.exports = app;
