const express = require('express');
const router = express.Router();

// InMemory array instead of Mongoose collection
let inMemoryLogs = [];

// @route   POST /api/logs
// @desc    Ingest a new log from external services (Log Collector)
router.post('/', async (req, res) => {
    try {
        const { level, service, message, metadata, timestamp } = req.body;
        
        // Basic validation
        if (!level || !service || !message) {
            return res.status(400).json({ error: 'Please provide level, service, and message' });
        }

        const newLog = {
            id: Date.now().toString() + Math.random().toString(36).substring(7),
            level: level.toUpperCase(),
            service,
            message,
            metadata: metadata || {},
            timestamp: timestamp ? new Date(timestamp) : new Date()
        };

        // Basic Alerting Mechanism Simulation
        if (newLog.level === 'ERROR') {
            console.warn(`🚨 [ALERT] High Priority Action REQUIRED: Error logged from service ${service}`);
        }

        inMemoryLogs.push(newLog);
        res.status(201).json(newLog);
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
        let filteredLogs = [...inMemoryLogs];

        // Parse Filters
        if (level) filteredLogs = filteredLogs.filter(l => l.level === level.toUpperCase());
        if (service) filteredLogs = filteredLogs.filter(l => l.service === service);
        
        // Simple search on 'message'.
        if (text) {
            filteredLogs = filteredLogs.filter(l => l.message.toLowerCase().includes(text.toLowerCase()));
        }
        
        // Time Window Filtering
        if (startDate || endDate) {
            filteredLogs = filteredLogs.filter(l => {
                let valid = true;
                if (startDate) valid = valid && new Date(l.timestamp) >= new Date(startDate);
                if (endDate) valid = valid && new Date(l.timestamp) <= new Date(endDate);
                return valid;
            });
        }

        // Sort Newest first
        filteredLogs.sort((a, b) => b.timestamp - a.timestamp);

        // Pagination Calculations
        const limitInt = parseInt(limit);
        const pageInt = parseInt(page);
        const skip = (pageInt - 1) * limitInt;

        const total = filteredLogs.length;
        const pagedLogs = filteredLogs.slice(skip, skip + limitInt);

        res.json({
            count: pagedLogs.length,
            total,
            page: pageInt,
            totalPages: Math.ceil(total / limitInt),
            logs: pagedLogs
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
        const levelMap = {};
        const serviceMap = {};
        
        inMemoryLogs.forEach(log => {
            levelMap[log.level] = (levelMap[log.level] || 0) + 1;
            serviceMap[log.service] = (serviceMap[log.service] || 0) + 1;
        });

        const levelDistribution = Object.keys(levelMap).map(k => ({ _id: k, count: levelMap[k] }));
        const trafficByService = Object.keys(serviceMap).map(k => ({ _id: k, count: serviceMap[k] }));

        res.json({
            levelDistribution,
            trafficByService,
            totalLogs: inMemoryLogs.length
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error retrieving stats' });
    }
});

module.exports = router;
