import {
  Box,
  Button,
  Paper,
  Step,
  StepConnector,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import React from "react";
import point from "../../../assets/svg/point.svg";

export default function HistoryStatus() {
  const handleNext = () => {
    console.log("Next button clicked"); // Placeholder for next button functionality
  };

  const handleBack = () => {
    console.log("Back button clicked"); // Placeholder for back button functionality
  };

  const steps = [
    {
      label: (
        <StepLabel
          StepIconProps={{
            sx: {
              "&.Mui-active": {
                color: "white",
                border: "1px solid",
                borderRadius: "100%",
                borderColor: "#5E17EB",
                borderWidth: "7px",
              },
            },
          }}
        >
          <Box sx={{ marginLeft: "20px" }}>
            <span style={{ fontSize: "16px", lineHeight: "20px" }}>
              The Weight per item of{" "}
              <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                {" "}
                iphone x
              </span>{" "}
              was updated from{" "}
              <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                1lb
              </span>{" "}
              to{" "}
              <span style={{ fontSize: "16px", fontWeight: "bold" }}>2lb </span>
              <br />
              by{" "}
              <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                Raj{" "}
                <img
                  style={{
                    display: "inline",
                    marginLeft: "10px",
                    marginRight: "10px",
                  }}
                  src={point}
                  alt="dot_icon"
                />
              </span>
              <span style={{ fontSize: "16px" }}>Mon Dec 04 2023 18:59:39</span>
            </span>
          </Box>
        </StepLabel>
      ),
      hasButton: false,
    },
    {
      label: (
        <StepLabel
          StepIconProps={{
            sx: {
              "&.Mui-active": {
                color: "white",
                border: "1px solid",
                borderRadius: "100%",
                borderColor: "#5E17EB",
                borderWidth: "7px",
              },
            },
          }}
        >
          <Box sx={{ marginLeft: "20px" }}>
            <span style={{ fontSize: "16px", lineHeight: "20px" }}>
              You have a balance in the amount of{" "}
              <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                {" "}
                $1410.91
              </span>{" "}
              Please <br />
              by{" "}
              <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                Raj{" "}
                <img
                  style={{
                    display: "inline",
                    marginLeft: "10px",
                    marginRight: "10px",
                  }}
                  src={point}
                  alt="dot_icon"
                />
              </span>
              <span style={{ fontSize: "16px" }}>Mon Dec 04 2023 18:59:39</span>
            </span>
          </Box>
        </StepLabel>
      ),
      hasButton: true,
    },
    {
      label: (
        <StepLabel
          StepIconProps={{
            sx: {
              "&.Mui-active": {
                color: "white",
                border: "1px solid",
                borderRadius: "100%",
                borderColor: "#5E17EB",
                borderWidth: "7px",
              },
            },
          }}
        >
          <Box sx={{ marginLeft: "20px" }}>
            <span style={{ fontSize: "16px", lineHeight: "20px" }}>
              The Weight per item of{" "}
              <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                {" "}
                iphone x
              </span>{" "}
              was updated from{" "}
              <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                1lb
              </span>{" "}
              to{" "}
              <span style={{ fontSize: "16px", fontWeight: "bold" }}>2lb </span>
              <br />
              by{" "}
              <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                Raj{" "}
                <img
                  style={{
                    display: "inline",
                    marginLeft: "10px",
                    marginRight: "10px",
                  }}
                  src={point}
                  alt="dot_icon"
                />
              </span>
              <span style={{ fontSize: "16px" }}>Mon Dec 04 2023 18:59:39</span>
            </span>
          </Box>
        </StepLabel>
      ),
      hasButton: false,
    },
  ];

  return (
    <>
      <Box sx={{ maxWidth: 600 }}>
        <Stepper orientation="vertical">
          {steps.map((step, index) => (
            <Step key={index} active>
              {step.label}
              <StepContent>
                {step.hasButton && (
                  <Box sx={{ mb: 2, ml: "20px" }}>
                    <div>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{
                          mt: 1,
                          mr: 1,
                          borderRadius: "4px",
                          boxShadow: "none",
                          paddingX: "14px",
                          width: "140px",
                          height: "42px",
                          backgroundColor: "#5E17EB",
                        }}
                      >
                        Pay Now
                      </Button>
                    </div>
                  </Box>
                )}
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Box>
    </>
  );
}
