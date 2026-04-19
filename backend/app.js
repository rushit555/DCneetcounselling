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
app.use('/api', paymentRoutes);
app.use('/api/orders', ordersRoutes);

// Basic health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
});
