import React, { useEffect, useRef, useState } from 'react';

import weatherIcons from "../../utils/weatherIcons";

import { Box, Card, CardContent, Stack, Typography } from "@mui/material";

import { Line } from "react-chartjs-2";
import "chart.js/auto";

import DropHumidity from '../../assets/icons/drop humidity.svg';

const HourlyForecast = ({ weatherData, isDayNow }) => {
  const cardContentRef = useRef(null);

  const [cardWidth, setCardWidth] = useState(0);

  useEffect(() => {
    if (cardContentRef.current) {
      setCardWidth(cardContentRef.current.scrollWidth - 50);
    }
  }, [weatherData]);

  const minTemp = Math.min(...weatherData.map(hour => hour.temp));
  const maxTemp = Math.max(...weatherData.map(hour => hour.temp));

  const getColorForTemp = (temp) => {
    const min = minTemp;
    const max = maxTemp;

    const normalizedTemp = (temp - min) / (max - min);

    const r = isDayNow ? Math.floor(255 - normalizedTemp * (255 - 255)) : Math.floor(187 + normalizedTemp * (33 - 187));
    const g = isDayNow ? Math.floor(255 - normalizedTemp * (255 - 242)) : Math.floor(222 + normalizedTemp * (150 - 222));
    const b = isDayNow ? Math.floor(183 + normalizedTemp * (32 - 183)) : Math.floor(251 + normalizedTemp * (243 - 251));

    return `rgb(${r}, ${g}, ${b})`;
  };

  const chartData = {
    labels: weatherData.map((hour) => hour.hour),
    datasets: [
      {
        label: "Temperature",
        data: weatherData.map((hour) => hour.temp),

        borderColor: (context) => {
          const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, context.chart.height);
          const data = context.chart.data.datasets[0].data;
          const steps = data.length;

          data.forEach((temp, index) => {
            const color = getColorForTemp(temp);
            const position = index / (steps - 1);
            gradient.addColorStop(1 - position, color);
          });
          return gradient;
        },

        pointBorderWidth: 2,
        pointBorderColor: weatherData.map((hour) => getColorForTemp(hour.temp)),
        pointBackgroundColor: "white",
        pointHoverBackgroundColor: "white",
        pointRadius: 6,
        pointHoverRadius: 6,
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: false,
        reverse: true,
      },
      y: {
        display: false,
        min: minTemp - 2.2,
        max: maxTemp + 2.2,
        beginAtZero: false,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
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
          paddingX: 2,
          paddingY: 0,
          boxShadow: 3,
          marginX: 'auto',
          marginTop: 1,
          whiteSpace: "nowrap",
          maxWidth: 800,
          width: "80%",
          color: " #213547"
        }}
      >
        <CardContent sx={{ overflowX: "auto" }} ref={cardContentRef}>
          <Stack direction="column" spacing={2} sx={{ paddingBottom: 2 }}>
            <Stack direction="row" spacing={2} sx={{ minWidth: 80, paddingTop: 2 }}>
              {weatherData.map((hour, index) => (
                <Stack key={index} alignItems="center" spacing={1} sx={{ minWidth: 80 }}>
                  <Typography variant="body2" fontWeight="bold">
                    {hour.hour}
                  </Typography>
                  <img
                    src={
                      hour.isDay
                        ? weatherIcons[hour.weather]?.icon
                        : weatherIcons[hour.weather]?.nightIcon || weatherIcons[hour.weather]?.icon
                    }
                    alt={weatherIcons[hour.weather]?.text}
                    style={{ width: 40, height: 40 }}
                  />
                  <Typography variant="body1" style={{ direction: 'ltr' }}>{hour.temp}°</Typography>
                </Stack>
              ))}
            </Stack>

            <Box sx={{ height: 80, width: cardWidth, overflowX: "auto", padding: 2, }}>
              <Line data={chartData} options={chartOptions} />
            </Box>

            <Stack direction="row" spacing={2} sx={{ minWidth: 80, paddingTop: 2 }}>
              {weatherData.map((hour, index) => (
                <Stack key={index} direction="row" alignItems="center" spacing={0} sx={{ minWidth: 80 }}>
                  <img
                    src={DropHumidity}
                    alt="לחות"
                    style={{ width: 25, height: 25 }}
                  />
                  <Typography variant="body1">{hour.humidity}%</Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
  )
}

export default HourlyForecast
