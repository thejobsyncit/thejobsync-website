const express = require('express');
const supabase = require('../lib/supabaseClient');
const testimonialStore = require('../lib/testimonialStore');

const router = express.Router();

// GET /api/testimonials
router.get('/', async (req, res) => {
  const localList = testimonialStore.getAllTestimonials();

  try {
    const fetchPromise = supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Supabase timeout')), 2000)
    );

    const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

    if (!error && Array.isArray(data) && data.length > 0) {
      // Merge unique by id
      const seen = new Set(data.map((d) => String(d.id)));
      const merged = [...data];
      for (const item of localList) {
        if (!seen.has(String(item.id))) {
          merged.push(item);
        }
      }
      return res.json({ success: true, count: merged.length, data: merged });
    }
  } catch (err) {
    // Supabase offline or timed out, fallback to local store
  }

  res.json({ success: true, count: localList.length, data: localList });
});

// POST /api/testimonials
router.post('/', async (req, res) => {
  const { name, role, company, avatar, rating, category, quote } = req.body;

  if (!name || !quote) {
    return res.status(400).json({ success: false, error: 'Name and feedback review are required fields.' });
  }

  const row = {
    name: name.trim(),
    role: role ? role.trim() : 'Client Partner',
    company: company ? company.trim() : 'Enterprise Client',
    avatar: avatar && avatar.trim() ? avatar.trim() : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: Number(rating) || 5,
    category: category || 'IT Consulting',
    quote: quote.trim(),
  };

  // 1. Always save to local store first so no feedback is ever lost
  const localSaved = testimonialStore.saveTestimonial(row);
  let savedData = localSaved;

  // 2. Attempt to save to Supabase if reachable
  try {
    const insertPromise = supabase.from('testimonials').insert(row).select().single();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Supabase timeout')), 2000)
    );

    const { data, error } = await Promise.race([insertPromise, timeoutPromise]);
    if (!error && data) {
      savedData = data;
    }
  } catch (err) {
    // Supabase is optional; local storage succeeds
  }

  res.status(201).json({
    success: true,
    message: 'Thank you for your feedback! Your review has been submitted successfully.',
    data: savedData,
  });
});

// DELETE /api/testimonials/:id
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  testimonialStore.deleteTestimonial(id);

  try {
    await supabase.from('testimonials').delete().eq('id', id);
  } catch (err) {}

  res.json({ success: true, message: 'Testimonial deleted successfully' });
});

module.exports = router;
