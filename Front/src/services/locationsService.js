import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const searchLocations = async (query) => {
    if (!query) {
        console.warn("Missing query parameter. Please provide a search term.");
        return { data: [], status: "error", message: "Missing query parameter. Please provide a search term." };
    }

    try {
        const response = await axios.get(`${API_BASE_URL}/api/locations/search`, {
            params: { query },
            withCredentials: true
        });

        return response.status === 200
            ? { data: response.data.data, status: "success", message: "Cities fetched successfully." }
            : { data: [], status: "error", message: "No cities matching your search were found." };

    } catch (error) {
        console.error("Error fetching cities:", error);

        if (error.response) {
            if (error.response.status === 400) {
                console.warn("Missing query parameter. Please provide a search term.");
                return { data: [], status: "error", message: "Missing query parameter. Please provide a search term." };
            }
            if (error.response.status === 404) {
                console.warn("No cities matching your search were found.");
                return { data: [], status: "error", message: "No cities matching your search were found." };
            }
        }

        console.error("Unexpected error:", error.message);
        return { data: [], status: "error", message: "Error fetching cities. Please try again later." };
    }
};

export const addUserLocation = async (location) => {
    if (!location || !location.name || !location.lat || !location.lon) {
        console.warn("One or more required fields are missing in the location data: 'name', 'lat', and/or 'lon'. Please ensure all required fields are provided.");
        return { data: [], status: "error", message: "One or more required fields are missing in the location data: 'name', 'lat', and/or 'lon'. Please ensure all required fields are provided." };
    }

    try {
        const response = await axios.post(
            `${API_BASE_URL}/api/locations/`,
            { location: location },
            { withCredentials: true }
        );

        return response.status === 200
            ? { data: response.data.locations, status: "success", message: "Location added successfully." }
            : { data: [], status: "error", message: "Error adding location." };

    } catch (error) {
        console.error("Error adding location:", error);

        if (error.response) {
            if (error.response.status === 400) {
                console.warn("One or more required fields are missing in the location data: 'name', 'lat', and/or 'lon'. Please ensure all required fields are provided.");
                return { data: [], status: "error", message: "One or more required fields are missing in the location data: 'name', 'lat', and/or 'lon'. Please ensure all required fields are provided." };
            }
            if (error.response.status === 404) {
                console.warn("User not found.");
                return { data: [], status: "error", message: "User not found." };
            }
            if (error.response.status === 409) {
                console.warn("Location already exists.");
                return { data: [], status: "error", message: "Location already exists." };
            }
        }

        console.error("Unexpected error:", error.message);
        return { data: [], status: "error", message: "Error adding location. Please try again later." };
    }
}

export const removeUserLocation = async (locationId) => {
    if (!locationId) {
        console.warn("Missing required fields. Please provide a valid location ID.");
        return { data: [], status: "error", message: "Missing required fields. Please provide a valid location ID." };
    }

    try {
        const response = await axios.delete(
            `${API_BASE_URL}/api/locations/${locationId}`,
            { withCredentials: true }
        );

        return response.status === 200
            ? { data: response.data.locations, status: "success", message: "Location removed successfully." }
            : { data: [], status: "error", message: "Error removing location." };

    } catch (error) {
        console.error("Error removing location:", error);

        if (error.response) {
            if (error.response.status === 400) {
                console.warn("Missing required fields. Please provide a valid location ID.");
                return { data: [], status: "error", message: "Missing required fields. Please provide a valid location ID." };
            }
            if (error.response.status === 404) {
                console.warn("User not found or location does not exist.");
                return { data: [], status: "error", message: "User not found or location does not exist." };
            }
        }

        console.error("Unexpected error:", error.message);
        return { data: [], status: "error", message: "Error removing location. Please try again later." };
    }
}