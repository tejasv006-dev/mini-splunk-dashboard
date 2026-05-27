const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
    ruleName: {
        type: String,
        required: true
    },
    condition: {
        type: String,
        required: true
    },
    service: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true,
        enum: ['INFO', 'WARN', 'ERROR', 'DEBUG']
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'ACKNOWLEDGED', 'RESOLVED'],
        default: 'ACTIVE'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Incident', incidentSchema);
