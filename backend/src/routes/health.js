const express = require('express');
const supabase = require('../lib/supabaseClient');

const router = express.Router();

// GET /api/health
router.get('/', async (req, res) => {
  const hasCreds = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
  let databaseStatus = 'SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set';

  if (hasCreds) {
    const { error } = await supabase.from('blogs').select('id', { head: true, count: 'exact' });
    databaseStatus = error ? `Connection error: ${error.message}` : 'Connected to Supabase';
  }

  res.json({
    status: 'ok',
    database: 'Supabase (PostgreSQL)',
    databaseStatus,
    message: 'The Jobsync Backend is running',
  });
});

module.exports = router;
