import React, { createContext, useState, useContext, useEffect } from 'react';

import axios from 'axios';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const [location, setLocation] = useState(
        null,
    );

    const updateLocation = (newLocation) => {
        setLocation(newLocation);
    };

    const getSavedLocations = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/locations/`,
                { withCredentials: true }
            );

            if (response.status === 200) {
                if (!location)
                    updateLocation(response.data.locations[0]);
                return { data: response.data.locations, status: "success", message: "Locations data fetched successfully." };
            } else if (response.status === 204) {
                return { data: [], status: "success", message: "No locations data found for the provided user." };
            } else
                return { data: [], status: "error", message: "Error fetching locations data." };

        } catch (error) {
            console.error("Error fetching locations data:", error);

            if (error.response) {
                if (error.response.status === 404) {
                    console.warn("User not found.");
                    return { data: [], status: "error", message: "User not found." };
                }
            }

            console.error("Unexpected error:", error.message);
            return { data: [], status: "error", message: "Error fetching locations data. Please try again later." };
        }
    };

    useEffect(() => {
        getSavedLocations();
    }, []);

    return (
        <LocationContext.Provider value={{ location, updateLocation, getSavedLocations }}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => useContext(LocationContext);
