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

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend server is running on port ${PORT} (exposed to network)`);
});
