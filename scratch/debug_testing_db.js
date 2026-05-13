const { createClient } = require('@supabase/supabase-js');

// TESTING database (from .env)
const supabase = createClient(
    'https://anqqmulbmeydetwpeudh.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFucXFtdWxibWV5ZGV0d3BldWRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzODY1MTMsImV4cCI6MjA5Mzk2MjUxM30.AbfUID7hy1gg88C_j0OUk09G0XEW8uEqvJzD17u96ZA'
);

async function debug() {
    console.log('=== TESTING DB (anqqmulbmeydetwpeudh) ===\n');

    // Users
    console.log('--- users table ---');
    const { data: users, error: usersErr } = await supabase.from('users').select('*').limit(10);
    if (usersErr) console.error('Error:', usersErr.message);
    else {
        console.log(`Rows: ${users.length}`);
        if (users.length > 0) {
            console.log('Columns:', Object.keys(users[0]));
            for (const u of users) {
                console.log(`  ${u.name || u.email || 'N/A'} | ID: ${u.id?.substring(0,8)}... | referred_by: ${u.referred_by || 'NONE'} | wallet: ₹${u.wallet_balance || 0} | token: ${u.referral_token || 'NONE'}`);
            }
        }
    }

    // Referrals
    console.log('\n--- referrals table ---');
    const { data: refs, error: refErr } = await supabase.from('referrals').select('*').limit(10);
    if (refErr) console.error('Error:', refErr.message);
    else {
        console.log(`Rows: ${refs.length}`);
        for (const r of refs) {
            console.log(`  ID: ${r.id} | referrer: ${r.referrer_id?.substring(0,8)}... | referred: ${r.referred_user_id?.substring(0,8)}... | status: ${r.status} | cashback_given: ${r.cashback_given}`);
        }
    }

    // Referral Coupons
    console.log('\n--- referral_coupons table ---');
    const { data: rc, error: rcErr } = await supabase.from('referral_coupons').select('*').limit(10);
    if (rcErr) console.error('Error:', rcErr.message);
    else {
        console.log(`Rows: ${rc.length}`);
        for (const c of rc) {
            console.log(`  ${c.code} | user: ${c.user_id?.substring(0,8)}... | ${c.discount_percent}% | used: ${c.is_used} | ref_id: ${c.referral_id}`);
        }
    }

    // Wallet Transactions
    console.log('\n--- wallet_transactions table ---');
    const { data: wt, error: wtErr } = await supabase.from('wallet_transactions').select('*').limit(10);
    if (wtErr) console.error('Error:', wtErr.message);
    else console.log(`Rows: ${wt.length}`);

    // Recent Orders
    console.log('\n--- orders (last 5) ---');
    const { data: orders, error: ordErr } = await supabase.from('orders')
        .select('id, user_id, user_email, amount, coupon_code, payment_status, created_at')
        .order('created_at', { ascending: false }).limit(5);
    if (ordErr) console.error('Error:', ordErr.message);
    else {
        for (const o of orders) {
            console.log(`  ${o.user_email || 'no-email'} | ₹${o.amount} | coupon=${o.coupon_code || 'none'} | ${o.payment_status} | user=${o.user_id?.substring(0,8)}...`);
        }
    }

    // Counselling Bookings
    console.log('\n--- counselling_bookings (last 5) ---');
    const { data: cb, error: cbErr } = await supabase.from('counselling_bookings')
        .select('*')
        .order('created_at', { ascending: false }).limit(5);
    if (cbErr) console.error('Error:', cbErr.message);
    else {
        console.log(`Rows: ${cb.length}`);
        for (const b of cb) {
            console.log(`  ${b.email} | ${b.plan_name} | ₹${b.plan_price} -> ₹${b.discounted_price} | coupon=${b.coupon_code || 'none'} | ${b.payment_status}`);
        }
    }
}

debug().catch(console.error);
