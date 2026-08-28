const express = require('express');
const supabase = require('../lib/supabaseClient');

const router = express.Router();

// NOTE: passwords are stored/compared as plain text here, matching the
// original project's behavior. This is not secure for a real production
// deployment — before going live, hash passwords (e.g. with bcrypt) and
// remove the 'admin123' / 'admin' master-password bypass below.

// POST /api/admin/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, error: 'Name, email, and password are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const { data: existing } = await supabase
    .from('admin_users')
    .select('id')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (existing) {
    return res.status(400).json({ success: false, error: 'An admin account with this email already exists.' });
  }

  const { data, error } = await supabase
    .from('admin_users')
    .insert({ name: name.trim(), email: normalizedEmail, password, role: 'Administrator' })
    .select()
    .single();

  if (error) {
    console.error('Supabase error during registration:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to register admin user.' });
  }

  res.status(201).json({
    success: true,
    message: 'Admin registered successfully!',
    user: { name: data.name, email: data.email, role: data.role },
  });
});

// POST /api/admin/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const { data: admin, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (error) {
    console.error('Supabase error during login:', error);
    return res.status(500).json({ success: false, error: 'Database authentication error.' });
  }

  if (!admin || admin.password !== password) {
    return res.status(401).json({ success: false, error: 'Invalid email or password.' });
  }

  res.json({
    success: true,
    message: 'Login successful!',
    token: 'admin-token-' + Date.now(),
    user: { name: admin.name, email: admin.email, role: admin.role },
  });
});

module.exports = router;
