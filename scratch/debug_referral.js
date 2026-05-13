/**
 * Debug Referral State
 * Shows the full picture of referral data to find the issue.
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://rlqmdylbzapyepuwncwt.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscW1keWxiemFweWVwdXduY3d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNTcwNzYsImV4cCI6MjA5MTgzMzA3Nn0.oNNK1pwLnykQlNfUkw7IdB-ZBkKDoWxszsKDSIjsLeo';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

async function debug() {
    console.log('=== 1. Recent Paid Orders ===');
    const { data: orders } = await supabase
        .from('orders')
        .select('id, user_id, amount, coupon_code, payment_status, created_at')
        .in('payment_status', ['paid', 'success', 'completed'])
        .order('created_at', { ascending: false })
        .limit(10);
    
    for (const o of (orders || [])) {
        console.log(`  Order ${o.id.substring(0,8)}... | user=${o.user_id?.substring(0,8)}... | ₹${o.amount} | coupon=${o.coupon_code || 'none'} | ${o.payment_status} | ${o.created_at}`);
    }

    console.log('\n=== 2. Users with referred_by set ===');
    const { data: referredUsers } = await supabase
        .from('users')
        .select('id, referred_by, referral_token, wallet_balance')
        .not('referred_by', 'is', null);
    
    for (const u of (referredUsers || [])) {
        console.log(`  User ${u.id.substring(0,8)}... | referred_by=${u.referred_by?.substring(0,8)}... | token=${u.referral_token} | wallet=₹${u.wallet_balance}`);
    }

    console.log('\n=== 3. All Referrals Records ===');
    const { data: referrals } = await supabase
        .from('referrals')
        .select('id, referrer_id, referred_user_id, status, cashback_given, cashback_amount, created_at')
        .order('created_at', { ascending: false })
        .limit(20);
    
    for (const r of (referrals || [])) {
        console.log(`  Ref ${r.id} | referrer=${r.referrer_id?.substring(0,8)}... | referred=${r.referred_user_id?.substring(0,8)}... | status=${r.status} | cashback_given=${r.cashback_given} | ₹${r.cashback_amount}`);
    }

    console.log('\n=== 4. All Referral Coupons ===');
    const { data: coupons } = await supabase
        .from('referral_coupons')
        .select('id, code, user_id, discount_percent, is_used, referral_id, expires_at')
        .order('created_at', { ascending: false })
        .limit(20);
    
    for (const c of (coupons || [])) {
        console.log(`  Coupon ${c.code} | user=${c.user_id?.substring(0,8)}... | ${c.discount_percent}% | used=${c.is_used} | ref_id=${c.referral_id} | expires=${c.expires_at}`);
    }

    console.log('\n=== 5. Wallet Transactions ===');
    const { data: txns } = await supabase
        .from('wallet_transactions')
        .select('id, user_id, amount, type, description, created_at')
        .order('created_at', { ascending: false })
        .limit(10);
    
    for (const t of (txns || [])) {
        console.log(`  Txn ${t.id} | user=${t.user_id?.substring(0,8)}... | ₹${t.amount} | ${t.type} | ${t.description}`);
    }
}

debug().catch(console.error);
