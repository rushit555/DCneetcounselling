const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// POST /submit-counseling-booking
// Saves counseling booking data
router.post('/', async (req, res) => {
    try {
        const { full_name, category, neet_score, domicile_state, all_india_rank, email, mobile_number, selected_plan, coupon_code, plan_name, plan_price, counselling_type } = req.body;

        if (!full_name || !email || !mobile_number || !selected_plan) {
            return res.status(400).json({ success: false, error: "Missing required fields" });
        }

        const insertData = {
            full_name,
            email,
            mobile: mobile_number,
            category,
            domicile_state,
            neet_score: parseInt(neet_score) || null,
            rank: parseInt(all_india_rank) || null,
            plan_type: selected_plan,
            plan_name: plan_name || null,
            plan_price: plan_price ? parseFloat(plan_price) : null,
            counselling_type: counselling_type || null,
            coupon_code: coupon_code || null,
            payment_status: 'pending',
            created_at: new Date()
        };

        // Validate coupon logic if provided
        // (simplified for this example, but you can integrate actual logic if you have coupon_usages table)

        const { data, error } = await supabase
            .from('counselling_bookings')
            .insert([insertData])
            .select('*');

        if (error) {
            console.error("Supabase Error:", error);
            throw error;
        }

        return res.status(200).json({
            success: true,
            message: "Counseling session booked successfully",
            data: data
        });

    } catch (error) {
        console.error("Counseling Booking Error:", error);
        res.status(500).json({ success: false, error: "Failed to book counseling session" });
    }
});

module.exports = router;
