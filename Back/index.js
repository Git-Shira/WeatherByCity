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

const corsOptions = {
    origin: function (origin, callback) {
        callback(null, true);
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