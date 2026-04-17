require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const logRoutes = require('./routes/logRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// All log-related actions mapped here
app.use('/api/logs', logRoutes);

// Health check endpoint
app.get('/', (req, res) => {
    res.send('Mini Splunk Backend API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
