const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const router = express.Router();

// Initialize Razorpay (ensure keys are added in root .env)
const razorpay = new Razorpay({
    key_id: process.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_SebrDtxMirg67M',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_SECRET_HERE'
});

// Create Order API
router.post('/create-order', async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount) return res.status(400).json({ success: false, error: "Amount is required" });

        const options = {
            amount: amount * 100, // amount in the smallest currency unit
            currency: "INR",
            receipt: "order_rcptid_" + Date.now()
        };

        const order = await razorpay.orders.create(options);
        res.json({ success: true, order_id: order.id });
    } catch (error) {
        console.error("Order Creation Error:", error);
        res.status(500).json({ success: false, error: "Razorpay order creation failed" });
    }
});

// Verify Payment API
router.post('/verify-payment', async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

        const secret = process.env.RAZORPAY_KEY_SECRET || 'YOUR_SECRET_HERE';

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            // Signature is valid. 
            // The frontend logic will update Supabase upon success (or we can do it here via Supabase Admin API).
            // Since this is just a validator, we return valid status.
            res.json({ success: true, message: "Payment verified successfully" });
        } else {
            res.status(400).json({ success: false, error: "Invalid payment signature" });
        }
    } catch (error) {
        console.error("Payment Verification Error:", error);
        res.status(500).json({ success: false, error: "Payment verification failed" });
    }
});

module.exports = router;
