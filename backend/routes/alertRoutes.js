const express = require('express');
const router = express.Router();
const AlertRule = require('../models/AlertRule');
const Incident = require('../models/Incident');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Seed In-Memory Store
global.inMemoryAlertRules = global.inMemoryAlertRules || [
    { id: 'rule-1', name: 'High Error Rate', condition: 'ERROR > 5 in 1 min', service: 'Any', active: true },
    { id: 'rule-2', name: 'Billing Gateway Failures', condition: 'ERROR > 1 in 1 min', service: 'billing-engine', active: true },
    { id: 'rule-3', name: 'Auth Critical Latency', condition: 'WARN > 3 in 5 min', service: 'auth-service', active: true }
];

global.inMemoryIncidents = global.inMemoryIncidents || [
    {
        id: 'inc-1',
        ruleName: 'Billing Gateway Failures',
        condition: 'ERROR > 1 in 1 min',
        service: 'billing-engine',
        message: 'Payment processor declined transaction - Connection Timeout',
        level: 'ERROR',
        status: 'ACTIVE',
        timestamp: new Date(Date.now() - 5 * 60 * 1000) // 5 mins ago
    },
    {
        id: 'inc-2',
        ruleName: 'High Error Rate',
        condition: 'ERROR > 5 in 1 min',
        service: 'image-processor',
        message: 'S3 Bucket Image upload failed: Access Denied',
        level: 'ERROR',
        status: 'ACKNOWLEDGED',
        timestamp: new Date(Date.now() - 15 * 60 * 1000) // 15 mins ago
    }
];

// --- ALERT RULES ENDPOINTS ---

// @route   GET /api/alerts/rules
// @desc    Retrieve all alert configurations
router.get('/rules', protect, async (req, res) => {
    try {
        if (global.isUsingMemoryDb) {
            return res.json(global.inMemoryAlertRules);
        } else {
            const rules = await AlertRule.find();
            return res.json(rules);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error retrieving alert rules' });
    }
});

// @route   POST /api/alerts/rules
// @desc    Add a new alert rule
router.post('/rules', protect, adminOnly, async (req, res) => {
    try {
        const { name, condition, service, active } = req.body;

        if (!name || !condition || !service) {
            return res.status(400).json({ error: 'Please provide name, condition, and target service' });
        }

        if (global.isUsingMemoryDb) {
            const exists = global.inMemoryAlertRules.find(r => r.name.toLowerCase() === name.toLowerCase());
            if (exists) {
                return res.status(400).json({ error: 'Alert rule name must be unique' });
            }

            const newRule = {
                id: Date.now().toString(),
                name,
                condition,
                service,
                active: active !== undefined ? active : true
            };

            global.inMemoryAlertRules.push(newRule);
            return res.status(201).json(newRule);
        } else {
            const exists = await AlertRule.findOne({ name });
            if (exists) {
                return res.status(400).json({ error: 'Alert rule name must be unique' });
            }

            const rule = await AlertRule.create({
                name,
                condition,
                service,
                active: active !== undefined ? active : true
            });

            return res.status(201).json(rule);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error creating alert rule' });
    }
});

// @route   DELETE /api/alerts/rules/:id
// @desc    Remove an alert rule
router.delete('/rules/:id', protect, adminOnly, async (req, res) => {
    try {
        const id = req.params.id;

        if (global.isUsingMemoryDb) {
            global.inMemoryAlertRules = global.inMemoryAlertRules.filter(r => r.id !== id);
            return res.json({ success: true, message: 'Alert rule removed' });
        } else {
            const rule = await AlertRule.findById(id);
            if (!rule) {
                return res.status(404).json({ error: 'Alert rule not found' });
            }
            await rule.deleteOne();
            return res.json({ success: true, message: 'Alert rule removed' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error removing alert rule' });
    }
});


// --- INCIDENTS ENDPOINTS ---

// @route   GET /api/alerts/incidents
// @desc    Retrieve all triggered alerts
router.get('/incidents', protect, async (req, res) => {
    try {
        if (global.isUsingMemoryDb) {
            // Sort newest first
            const sortedIncidents = [...global.inMemoryIncidents].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            return res.json(sortedIncidents);
        } else {
            const incidents = await Incident.find().sort({ timestamp: -1 });
            return res.json(incidents);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error retrieving incidents' });
    }
});

// @route   PUT /api/alerts/incidents/:id
// @desc    Update incident state (Acknowledge or Resolve)
router.put('/incidents/:id', protect, async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;

        if (!status || !['ACTIVE', 'ACKNOWLEDGED', 'RESOLVED'].includes(status)) {
            return res.status(400).json({ error: 'Please provide a valid status update' });
        }

        if (global.isUsingMemoryDb) {
            const incident = global.inMemoryIncidents.find(i => i.id === id);
            if (!incident) {
                return res.status(404).json({ error: 'Incident not found' });
            }
            incident.status = status;
            return res.json(incident);
        } else {
            const incident = await Incident.findById(id);
            if (!incident) {
                return res.status(404).json({ error: 'Incident not found' });
            }
            incident.status = status;
            await incident.save();
            return res.json(incident);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error updating incident' });
    }
});

module.exports = router;
