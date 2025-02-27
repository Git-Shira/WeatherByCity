const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true,
        unique: true
    },
    locations: [
        {
            name: String,
            state: String,
            country: String,
            lat: Number,
            lon: Number
        }
    ],
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    }
});

userSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('User', userSchema);
