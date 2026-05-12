const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
    'https://rlqmdylbzapyepuwncwt.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscW1keWxiemFweWVwdXduY3d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNTcwNzYsImV4cCI6MjA5MTgzMzA3Nn0.oNNK1pwLnykQlNfUkw7IdB-ZBkKDoWxszsKDSIjsLeo'
);

async function checkSchema() {
    // Check all users
    console.log('=== All Users ===\n');
    const { data: users, error: usersErr } = await supabase
        .from('users')
        .select('*')
        .limit(20);

    if (usersErr) {
        console.error('Users table error:', usersErr);
    } else if (users.length === 0) {
        console.log('⚠️ Users table is EMPTY! This is the problem.');
        console.log('The users table has no rows, so referred_by is never set.\n');
    } else {
        console.log('Columns:', Object.keys(users[0]));
        for (const u of users) {
            console.log(`${u.name || u.email || 'N/A'} | ID: ${u.id?.substring(0,8)}...`);
        }
    }

    // Check orders
    console.log('\n=== Recent Orders ===');
    const { data: orders } = await supabase.from('orders')
        .select('id, user_id, user_email, amount, coupon_code, payment_status, created_at')
        .order('created_at', { ascending: false }).limit(5);
    
    for (const o of (orders || [])) {
        console.log(`  ${o.user_email} | ₹${o.amount} | coupon=${o.coupon_code || 'none'} | ${o.payment_status} | ${new Date(o.created_at).toLocaleString()}`);
        console.log(`    order_id=${o.id} | user_id=${o.user_id}`);
    }

    // Check counselling_bookings
    console.log('\n=== Recent Counselling Bookings ===');
    const { data: bookings } = await supabase.from('counselling_bookings')
        .select('*')
        .order('created_at', { ascending: false }).limit(5);
    
    for (const b of (bookings || [])) {
        console.log(`  ${b.email} | ${b.plan_name} | ₹${b.plan_price} -> ₹${b.discounted_price} | coupon=${b.coupon_code || 'none'} | ${b.payment_status}`);
    }

    // Check auth.users count (via RPC or direct)
    console.log('\n=== Referrals table ===');
    const { data: refs, error: refErr } = await supabase.from('referrals').select('*').limit(5);
    if (refErr) console.error('Error:', refErr.message);
    else console.log(`Records: ${refs.length}`);

    console.log('\n=== Referral Coupons table ===');
    const { data: rc, error: rcErr } = await supabase.from('referral_coupons').select('*').limit(5);
    if (rcErr) console.error('Error:', rcErr.message);
    else console.log(`Records: ${rc.length}`);

    console.log('\n=== Wallet Transactions table ===');
    const { data: wt, error: wtErr } = await supabase.from('wallet_transactions').select('*').limit(5);
    if (wtErr) console.error('Error:', wtErr.message);
    else console.log(`Records: ${wt.length}`);
}

checkSchema().catch(console.error);
