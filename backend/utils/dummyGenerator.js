const axios = require('axios');

// This script acts as a mock "Log Producer" from other systems in your microservices landscape.
const generateLog = async () => {
    // Array with weighted odds for 'INFO' over others!
    const levels = ['INFO', 'INFO', 'INFO', 'INFO', 'WARN', 'ERROR', 'DEBUG'];
    const services = ['auth-service', 'payment-gateway', 'user-dashboard', 'billing-engine', 'image-processor'];
    const messages = [
        'User authentication successful',
        'Payload validation complete',
        'Database transaction finalized',
        'Processing request payload',
        'Cache hit for user profile',
        'Background job triggered',
        // Errors
        'Database connection timeout',
        'Payment processor declined transaction',
        'Rate limit exceeded for IP',
        'S3 Bucket Image upload failed'
    ];

    const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    
    // Choose our config
    const level = randomPick(levels);
    const service = randomPick(services);

    // Pick appropriately severe message depending on if it's an ERROR or not
    let message = randomPick(messages);
    if (level === 'ERROR' && !message.includes('fail') && !message.includes('timeout') && !message.includes('decline') && !message.includes('exceed')) {
         message = "Unexpected runtime exception occurred";
    }

    const logData = {
        level,
        service,
        message,
        metadata: {
            processId: Math.floor(Math.random() * 9999),
            host: 'server-' + Math.floor(Math.random() * 5),
            latency: Math.floor(Math.random() * 200) + 'ms'
        }
    };

    try {
        // Send to your newly created ingestion API:
        await axios.post('http://localhost:5000/api/logs', logData);
        console.log(`[Sent Data] Pushed ${level} log from [${service}] -> Backend API.`);
    } catch (error) {
        console.error('Failed to send dummy log. Ensure node server.js is running and MongoDB is connected!');
    }
};

// Fire a dummy log every 1.5 seconds!
console.log("🚀 Starting continuous Dummy Log Generator...");
console.log("Make sure the backend is running (npm run dev)...");
setInterval(generateLog, 1500);
