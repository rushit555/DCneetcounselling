const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

// Helper function to validate coupon
async function checkCouponValid(code, amount) {
    if (!code) {
        return { valid: false, message: "Invalid coupon code" };
    }

    const uppercaseCode = code.trim().toUpperCase();

    const start = Date.now();
    const { data: coupon, error } = await supabase
        .from('coupons')
        .select('id, coupon_code, discount_type, discount_value, valid_from, valid_to, usage_limit, used_count')
        .eq('coupon_code', uppercaseCode)
        .single();
    const dur = Date.now() - start;
    if (dur > 200) console.log(`⚠️ Slow Query [Check Coupon]: ${dur}ms`);

    if (error || !coupon) {
        return { valid: false, message: "Invalid coupon" };
    }

    const now = new Date();

    if (coupon.valid_from) {
        const validFrom = new Date(coupon.valid_from);
        if (now < validFrom) {
            return { valid: false, message: "Coupon is not yet valid" };
        }
    }

    if (coupon.valid_to) {
        const validTo = new Date(coupon.valid_to);
        if (now > validTo) {
            return { valid: false, message: "Coupon has expired" };
        }
    }

    if (coupon.usage_limit !== null && coupon.used_count >= coupon.usage_limit) {
        return { valid: false, message: "Coupon usage limit reached" };
    }

    let discount = 0;
    let final_amount = 0;
    let parsedAmount = parseFloat(amount);

    if (!isNaN(parsedAmount) && parsedAmount >= 0) {
        if (coupon.discount_type === 'percentage') {
            discount = Math.round(parsedAmount * (parseFloat(coupon.discount_value) / 100));
        } else if (coupon.discount_type === 'fixed') {
            discount = Math.round(parseFloat(coupon.discount_value));
        }
        
        final_amount = parsedAmount - discount;
        if (final_amount < 0) final_amount = 0;
    }

    return {
        valid: true,
        discount: discount,
        final_amount: final_amount,
        original_price: parsedAmount,
        coupon: coupon
    };
}

// POST /validate-coupon
router.post('/validate-coupon', async (req, res) => {
    try {
        const { code, amount } = req.body;
        
        const result = await checkCouponValid(code, amount);
        
        if (!result.valid) {
            return res.status(400).json({ valid: false, message: result.message });
        }

        return res.json({
            valid: true,
            original_price: result.original_price,
            discount: result.discount,
            final_amount: result.final_amount,
            coupon: result.coupon.coupon_code,
            message: "Coupon is valid"
        });

    } catch (error) {
        console.error("Validate Coupon Error:", error);
        res.status(500).json({ valid: false, message: "Internal server error" });
    }
});

// POST /apply-coupon
router.post('/apply-coupon', async (req, res) => {
    try {
        const { code, order_amount } = req.body;
        
        if (!code || !order_amount) {
            return res.status(400).json({ valid: false, message: "Code and order_amount are required" });
        }

        const result = await checkCouponValid(code, order_amount);
        
        if (!result.valid) {
            return res.status(400).json({ valid: false, message: result.message });
        }

        return res.json({
            valid: true,
            original_price: result.original_price,
            discount: result.discount,
            final_amount: result.final_amount,
            coupon: result.coupon.coupon_code,
            message: "Coupon applied successfully"
        });

    } catch (error) {
        console.error("Apply Coupon Error:", error);
        res.status(500).json({ valid: false, message: "Internal server error" });
    }
});

// POST /payment-success
router.post('/payment-success', async (req, res) => {
    try {
        const { code, order_id, user_email, user_mobile, plan_name, original_price, discounted_price, discount_applied, payment_status } = req.body;
        
        // CRITICAL RULE: Only insert if payment_status is 'success'
        if (payment_status !== 'success') {
            return res.json({ success: false, message: "Coupon usage not logged because payment status is not success" });
        }

        if (!code || !order_id || !user_email) {
            return res.status(400).json({ success: false, message: "Code, order_id, and user_email are required" });
        }

        const uppercaseCode = code.trim().toUpperCase();

        const start = Date.now();
        const { data: coupon, error } = await supabase
            .from('coupons')
            .select('id, used_count')
            .eq('coupon_code', uppercaseCode)
            .single();
        const dur = Date.now() - start;
        if (dur > 200) console.log(`⚠️ Slow Query [Payment Success]: ${dur}ms`);

        if (error || !coupon) {
            return res.status(400).json({ success: false, message: "Coupon not found" });
        }

        // 1. Insert into coupon_usage
        const { error: usageError } = await supabase
            .from('coupon_usage')
            .insert([{
                coupon_code: uppercaseCode,
                order_id: order_id.toString(),
                user_email: user_email,
                user_mobile: user_mobile,
                plan_name: plan_name,
                original_price: original_price,
                discounted_price: discounted_price,
                discount_applied: discount_applied || 0,
                payment_status: 'success'
            }]);

        if (usageError) throw usageError;

        // 2. Increment used_count in coupons table
        const { error: updateError } = await supabase
            .from('coupons')
            .update({ used_count: coupon.used_count + 1 })
            .eq('id', coupon.id);

        if (updateError) throw updateError;

        return res.json({ success: true, message: "Coupon usage logged successfully after successful payment" });

    } catch (error) {
        console.error("Payment Success Coupon Logging Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

let analyticsCache = {
    data: null,
    lastFetched: 0
};

// GET /coupon-analytics
router.get('/coupon-analytics', async (req, res) => {
    try {
        const now = Date.now();
        // Cache for 10 seconds
        if (analyticsCache.data && (now - analyticsCache.lastFetched < 10000)) {
            return res.json(analyticsCache.data);
        }

        const start = Date.now();
        
        const { data, error } = await supabase.rpc('get_coupon_analytics');

        const dur = Date.now() - start;
        if (dur > 200) console.log(`⚠️ Slow Query [Analytics RPC Fetch]: ${dur}ms`);

        if (error) throw error;

        // Ensure API response includes ONLY: id, coupon_code, usage_count
        const minimizedData = data.map(item => ({
            id: item.id,
            coupon_code: item.coupon_code,
            usage_count: item.usage_count
        }));

        const responseData = {
            success: true,
            coupons: minimizedData
        };

        analyticsCache.data = responseData;
        analyticsCache.lastFetched = now;

        return res.json(responseData);

    } catch (error) {
        console.error("Coupon Analytics Error:", error);
        
        // Safe fallback to cache if DB fails
        if (analyticsCache.data) {
            return res.json(analyticsCache.data);
        }

        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

module.exports = router;
