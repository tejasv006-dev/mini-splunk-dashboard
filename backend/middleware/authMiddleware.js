const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mini_splunk_secret_key');

            // Attach user details to request
            if (global.isUsingMemoryDb) {
                // In memory mode, we trust the decrypted JWT payload directly
                req.user = {
                    id: decoded.id,
                    username: decoded.username,
                    role: decoded.role || 'user'
                };
            } else {
                // In MongoDB mode, fetch the actual user document (without password)
                const user = await User.findById(decoded.id).select('-password');
                if (!user) {
                    return res.status(401).json({ error: 'Not authorized, user not found' });
                }
                req.user = user;
            }

            return next();
        } catch (error) {
            console.error('JWT Auth Error:', error.message);
            return res.status(401).json({ error: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ error: 'Not authorized, no token provided' });
    }
};

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Access denied: Admin privileges required' });
    }
};

module.exports = { protect, adminOnly };
