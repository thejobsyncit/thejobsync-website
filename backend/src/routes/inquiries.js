const express = require('express');
const supabase = require('../lib/supabaseClient');
const inquiryStore = require('../lib/inquiryStore');

const router = express.Router();

// GET /api/inquiries
router.get('/', async (req, res) => {
  const localData = inquiryStore.getAllInquiries();

  try {
    const supabasePromise = supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Supabase timeout')), 1000)
    );

    const { data, error } = await Promise.race([supabasePromise, timeoutPromise]);

    if (!error && data && data.length > 0) {
      const ids = new Set(data.map((d) => String(d.id)));
      const combined = [...data];
      for (const item of localData) {
        if (!ids.has(String(item.id))) {
          combined.push(item);
        }
      }
      return res.json({ success: true, count: combined.length, data: combined });
    }
  } catch (err) {
    // Supabase unreachable or timed out, instantly fallback to local store
  }

  res.json({ success: true, count: localData.length, data: localData });
});

// PATCH /api/inquiries/:id/status
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  const newStatus = status || 'Contacted';

  try {
    const { data, error } = await supabase
      .from('inquiries')
      .update({ status: newStatus })
      .eq('id', req.params.id)
      .select()
      .maybeSingle();

    if (!error && data) {
      inquiryStore.updateInquiryStatus(req.params.id, newStatus);
      return res.json({ success: true, data });
    }
  } catch (err) {
    // Fallback to local store
  }

  const updated = inquiryStore.updateInquiryStatus(req.params.id, newStatus);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Inquiry not found' });
  }
  res.json({ success: true, data: updated });
});

// DELETE /api/inquiries/:id
router.delete('/:id', async (req, res) => {
  try {
    await supabase.from('inquiries').delete().eq('id', req.params.id);
  } catch (err) {
    // Fallback to local store
  }

  inquiryStore.deleteInquiry(req.params.id);
  res.json({ success: true, message: 'Inquiry deleted successfully' });
});

module.exports = router;
