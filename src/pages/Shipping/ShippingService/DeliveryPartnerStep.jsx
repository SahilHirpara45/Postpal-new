import {
  Box,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  OutlinedInput,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import React, { useState } from "react";
import SimpleBar from "simplebar-react";
import selected from "../../../assets/svg/selected.svg";
import arrow_check from "../../../assets/svg/arrow_check.svg";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ maxHeight: "78vh" }}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

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
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "16px",
            backgroundColor:
              location.type === "Traveler"
                ? "#2D9CDB"
                : location.type === "CrowdShipper"
                ? "#F2994A"
                : "#2DC58C",
            width: "fit-content",
            paddingX: "8px",
            paddingY: "4px",
            marginBottom: "5px",
            borderRadius: "2px",
            color: "white",
          }}
        >
          {location.type}
        </Typography>
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

export default function DeliveryPartnerStep() {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const special_service = [
    "Fast Lane",
    "Greener Shipping",
    "Guaranteed Delivery",
    "International Return",
    "National Return",
    "Ownership Certicifate",
    "Package Inspection",
    "Personal Shopping",
    "Scan Mail",
    "Store Mediation Service",
  ];

  const specialized_service = ["Hazmat", "Medical", "Traveler", "Pick up"];
  const rating = ["5", ">3"];

  const [checkedSpecialService, setCheckedSpecialService] = useState(
    special_service.reduce((acc, item) => ({ ...acc, [item]: false }), {})
  );
  const [checkedSpecializedService, setCheckedSpecializedService] = useState(
    specialized_service.reduce((acc, item) => ({ ...acc, [item]: false }), {})
  );
  const [checkedRating, setCheckedRating] = useState(
    rating.reduce((acc, item) => ({ ...acc, [item]: false }), {})
  );

  const handleSpecialServiceChange = (item) => (event) => {
    setCheckedSpecialService((prevChecked) => ({
      ...prevChecked,
      [item]: event.target.checked,
    }));
  };

  const handleSpecializedServiceChange = (item) => (event) => {
    setCheckedSpecializedService((prevChecked) => ({
      ...prevChecked,
      [item]: event.target.checked,
    }));
  };

  const handleRatingChange = (item) => (event) => {
    setCheckedRating((prevChecked) => ({
      ...prevChecked,
      [item]: event.target.checked,
    }));
  };

  const [selectedtypeAllId, setSelectedtypeAllId] = useState(null);
  const [selectedtypeTravelerId, setSelectedtypeTravelerId] = useState(null);
  const [selectedtypeCrowdShipperId, setSelectedtypeCrowShipperId] =
    useState(null);
  const [selectedtypeOtherId, setSelectedtypeOtherId] = useState(null);

  const handleSelectAll = (id) => {
    setSelectedtypeAllId(id);
  };
  const handleSelectTraveler = (id) => {
    setSelectedtypeTravelerId(id);
  };
  const handleSelectCrowShipper = (id) => {
    setSelectedtypeCrowShipperId(id);
  };
  const handleSelectOther = (id) => {
    setSelectedtypeOtherId(id);
  };

  const typeAll = [
    {
      id: 1,
      type: "Traveler",
      name: "Angle Bastine",
      address: "1234 56th Ave N",
      city: "Plymouth, minnesota",
      country: "United States",
    },
    {
      id: 2,
      type: "Traveler",
      name: "Angle Bastine",
      address: "1234 56th Ave N",
      city: "Plymouth, minnesota",
      country: "United States",
    },
    {
      id: 3,
      type: "Traveler",
      name: "Angle Bastine",
      address: "1234 56th Ave N",
      city: "Plymouth, minnesota",
      country: "United States",
    },
  ];
  const typeTraveler = [
    {
      id: 1,
      type: "Traveler",
      name: "Angle Bastine",
      address: "1234 56th Ave N",
      city: "Plymouth, minnesota",
      country: "United States",
    },
    {
      id: 2,
      type: "Traveler",
      name: "Angle Bastine",
      address: "1234 56th Ave N",
      city: "Plymouth, minnesota",
      country: "United States",
    },
    {
      id: 3,
      type: "Traveler",
      name: "Angle Bastine",
      address: "1234 56th Ave N",
      city: "Plymouth, minnesota",
      country: "United States",
    },
  ];
  const typeCrowdShipper = [
    {
      id: 1,
      type: "CrowdShipper",
      name: "Angle Bastine",
      address: "1234 56th Ave N",
      city: "Plymouth, minnesota",
      country: "United States",
    },
    {
      id: 2,
      type: "CrowdShipper",
      name: "Angle Bastine",
      address: "1234 56th Ave N",
      city: "Plymouth, minnesota",
      country: "United States",
    },
    {
      id: 3,
      type: "CrowdShipper",
      name: "Angle Bastine",
      address: "1234 56th Ave N",
      city: "Plymouth, minnesota",
      country: "United States",
    },
  ];
  const typeOther = [
    {
      id: 1,
      type: "CarrierPartner",
      name: "Angle Bastine",
      address: "1234 56th Ave N",
      city: "Plymouth, minnesota",
      country: "United States",
    },
    {
      id: 2,
      type: "CarrierPartner",
      name: "Angle Bastine",
      address: "1234 56th Ave N",
      city: "Plymouth, minnesota",
      country: "United States",
    },
    {
      id: 3,
      type: "CarrierPartner",
      name: "Angle Bastine",
      address: "1234 56th Ave N",
      city: "Plymouth, minnesota",
      country: "United States",
    },
  ];

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
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
            <Stack sx={{ marginTop: 2 }}>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                    Search
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
                    id="search"
                    placeholder="Search Route Partner"
                    name="search"
                  />
                </FormControl>
              </Grid>
            </Stack>
            <Stack sx={{ marginTop: 2 }}>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                    Destination
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
                    id="destination"
                    placeholder="Ex. Delhi"
                    name="destination"
                  />
                </FormControl>
              </Grid>
            </Stack>
            <Stack sx={{ marginTop: 2 }}>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                    Max Pickup Price
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
                    id="max_price"
                    placeholder=""
                    name="max_price"
                  />
                </FormControl>
              </Grid>
            </Stack>
            <Stack sx={{ marginTop: 2 }}>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                    Max Import Fee (Per Consigment)
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
                    id="max_import_fee"
                    placeholder=""
                    name="max_import_fee"
                  />
                </FormControl>
              </Grid>
            </Stack>
            <Stack sx={{ marginTop: 2 }}>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                    Max Last Mile Delivery Fee
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
                    id="max_mile"
                    placeholder=""
                    name="max_mile"
                  />
                </FormControl>
              </Grid>
            </Stack>
            <Stack sx={{ marginTop: 2 }}>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                    Special Services
                  </Typography>
                </Box>
                {special_service.map((item) => (
                  <Box key={item}>
                    <FormControlLabel
                      label={item}
                      control={
                        <Checkbox
                          checked={checkedSpecialService[item]}
                          onChange={handleSpecialServiceChange(item)}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      }
                    />
                  </Box>
                ))}
              </Grid>
            </Stack>

            <Stack sx={{ marginTop: 2 }}>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                    Specialized Services
                  </Typography>
                </Box>
                {specialized_service.map((item) => (
                  <Box key={item}>
                    <FormControlLabel
                      label={item}
                      control={
                        <Checkbox
                          checked={checkedSpecializedService[item]}
                          onChange={handleSpecializedServiceChange(item)}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      }
                    />
                  </Box>
                ))}
              </Grid>
            </Stack>

            <Stack sx={{ marginTop: 2 }}>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                    Rating
                  </Typography>
                </Box>
                {rating.map((item) => (
                  <Box key={item}>
                    <FormControlLabel
                      label={item}
                      control={
                        <Checkbox
                          checked={checkedRating[item]}
                          onChange={handleRatingChange(item)}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      }
                    />
                  </Box>
                ))}
              </Grid>
            </Stack>
          </SimpleBar>
        </Grid>
        <Grid item xs={12} md={8}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="route partner tabs"
          >
            <Tab label="All" />
            <Tab label="Traveler" />
            <Tab label="CrowdShippers" />
            <Tab label="Other Route Partners" />
          </Tabs>
          <SimpleBar
            forceVisible="x"
            autoHide={true}
            style={{
              overflowX: "auto",
              maxHeight: "calc(100vh - 420px)",
            }}
            className="custom-scrollbar"
          >
            <TabPanel value={value} index={0}>
              <Stack direction="row" sx={{ marginTop: 2, marginBottom: 2 }}>
                <Typography sx={{ fontSize: "20px", fontWeight: "600" }}>
                  Your Traveler
                </Typography>
              </Stack>
              <Grid container spacing={2}>
                {typeAll.map((location) => (
                  <Grid item xs={12} sm={12} md={4} key={location.id}>
                    <LocationCard
                      location={location}
                      isSelected={location.id === selectedtypeAllId}
                      onSelect={handleSelectAll}
                    />
                  </Grid>
                ))}
              </Grid>
              <Stack direction="row" sx={{ marginTop: 2, marginBottom: 2 }}>
                <Typography sx={{ fontSize: "20px", fontWeight: "600" }}>
                  Your CrowShipper
                </Typography>
              </Stack>
              <Grid container spacing={2}>
                {typeCrowdShipper.map((location) => (
                  <Grid item xs={12} sm={12} md={4} key={location.id}>
                    <LocationCard
                      location={location}
                      isSelected={location.id === selectedtypeAllId}
                      onSelect={handleSelectAll}
                    />
                  </Grid>
                ))}
              </Grid>
              <Stack direction="row" sx={{ marginTop: 2, marginBottom: 2 }}>
                <Typography sx={{ fontSize: "20px", fontWeight: "600" }}>
                  Other Route Partners
                </Typography>
              </Stack>
              <Grid container spacing={2}>
                {typeOther.map((location) => (
                  <Grid item xs={12} sm={12} md={4} key={location.id}>
                    <LocationCard
                      location={location}
                      isSelected={location.id === selectedtypeAllId}
                      onSelect={handleSelectAll}
                    />
                  </Grid>
                ))}
              </Grid>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Stack direction="row" sx={{ marginTop: 2, marginBottom: 2 }}>
                <Typography sx={{ fontSize: "20px", fontWeight: "600" }}>
                  Your Traveler
                </Typography>
              </Stack>
              <Grid container spacing={2}>
                {typeTraveler.map((location) => (
                  <Grid item xs={12} sm={12} md={4} key={location.id}>
                    <LocationCard
                      location={location}
                      isSelected={location.id === selectedtypeTravelerId}
                      onSelect={handleSelectTraveler}
                    />
                  </Grid>
                ))}
              </Grid>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <Stack direction="row" sx={{ marginTop: 2, marginBottom: 2 }}>
                <Typography sx={{ fontSize: "20px", fontWeight: "600" }}>
                  Your CrowShipper
                </Typography>
              </Stack>
              <Grid container spacing={2}>
                {typeCrowdShipper.map((location) => (
                  <Grid item xs={12} sm={12} md={4} key={location.id}>
                    <LocationCard
                      location={location}
                      isSelected={location.id === selectedtypeCrowdShipperId}
                      onSelect={handleSelectCrowShipper}
                    />
                  </Grid>
                ))}
              </Grid>
            </TabPanel>
            <TabPanel value={value} index={3}>
              <Stack direction="row" sx={{ marginTop: 2, marginBottom: 2 }}>
                <Typography sx={{ fontSize: "20px", fontWeight: "600" }}>
                  Other Partners
                </Typography>
              </Stack>
              <Grid container spacing={2}>
                {typeOther.map((location) => (
                  <Grid item xs={12} sm={12} md={4} key={location.id}>
                    <LocationCard
                      location={location}
                      isSelected={location.id === selectedtypeOtherId}
                      onSelect={handleSelectOther}
                    />
                  </Grid>
                ))}
              </Grid>
            </TabPanel>
          </SimpleBar>
        </Grid>
      </Grid>
    </>
  );
}
