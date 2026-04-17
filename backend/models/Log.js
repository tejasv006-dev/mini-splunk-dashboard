const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    level: {
        type: String,
        required: true,
        enum: ['INFO', 'WARN', 'ERROR', 'DEBUG'],
        index: true // Indexed for faster querying
    },
    service: {
        type: String,
        required: true,
        index: true
    },
    message: {
        type: String,
        required: true
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed, // Allows flexible unstructured JSON metadata
        default: {}
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true // Crucial index: logs are heavily sorted and filtered by time
    }
}, { timestamps: true });

// Compound index for queries filtering by service + level
logSchema.index({ service: 1, level: 1, timestamp: -1 });

module.exports = mongoose.model('Log', logSchema);
