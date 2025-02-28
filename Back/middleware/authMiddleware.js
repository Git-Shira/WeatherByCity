const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    try {
        let userUUID = req.cookies.userUUID;
        if (!userUUID) {
            userUUID = uuidv4();
            res.cookie('userUUID', userUUID, { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'lax' });

            await User.create({ uuid: userUUID, locations: [] });
        } else {
            res.cookie('userUUID', userUUID, { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'lax' });

            await User.updateOne(
                { uuid: userUUID },
                { $set: { expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) } }
            );
        }

        req.userUUID = userUUID;
        next();
    } catch (error) {
        console.error("Error in authMiddleware:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

module.exports = authMiddleware;
