import React, { useEffect, useRef, useState } from 'react';

import { useLocation } from '../../contexts/LocationContext';

import { searchLocations, addUserLocation } from '../../services/locationsService';

import ErrorMessage from '../ErrorMessage';

import { Box, Typography, TextField, InputAdornment, IconButton, CircularProgress } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from '@mui/icons-material/Clear';

const LocationSearch = ({ toggleListVisibility }) => {
  const { updateLocation } = useLocation();

  const [query, setQuery] = useState("");
  const queryRef = useRef(query);

  const [suggestions, setSuggestions] = useState([]);

  const [loading, setLoading] = useState(false);

  const [errorType, setErrorType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [timer, setTimer] = useState(null);

  const handleSearch = async (search) => {
    if (search.trim()) {
      setLoading(true);

      const response = await searchLocations(search);
      console.log(response.message);

      if (response.status === 'error') {
        setErrorType('search');
        setErrorMessage("לא הצלחנו למצוא את המיקום שחיפשתם, נסו לנסח אחרת או לבדוק את החיבור לרשת.");
      }
      else {
        setErrorType('');
        setErrorMessage('');
        setLoading(false);
      }

      setSuggestions(response.data);
      if (toggleListVisibility)
        toggleListVisibility(false);
    } else {
      handleClear();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch(queryRef.current);
    }
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    queryRef.current = e.target.value;

    if (timer) {
      clearTimeout(timer);
    }
    const newTimer = setTimeout(() => {
      handleSearch(queryRef.current);
    }, 500);

    setTimer(newTimer);
  };

  useEffect(() => {
    if (query.trim()) {
      handleSearch(queryRef.current);
    } else
      handleClear();
  }, [query]);


  const handleClear = () => {
    setQuery("");
    queryRef.current = "";
    setSuggestions([]);

    setErrorType('');
    setErrorMessage('');

    if (toggleListVisibility)
      toggleListVisibility(true);
  };

  const handleLocationSelect = async (location) => {
    const response = await addUserLocation(location);
    console.log(response.message);

    if (response.status === 'error') {
      setErrorType('select');
      setErrorMessage("לא הצלחנו להוסיף את המיקום שבחרתם, בדקו את החיבור לאינטרנט ונסו שוב.");

      if (toggleListVisibility)
        toggleListVisibility(true);

      setTimeout(() => {
        setErrorType('');
        setErrorMessage('');
      }, 8000);
    }
    else {
      const currentLocation = response.data.find(l => (l.lat === parseFloat(location.lat) && l.lon === parseFloat(location.lon)));
      updateLocation(currentLocation);

      setErrorType('');
      setErrorMessage('');

      setQuery("");
      setSuggestions([]);
      if (toggleListVisibility)
        toggleListVisibility(true);
    }
  }

  return (
    <>
      <Box sx={{
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        padding: 3,
        borderRadius: 8,
        marginY: 1,
        color: " #213547"
      }}>
        <div style={{ display: "flex", alignItems: "center", position: "relative", }}>

          <TextField
            value={query}
            onChange={handleQueryChange}
            onKeyDown={handleKeyDown}
            label="חיפוש מיקום"
            variant="outlined"
            fullWidth
            size="small"

            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(0,0,0,0.2) !important",
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "rgba(0,0,0,0.6)",
              },
            }}
            slotProps={{
              input: {
                endAdornment: (
                  query && (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClear}
                        sx={{
                          padding: 0,
                          marginRight: 5,
                        }}>
                        <ClearIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </InputAdornment>
                  )
                ),
              }
            }}
          />

          <IconButton
            onClick={() => handleSearch(queryRef.current)}
            sx={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <SearchIcon />
          </IconButton>
        </div>
      </Box>

      {errorType === 'select' && errorMessage && errorMessage !== "" && (
        <ErrorMessage message={errorMessage} />
      )}


      {(suggestions && suggestions.length > 0)
        ?
        <Box
          sx={{
            top: "100%",
            left: 0,
            width: "100%",
            overflowY: "auto",
            zIndex: 10,
            color: " #213547"
          }}
        >
          {suggestions.slice(0, 7).map((suggestion, index) => (
            <Box
              key={index}
              onClick={() => handleLocationSelect(suggestion)}

              sx={{
                padding: "10px 20px",
                justifyContent: "flex-start",
                borderBottom: "1px solid #ddd",
                borderRadius: "30px",
                marginBottom: "4px",
                cursor: "pointer",
                backgroundColor: "rgba(255, 255, 255, 0.5)",

                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                },

                direction: suggestion.name && /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u0800-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(suggestion.name)
                  ? "ltr" : "rtl",
              }}
            >
              <div style={{ fontWeight: "bold" }}>{suggestion.name}</div>
              <div>{suggestion.state && `${suggestion.state},`} {suggestion.country}</div>
            </Box>
          ))}
        </Box>
        : errorType === 'search' && errorMessage && errorMessage !== "" ? (
          <ErrorMessage message={errorMessage} />
        ) : loading && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', marginY: 3 }}>
            <CircularProgress sx={{ color: " #213547" }} />
            <Typography fontWeight="bold" sx={{ marginTop: 3 }}>מחפשים מיקומים... </Typography>
          </Box>
        )}
    </>
  )
}

export default LocationSearch
