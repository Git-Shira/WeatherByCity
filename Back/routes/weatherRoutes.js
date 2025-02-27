const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async (req, res) => {
    const { lat, lon } = req.query;
    if (!lat || !lon)
        return res.status(400).send({ message: 'Missing query parameter. Please provide both latitude and longitude.' });

    try {
        const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_min,temperature_2m_max,weathercode,sunrise,sunset&hourly=temperature_2m,weathercode,relative_humidity_2m,wind_speed_120m,dewpoint_2m,pressure_msl,visibility,uv_index,is_day&current_weather=true&timezone=auto&past_days=2&forecast_days=8`);

        const days = response.data.daily.time;
        const minTemps = response.data.daily.temperature_2m_min;
        const maxTemps = response.data.daily.temperature_2m_max;
        const weatherCodes = response.data.daily.weathercode;

        const hourlyHumidities = response.data.hourly.relative_humidity_2m;

        let daily = days.map((day, index) => {
            const startIndex = index * 24;
            const endIndex = startIndex + 23;

            const humidityValues = hourlyHumidities.slice(startIndex, endIndex + 1);

            const avgHumidity = Math.round(humidityValues.reduce((acc, curr) => acc + curr, 0) / 24);

            return {
                day: day,
                minTemp: minTemps[index],
                maxTemp: maxTemps[index],
                weather: weatherCodes[index],
                avgHumidity: avgHumidity,
            };
        });

        const hours = response.data.hourly.time.slice(48, 72).map(time => {
            return time.split('T')[1];
        });

        const temps = response.data.hourly.temperature_2m.slice(48, 72);
        const weatherCodesByHours = response.data.hourly.weathercode.slice(48, 72);
        const humidities = response.data.hourly.relative_humidity_2m.slice(48, 72);
        const winds = response.data.hourly.wind_speed_120m.slice(48, 72);
        const pressures = response.data.hourly.pressure_msl.slice(48, 72);
        const visibilities = response.data.hourly.visibility.slice(48, 72);
        const dewPoints = response.data.hourly.dewpoint_2m.slice(48, 72);
        const uvIndexs = response.data.hourly.uv_index.slice(48, 72);
        const isDays = response.data.hourly.is_day.slice(48, 72);

        let hourly = hours.map((hour, index) => {

            return {
                hour: hour,
                temp: temps[index],
                weather: weatherCodesByHours[index],
                humidity: humidities[index],
                visibility: visibilities[index],
                wind: winds[index],
                pressure: pressures[index],
                dewPoint: dewPoints[index],
                uvIndex: uvIndexs[index],
                isDay: isDays[index],
            };
        });

        const sunTimes = {
            sunrise: response.data.daily.sunrise[2].split('T')[1],
            sunset: response.data.daily.sunset[2].split('T')[1]
        };

        const fetchTime = {
            hour: response.data.current_weather.time.split('T')[1].split(':')[0],
            day: response.data.current_weather.time.split('T')[0],
        };

        if (!response || !response.data || Object.keys(response.data).length === 0 || !response.data.hourly || !response.data.daily)
            return res.status(404).send({ message: 'No weather data found for the provided location.' });

        else
            res.status(200).send({ message: "Weather data fetched successfully", daily, hourly, sunTimes, fetchTime });

    } catch (error) {
        res.status(500).json({ message: 'Error fetching weather data.', error: error.message });
    }
});

module.exports = router;