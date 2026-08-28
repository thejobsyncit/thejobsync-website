const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
// Service role key is required on the server so the backend can bypass
// Row Level Security. NEVER expose this key to the frontend/browser.
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn(
    '[supabase] SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY are not set. ' +
    'API routes that touch the database will fail until they are configured in backend/.env'
  );
}

const supabase = createClient(supabaseUrl || '', supabaseServiceKey || '', {
  auth: { persistSession: false, autoRefreshToken: false },
});

module.exports = supabase;
