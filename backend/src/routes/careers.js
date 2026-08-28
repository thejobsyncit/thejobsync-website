const express = require('express');
const supabase = require('../lib/supabaseClient');

const router = express.Router();

// GET /api/careers
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('careers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
  res.json({ success: true, count: data.length, data });
});

// POST /api/careers
router.post('/', async (req, res) => {
  const { title, department, type, location, experience } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, error: 'Job title is required.' });
  }

  const row = {
    title: title.trim(),
    department: department || 'Engineering',
    type: type || 'Full-Time',
    location: location || 'Remote / Hybrid',
    experience: experience || '2+ Years',
    status: 'Active',
  };

  const { data, error } = await supabase.from('careers').insert(row).select().single();
  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
  res.status(201).json({ success: true, data });
});

// DELETE /api/careers/:id
router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('careers').delete().eq('id', req.params.id);
  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
  res.json({ success: true, message: 'Job posting removed' });
});

module.exports = router;
