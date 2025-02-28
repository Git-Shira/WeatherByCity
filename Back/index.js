const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const connectDB = require('./db');
const authMiddleware = require('./middleware/authMiddleware');

dotenv.config();

const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = ['http://localhost:5173', 'https://weather-by-city.vercel.app', 'https://weather-by-city-shira-prod.vercel.app', 'https://weather-by-city-git-main-shira-prod.vercel.app'];

const corsOptions = {
    origin: function (origin, callback) {
        const isAllowedOrigin = allowedOrigins.includes(origin) || (origin && origin.endsWith('.vercel.app'));
        if (!origin || isAllowedOrigin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use(cors(corsOptions));

app.use(authMiddleware);

const weatherRoutes = require("./routes/weatherRoutes");
const locationsRoutes = require("./routes/locationsRoutes");

app.use("/api/weather", weatherRoutes);
app.use("/api/locations", locationsRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});