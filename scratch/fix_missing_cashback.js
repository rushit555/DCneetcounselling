/**
 * Fix Missing Cashback Script
 * 
 * Finds all paid orders where:
 * 1. The buyer was referred (has referred_by in users table)
 * 2. No cashback was credited to the referrer yet
 * 
 * Then credits the 10% cashback to the referrer's wallet.
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://rlqmdylbzapyepuwncwt.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscW1keWxiemFweWVwdXduY3d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNTcwNzYsImV4cCI6MjA5MTgzMzA3Nn0.oNNK1pwLnykQlNfUkw7IdB-ZBkKDoWxszsKDSIjsLeo';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

async function fixMissingCashback() {
    console.log('🔍 Scanning for paid orders with missing referral cashback...\n');

    // 1. Get all paid orders
    const { data: paidOrders, error: ordersErr } = await supabase
        .from('orders')
        .select('id, user_id, amount, coupon_code, payment_status')
        .in('payment_status', ['paid', 'success', 'completed'])
        .not('user_id', 'is', null);

    if (ordersErr) {
        console.error('❌ Error fetching orders:', ordersErr);
        return;
    }

    console.log(`Found ${paidOrders.length} paid orders with user_id\n`);

    let fixed = 0;

    for (const order of paidOrders) {
        // 2. Check if user was referred
        const { data: user } = await supabase
            .from('users')
            .select('referred_by')
            .eq('id', order.user_id)
            .single();

        if (!user || !user.referred_by) continue;

        const referrerId = user.referred_by;

        // 3. Check if cashback was already given
        const { data: referral } = await supabase
            .from('referrals')
            .select('id, cashback_given')
            .eq('referrer_id', referrerId)
            .eq('referred_user_id', order.user_id)
            .maybeSingle();

        if (referral && referral.cashback_given) {
            console.log(`⏭ Order ${order.id}: Cashback already given`);
            continue;
        }

        // 4. Calculate cashback (10% of original amount)
        const cashbackAmount = parseFloat(order.amount) * 0.10;
        console.log(`\n💰 Order ${order.id}:`);
        console.log(`   Buyer: ${order.user_id}`);
        console.log(`   Referrer: ${referrerId}`);
        console.log(`   Order amount: ₹${order.amount}`);
        console.log(`   Cashback (10%): ₹${cashbackAmount}`);

        // 5. Create referral record if missing
        let referralId = referral?.id;
        if (!referral) {
            const { data: newRef, error: newRefErr } = await supabase
                .from('referrals')
                .insert({
                    referrer_id: referrerId,
                    referred_user_id: order.user_id,
                    status: 'purchased'
                })
                .select('id')
                .single();
            
            if (newRefErr) {
                console.error(`   ❌ Failed to create referral record:`, newRefErr.message);
                continue;
            }
            referralId = newRef.id;
            console.log(`   📝 Created referral record: ${referralId}`);
        }

        // 6. Credit wallet
        const { data: referrerUser } = await supabase
            .from('users')
            .select('wallet_balance')
            .eq('id', referrerId)
            .single();

        if (!referrerUser) {
            console.error(`   ❌ Referrer user not found`);
            continue;
        }

        const currentBalance = parseFloat(referrerUser.wallet_balance) || 0;
        const newBalance = currentBalance + cashbackAmount;

        const { error: walletErr } = await supabase
            .from('users')
            .update({ wallet_balance: newBalance })
            .eq('id', referrerId);

        if (walletErr) {
            console.error(`   ❌ Wallet update failed:`, walletErr.message);
            continue;
        }

        console.log(`   ✅ Wallet: ₹${currentBalance} → ₹${newBalance}`);

        // 7. Log transaction
        await supabase.from('wallet_transactions').insert({
            user_id: referrerId,
            amount: cashbackAmount,
            type: 'cashback',
            description: `Referral cashback for order ${order.id} (retroactive fix)`,
            order_id: order.id.toString()
        });

        // 8. Mark referral as processed
        await supabase.from('referrals').update({
            cashback_given: true,
            cashback_amount: cashbackAmount,
            status: 'purchased'
        }).eq('id', referralId);

        console.log(`   ✅ Cashback credited successfully!`);
        fixed++;
    }

    console.log(`\n${'='.repeat(50)}`);
    console.log(`✅ Done! Fixed ${fixed} missing cashback(s).`);
}

fixMissingCashback().catch(console.error);
