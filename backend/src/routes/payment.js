const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_SebrDtxMirg67M',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_SECRET_HERE'
});

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Create Order API
router.post('/create-order', async (req, res) => {
    try {
        const { email, amount, coupon } = req.body;
        if (!amount) return res.status(400).json({ success: false, error: "Amount is required" });

        let parsedAmount = parseFloat(amount);
        let finalAmount = parsedAmount;
        let discount = 0;
        let affiliate_ref = null;
        let commission = 0;
        let validCoupon = null;

        if (coupon) {
            const uppercaseCode = coupon.trim().toUpperCase();
            const { data: couponData } = await supabase
                .from('coupons')
                .select('*')
                .eq('code', uppercaseCode)
                .single();

            if (couponData && couponData.is_active && 
                (!couponData.expires_at || new Date() <= new Date(couponData.expires_at)) &&
                (couponData.usage_limit === null || couponData.used_count < couponData.usage_limit)) {
                
                validCoupon = couponData;
                affiliate_ref = couponData.affiliate_ref;

                if (couponData.type === 'percentage') {
                    discount = Math.round(parsedAmount * (parseFloat(couponData.value) / 100));
                } else if (couponData.type === 'flat') {
                    discount = Math.round(parseFloat(couponData.value));
                }
                finalAmount = parsedAmount - discount;
                if (finalAmount < 0) finalAmount = 0;

                // get commission
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
            }
        }

        const options = {
            amount: Math.round(finalAmount * 100), // convert to paisa and ensure integer
            currency: "INR",
            receipt: "order_rcptid_" + Date.now()
        };

        console.log("Creating order with:", options);
        const rzpOrder = await razorpay.orders.create(options);

        // Insert into orders table
        const { data: newOrder, error } = await supabase.from('orders').insert({
            user_email: email,
            amount: parsedAmount,
            discount: discount,
            final_amount: finalAmount,
            coupon_code: validCoupon ? validCoupon.code : null,
            affiliate_ref: affiliate_ref,
            commission: commission,
            status: 'pending',
            razorpay_order_id: rzpOrder.id
        }).select('id').single();

        if (error) {
            console.error("Supabase Order Creation Error:", error);
            return res.status(500).json({ success: false, error: "Failed to save order to database" });
        }

        res.json({ 
            success: true, 
            order_id: newOrder.id, 
            razorpay_order_id: rzpOrder.id,
            final_amount: finalAmount 
        });
    } catch (error) {
        console.error("Order Creation Error:", error);
        res.status(500).json({ success: false, error: "Razorpay order creation failed" });
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
            razorpay_payment_id: razorpay_payment_id || null
        }).eq('id', order_id).select('*').single();

        if (error) {
            console.error("Update Order Error:", error);
            return res.status(500).json({ success: false, error: "Failed to update order status" });
        }

        // Increment coupon usage
        if (updatedOrder && updatedOrder.coupon_code) {
            const { data: coupon } = await supabase.from('coupons').select('used_count').eq('code', updatedOrder.coupon_code).single();
            if (coupon) {
                await supabase.from('coupons').update({ used_count: coupon.used_count + 1 }).eq('code', updatedOrder.coupon_code);
            }
        }

        res.json({ success: true, message: "Payment confirmed successfully" });
    } catch (error) {
        console.error("Payment Confirmation Error:", error);
        res.status(500).json({ success: false, error: "Payment confirmation failed" });
    }
});

module.exports = router;
