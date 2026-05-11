const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_ShlgHvLVwqmST2',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '2MzRW1BAyaURYGWXiAmPhQqa'
});

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

// Get Payment Summary API (calculates all discounts and final price server-side)
router.post('/payment-summary', async (req, res) => {
    try {
        const { user_id, plan_price, wallet_enabled, coupon_code } = req.body;
        console.log(`[Summary] Request: user_id=${user_id}, price=${plan_price}, coupon=${coupon_code}`);
        const originalPrice = parseFloat(plan_price) || 0;
        
        let discountAmount = 0;
        let subtotal = originalPrice;

        // Check for Referral Coupon First
        let validReferralCoupon = null;
        if (coupon_code) {
            const uppercaseCode = coupon_code.trim().toUpperCase();
            
            const { data: refCoupon, error: refErr } = await supabase
                .from('referral_coupons')
                .select('*')
                .eq('code', uppercaseCode)
                .eq('is_used', false)
                .single();
            
            if (refCoupon && !refErr) {
                const now = new Date();
                const isExpired = refCoupon.expires_at && new Date(refCoupon.expires_at) < now;
                
                if (!isExpired) {
                    validReferralCoupon = refCoupon;
                    discountAmount = Math.round(originalPrice * (parseFloat(refCoupon.discount_percent) / 100));
                }
            }

            // If not a referral coupon, check regular coupons
            if (!validReferralCoupon) {
                const { data: couponData, error: couponError } = await supabase
                    .from('coupons')
                    .select('*')
                    .eq('coupon_code', uppercaseCode)
                    .single();

                if (couponData && !couponError) {
                    const now = new Date();
                    const isValidFrom = !couponData.valid_from || now >= new Date(couponData.valid_from);
                    const isValidTo = !couponData.valid_to || now <= new Date(couponData.valid_to);
                    const isLimitValid = couponData.usage_limit === null || couponData.used_count < couponData.usage_limit;

                    if (isValidFrom && isValidTo && isLimitValid) {
                        if (couponData.discount_type === 'percentage') {
                            discountAmount = Math.round(originalPrice * (parseFloat(couponData.discount_value) / 100));
                        } else if (couponData.discount_type === 'fixed') {
                            discountAmount = Math.round(parseFloat(couponData.discount_value));
                        }
                    }
                }
            }
        }

        subtotal = originalPrice - discountAmount;
        if (subtotal < 0) subtotal = 0;
        
        let walletUsed = 0;
        let walletBalance = 0;
        if (wallet_enabled && user_id) {
            const { data: userData } = await supabase.from('users').select('wallet_balance').eq('id', user_id).single();
            if (userData) {
                walletBalance = parseFloat(userData.wallet_balance) || 0;
                walletUsed = Math.min(walletBalance, subtotal);
            }
        }

        const finalAmount = subtotal - walletUsed;

        res.json({
            success: true,
            original_price: originalPrice,
            discount: discountAmount,
            subtotal: subtotal,
            wallet_used: walletUsed,
            wallet_balance: walletBalance,
            final_amount: finalAmount
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Create Order API
router.post('/create-order', async (req, res) => {
    try {
        const { 
            email, full_name, mobile, product_name, amount, coupon, user_id,
            category, domicile_state, neet_score, rank, counselling_type,
            wallet_enabled
        } = req.body;

        if (!amount) return res.status(400).json({ success: false, error: "Amount is required" });

        let parsedAmount = parseFloat(amount);
        let subtotal = parsedAmount;
        let discount = 0;
        
        let affiliate_ref = null;
        let commission = 0;
        let validCoupon = null;
        let validReferralCoupon = null;

        // 1. Check for Referral Coupon First
        if (coupon) {
            const uppercaseCode = coupon.trim().toUpperCase();
            
            const { data: refCoupon, error: refErr } = await supabase
                .from('referral_coupons')
                .select('*')
                .eq('code', uppercaseCode)
                .eq('is_used', false)
                .single();
            
            if (refCoupon && !refErr) {
                const now = new Date();
                const isExpired = refCoupon.expires_at && new Date(refCoupon.expires_at) < now;
                
                if (isExpired) {
                    return res.status(400).json({ success: false, error: "This referral coupon has expired." });
                }

                validReferralCoupon = refCoupon;
                discount = Math.round(parsedAmount * (parseFloat(refCoupon.discount_percent) / 100));
                subtotal -= discount;
            }

            // 2. If not a referral coupon, apply Regular Coupon
            if (!validReferralCoupon) {
                const { data: couponData, error: couponError } = await supabase
                    .from('coupons')
                    .select('*')
                    .eq('coupon_code', uppercaseCode)
                    .single();

                if (couponData && !couponError) {
                    const now = new Date();
                    const isValidFrom = !couponData.valid_from || now >= new Date(couponData.valid_from);
                    const isValidTo = !couponData.valid_to || now <= new Date(couponData.valid_to);
                    const isLimitValid = couponData.usage_limit === null || couponData.used_count < couponData.usage_limit;

                    if (isValidFrom && isValidTo && isLimitValid) {
                        validCoupon = couponData;
                        affiliate_ref = couponData.affiliate_ref || null;

                        if (couponData.discount_type === 'percentage') {
                            discount = Math.round(parsedAmount * (parseFloat(couponData.discount_value) / 100));
                        } else if (couponData.discount_type === 'fixed') {
                            discount = Math.round(parseFloat(couponData.discount_value));
                        }
                        
                        subtotal -= discount;
                        if (subtotal < 0) subtotal = 0;

                        if (affiliate_ref) {
                            const { data: aff } = await supabase.from('affiliates').select('*').eq('ref_code', affiliate_ref).single();
                            if (aff) {
                                if (aff.commission_type === 'percentage') {
                                    commission = Math.round(subtotal * (parseFloat(aff.commission_value) / 100));
                                } else {
                                    commission = parseFloat(aff.commission_value);
                                }
                            }
                        }
                    } else {
                        return res.status(400).json({ success: false, error: "Invalid or expired coupon" });
                    }
                } else {
                    return res.status(400).json({ success: false, error: "Invalid coupon code" });
                }
            }
        }

        // 3. Apply Wallet Balance
        let walletUsed = 0;
        if (wallet_enabled && user_id) {
            const { data: userData, error: userErr } = await supabase
                .from('users')
                .select('wallet_balance')
                .eq('id', user_id)
                .single();
            
            if (userData && !userErr) {
                const availableBalance = parseFloat(userData.wallet_balance) || 0;
                walletUsed = Math.min(availableBalance, subtotal);
                if (walletUsed < 0) walletUsed = 0;
            }
        }

        const finalAmount = subtotal - walletUsed;

        const options = {
            amount: Math.round(finalAmount * 100),
            currency: "INR",
            receipt: "order_rcptid_" + Date.now()
        };

        const rzpOrder = await razorpay.orders.create(options);

        // 3. Insert into main orders table
        const { data: newOrder, error: orderErr } = await supabase.from('orders').insert({
            user_id: user_id || null,
            user_email: email,
            email: email,
            full_name: full_name || 'Guest',
            mobile: mobile || 'N/A',
            product_name: product_name || 'Counselling Plan',
            amount: parsedAmount,
            amount_paid: finalAmount,
            discount: discount,
            referral_discount: validReferralCoupon ? discount : 0,
            wallet_used: walletUsed,
            final_amount: finalAmount,
            coupon_code: validReferralCoupon ? validReferralCoupon.code : (validCoupon ? validCoupon.coupon_code : null),
            affiliate_ref: affiliate_ref,
            commission: commission,
            status: 'pending',
            payment_status: 'pending',
            razorpay_order_id: rzpOrder.id
        }).select('id').single();

        if (orderErr) {
            console.error("Order Insert Error:", orderErr);
            return res.status(500).json({ success: false, error: "Failed to save order" });
        }

        // 4. If it's a counselling product, also insert into counselling_bookings
        if (product_name && product_name.toLowerCase().includes('counselling')) {
            await supabase.from('counselling_bookings').insert({
                user_id: user_id || null,
                full_name: full_name || 'Guest',
                email: email,
                mobile: mobile || 'N/A',
                category: category || null,
                domicile_state: domicile_state || null,
                neet_score: parseInt(neet_score) || null,
                rank: parseInt(rank) || null,
                plan_name: product_name,
                plan_price: parsedAmount,
                discounted_price: finalAmount,
                wallet_used: walletUsed,
                referral_discount: discount,
                counselling_type: counselling_type || null,
                coupon_code: validCoupon ? validCoupon.coupon_code : null,
                payment_status: 'pending',
                order_id: newOrder.id.toString()
            });
        }

        // 5. Update user profile with the provided mobile number if user is logged in
        if (user_id && mobile && mobile !== 'N/A') {
            await supabase.from('users').update({ mobile_number: mobile, phone: mobile }).eq('id', user_id);
        }

        res.json({ 
            success: true, 
            order_id: newOrder.id, 
            razorpay_order_id: rzpOrder.id,
            final_amount: finalAmount 
        });
    } catch (error) {
        console.error("Order Creation Error:", error);
        res.status(500).json({ success: false, error: "Razorpay order creation failed", details: error.message || error });
    }
});

// Create standalone Razorpay Order API (as requested)
router.post('/create-razorpay-order', async (req, res) => {
    try {
        const { amount } = req.body;
        console.log("Amount sent:", amount);

        if (!amount) {
            return res.status(400).json({ success: false, message: "Amount required" });
        }

        const options = {
            amount: Math.round(amount * 100), // convert to paisa
            currency: "INR",
            receipt: "order_" + Date.now()
        };

        console.log("Creating order with:", options);
        const order = await razorpay.orders.create(options);

        res.json({
            success: true,
            order
        });

    } catch (err) {
        console.error("RAZORPAY ERROR:", err);
        res.status(500).json({
            success: false,
            message: "Order creation failed"
        });
    }
});

// Confirm Payment API
router.post('/confirm-payment', async (req, res) => {
    try {
        const { order_id, razorpay_payment_id } = req.body;
        if (!order_id) return res.status(400).json({ success: false, error: "order_id is required" });

        // 1. Mark order as paid
        const { data: updatedOrder, error } = await supabase.from('orders').update({
            status: 'paid',
            payment_status: 'paid',
            razorpay_payment_id: razorpay_payment_id || null
        }).eq('id', order_id).select('*').single();

        if (error) {
            console.error("Update Order Error:", error);
            return res.status(500).json({ success: false, error: "Failed to update order status" });
        }

        // 2. Update counselling_bookings if it exists
        await supabase.from('counselling_bookings').update({
            payment_status: 'paid',
            razorpay_payment_id: razorpay_payment_id || null
        }).eq('order_id', order_id.toString());
 
        // Note: referral discount is effectively marked as used by the order status becoming 'paid'

        // 3. Wallet Deduction Logic
        if (updatedOrder.wallet_used > 0 && updatedOrder.user_id) {
            const { data: userData } = await supabase
                .from('users')
                .select('wallet_balance')
                .eq('id', updatedOrder.user_id)
                .single();
            
            if (userData) {
                const newBalance = Math.max(0, (parseFloat(userData.wallet_balance) || 0) - parseFloat(updatedOrder.wallet_used));
                await supabase.from('users').update({ wallet_balance: newBalance }).eq('id', updatedOrder.user_id);

                // Log Wallet Transaction
                await supabase.from('wallet_transactions').insert({
                    user_id: updatedOrder.user_id,
                    amount: -updatedOrder.wallet_used,
                    type: 'wallet_usage',
                    description: `Used wallet balance for ${updatedOrder.product_name}`,
                    order_id: order_id.toString()
                });
            }
        }

        // 4. Referral Reward Logic (Credit cashback to referrer wallet)
        if (updatedOrder.user_id) {
            const { data: userProfile } = await supabase
                .from('users')
                .select('referred_by')
                .eq('id', updatedOrder.user_id)
                .single();

            if (userProfile && userProfile.referred_by) {
                const referrerId = userProfile.referred_by;

                const { data: referralRecord } = await supabase
                    .from('referrals')
                    .select('id, cashback_given')
                    .eq('referrer_id', referrerId)
                    .eq('referred_user_id', updatedOrder.user_id)
                    .maybeSingle();

                if (referralRecord && !referralRecord.cashback_given) {
                    // Credit 10% cashback to referrer
                    const cashbackAmount = parseFloat(updatedOrder.amount) * 0.10;
                    
                    const { data: referrerUser } = await supabase.from('users').select('wallet_balance').eq('id', referrerId).single();
                    const currentBalance = parseFloat(referrerUser.wallet_balance) || 0;
                    await supabase.from('users').update({ wallet_balance: currentBalance + cashbackAmount }).eq('id', referrerId);

                    // Log wallet transaction
                    await supabase.from('wallet_transactions').insert({
                        user_id: referrerId,
                        amount: cashbackAmount,
                        type: 'cashback',
                        description: `Referral cashback for order ${order_id}`,
                        order_id: order_id.toString()
                    });

                    // Mark referral as processed
                    await supabase.from('referrals').update({
                        cashback_given: true,
                        cashback_amount: cashbackAmount,
                        status: 'purchased'
                    }).eq('id', referralRecord.id);
                }
            }
        }

        // 5. Increment coupon usage
        if (updatedOrder && updatedOrder.coupon_code) {
            // Check if it's a referral coupon
            const { data: refCoupon } = await supabase.from('referral_coupons').select('*').eq('code', updatedOrder.coupon_code).maybeSingle();
            
            if (refCoupon) {
                // Mark referral coupon as used
                await supabase.from('referral_coupons').update({ 
                    is_used: true, 
                    used_at: new Date() 
                }).eq('id', refCoupon.id);
            } else {
                // Regular coupon logic
                const { data: coupon } = await supabase.from('coupons').select('*').eq('coupon_code', updatedOrder.coupon_code).single();
                if (coupon) {
                    await supabase.from('coupons').update({ used_count: coupon.used_count + 1 }).eq('coupon_code', updatedOrder.coupon_code);
                    
                    await supabase.from('coupon_usage').insert([{
                        coupon_code: coupon.coupon_code,
                        order_id: updatedOrder.id.toString(),
                        user_email: updatedOrder.email || updatedOrder.user_email,
                        user_mobile: updatedOrder.mobile,
                        plan_name: updatedOrder.product_name || 'Counselling Plan',
                        original_price: updatedOrder.amount,
                        discounted_price: updatedOrder.final_amount,
                        discount_applied: updatedOrder.discount || 0,
                        payment_status: 'success'
                    }]);
                }
            }
        }

        res.json({ success: true, message: "Payment confirmed successfully" });
    } catch (error) {
        console.error("Payment Confirmation Error:", error);
        res.status(500).json({ success: false, error: "Payment confirmation failed" });
    }
});

// Payment Success API (with signature verification)
router.post('/payment-success', async (req, res) => {
    try {
        const { 
            razorpay_order_id, 
            razorpay_payment_id, 
            razorpay_signature,
            email, fullName, mobile, ctx, userId
        } = req.body;

        console.log("Payment success request body:", req.body);

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || '2MzRW1BAyaURYGWXiAmPhQqa')
            .update(body.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            // SUCCESS - Verify and save to database
            
            // Record Coupon Usage
            if (ctx && ctx.appliedCoupon) {
                const finalAmount = ctx.price;
                const commission = finalAmount * 0.20;
                await supabase.from('coupon_usage').insert({
                    coupon_code: ctx.appliedCoupon.coupon_code || ctx.appliedCoupon.id,
                    user_email: email,
                    original_price: ctx.originalPrice,
                    discount_applied: ctx.originalPrice - ctx.price,
                    discounted_price: finalAmount,
                    payment_status: 'success'
                });
            }

            // Clear Cart if applicable
            if (ctx && ctx.is_cart && userId) {
                await supabase.from('cart').delete().eq('user_id', userId);
            }

            // Save order to orders table securely
            if (userId && ctx) {
                await supabase.from('orders').insert({
                    user_id: userId,
                    full_name: fullName,
                    email: email,
                    mobile: mobile,
                    product_name: ctx.course + ' (' + ctx.quota + ')',
                    amount_paid: ctx.price,
                    payment_status: 'success',
                    razorpay_payment_id: razorpay_payment_id,
                    razorpay_order_id: razorpay_order_id,
                    created_at: new Date()
                });
            }

            // Update ebook_users record status
            if (ctx && email) {
                await supabase.from('ebook_users')
                    .update({
                        payment_status: 'success',
                        razorpay_payment_id: razorpay_payment_id,
                        razorpay_order_id: razorpay_order_id
                    })
                    .eq('email', email)
                    .eq('course', ctx.course)
                    .eq('payment_status', 'initiated');
            }

            return res.json({ success: true, message: "Payment verified successfully" });
        } else {
            console.error("Signature mismatch. Expected:", expectedSignature, "Got:", razorpay_signature);
            return res.status(400).json({ success: false, message: "Payment verification failed" });
        }
    } catch (error) {
        console.error("Payment Verification Error:", error);
        return res.status(500).json({ success: false, message: "Server error during verification" });
    }
});

module.exports = router;
