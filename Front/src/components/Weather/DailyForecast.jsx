import React from 'react';

import weatherIcons from "../../utils/weatherIcons";

import { Card, CardContent, Grid2, Typography } from '@mui/material';

import DropHumidity from '../../assets/icons/drop humidity.svg';

const DailyForecast = ({ weatherData }) => {
  const getDayName = (date) => {
    const daysOfWeek = [
      'ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'
    ];
    const dayIndex = new Date(date).getDay();
    return daysOfWeek[dayIndex];
  };

  const getFormattedDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('he-IL', options);
  };

  return (
    (!weatherData || weatherData.length === 0)
      ?
      ""
      :
      <Card
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: 3,
          paddingY: 0,
          paddingX: 2,
          boxShadow: 3,
          marginX: 'auto',
          marginTop: 5,
          maxWidth: 800,
          width: "80%",
          color: " #213547"
        }}
      >
        <CardContent sx={{ overflowX: "auto" }}>
          <Grid2 container spacing={2}>
            {weatherData.map((day, index) => (
              <Grid2
                key={index}
                container
                alignItems="center"
                justifyContent="space-around"
                sx={{ width: "100%", paddingY: 1 }}
              >
                <Grid2 item size={{ xs: 3 }} textAlign="center">
                  <Typography variant="body2" fontWeight="bold">
                    {index === 1 ? "אתמול" : index === 2 ? "היום" : index === 3 ? "מחר" : `יום ${getDayName(day.day)}`}
                  </Typography>
                  <Typography variant="body2" fontWeight="normal">
                    {getFormattedDate(day.day)}
                  </Typography>
                </Grid2>

                <Grid2 item size={{ xs: 3 }} display="flex" alignItems="center" justifyContent="center">
                  <img src={DropHumidity} alt="לחות" style={{ width: 25, height: 25 }} />
                  <Typography variant="body1" sx={{ marginLeft: 0.5 }}>
                    {day.avgHumidity}%
                  </Typography>
                </Grid2>

                <Grid2 item size={{ xs: 3 }} display="flex" justifyContent="center">
                  <img
                    src={weatherIcons[day.weather]?.icon}
                    alt={weatherIcons[day.weather]?.text}
                    style={{ width: 40, height: 40 }}
                  />
                </Grid2>

                <Grid2 item size={{ xs: 3 }} textAlign="center">
                  <Typography variant="body1" style={{ direction: 'ltr' }}>
                    {day.minTemp}° / {day.maxTemp}°
                  </Typography>
                </Grid2>
              </Grid2>
            ))}
          </Grid2>
        </CardContent>
      </Card>
  )
}

export default DailyForecast
