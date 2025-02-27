import React from 'react';

import { Box, Typography } from "@mui/material";

const Loading = () => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                textAlign: "center",
                gap: 1.5,
                color: " #213547"
            }}
        >
            <video
                src={'background.mp4'}
                type="video/mp4"
                autoPlay
                loop
                muted
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    zIndex: -1,
                }}
            />
            <Box
                sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                    padding: 3,
                    borderRadius: 2,
                    zIndex: 1,
                }}
            >
                <Typography variant="h4" fontWeight="bold">
                    בודקים את מזג האוויר בשבילך...
                </Typography>
                <Typography variant="h4" >
                    עוד רגע והתחזית כאן!
                </Typography>
            </Box>
        </Box>
    );
};

export default Loading;
