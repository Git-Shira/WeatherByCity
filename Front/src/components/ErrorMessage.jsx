import React from 'react';

import { Box, Typography } from "@mui/material";

const ErrorMessage = ({ message }) => {
    return (
        <div>
            <Box
                sx={{
                    backgroundColor: "rgba(255, 205, 210, 0.8)", 
                    color: " #C62828",
                    padding: "10px 20px",
                    borderRadius: "30px",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "fit-content",
                    maxWidth: "90%",
                    marginX: "auto",
                    marginY: 1,
                }}
            >
                <Typography variant="body1" fontWeight="bold">
                    {message}
                </Typography>
            </Box>
        </div>
    )
}

export default ErrorMessage
