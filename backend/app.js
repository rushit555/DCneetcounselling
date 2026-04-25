require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: "*"
}));
app.use(express.json());

// Routes
const paymentRoutes = require('./src/routes/payment');
const ordersRoutes = require('./src/routes/orders');
const counselingRoutes = require('./src/routes/counseling');
const couponsRoutes = require('./src/routes/coupons');
const affiliatesRoutes = require('./src/routes/affiliates');

app.use('/api', paymentRoutes);
app.use('/api', couponsRoutes);
app.use('/api', affiliatesRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/submit-counseling-booking', counselingRoutes);

// Basic health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend server is running on port ${PORT} (exposed to network)`);
});
