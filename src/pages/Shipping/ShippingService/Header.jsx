import { Box, Breadcrumbs, Button, Stack, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

export default function Header({
  pageTitle,
  handleCancle,
  handleSave,
  currentRoute,
  buttonName,
  loading,
}) {
  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      to="/"
      //   onClick={handleClick}
      style={{
        color: "#1C2630",
        fontWeight: 500,
        fontSize: "12px",
      }}
    >
      Home
    </Link>,
    <Link
      underline="hover"
      key="2"
      color="inherit"
      to="/shipping/shipping-service"
      //   onClick={handleClick}
      style={{
        color: "#1C2630",
        fontWeight: 500,
        fontSize: "12px",
      }}
    >
      Shipping Service
    </Link>,
    <Link
      underline="hover"
      key="2"
      color="inherit"
      to="/shipping/shipping-service"
      //   onClick={handleClick}
      style={{
        color: "#1C2630",
        fontWeight: 500,
        fontSize: "12px",
      }}
    >
      Shipping Service
    </Link>,
    <Typography
      key="3"
      color="text.primary"
      sx={{ color: "#959BA1", fontWeight: 500, fontSize: "12px" }}
    >
      {currentRoute}
    </Typography>,
  ];

  return (
    <Box sx={{ height: "80px" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Box>
            <label
              style={{
                textAlign: "left",
                fontSize: " 26px",
                fontWeight: "bold",
              }}
            >
              {pageTitle}
            </label>
          </Box>
          <Box>
            <Stack spacing={2}>
              <Breadcrumbs separator="›" aria-label="breadcrumb">
                {breadcrumbs}
              </Breadcrumbs>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
