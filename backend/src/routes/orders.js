const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// GET /api/orders/user
// Fetches the order history for a specific logged-in user
// In a real app, you would pass the JWT token to verify identity, but here we can accept a query param ?user_id= for simplicity (adjust as per auth level constraints)
router.get('/user', async (req, res) => {
    try {
        const userId = req.headers['x-user-id'] || req.query.user_id;

        if (!userId) {
            return res.status(400).json({ success: false, error: "User ID is required" });
        }

        const { data, error } = await supabase
            .from('orders')
            .select('product_name, amount_paid, payment_status, created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({ success: true, orders: data });
    } catch (error) {
        console.error("Order Fetch Error:", error);
        res.status(500).json({ success: false, error: "Failed to fetch orders" });
    }
});

module.exports = router;
