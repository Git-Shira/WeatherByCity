import React from 'react';

import LocationsManager from './Locations/LocationsManager';

import { Drawer, Box, IconButton } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const Sidebar = ({ open, toggleSidebar }) => {
    return (
        <Drawer
            variant="temporary"
            anchor="left"
            open={open}
            onClose={toggleSidebar}
            sx={{
                "& .MuiDrawer-paper": {
                    width: {
                        xs: "80%",
                        sm: "50%",
                        md: "40%",
                        lg: "30%",
                    },
                },
                "& .MuiBackdrop-root": {
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                },
            }}
        >
            <Box
                sx={{
                    backgroundImage: "url('/background.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <IconButton
                    onClick={toggleSidebar}
                    sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        zIndex: 1000,
                        padding: 1,
                        backgroundColor: "rgba(255, 255, 255, 0.5)",
                        borderRadius: 2,
                        color: "rgba(33, 53, 71,0.8)",
                        "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            color: " #213547",
                            fontWeight: "bold",
                        }
                    }}
                >
                    <ChevronRightIcon />
                </IconButton>

                <div style={{ minHeight: '100vh' }}>
                    <Box sx={{ height: "35px", marginBottom: 2 }} />

                    <LocationsManager />
                </div>
            </Box>
        </Drawer>
    )
}

export default Sidebar
