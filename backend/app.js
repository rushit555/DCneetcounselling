require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const paymentRoutes = require('./src/routes/payment');
const ordersRoutes = require('./src/routes/orders');
const counselingRoutes = require('./src/routes/counseling');
const couponsRoutes = require('./src/routes/coupons');

app.use('/api', paymentRoutes);
app.use('/api', couponsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/submit-counseling-booking', counselingRoutes);

// Basic health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Explicit Tracking Route
app.post('/api/track-order', async (req, res) => {
  try {
    const { order_id, amount, coupon } = req.body;

    console.log('📩 Incoming:', { order_id, amount, coupon });

    const response = await fetch('https://dcneetcounselling.goaffpro.com/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ order_id, amount, coupon })
    });

    const text = await response.text();
    console.log('GoAffPro response:', text);

    res.json({ success: true });

  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Explicit Validate Coupon Route
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

app.post('/api/validate-coupon', async (req, res) => {
  try {
    const coupon = req.body.coupon?.trim().toUpperCase();
    console.log("Incoming coupon:", coupon);

    const { data: allCoupons } = await supabase.from("coupons").select("*");
    console.log("ALL COUPONS:", allCoupons);

    const { data } = await supabase
      .from('coupons')
      .select('*')
      .ilike('code', coupon);

    if (data && data.length > 0) {
      const c = data[0];
      return res.json({
        valid: true,
        discount_type: c.discount_type,
        discount_value: c.discount_value,
        affiliate_id: c.affiliate_id,
        min_order_amount: c.min_order_amount // Retained to avoid frontend breaks
      });
    }

    return res.json({ valid: false, message: 'Invalid Coupon' });
  } catch (err) {
    console.error("Validate Coupon Error:", err);
    return res.status(500).json({ valid: false, message: "Internal server error" });
  }
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend server is running on port ${PORT} (exposed to network)`);
});
