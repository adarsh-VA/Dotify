const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        const decodedData = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decodedData._id).select("-password");
        if (!user) {
            throw new Error("Invalid Access Token")
        }

        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Authentication failed' });
    }
};

module.exports = verifyToken;