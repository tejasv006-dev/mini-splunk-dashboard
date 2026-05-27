const WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_LIMIT = 5; // Max 5 authentication requests per minute per IP

const ipRequestCache = {};

const rateLimiter = (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const now = Date.now();

    if (!ipRequestCache[ip]) {
        // Initialize cache for this IP
        ipRequestCache[ip] = {
            count: 1,
            resetTime: now + WINDOW_MS
        };
        return next();
    }

    const record = ipRequestCache[ip];

    if (now > record.resetTime) {
        // Window expired, reset window
        record.count = 1;
        record.resetTime = now + WINDOW_MS;
        return next();
    }

    // Increment request count
    record.count += 1;

    if (record.count > MAX_LIMIT) {
        const secondsRemaining = Math.ceil((record.resetTime - now) / 1000);
        return res.status(429).json({
            error: `Too many login attempts. Brute force defense active. Please retry in ${secondsRemaining} seconds.`
        });
    }

    next();
};

module.exports = rateLimiter;
