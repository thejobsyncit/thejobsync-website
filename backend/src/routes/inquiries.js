const express = require('express');
const supabase = require('../lib/supabaseClient');

const router = express.Router();

// GET /api/inquiries
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
  res.json({ success: true, count: data.length, data });
});

// PATCH /api/inquiries/:id/status
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;

  const { data, error } = await supabase
    .from('inquiries')
    .update({ status: status || 'Contacted' })
    .eq('id', req.params.id)
    .select()
    .maybeSingle();

  if (error) {
    return res.status(500).json({ success: false, error: 'Failed to update status' });
  }
  if (!data) {
    return res.status(404).json({ success: false, error: 'Inquiry not found' });
  }
  res.json({ success: true, data });
});

// DELETE /api/inquiries/:id
router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('inquiries').delete().eq('id', req.params.id);
  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
  res.json({ success: true, message: 'Inquiry deleted successfully' });
});

module.exports = router;
