const express = require('express');
const router = express.Router();
const Log = require('../models/Log');
const Incident = require('../models/Incident');
const AlertRule = require('../models/AlertRule');
const { protect } = require('../middleware/authMiddleware');

// InMemory logs array (used as fallback when MongoDB is disabled)
global.inMemoryLogs = global.inMemoryLogs || [];

// @route   POST /api/logs
// @desc    Ingest a new log from external services (Log Collector)
router.post('/', async (req, res) => {
    try {
        const { level, service, message, metadata, timestamp } = req.body;
        
        // Basic validation
        if (!level || !service || !message) {
            return res.status(400).json({ error: 'Please provide level, service, and message' });
        }

        const logTimestamp = timestamp ? new Date(timestamp) : new Date();
        const uppercaseLevel = level.toUpperCase();

        const logObj = {
            level: uppercaseLevel,
            service,
            message,
            metadata: metadata || {},
            timestamp: logTimestamp
        };

        let savedLog;

        if (global.isUsingMemoryDb) {
            // Save to memory
            logObj.id = Date.now().toString() + Math.random().toString(36).substring(7);
            global.inMemoryLogs.push(logObj);
            savedLog = logObj;
        } else {
            // Save to MongoDB
            savedLog = await Log.create(logObj);
        }

        // --- REAL-TIME ALERTING ENGINE (Option C) ---
        // Trigger alerts on ERROR or specific criteria matching active Alert Rules
        if (uppercaseLevel === 'ERROR') {
            let activeRules = [];
            
            if (global.isUsingMemoryDb) {
                activeRules = global.inMemoryAlertRules.filter(r => r.active);
            } else {
                activeRules = await AlertRule.find({ active: true });
            }

            // Find matching rules for this service
            const matchingRules = activeRules.filter(rule => 
                rule.service.toLowerCase() === 'any' || 
                rule.service.toLowerCase() === service.toLowerCase()
            );

            for (const rule of matchingRules) {
                const incidentData = {
                    ruleName: rule.name,
                    condition: rule.condition,
                    service: service,
                    message: message,
                    level: uppercaseLevel,
                    status: 'ACTIVE',
                    timestamp: new Date()
                };

                if (global.isUsingMemoryDb) {
                    incidentData.id = 'inc-' + Date.now() + Math.floor(Math.random() * 100);
                    global.inMemoryIncidents.push(incidentData);
                    console.log(`🚨 [ALERT ENGINE] Triggered memory incident: "${rule.name}" for service: ${service}`);
                } else {
                    await Incident.create(incidentData);
                    console.log(`🚨 [ALERT ENGINE] Triggered MongoDB incident: "${rule.name}" for service: ${service}`);
                }
            }
        }

        res.status(201).json(savedLog);
    } catch (error) {
        console.error('Log Ingestion Error:', error);
        res.status(500).json({ error: 'Server error while ingesting log' });
    }
});

// @route   GET /api/logs
// @desc    Retrieve logs to display in Dashboard with search/filter/pagination (PROTECTED)
router.get('/', protect, async (req, res) => {
    try {
        const { level, service, text, startDate, endDate, page = 1, limit = 50 } = req.query;
        const pageInt = parseInt(page);
        const limitInt = parseInt(limit);
        const skip = (pageInt - 1) * limitInt;

        if (global.isUsingMemoryDb) {
            let filteredLogs = [...global.inMemoryLogs];

            // Parse Filters
            if (level) filteredLogs = filteredLogs.filter(l => l.level === level.toUpperCase());
            if (service) filteredLogs = filteredLogs.filter(l => l.service === service);
            
            // Search filter
            if (text) {
                filteredLogs = filteredLogs.filter(l => 
                    l.message.toLowerCase().includes(text.toLowerCase()) ||
                    l.service.toLowerCase().includes(text.toLowerCase())
                );
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
            filteredLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            const total = filteredLogs.length;
            const pagedLogs = filteredLogs.slice(skip, skip + limitInt);

            return res.json({
                count: pagedLogs.length,
                total,
                page: pageInt,
                totalPages: Math.ceil(total / limitInt),
                logs: pagedLogs
            });
        } else {
            // MongoDB queries
            const query = {};
            if (level) query.level = level.toUpperCase();
            if (service) query.service = service;
            if (text) query.message = { $regex: text, $options: 'i' };
            
            if (startDate || endDate) {
                query.timestamp = {};
                if (startDate) query.timestamp.$gte = new Date(startDate);
                if (endDate) query.timestamp.$lte = new Date(endDate);
            }

            const total = await Log.countDocuments(query);
            const logs = await Log.find(query)
                .sort({ timestamp: -1 })
                .skip(skip)
                .limit(limitInt);

            return res.json({
                count: logs.length,
                total,
                page: pageInt,
                totalPages: Math.ceil(total / limitInt),
                logs
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error retrieving logs' });
    }
});

// @route   GET /api/logs/stats
// @desc    Retrieve summarized metrics for frontend visualization widgets (PROTECTED)
router.get('/stats', protect, async (req, res) => {
    try {
        if (global.isUsingMemoryDb) {
            const levelMap = {};
            const serviceMap = {};
            
            global.inMemoryLogs.forEach(log => {
                levelMap[log.level] = (levelMap[log.level] || 0) + 1;
                serviceMap[log.service] = (serviceMap[log.service] || 0) + 1;
            });

            const levelDistribution = Object.keys(levelMap).map(k => ({ _id: k, count: levelMap[k] }));
            const trafficByService = Object.keys(serviceMap).map(k => ({ _id: k, count: serviceMap[k] }));

             return res.json({
                levelDistribution,
                trafficByService,
                totalLogs: global.inMemoryLogs.length,
                isUsingMemoryDb: global.isUsingMemoryDb
            });
        } else {
            // MongoDB Aggregations
            const levelDistribution = await Log.aggregate([
                { $group: { _id: '$level', count: { $sum: 1 } } }
            ]);

            const trafficByService = await Log.aggregate([
                { $group: { _id: '$service', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]);

            const totalLogs = await Log.countDocuments();

            return res.json({
                levelDistribution,
                trafficByService,
                totalLogs,
                isUsingMemoryDb: global.isUsingMemoryDb
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error retrieving stats' });
    }
});

// @route   POST /api/logs/cleanup
// @desc    Prune old telemetry records (Data Retention)
router.post('/cleanup', protect, async (req, res) => {
    try {
        const { olderThan } = req.body;
        
        let cutoffDate = new Date();
        let query = {};
        
        if (olderThan === '5m') {
            cutoffDate.setMinutes(cutoffDate.getMinutes() - 5);
            query = { timestamp: { $lt: cutoffDate } };
        } else if (olderThan === '1h') {
            cutoffDate.setHours(cutoffDate.getHours() - 1);
            query = { timestamp: { $lt: cutoffDate } };
        } else if (olderThan === 'all') {
            query = {};
        } else {
            return res.status(400).json({ error: 'Invalid retention time window specified' });
        }

        if (global.isUsingMemoryDb) {
            if (olderThan === 'all') {
                global.inMemoryLogs = [];
            } else {
                global.inMemoryLogs = global.inMemoryLogs.filter(log => new Date(log.timestamp) >= cutoffDate);
            }
            return res.json({ success: true, message: `Successfully pruned memory logs (${olderThan}).` });
        } else {
            const result = await Log.deleteMany(query);
            return res.json({ success: true, message: `Successfully deleted ${result.deletedCount} logs from database.` });
        }
    } catch (error) {
        console.error('Data retention error:', error);
        res.status(500).json({ error: 'Server error during data retention cleanup' });
    }
});

module.exports = router;

