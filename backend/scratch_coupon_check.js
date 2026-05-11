require('dotenv').config({ path: '../.env' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

async function checkCoupons() {
  const { data, error } = await supabase.from('referral_coupons').select('*');
  console.log("Error:", error);
  console.log("Data:", data);
}

checkCoupons();
