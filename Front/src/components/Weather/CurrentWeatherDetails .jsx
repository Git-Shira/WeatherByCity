import React, { useEffect, useState } from 'react';

import { Box, Card, CardContent, Grid2, Typography } from "@mui/material";

import DropHumidity from '../../assets/icons/drop humidity.svg';
import VisibilityIcon from '../../assets/icons/visibility.svg';
import WindIcon from '../../assets/icons/wind.svg';
import PressureIcon from '../../assets/icons/pressure.svg';
import DewPoint from '../../assets/icons/dew point.svg';
import UvIndexIcon from '../../assets/icons/sun ultraviolet.svg';

import SunriseIcon from '../../assets/icons/sunrise.svg';
import SunsetIcon from '../../assets/icons/sunset.svg';

import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const CurrentWeatherDetails = ({ weatherDataCurHour, sunTimes }) => {
  const [chartData, setChartData] = useState(null);

  const today = new Date().toISOString().split("T")[0];
  const sunriseTime = new Date(`${today}T${sunTimes.sunrise}`).getTime();
  const sunsetTime = new Date(`${today}T${sunTimes.sunset}`).getTime();

  const totalDuration = sunsetTime - sunriseTime;
  const segmentDuration = totalDuration / 20;

  const calculateChartData = () => {
    const currentTime = new Date().getTime();

    const duration = sunsetTime - sunriseTime;
    const xData = Array.from({ length: 21 }, (_, i) => i);
    const yData = xData.map(x => {
      const xRatio = x / 20;
      return -0.8 * (xRatio - 0.5) ** 2 + 1.5;
    });

    const pointData = new Array(21).fill(null);
    const currentRatio = (currentTime - sunriseTime) / duration;

    const currentX = Math.round(currentRatio * 20);

    const currentY = -0.8 * ((currentX / 20) - 0.5) ** 2 + 1.5;

    const index = currentX;
    if (index >= 0 && index <= 20) {
      pointData[index] = currentY;
    }

    setChartData({
      labels: xData,
      datasets: [
        {
          label: "Sun Arc",
          data: yData,
          borderColor: " #ffdd32",
          backgroundColor: " #ffdd32",
          borderWidth: 10,
          pointRadius: 0,
          tension: 0.3,
        },
        {
          label: "Current Time",
          data: pointData,
          borderColor: " #ffdd32",
          backgroundColor: " #ffdd32",
          pointRadius: 12,
          pointBorderWidth: 4,
          pointHoverRadius: 12,
        },
      ],
    });
  };

  if (sunTimes?.sunrise && sunTimes?.sunset && !chartData) {
    calculateChartData();
  }

  const [current, setCurrent] = useState(0);

  const startIntervals = () => {
    const interval = setInterval(() => {
      calculateChartData();

      if (current >= 20) {
        clearInterval(interval);
      }
    }, segmentDuration);
  };

  useEffect(() => {
    const currentTime = new Date().getTime();
    const timePassed = currentTime - sunriseTime;
    const currentSegment = Math.floor(timePassed / segmentDuration);
    const remainingTimeInSegment = segmentDuration - (timePassed % segmentDuration);

    setCurrent(currentSegment);

    setTimeout(() => {
      calculateChartData();
      startIntervals();
    }, remainingTimeInSegment);

  }, [current]);

  return (
    <div>
      <Card
        sx={{
          paddingY: 0,
          paddingX: 0,
          paddingTop: 1,
          marginX: 'auto',
          boxShadow: 'none',
          width: "85%",
          maxWidth: 835,
          marginTop: 4,
          background: 'transparent',
          color: " #213547"
        }}
      >
        <CardContent sx={{ paddingY: 0, paddingX: 0.8 }}>
          <Grid2 container spacing={3} display='flex'>
            {!weatherDataCurHour || weatherDataCurHour.length === 0
              ?
              ""
              :
              <>
                <Grid2 item size={{ xs: 6, md: 4 }} textAlign="center" display="flex">
                  <Card
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      borderRadius: 3,
                      padding: 2,
                      boxShadow: 3,
                      color: " #213547",
                      flexGrow: 1,
                    }}
                  >
                    <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                      <Grid2 container justifyContent="center" alignItems="center">
                        <img src={DropHumidity} alt="לחות" style={{ width: 25, height: 25 }} />
                        <Typography variant="subtitle1" fontWeight="bold" textAlign="center" style={{ marginRight: 8 }}>לחות</Typography>
                      </Grid2>
                      <Typography variant="h4" textAlign="center" style={{ marginTop: 12 }}>{weatherDataCurHour.humidity}%</Typography>
                    </CardContent>
                  </Card>
                </Grid2>

                <Grid2 item size={{ xs: 6, md: 4 }} textAlign="center" display="flex">
                  <Card
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      borderRadius: 3,
                      padding: 2,
                      boxShadow: 3,
                      color: " #213547",
                      flexGrow: 1,
                    }}
                  >
                    <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                      <Grid2 container justifyContent="center" alignItems="center">
                        <img src={VisibilityIcon} alt="נראות" style={{ width: 25, height: 25 }} />
                        <Typography variant="subtitle1" fontWeight="bold" textAlign="center" style={{ marginRight: 8 }}>נראות</Typography>
                      </Grid2>
                      <Typography variant="h4" textAlign="center" style={{ marginTop: 12 }}>{(weatherDataCurHour.visibility / 1000).toFixed(2)} <span style={{ fontSize: '0.7em' }}>ק"מ</span></Typography>
                    </CardContent>
                  </Card>
                </Grid2>

                <Grid2 item size={{ xs: 6, md: 4 }} textAlign="center" display="flex">
                  <Card
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      borderRadius: 3,
                      padding: 2,
                      boxShadow: 3,
                      color: " #213547",
                      flexGrow: 1,
                    }}
                  >
                    <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                      <Grid2 container justifyContent="center" alignItems="center">
                        <img src={WindIcon} alt="רוח" style={{ width: 25, height: 25 }} />
                        <Typography variant="subtitle1" fontWeight="bold" textAlign="center" style={{ marginRight: 8 }}>רוח</Typography>
                      </Grid2>
                      <Typography variant="h4" textAlign="center" style={{ marginTop: 12 }}>{weatherDataCurHour.wind} <span style={{ fontSize: '0.7em' }}>קמ"ש</span></Typography>
                    </CardContent>
                  </Card>
                </Grid2>

                <Grid2 item size={{ xs: 6, md: 4 }} textAlign="center" display="flex">
                  <Card
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      borderRadius: 3,
                      padding: 2,
                      boxShadow: 3,
                      color: " #213547",
                      flexGrow: 1,
                    }}
                  >
                    <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                      <Grid2 container justifyContent="center" alignItems="center">
                        <img src={PressureIcon} alt="לחץ" style={{ width: 25, height: 25 }} />
                        <Typography variant="subtitle1" fontWeight="bold" textAlign="center" style={{ marginRight: 8 }}>לחץ</Typography>
                      </Grid2>
                      <Typography variant="h4" textAlign="center" style={{ direction: 'ltr', marginTop: 12 }} >{weatherDataCurHour.pressure} <span style={{ fontSize: '0.7em' }}>mb</span></Typography>
                    </CardContent>
                  </Card>
                </Grid2>

                <Grid2 item size={{ xs: 6, md: 4 }} textAlign="center" display="flex">
                  <Card
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      borderRadius: 3,
                      padding: 2,
                      boxShadow: 3,
                      color: " #213547",
                      flexGrow: 1,
                    }}
                  >
                    <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                      <Grid2 container justifyContent="center" alignItems="center">
                        <img src={DewPoint} alt="נקודת הטל" style={{ width: 25, height: 25 }} />
                        <Typography variant="subtitle1" fontWeight="bold" textAlign="center" style={{ marginRight: 8 }}>נקודת הטל</Typography>
                      </Grid2>
                      <Typography variant="h4" textAlign="center" style={{ direction: 'ltr', marginTop: 12 }} >{weatherDataCurHour.dewPoint}°</Typography>
                    </CardContent>
                  </Card>
                </Grid2>

                <Grid2 item size={{ xs: 6, md: 4 }} textAlign="center" display="flex">
                  <Card
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      borderRadius: 3,
                      padding: 2,
                      boxShadow: 3,
                      color: " #213547",
                      flexGrow: 1,
                    }}
                  >
                    <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                      <Grid2 container justifyContent="center" alignItems="center">
                        <img src={UvIndexIcon} alt="אינדקס UV" style={{ width: 25, height: 25 }} />
                        <Typography variant="subtitle1" fontWeight="bold" textAlign="center" style={{ marginRight: 8 }}>אינדקס UV</Typography>
                      </Grid2>
                      <Typography variant="h4" textAlign="center" style={{ marginTop: 12 }}>
                        {(() => {
                          const uvIndex = weatherDataCurHour.uvIndex;
                          if (uvIndex <= 2) return "נמוך";
                          else if (uvIndex <= 5) return "בינוני";
                          else if (uvIndex <= 7) return "גבוה";
                          else if (uvIndex <= 10) return "גבוה מאוד";
                          return "קיצוני";
                        })()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid2>
              </>
            }

            {(!sunTimes || sunTimes.length === 0)
              ?
              ""
              :
              <Grid2 item size={{ xs: 12 }} textAlign="center">
                <Card
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    borderRadius: 3,
                    padding: 2,
                    boxShadow: 3,
                    marginTop: 2,
                    color: " #213547",
                  }}
                >
                  <CardContent>
                    <Box sx={{ width: { xs: '95%', md: '67%' }, margin: '0 auto', height: { xs: 100, sm: 'auto' } }}>
                      <Line
                        data={chartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            x: { display: false, reverse: true },
                            y: { display: false },
                          },
                          plugins: {
                            legend: { display: false },
                            tooltip: { enabled: false },
                          },
                        }}
                      />
                    </Box>

                    <Box display="flex" justifyContent="space-between" mt={2} sx={{ width: { xs: '100%', md: '70%' }, margin: '0 auto', }}>
                      <Box textAlign="center">
                        <img src={SunriseIcon} alt="זריחה" style={{ width: 30, height: 30 }} />
                        <Typography variant="h6" fontWeight="bold">זריחה</Typography>
                        <Typography variant="h6" fontWeight="bold">{sunTimes?.sunrise}</Typography>
                      </Box>
                      <Box textAlign="center">
                        <img src={SunsetIcon} alt="שקיעה" style={{ width: 30, height: 30 }} />
                        <Typography variant="h6" fontWeight="bold">שקיעה</Typography>
                        <Typography variant="h6" fontWeight="bold">{sunTimes.sunset}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid2>
            }
          </Grid2>
        </CardContent>
      </Card>
    </div >
  )
}

export default CurrentWeatherDetails
