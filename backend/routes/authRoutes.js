const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const rateLimiter = require('../middleware/rateLimiter');

// In-Memory User Store (Initial seed with default admin account!)
global.inMemoryUsers = global.inMemoryUsers || [];

// Seed the memory store with a default admin user if it is empty
const seedDefaultAdmin = async () => {
    if (global.inMemoryUsers.length === 0) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('adminpassword', salt);
        global.inMemoryUsers.push({
            id: 'default-admin-id',
            username: 'admin',
            email: 'admin@splunk.com',
            password: hashedPassword,
            role: 'admin',
            createdAt: new Date()
        });
        console.log(`🔑 [SEED] Seeded In-Memory DB with admin account (Username: admin / Password: adminpassword)`);
    }
};
seedDefaultAdmin();

// Helper to sign JWT Token
const generateToken = (id, username, role) => {
    return jwt.sign(
        { id, username, role }, 
        process.env.JWT_SECRET || 'mini_splunk_secret_key', 
        { expiresIn: '30d' }
    );
};

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', rateLimiter, async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Please fill in all fields' });
        }

        // 1. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const assignedRole = role || 'user';

        if (global.isUsingMemoryDb) {
            // Memory check
            const exists = global.inMemoryUsers.find(u => u.email === email.toLowerCase() || u.username === username);
            if (exists) {
                return res.status(400).json({ error: 'User already exists' });
            }

            const newUser = {
                id: Date.now().toString(),
                username,
                email: email.toLowerCase(),
                password: hashedPassword,
                role: assignedRole,
                createdAt: new Date()
            };

            global.inMemoryUsers.push(newUser);

            return res.status(201).json({
                _id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                token: generateToken(newUser.id, newUser.username, newUser.role)
            });
        } else {
            // MongoDB operation
            const exists = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username }] });
            if (exists) {
                return res.status(400).json({ error: 'User already exists' });
            }

            const user = await User.create({
                username,
                email,
                password: hashedPassword,
                role: assignedRole
            });

            return res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.username, user.role)
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during user registration' });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', rateLimiter, async (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;

        if (!usernameOrEmail || !password) {
            return res.status(400).json({ error: 'Please provide credentials' });
        }

        if (global.isUsingMemoryDb) {
            // Find user in memory
            const user = global.inMemoryUsers.find(u => 
                u.email === usernameOrEmail.toLowerCase() || u.username === usernameOrEmail
            );

            if (user && (await bcrypt.compare(password, user.password))) {
                return res.json({
                    _id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user.id, user.username, user.role)
                });
            } else {
                return res.status(401).json({ error: 'Invalid username/email or password' });
            }
        } else {
            // Find user in MongoDB
            const user = await User.findOne({
                $or: [
                    { email: usernameOrEmail.toLowerCase() },
                    { username: usernameOrEmail }
                ]
            });

            if (user && (await bcrypt.compare(password, user.password))) {
                return res.json({
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id, user.username, user.role)
                });
            } else {
                return res.status(401).json({ error: 'Invalid username/email or password' });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during user login' });
    }
});

// @route   GET /api/auth/me
// @desc    Get current logged in user details
router.get('/me', protect, async (req, res) => {
    // req.user has already been set by the protect middleware
    res.json(req.user);
});

module.exports = router;
