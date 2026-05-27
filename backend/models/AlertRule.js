const mongoose = require('mongoose');

const alertRuleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    condition: {
        type: String,
        required: true
    },
    service: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('AlertRule', alertRuleSchema);
