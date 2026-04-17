const express = require('express');
const router = express.Router();
const Log = require('../models/Log');

// @route   POST /api/logs
// @desc    Ingest a new log from external services (Log Collector)
router.post('/', async (req, res) => {
    try {
        const { level, service, message, metadata, timestamp } = req.body;
        
        // Basic validation
        if (!level || !service || !message) {
            return res.status(400).json({ error: 'Please provide level, service, and message' });
        }

        const newLog = new Log({
            level: level.toUpperCase(),
            service,
            message,
            metadata: metadata || {},
            timestamp: timestamp ? new Date(timestamp) : Date.now()
        });

        // Basic Alerting Mechanism Simulation
        if (newLog.level === 'ERROR') {
            console.warn(`🚨 [ALERT] High Priority Action REQUIRED: Error logged from service ${service}`);
            // Logic to track >10 errors/min can be inserted here into Redis or in-app memory
        }

        const savedLog = await newLog.save();
        res.status(201).json(savedLog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server validation error while saving log' });
    }
});

// @route   GET /api/logs
// @desc    Retrieve logs to display in Dashboard with search/filter/pagination
router.get('/', async (req, res) => {
    try {
        const { level, service, text, startDate, endDate, page = 1, limit = 50 } = req.query;
        let query = {};

        // Parse Filters
        if (level) query.level = level.toUpperCase();
        if (service) query.service = service;
        
        // Simple search on 'message'.
        // In deep production environments, consider MongoDB Text Indexes or ElasticSearch.
        if (text) {
            query.message = { $regex: text, $options: 'i' };
        }
        
        // Time Window Filtering
        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) query.timestamp.$lte = new Date(endDate);
        }

        // Pagination Calculations
        const limitInt = parseInt(limit);
        const pageInt = parseInt(page);
        const skip = (pageInt - 1) * limitInt;

        // Execute DB Read
        const logs = await Log.find(query)
            .sort({ timestamp: -1 }) // Newest first
            .skip(skip)
            .limit(limitInt);

        // Fetch Total Count for proper FrontEnd pagination states
        const total = await Log.countDocuments(query);

        res.json({
            count: logs.length,
            total,
            page: pageInt,
            totalPages: Math.ceil(total / limitInt),
            logs
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error retrieving logs' });
    }
});

// @route   GET /api/logs/stats
// @desc    Retrieve summarized metrics for frontend visualization widgets
router.get('/stats', async (req, res) => {
    try {
        // Aggregate count of logs per level using Pipeline
        const levelDistribution = await Log.aggregate([
            { $group: { _id: "$level", count: { $sum: 1 } } }
        ]);

        const totalLogs = await Log.countDocuments();

        // Bonus: could also count logs by service to generate a Bar Chart of System traffic
        const trafficByService = await Log.aggregate([
            { $group: { _id: "$service", count: { $sum: 1 } } }
        ]);

        res.json({
            levelDistribution,
            trafficByService,
            totalLogs
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error retrieving stats' });
    }
});

module.exports = router;
