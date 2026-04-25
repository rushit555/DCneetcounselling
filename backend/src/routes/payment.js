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

// Create Order API
router.post('/create-order', async (req, res) => {
    try {
        const { 
            email, full_name, mobile, product_name, amount, coupon, user_id,
            category, domicile_state, neet_score, rank, counselling_type
        } = req.body;

        if (!amount) return res.status(400).json({ success: false, error: "Amount is required" });

        let parsedAmount = parseFloat(amount);
        let finalAmount = parsedAmount;
        let discount = 0;
        let affiliate_ref = null;
        let commission = 0;
        let validCoupon = null;

        if (coupon) {
            const uppercaseCode = coupon.trim().toUpperCase();
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
                    
                    finalAmount = parsedAmount - discount;
                    if (finalAmount < 0) finalAmount = 0;

                    if (affiliate_ref) {
                        const { data: aff } = await supabase.from('affiliates').select('*').eq('ref_code', affiliate_ref).single();
                        if (aff) {
                            if (aff.commission_type === 'percentage') {
                                commission = Math.round(finalAmount * (parseFloat(aff.commission_value) / 100));
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

        const options = {
            amount: Math.round(finalAmount * 100),
            currency: "INR",
            receipt: "order_rcptid_" + Date.now()
        };

        const rzpOrder = await razorpay.orders.create(options);

        // 1. Insert into main orders table
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
            final_amount: finalAmount,
            coupon_code: validCoupon ? validCoupon.coupon_code : null,
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

        // 2. If it's a counselling product, also insert into counselling_bookings
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
                counselling_type: counselling_type || null,
                coupon_code: validCoupon ? validCoupon.coupon_code : null,
                payment_status: 'pending',
                order_id: newOrder.id.toString()
            });
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

        // Mark order as paid
        const { data: updatedOrder, error } = await supabase.from('orders').update({
            status: 'paid',
            payment_status: 'paid',
            razorpay_payment_id: razorpay_payment_id || null
        }).eq('id', order_id).select('*').single();

        if (error) {
            console.error("Update Order Error:", error);
            return res.status(500).json({ success: false, error: "Failed to update order status" });
        }

        // Update counselling_bookings if it exists
        await supabase.from('counselling_bookings').update({
            payment_status: 'paid',
            razorpay_payment_id: razorpay_payment_id || null
        }).eq('order_id', order_id.toString());

        // Increment coupon usage and log tracking
        if (updatedOrder && updatedOrder.coupon_code) {
            const { data: coupon } = await supabase.from('coupons').select('*').eq('coupon_code', updatedOrder.coupon_code).single();
            if (coupon) {
                await supabase.from('coupons').update({ used_count: coupon.used_count + 1 }).eq('coupon_code', updatedOrder.coupon_code);
                
                // Insert into coupon_usage table
                await supabase.from('coupon_usage').insert([{
                    coupon_code: coupon.coupon_code,
                    order_id: updatedOrder.id.toString(),
                    user_email: updatedOrder.email || updatedOrder.user_email,
                    plan_name: updatedOrder.product_name || 'Counselling Plan',
                    original_price: updatedOrder.amount,
                    discounted_price: updatedOrder.final_amount,
                    discount_applied: updatedOrder.discount || 0,
                    payment_status: 'success'
                }]);
            }
        }

        res.json({ success: true, message: "Payment confirmed successfully" });
    } catch (error) {
        console.error("Payment Confirmation Error:", error);
        res.status(500).json({ success: false, error: "Payment confirmation failed" });
    }
});

module.exports = router;
