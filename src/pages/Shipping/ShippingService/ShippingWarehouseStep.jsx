import {
  Box,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import React, { useState } from "react";
import SimpleBar from "simplebar-react";
import selected from "../../../assets/svg/selected.svg";
import arrow_check from "../../../assets/svg/arrow_check.svg";

const LocationCard = ({ location, isSelected, onSelect }) => {
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
        <Typography sx={{ fontWeight: 700, fontSize: "16px" }}>
          {location.name}
        </Typography>
        <Typography>{location.address}</Typography>
        <Typography>{location.city}</Typography>
        <Typography>{location.country}</Typography>
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

export default function ShippingWarehouseStep() {
  const [selectedLocationId, setSelectedLocationId] = useState(null);

  const handleSelect = (id) => {
    setSelectedLocationId(id);
  };

  const locations = [
    {
      id: 1,
      name: "Kolkata Place",
      address: "6500 Sharman Way",
      city: "Kolkata, West Bengal",
      country: "India",
    },
    // Add more locations as needed
    {
      id: 2,
      name: "Kolkata Place",
      address: "6500 Sharman Way",
      city: "Kolkata, West Bengal",
      country: "India",
    },
    {
      id: 3,
      name: "Kolkata Place",
      address: "6500 Sharman Way",
      city: "Kolkata, West Bengal",
      country: "India",
    },
    {
      id: 4,
      name: "Kolkata Place",
      address: "6500 Sharman Way",
      city: "Kolkata, West Bengal",
      country: "India",
    },
    {
      id: 5,
      name: "Kolkata Place",
      address: "6500 Sharman Way",
      city: "Kolkata, West Bengal",
      country: "India",
    },
    {
      id: 6,
      name: "Kolkata Place",
      address: "6500 Sharman Way",
      city: "Kolkata, West Bengal",
      country: "India",
    },
  ];

  return (
    <SimpleBar
      forceVisible="x"
      autoHide={true}
      style={{
        overflowX: "auto",
        maxHeight: "calc(100vh - 356px)",
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
        <Stack direction={"row"} sx={{ marginTop: "20px" }} gap={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ marginBottom: "10px" }}>
              <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                Select Shipping (From)
              </Typography>
            </Box>
            <FormControl
              fullWidth
              sx={{
                mt: 1,
                minWidth: "20vw",
                minHeight: "35px",
                marginLeft: "0px",
              }}
              size="small"
            >
              <OutlinedInput
                type="text"
                id="city"
                placeholder="City"
                name="city"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ marginBottom: "10px" }}>
              <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                Select Arrival (To)
              </Typography>
            </Box>
            <FormControl
              fullWidth
              sx={{
                mt: 1,
                minWidth: "20vw",
                minHeight: "35px",
                marginLeft: "0px",
              }}
              size="small"
            >
              <OutlinedInput
                type="text"
                id="city"
                placeholder="City"
                name="city"
              />
            </FormControl>
          </Grid>
        </Stack>
        <Stack sx={{ marginTop: 2 }}>
          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">
              What kind of partner are you adding?
            </FormLabel>
            <RadioGroup row>
              <FormControlLabel
                value="crowdshipping"
                control={<Radio />}
                label="This is a Crowdshipping Service"
              />
              <FormControlLabel
                value="traveler"
                control={<Radio />}
                label="This is a Traveler Service"
              />
            </RadioGroup>
          </FormControl>
        </Stack>
        <Stack sx={{ marginTop: 2 }}>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                Transit Day
              </Typography>
            </Box>
            <FormControl fullWidth margin="normal">
              <Select defaultValue="" displayEmpty fullWidth>
                <MenuItem value="" disabled>
                  Transit Day
                </MenuItem>
                <MenuItem value={"10 Day"}>10 Day</MenuItem>
                <MenuItem value={"20 Day"}>20 Day</MenuItem>
                <MenuItem value={"30 Day"}>30 Day</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Stack>
        <Stack sx={{ marginTop: 2 }}>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                Transit Day
              </Typography>
            </Box>
            <FormControl fullWidth margin="normal">
              <Select defaultValue="" displayEmpty fullWidth>
                <MenuItem value="" disabled>
                  Select Route Partner
                </MenuItem>
                <MenuItem value={1}>Partner 1</MenuItem>
                <MenuItem value={2}>Partner 2</MenuItem>
                <MenuItem value={3}>Partner 3</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Stack>
        <Box sx={{ marginTop: 2 }}>
          <Stack direction="row" sx={{ marginBottom: 2 }}>
            <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
              Select Shipping Warehouse
            </Typography>
          </Stack>
          <Grid container spacing={2}>
            {locations.map((location) => (
              <Grid item xs={12} sm={12} md={4} key={location.id}>
                <LocationCard
                  location={location}
                  isSelected={location.id === selectedLocationId}
                  onSelect={handleSelect}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </SimpleBar>
  );
}
