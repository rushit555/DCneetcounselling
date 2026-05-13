const fs = require('fs');

let html = fs.readFileSync('frontend/web/payment/index.html', 'utf8');

// 1. Add the Referral Reward Function
const rewardFunction = `
        // ═══════════════════════════════════════════════════════════
        // REFERRAL REWARD PROCESSOR
        // ═══════════════════════════════════════════════════════════
        async function processReferralReward(amount) {
            try {
                if (!window.supabaseClient) return;
                const client = window.supabaseClient;
                const { data: { user } } = await client.auth.getUser();
                if (!user) return;

                // 1. Check if this user was referred by someone
                const { data: userData } = await client
                    .from('users')
                    .select('referred_by')
                    .eq('id', user.id)
                    .single();

                if (!userData || !userData.referred_by) return;
                const referrerId = userData.referred_by;

                // 2. Check if we already processed cashback for this referral
                const { data: referral } = await client
                    .from('referrals')
                    .select('id, cashback_processed')
                    .eq('referrer_id', referrerId)
                    .eq('referred_user_id', user.id)
                    .maybeSingle();

                if (!referral || referral.cashback_processed) return;

                // 3. Calculate 10% cashback
                const cashbackAmount = Math.round(amount * 0.10);
                if (cashbackAmount <= 0) return;

                // 4. Update Referrer's Wallet
                // Use a RPC or manual update (RPC is safer for concurrency)
                const { data: referrer } = await client
                    .from('users')
                    .select('wallet_balance')
                    .eq('id', referrerId)
                    .single();
                
                const newBalance = (referrer.wallet_balance || 0) + cashbackAmount;
                
                await client.from('users').update({ wallet_balance: newBalance }).eq('id', referrerId);

                // 5. Log Transaction
                await client.from('wallet_transactions').insert({
                    user_id: referrerId,
                    amount: cashbackAmount,
                    type: 'referral_bonus',
                    description: 'Cashback for referring ' + (user.email || 'a friend'),
                    order_id: localStorage.getItem('order_id')
                });

                // 6. Mark referral as Purchased & Processed
                await client.from('referrals').update({ 
                    status: 'purchased', 
                    cashback_processed: true,
                    cashback_amount: cashbackAmount 
                }).eq('id', referral.id);

                console.log('[Referral] Cashback processed successfully:', cashbackAmount);
            } catch (err) {
                console.error('[Referral] Error rewarding referrer:', err);
            }
        }
`;

// Insert the function before proceedToPayment
html = html.replace('async function proceedToPayment()', rewardFunction + '\n\n        async function proceedToPayment()');

// 2. Call the function inside the Razorpay handler
const handlerTarget = "if (data.success) {";
const handlerReplacement = "if (data.success) {\n                                // Process Referral Reward (10% cashback)\n                                await processReferralReward(order.final_amount);";

if (html.includes(handlerTarget)) {
    html = html.replace(handlerTarget, handlerReplacement);
    console.log('✅ Injected Referral Reward logic into Payment Handler');
}

fs.writeFileSync('frontend/web/payment/index.html', html, 'utf8');
console.log('Done!');
