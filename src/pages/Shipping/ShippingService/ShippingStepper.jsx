import React, { useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Select,
  Box,
  StepConnector,
  Grid,
  OutlinedInput,
  Stack,
} from "@mui/material";
import ShippingWarehouseStep from "./ShippingWarehouseStep";
import DeliveryPartnerStep from "./DeliveryPartnerStep";
import ShippingCarrierStep from "./ShippingCarrierStep";
import ShippingPriceStep from "./ShippingPriceStep";

const steps = [
  { label: "Shipping Warehouse" },
  { label: "Delivery Partner" },
  { label: "Carrier" },
  { label: "Set Shipping Price" },
];

function getStepContent(step) {
  switch (step) {
    case 0:
      return <ShippingWarehouseStep />;
    case 1:
      return <DeliveryPartnerStep />;
    case 2:
      return <ShippingCarrierStep />;
    case 3:
      return <ShippingPriceStep />;
    default:
      return "Unknown step";
  }
}

const ShippingStepper = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box
      sx={{
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "white",
      }}
    >
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        sx={{
          width: "50%", // Set the Stepper width to 50%
          margin: "0 auto", // Center the Stepper
          paddingBottom: 5,
        }}
      >
        {steps.map((step) => (
          <Step key={step.label}>
            <StepLabel>
              <span
                style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}
              >
                {step.label}
              </span>
            </StepLabel>
            {step.index > 0 && (
              <StepConnector
                sx={{
                  "& .MuiStepConnector-line": {
                    borderWidth: "1px",
                    borderColor: "#EDEDED",
                  },
                }}
              />
            )}
          </Step>
        ))}
      </Stepper>
      <Box>
        {activeStep === steps.length ? (
          <Box>
            <Typography>All steps completed</Typography>
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        ) : (
          <Box>
            {getStepContent(activeStep)}
            <Box
              sx={{
                position: "absolute",
                bottom: "3%",
                right: "5%",
              }}
            >
              <Button
                variant="contained"
                disabled={activeStep === 0}
                sx={{
                  backgroundColor: "#fff",
                  color: "black",
                  width: "155px",
                  border: "1px solid #E5E5E8",
                  borderRadius: "4px",
                  boxShadow: "none",
                  whiteSpace: "nowrap",
                  fontWeight: 600,
                  marginTop: "20px",
                  marginRight: "20px",
                  "&:hover": {
                    outline: "none",
                    color: "black",
                    backgroundColor: "#fff",
                  },
                }}
                onClick={handleBack}
              >
                Back
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#5E17EB",
                  width: "155px",
                  color: "#fff",
                  border: "1px solid #5E17EB",
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
                onClick={handleNext}
              >
                {activeStep === steps.length - 1 ? "Finish" : "Continue"}
              </Button>
              {/* <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ marginRight: 5 }}
              >
                Back
              </Button> */}
              {/* <Button variant="contained" color="primary" onClick={handleNext}>
                {activeStep === steps.length - 1 ? "Finish" : "Continue"}
              </Button> */}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ShippingStepper;
