import React, { useState } from 'react';

import Sidebar from './Sidebar';
import WeatherManager from './Weather/WeatherManager';

import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const Dashboard = () => {
    const [open, setOpen] = useState(false);

    return (
        <div style={{ display: "flex" }}>

            <IconButton
                onClick={() => setOpen(!open)}
                sx={{
                    color: "rgba(33, 53, 71,0.8)",
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                    position: "absolute",
                    top: 10,
                    left: 10,
                    zIndex: 1000,
                    borderRadius: 2,
                    "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        color: " #213547",
                        fontWeight: "bold",
                    }
                }}
            >
                <MenuIcon />
            </IconButton>

            <Sidebar open={open} toggleSidebar={() => setOpen(false)} />

            <div
                style={{
                    flexGrow: 1,
                    transition: "margin 0.3s ease-in-out",
                }}
            >
                <WeatherManager />
            </div>
        </div>
    );
};

export default Dashboard;
