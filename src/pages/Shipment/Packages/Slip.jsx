import React, { forwardRef, useRef } from "react";
import Barcode from "react-barcode";
import { Box, Typography, Button } from "@mui/material";
import html2canvas from "html2canvas";

const Slip = forwardRef(
  ({ name, date, suiteNumber, packageId, barcodeValue }, ref) => {
    return (
      <Box
        ref={ref}
        sx={{
          width: "80mm", // Set exact width
          height: "50mm", // Set exact height
          padding: "0", // Remove padding to fill the space
          textAlign: "center",
          border: "none", // Remove border for print
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#fff", // White background
          "@media print": {
            margin: 0, // Remove margins for print
            border: "none", // No border for print
            width: "100%", // Fill the print area
            height: "100%",
            overflow: "hidden",
          },
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{
            margin: 0,
            fontWeight: 700,
            marginBottom: "2mm",
            fontSize: "4mm", // Adjust font size
          }}
        >
          {name?.replace(/\s+/g, "-")}-{barcodeValue}
        </Typography>
        <Typography
          sx={{
            fontSize: "2.5mm",
            padding: 0,
            margin: 0,
            fontWeight: 700,
          }}
        >
          Received date: {date}
        </Typography>
        <Typography
          sx={{
            fontSize: "2.5mm",
            padding: 0,
            margin: 0,
            fontWeight: 700,
          }}
        >
          Suite number: {suiteNumber}
        </Typography>
        <Typography
          sx={{
            fontSize: "2.5mm",
            padding: 0,
            margin: 0,
            fontWeight: 700,
          }}
        >
          Package ID: {packageId}
        </Typography>
        <Box sx={{ marginTop: "2mm" }}>
          <Barcode
            value={barcodeValue}
            width={1} // Adjust barcode width
            height={40} // Adjust barcode height
            fontSize={8} // Adjust barcode text size
          />
        </Box>
      </Box>
    );
  }
);

export default Slip;
