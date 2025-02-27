import React, { useEffect, useState } from 'react';

import { useLocation } from '../../contexts/LocationContext';

import axios from 'axios';

import CurrentWeatherSummary from './CurrentWeatherSummary ';
import HourlyForecast from './HourlyForecast';
import DailyForecast from './DailyForecast';
import CurrentWeatherDetails from './CurrentWeatherDetails ';
import Loading from '../Loading';
import ErrorMessage from '../ErrorMessage';
import LocationSearch from '../Locations/LocationSearch';

import { Box, Typography } from "@mui/material";

const WeatherManager = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const { location } = useLocation();

  const [weatherData, setWeatherData] = useState(null);
  const [isDayNow, setIsDayNow] = useState();
  const [weatherDataCurHour, setWeatherDataCurHour] = useState(null);
  const [lastUpdatedDate, setLastUpdatedDate] = useState(null);

  const [errorMessage, setErrorMessage] = useState('');

  const fetchWeather = async () => {
    if (location?.lat && location?.lon) {
      const weather = await axios.get(`${API_BASE_URL}/api/weather/`, {
        params: {
          lat: location.lat,
          lon: location.lon
        },
        withCredentials: true
      });

      if (weather.status === 200) {
        setErrorMessage('');

        setWeatherData(weather.data);
        setLastUpdatedDate(weather.data.fetchTime.day);

        const now = new Date();
        const currentHour = now.getHours();
        setWeatherDataCurHour(weather.data.hourly[currentHour]);
        setIsDayNow(weather.data.hourly[currentHour].isDay)
      }
      else {
        setWeatherData([]);
        setErrorMessage("לא הצלחנו להציג את התחזית עבור המיקום שבחרתם, בדקו את החיבור לאינטרנט ונסו שוב.");
      }
    }
  }

  useEffect(() => {
    fetchWeather();

    const now = new Date();
    const currentMinutes = now.getMinutes();
    const currentSeconds = now.getSeconds();
    const minutesUntilNextHour = 60 - currentMinutes;
    const millisecondsUntilNextHour = (minutesUntilNextHour * 60 - currentSeconds) * 1000;

    console.log(`Next update in ${minutesUntilNextHour} minutes`);

    const timeout = setTimeout(() => {
      console.log("Updating on the hour...");
      updateHourly();
      startHourlyUpdates();
    }, millisecondsUntilNextHour);

    return () => clearTimeout(timeout);
  }, [location]);

  const startHourlyUpdates = () => {
    const interval = setInterval(() => {
      updateHourly();
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  };

  const updateHourly = () => {
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];
    const currentHour = now.getHours();

    if (currentDate !== lastUpdatedDate) {
      console.log("Day changed - fetching new weather data...");
      fetchWeather();
    } else {
      console.log(`Hour changed to ${currentHour} - updating local state`);
      setWeatherDataCurHour(weatherData.hourly[currentHour]);
      setIsDayNow(weatherData.data.hourly[currentHour].isDay)
    }
  };

  return (
    location ? (
      <div key={location.lat + location.lon}>
        {(location.lat && location.lon && weatherData)
          ? (
            <>
              <Box
                sx={{
                  backgroundImage: "url('/background.png')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  minHeight: '100vh',
                  width: '100vw',
                }}
              >
                <CurrentWeatherSummary location={location} weatherDataCurHour={weatherDataCurHour} weatherData={weatherData?.daily || []} />
                <HourlyForecast weatherData={weatherData?.hourly || []} isDayNow={isDayNow} />
                <DailyForecast weatherData={weatherData?.daily || []} />
                <CurrentWeatherDetails weatherDataCurHour={weatherDataCurHour} sunTimes={weatherData?.sunTimes || []} />
              </Box>
            </>
          ) : (errorMessage && errorMessage !== "") ? (
            <ErrorMessage message={errorMessage} />
          ) : (
            <Loading />
          )}
      </div>
    ) : (
      <Box
        sx={{
          backgroundImage: "url('/background.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          padding: 3,
          borderRadius: 8,
          marginY: 1,
          color: " #213547"
        }}>
          <Typography variant="h2" align="center" fontWeight="bold">
            ברוכים הבאים!
          </Typography>

          <Typography variant="h4" align="center"
            sx={{
              marginTop: 1,
              marginBottom: 5
            }}>
            חפשו מיקום כדי להתחיל :)
          </Typography>

          <LocationSearch />
        </Box>
      </Box>
    )
  );
}

export default WeatherManager
