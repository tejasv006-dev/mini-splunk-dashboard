require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const logRoutes = require('./routes/logRoutes');
const authRoutes = require('./routes/authRoutes');
const alertRoutes = require('./routes/alertRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB (Hybrid fallback is handled internally)
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/logs', logRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/alerts', alertRoutes);

// Health check endpoint
app.get('/', (req, res) => {
    res.send('Mini Splunk Backend API is running with Hybrid DB mode');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
