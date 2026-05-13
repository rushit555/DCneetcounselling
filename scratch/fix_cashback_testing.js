/**
 * Fix Missing Cashback - TESTING DATABASE
 * Finds paid orders, resolves user_id from email, and credits cashback to referrer.
 */

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
    'https://anqqmulbmeydetwpeudh.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFucXFtdWxibWV5ZGV0d3BldWRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzODY1MTMsImV4cCI6MjA5Mzk2MjUxM30.AbfUID7hy1gg88C_j0OUk09G0XEW8uEqvJzD17u96ZA'
);

async function fix() {
    console.log('🔍 Scanning TESTING DB for paid orders with missing cashback...\n');

    // Get all paid orders
    const { data: paidOrders } = await supabase
        .from('orders')
        .select('*')
        .in('payment_status', ['paid', 'success', 'completed']);

    console.log(`Found ${paidOrders?.length || 0} paid orders\n`);

    let fixed = 0;
    for (const order of (paidOrders || [])) {
        // Resolve user_id from email if missing
        let userId = order.user_id;
        if (!userId && (order.email || order.user_email)) {
            const email = order.email || order.user_email;
            const { data: u } = await supabase.from('users').select('id').eq('email', email).maybeSingle();
            if (u) {
                userId = u.id;
                await supabase.from('orders').update({ user_id: userId }).eq('id', order.id);
                console.log(`📧 Resolved user_id for order ${order.id.substring(0,8)}... from email ${email} -> ${userId.substring(0,8)}...`);
            }
        }

        if (!userId) {
            console.log(`⏭ Order ${order.id.substring(0,8)}... has no user_id and no matching email`);
            continue;
        }

        // Check if user was referred
        const { data: user } = await supabase.from('users').select('referred_by').eq('id', userId).single();
        if (!user || !user.referred_by) {
            console.log(`⏭ Order ${order.id.substring(0,8)}... user not referred`);
            continue;
        }

        const referrerId = user.referred_by;

        // Check existing cashback
        const { data: referral } = await supabase
            .from('referrals')
            .select('id, cashback_given')
            .eq('referrer_id', referrerId)
            .eq('referred_user_id', userId)
            .maybeSingle();

        if (referral && referral.cashback_given) {
            console.log(`⏭ Order ${order.id.substring(0,8)}... cashback already given`);
            continue;
        }

        const orderAmount = parseFloat(order.amount) || 0;
        if (orderAmount === 0) {
            console.log(`⏭ Order ${order.id.substring(0,8)}... has no amount`);
            continue;
        }

        const cashbackAmount = orderAmount * 0.10;
        console.log(`\n💰 Order ${order.id.substring(0,8)}...:`);
        console.log(`   Buyer: ${userId.substring(0,8)}... (${order.email || order.user_email})`);
        console.log(`   Referrer: ${referrerId.substring(0,8)}...`);
        console.log(`   Amount: ₹${orderAmount}, Cashback: ₹${cashbackAmount}`);

        // Get referral record ID (or create one)
        let referralId = referral?.id;
        if (!referral) {
            const { data: newRef } = await supabase.from('referrals')
                .insert({ referrer_id: referrerId, referred_user_id: userId, status: 'purchased' })
                .select('id').single();
            referralId = newRef?.id;
        }

        // Credit wallet
        const { data: referrerUser } = await supabase.from('users').select('wallet_balance, full_name, email, phone').eq('id', referrerId).single();
        const currentBalance = parseFloat(referrerUser?.wallet_balance) || 0;
        const newBalance = currentBalance + cashbackAmount;

        await supabase.from('users').update({ wallet_balance: newBalance }).eq('id', referrerId);
        console.log(`   ✅ Wallet: ₹${currentBalance} → ₹${newBalance}`);

        // Log transaction
        await supabase.from('wallet_transactions').insert({
            user_id: referrerId,
            amount: cashbackAmount,
            type: 'cashback',
            description: `Referral cashback for order ${order.id} (retroactive fix)`,
            order_id: order.id.toString(),
            name: referrerUser?.full_name || 'N/A',
            email: referrerUser?.email || 'N/A',
            mobilenumber: referrerUser?.phone || 'N/A'
        });

        // Mark referral as processed
        if (referralId) {
            await supabase.from('referrals').update({
                cashback_given: true,
                cashback_amount: cashbackAmount,
                status: 'purchased'
            }).eq('id', referralId);
        }

        console.log(`   ✅ Cashback credited!`);
        fixed++;
    }

    console.log(`\n${'='.repeat(50)}`);
    console.log(`✅ Done! Fixed ${fixed} missing cashback(s).`);
}

fix().catch(console.error);
