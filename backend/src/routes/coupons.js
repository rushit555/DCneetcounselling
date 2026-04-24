const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// POST /apply-coupon
router.post('/apply-coupon', async (req, res) => {
    try {
        const { code, order_amount } = req.body;
        
        if (!code || !order_amount) {
            return res.status(400).json({ valid: false, message: "Code and order_amount are required" });
        }

        const uppercaseCode = code.trim().toUpperCase();

        const { data: coupon, error } = await supabase
            .from('coupons')
            .select('*')
            .ilike('code', uppercaseCode)
            .single();

        if (error || !coupon || !coupon.is_active) {
            return res.status(400).json({ valid: false, message: "Invalid or expired coupon" });
        }

        // Check expiry date
        if (coupon.expiry_date) {
            const expiry = new Date(coupon.expiry_date);
            const now = new Date();
            if (now > expiry) {
                return res.status(400).json({ valid: false, message: "Invalid or expired coupon" });
            }
        }

        // Check usage limit
        if (coupon.usage_limit !== null && coupon.used_count >= coupon.usage_limit) {
            return res.status(400).json({ valid: false, message: "Invalid or expired coupon" });
        }

        // Check minimum order amount
        if (coupon.min_order_amount !== null && order_amount < coupon.min_order_amount) {
            return res.status(400).json({ valid: false, message: `Minimum order amount of ₹${coupon.min_order_amount} not met` });
        }

        // Calculate discount
        let discount = 0;
        if (coupon.discount_type === 'percentage') {
            discount = Math.round(order_amount * (parseFloat(coupon.discount_value) / 100));
        } else {
            discount = parseFloat(coupon.discount_value);
        }

        // Final amount
        let final_amount = order_amount - discount;
        if (final_amount < 0) final_amount = 0;

        return res.json({
            valid: true,
            discount,
            final_amount,
            message: "Coupon applied successfully"
        });

    } catch (error) {
        console.error("Apply Coupon Error:", error);
        res.status(500).json({ valid: false, message: "Internal server error" });
    }
});

// POST /update-coupon-usage
router.post('/update-coupon-usage', async (req, res) => {
    try {
        const { code } = req.body;
        
        if (!code) {
            return res.status(400).json({ success: false, message: "Code is required" });
        }

        const uppercaseCode = code.trim().toUpperCase();

        const { data: coupon, error } = await supabase
            .from('coupons')
            .select('*')
            .ilike('code', uppercaseCode)
            .single();

        if (error || !coupon) {
            return res.status(400).json({ success: false, message: "Coupon not found" });
        }

        const { error: updateError } = await supabase
            .from('coupons')
            .update({ used_count: coupon.used_count + 1 })
            .ilike('code', uppercaseCode);

        if (updateError) throw updateError;

        return res.json({ success: true, message: "Coupon usage updated" });

    } catch (error) {
        console.error("Update Coupon Usage Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Route removed, handled directly in app.js

module.exports = router;
