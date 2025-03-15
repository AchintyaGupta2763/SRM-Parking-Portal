const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.verifyUser = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ success: false, message: 'No token provided' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) return res.status(401).json({ success: false, message: 'Invalid token' });

        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
    }
};

exports.verifyAdmin = async (req, res, next) => {
    await this.verifyUser(req, res, async () => {
        if (req.user.role === 'admin' || req.user.role === 'super-admin') {
            return next();
        }
        res.status(403).json({ success: false, message: 'Access denied' });
    });
};
