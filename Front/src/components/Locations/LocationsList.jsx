import React, { useEffect, useState } from 'react';

import { useLocation } from '../../contexts/LocationContext';

import { removeUserLocation } from '../../services/locationsService';

import ErrorMessage from '../ErrorMessage';

import { Box, Typography, IconButton } from "@mui/material";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const LocationsList = () => {
  const { updateLocation, getSavedLocations } = useLocation();

  const [savedLocations, setSavedLocations] = useState([]);

  const [errorType, setErrorsType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchLocations = async () => {
      const response = await getSavedLocations();
      setSavedLocations(response.data || []);

      if (response.status === 'error') {
        setErrorsType('fetch');
        console.error(response.message);
        setErrorMessage("לא הצלחנו להציג את המיקומים שלכם, בדקו את החיבור לרשת ונסו שוב.");
      } else {
        setErrorsType('');
        setErrorMessage('');
      }
    };

    fetchLocations();
  }, []);


  const handleDeleteLocation = async (e, locationId) => {
    e.stopPropagation();

    const response = await removeUserLocation(locationId);
    console.log(response.message);

    if (response.status === 'error') {
      setErrorsType('remove');
      setErrorMessage("לא הצלחנו להסיר את המיקום שבחרתם, בדקו את החיבור לאינטרנט ונסו שוב.");
    } else {
      setErrorsType('');
      setErrorMessage('');

      setSavedLocations(response.data);
      if (response.data.length > 0) {
        if (!location.name && !location.lat && !location.lon)
          updateLocation(response.data[0]);
      } else {
        updateLocation(null);
      }
    }
  };

  return (
    <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: " #213547"
    }}>
      {errorType === 'remove' && errorMessage && errorMessage !== "" && (
        <ErrorMessage message={errorMessage} />
      )}

      {(savedLocations && savedLocations.length > 0)
        ?
        <Box
          sx={{
            top: "100%",
            left: 0,
            width: "100%",
            overflowY: "auto",
            zIndex: 10,
            marginTop: 2
          }}
        >
          {savedLocations.map((curLocation) => (
            <Box
              key={curLocation._id}
              onClick={() => {
                if (
                  location?.lat !== curLocation.lat ||
                  location?.lon !== curLocation.lon
                ) {
                  updateLocation(curLocation);
                }
              }}

              sx={{
                padding: "10px 20px",
                borderBottom: "1px solid #ddd",
                borderRadius: "30px",
                marginBottom: "4px",
                cursor: "pointer",
                backgroundColor: "rgba(255, 255, 255, 0.5)",

                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                },

                display: 'flex',
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                direction: curLocation.name && /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u0800-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(curLocation.name)
                  ? "rtl" : "ltr",
                marginRight: curLocation.name && /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u0800-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(curLocation.name)
                  ? "" : "auto"
              }}>
                <div style={{ fontWeight: "bold" }}>{curLocation.name}</div>
                <div>{curLocation.state && `${curLocation.state},`} {curLocation.country}</div>
              </div>
              <IconButton onClick={(e) => handleDeleteLocation(e, curLocation._id)} sx={{ ml: 2 }}>
                <RemoveCircleOutlineIcon
                  sx={{
                    color: 'gray',
                    '&:hover': {
                      color: 'error.main',
                    },
                  }}
                />
              </IconButton>
            </Box>
          ))}
        </Box>
        : errorType === 'fetch' && errorMessage && errorMessage !== "" ? (
          <ErrorMessage message={errorMessage} />
        ) : (
          <Box sx={{
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            padding: 3,
            borderRadius: 8,
            marginY: 1,
            color: " #213547"
          }}>
            <Typography variant="h6" align="center" fontWeight="bold">
              חפשו מיקום כדי להתחיל :)
            </Typography>
          </Box>
        )}
    </div>
  )
}

export default LocationsList
