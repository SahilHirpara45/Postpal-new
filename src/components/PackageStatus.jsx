import React from "react";
import {
  Box,
  LinearProgress,
  Step,
  StepConnector,
  StepIcon,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import current from "../assets/svg/currect.svg";

function PackageStatus({ steps = [], activeStep = 1 }) {
  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps?.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                StepIconProps={{
                  sx: {
                    "&.MuiStepIcon-root": {
                      color: "#FFF",
                      border: "1px solid",
                      borderRadius: "100%",
                      borderColor: "#959BA1",
                    },
                    "& .MuiStepIcon-text": {
                      fill: "#959BA1",
                      fontWeight: "bold",
                    },
                    "&.Mui-completed": {
                      color: "#38A34F",
                      borderColor: "#38A34F",
                    },
                    "&.Mui-active": {
                      color: "white",
                      border: "1px solid",
                      borderRadius: "100%",
                      borderColor: "#F68712",
                      "& .MuiStepIcon-text": {
                        fill: "#F68712",
                        color: "#FFF",
                        fontWeight: "bold",
                      },
                    },
                  },
                }}
              >
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "black",
                  }}
                >
                  {step.label}
                </span>
                <br />
                <span style={{ color: "#959BA1", fontSize: "16px" }}>
                  {step.date}
                </span>
              </StepLabel>
              {index > 0 && (
                <StepConnector
                  sx={{
                    "& .MuiStepConnector-line": {
                      borderWidth: "1px",
                      borderColor: index < activeStep ? "#38A34F" : "#EDEDED", // Change color here
                    },
                  }}
                />
              )}
            </Step>
          ))}
        </Stepper>
      </Box>
    </>
  );
}

export default PackageStatus;
