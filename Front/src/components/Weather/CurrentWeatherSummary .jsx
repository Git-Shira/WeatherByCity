import React from 'react';

import weatherIcons from "../../utils/weatherIcons";

import { Box, Card, CardContent, Stack, Typography } from "@mui/material";


const CurrentWeatherSummary = ({ location, weatherDataCurHour, weatherData }) => {

  return (
    (!location || !location.name || !weatherDataCurHour || weatherDataCurHour.length === 0 || !weatherData || weatherData.length === 0)
      ?
      ""
      :
      <Card
        sx={{
          paddingX: 0,
          paddingTop: 10,
          paddingBottom: 1,
          boxShadow: 'none',
          width: "85%",
          marginX: 'auto',
          maxWidth: 835,
          background: 'transparent',
          color: " #213547"
        }}
      >
        <CardContent sx={{ paddingY: 0, paddingX: 0.8, paddingBottom: 0 }}>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box
              sx={{
                flex: { xs: "1 1 100%", sm: "0 1 auto" },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'center',
                padding: 2,
                borderRadius: 3,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                boxShadow: 3,
              }}
            >
              <Typography variant="h3" fontWeight="bold">
                {location.name}
              </Typography>
              <Typography variant="subtitle1">
                {location.state && `${location.state},`} {location.country}
              </Typography>
            </Box>

            <Box
              sx={{
                flex: { xs: "1 1 100%", sm: "1" },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'center',
                padding: 2,
                borderRadius: 3,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                boxShadow: 3,
              }}
            >
              <Stack direction="row" justifyContent="space-around" alignItems="center" spacing={2}>
                <Stack alignItems="center" spacing={1}>
                  <Typography variant="h3" fontWeight="bold">
                    {weatherDataCurHour.temp}°
                  </Typography>
                  <Typography variant="subtitle1" style={{ direction: 'ltr' }}>
                    {weatherData[2]?.minTemp}° / {weatherData[2]?.maxTemp}°
                  </Typography>
                </Stack>

                <Stack alignItems="center" spacing={0.5}>
                  <img
                    src={
                      weatherDataCurHour.isDay
                        ? weatherIcons[weatherDataCurHour.weather]?.icon
                        : weatherIcons[weatherDataCurHour.weather]?.nightIcon || weatherIcons[weatherDataCurHour.weather]?.icon
                    }
                    alt={weatherIcons[weatherDataCurHour.weather]?.text}
                    style={{ width: 60, height: 60 }}
                  />
                  <Typography variant="subtitle1">
                    {weatherIcons[weatherDataCurHour.weather]?.text}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Box>
        </CardContent>
      </Card>
  )
}

export default CurrentWeatherSummary 
