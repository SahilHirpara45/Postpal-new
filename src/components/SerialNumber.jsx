import { Box } from "@mui/material";
import React from "react";

function SerialNumber({ SerialNumber, packageTotalAmount }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        margin: "20px",
        marginRight: "0px",
        backgroundColor: "#F9FAFC",
        border: "1px solid #E5E5E8",
        paddingY: "20px",
        paddingX: "40px",
        borderRadius: "4px",
      }}
    >
      <Box sx={{ display: "grid" }}>
        <label
          style={{
            color: "#959BA1",
            fontWeight: "500",
            fontSize: "14px",
          }}
        >
          Serial Number
        </label>
        <label
          style={{
            color: "#1C2630",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          {SerialNumber}
        </label>
      </Box>
      <Box sx={{ display: "grid" }}>
        <label
          style={{
            color: "#959BA1",
            fontWeight: "500",
            fontSize: "14px",
          }}
        >
          Value
        </label>
        <label
          style={{
            color: "#1C2630",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          ${packageTotalAmount?.toFixed(2)}
        </label>
      </Box>
    </Box>
  );
}

export default SerialNumber;
