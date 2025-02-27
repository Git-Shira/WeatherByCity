const express = require('express');
const router = express.Router();
const axios = require('axios');

const User = require('../models/User');

router.get('/search', async (req, res) => {
    const query = req.query.query;
    if (!query)
        res.status(400).send({ message: 'Missing query parameter. Please provide a search term.' });

    const API_KEY = process.env.API_KEY;
    try {
        const response = await axios.get(`https://api.locationiq.com/v1/autocomplete?key=${API_KEY}&q=${query}&limit=20&dedupe=1&accept-language=he`);

        const data = response.data
            .filter(item => item.type && ['city', 'town', 'village', 'suburb', 'hamlet'].includes(item.type))
            .filter(item => item.display_place || item.address.name)
            .map(item => ({
                name: item.address.name || item.display_place,
                state: item.address.state || "",
                country: item.address.country || "",
                lat: item.lat,
                lon: item.lon,
            }));

        const userUUID = req.userUUID;

        if (!data || data.length === 0)
            res.status(404).send({ message: 'No cities matching your search were found.' });

        else
            res.status(200).send({ message: "Cities fetched successfully", data: data });

    } catch (error) {
        res.status(500).json({ message: 'Error fetching cities.', error: error.message });
    }
});

router.get('/', async (req, res) => {
    const userUUID = req.userUUID;
    if (!userUUID)
        return res.status(400).send({ message: 'Missing query parameter. Please provide user UUID.' });

    try {
        const user = await User.findOne({ uuid: userUUID });
        if (!user)
            return res.status(404).send({ message: 'User not found.' });

        if (!user.locations || user.locations.length === 0)
            return res.status(204).send({ message: 'No locations data found for the provided user.' });

        const sortedLocations = user.locations.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });

        res.status(200).send({ message: "Locations data fetched successfully", locations: sortedLocations });

    } catch (error) {
        res.status(500).json({ message: 'Error fetching locations data.', error: error.message });
    }
});

router.post("/", async (req, res) => {
    const userUUID = req.userUUID;
    if (!userUUID)
        return res.status(400).send({ message: 'Missing query parameter. Please provide user UUID.' });

    const locationData = req.body.location;

    if (!locationData || !locationData.name || !locationData.lat || !locationData.lon) {
        return res.status(400).send({ message: "Missing required fields. Please provide a valid location ID." });
    }

    try {
        const user = await User.findOne({ uuid: userUUID });
        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }

        const existingLocation = user.locations.find(
            (loc) => loc.lat === parseFloat(locationData.lat) && loc.lon === parseFloat(locationData.lon)
        );

        if (existingLocation) {
            return res.status(409).send({ message: 'Location already exists.' });
        }

        user.locations.push(locationData);

        user.locations.sort((a, b) => a.name.localeCompare(b.name));

        await user.save();

        res.status(200).send({
            message: "Location added successfully.",
            locations: user.locations,
        });

    } catch (error) {
        res.status(500).json({ message: "Error adding location.", error: error.message });
    }
});

router.delete("/:locationId", async (req, res) => {
    const userUUID = req.userUUID;
    if (!userUUID)
        return res.status(400).send({ message: 'Missing query parameter. Please provide user UUID.' });

    const { locationId } = req.params;
    if (!locationId) {
        return res.status(400).send({ message: "Missing required location ID." });
    }

    try {
        const updatedUser = await User.findOneAndUpdate(
            { uuid: userUUID },
            { $pull: { locations: { _id: locationId } } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).send({ message: "User not found or location does not exist." });
        }

        const sortedLocations = updatedUser.locations.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });

        res.status(200).send({
            message: "Location removed successfully",
            locations: sortedLocations,
        });

    } catch (error) {
        res.status(500).json({ message: "Error removing location.", error: error.message });
    }
});

module.exports = router;
