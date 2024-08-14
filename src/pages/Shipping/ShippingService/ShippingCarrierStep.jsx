import { Box, Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import React, { useState } from "react";
import SimpleBar from "simplebar-react";
import logo from "../../../assets/svg/fedex.svg";
import logo2 from "../../../assets/svg/ups.svg";
import selected from "../../../assets/svg/selected.svg";
import arrow_check from "../../../assets/svg/arrow_check.svg";

const CarrierCard = ({ location, isSelected, onSelect }) => {
  return (
    <Card
      onClick={() => onSelect(location.id)}
      sx={{
        border: isSelected ? "2px solid green" : "1px solid #e0e0e0",
        borderRadius: "4px",
        cursor: "pointer",
        position: "relative",
        "&:hover": {
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <CardContent>
        <img src={location.img} alt={location.name} />
        <Typography sx={{ fontWeight: 700, fontSize: "16px" }}>
          {location.name}
        </Typography>
      </CardContent>
      {isSelected && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: -2,
            color: "green",
          }}
        >
          <img src={selected} alt="select" />
          <img
            src={arrow_check}
            alt="select"
            style={{
              position: "absolute",
              top: 5,
              right: 5,
            }}
          />
          {/* <CheckCircleIcon
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
          }}
        /> */}
        </Box>
      )}
    </Card>
  );
};

export default function ShippingCarrierStep() {
  const [selectedCarrierId, setSelectedCarrierId] = useState(null);

  const handleSelectCarrier = (id) => {
    setSelectedCarrierId(id);
  };

  const carrier = [
    {
      id: 1,
      name: "FedEx",
      img: logo,
    },
    {
      id: 2,
      name: "UPS",
      img: logo2,
    },
    {
      id: 3,
      name: "MailCarib",
      img: logo,
    },
    {
      id: 4,
      name: "MailCarib",
      img: logo2,
    },
    {
      id: 5,
      name: "FedEx",
      img: logo,
    },
    {
      id: 6,
      name: "UPS",
      img: logo2,
    },
    {
      id: 7,
      name: "UPS",
      img: logo2,
    },
  ];
  return (
    <SimpleBar
      forceVisible="x"
      autoHide={true}
      style={{
        overflowX: "auto",
        maxHeight: "calc(100vh - 356px)",
        minHeight: "calc(100vh - 356)",
      }}
      className="custom-scrollbar"
    >
      <Box
        sx={{
          width: "50%",
          margin: "0 auto",
          padding: "20px",
          backgroundColor: "white",
        }}
      >
        <Box sx={{ marginTop: 2 }}>
          <Grid container spacing={2}>
            {carrier.map((location) => (
              <Grid item xs={12} sm={12} md={4} key={location.id}>
                <CarrierCard
                  location={location}
                  isSelected={location.id === selectedCarrierId}
                  onSelect={handleSelectCarrier}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </SimpleBar>
  );
}
