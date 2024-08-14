import { Box, Breadcrumbs, Button, Stack, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

export default function Header({
  pageTitle,
  handleCancle,
  handleSave,
  buttonName,
  loading,
  currentRoute,
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
      to="/shopping/brand"
      //   onClick={handleClick}
      style={{
        color: "#1C2630",
        fontWeight: 500,
        fontSize: "12px",
      }}
    >
      Shopping
    </Link>,
    <Link
      underline="hover"
      key="2"
      color="inherit"
      to="/shopping/brand"
      //   onClick={handleClick}
      style={{
        color: "#1C2630",
        fontWeight: 500,
        fontSize: "12px",
      }}
    >
      Brand
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
        <Box sx={{ display: "flex" }}>
          <Box>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "white",
                color: "#1C2630",
                border: "1px solid #E5E5E8",
                minWidth: "126px",
                borderRadius: "4px",
                boxShadow: "none",
                whiteSpace: "nowrap",
                fontWeight: 600,
                marginTop: "20px",
                "&:hover": {
                  outline: "none",
                  color: "#1C2630",
                  backgroundColor: "white",
                },
              }}
              onClick={handleCancle}
            >
              Cancel
            </Button>
          </Box>
          <Box>
            <Button
              variant="contained"
              disabled={loading}
              onClick={handleSave}
              sx={{
                backgroundColor: "#5E17EB",
                color: "#fff",
                marginLeft: "20px",
                minWidth: "126px",
                border: "1px solid #E5E5E8",
                borderRadius: "4px",
                boxShadow: "none",
                whiteSpace: "nowrap",
                fontWeight: 600,
                marginTop: "20px",
                "&:hover": {
                  outline: "none",
                  color: "#fff",
                  backgroundColor: "#5E17EB",
                },
              }}
            >
              {buttonName}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
