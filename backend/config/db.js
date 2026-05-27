const mongoose = require('mongoose');

// Default to in-memory mode during startup to prevent Mongoose buffering before connection establishes
global.isUsingMemoryDb = true;

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/mini_splunk';
        console.log(`⚡ Attempting to connect to MongoDB at: ${uri}`);
        
        // Connect with a 4-second timeout so it falls back quickly if MongoDB isn't running
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 4000
        });
        
        global.isUsingMemoryDb = false;
        console.log(`✅ [HYBRID DB] Connected successfully to MongoDB.`);
    } catch (error) {
        global.isUsingMemoryDb = true;
        console.warn(`⚠️ [HYBRID DB] Connection failed: ${error.message}`);
        console.warn(`🚀 [HYBRID DB] Fallback active: Running fully-featured in-memory database simulation.`);
    }
};

module.exports = connectDB;

