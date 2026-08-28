const express = require('express');
const supabase = require('../lib/supabaseClient');

const router = express.Router();

// GET /api/testimonials
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
  res.json({ success: true, count: data.length, data });
});

// POST /api/testimonials
router.post('/', async (req, res) => {
  const { name, role, company, avatar, rating, category, quote } = req.body;

  if (!name || !quote) {
    return res.status(400).json({ success: false, error: 'Name and quote are required fields.' });
  }

  const row = {
    name: name.trim(),
    role: role ? role.trim() : 'Client',
    company: company ? company.trim() : 'Enterprise Partner',
    avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: Number(rating) || 5,
    category: category || 'IT Consulting',
    quote: quote.trim(),
  };

  const { data, error } = await supabase.from('testimonials').insert(row).select().single();
  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
  res.status(201).json({ success: true, message: 'Testimonial added successfully!', data });
});

// DELETE /api/testimonials/:id
router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('testimonials').delete().eq('id', req.params.id);
  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
  res.json({ success: true, message: 'Testimonial deleted successfully' });
});

module.exports = router;
