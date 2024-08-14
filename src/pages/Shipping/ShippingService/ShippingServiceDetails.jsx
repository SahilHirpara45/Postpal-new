import React, { useContext, useState } from "react";
import SidebarContext from "../../../context/SidebarContext";
import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import logo from "../../../assets/svg/fedex.svg";
import loc from "../../../assets/svg/loc.svg";
import ShippingServiceOverview from "./ShippingServiceOverview";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ minHeight: "78vh", maxHeight: "78vh" }}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

export default function ShippingServiceDetails() {
  const { open } = useContext(SidebarContext);
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "96vh",
        margin: "20px",
        marginRight: "0px",
        width: open === true ? "calc(98vw - 240px)" : "calc(98vw - 80px)",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "12px",
      }}
    >
      <Box>
        <Box>
          <Box sx={{ height: "80px" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box>
                  <img
                    src={logo}
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                    }}
                    alt="logo"
                  />
                </Box>
                <Box sx={{ marginLeft: "20px" }}>
                  <Typography
                    sx={{
                      textAlign: "left",
                      fontSize: " 26px",
                      fontWeight: "bold",
                    }}
                  >
                    Parcel.com
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box>
                      <img src={loc} alt="address" />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontSize: "12px" }}>
                        Daleware, United States
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    border: "1px solid #E5E5E8",
                    borderRadius: "4px",
                    boxShadow: "none",
                    whiteSpace: "nowrap",
                    fontWeight: 600,
                    marginTop: "20px",
                    "&:hover": {
                      outline: "none",
                      color: "#000000",
                      backgroundColor: "#ffffff",
                    },
                  }}
                >
                  Edit Shipping Service
                </Button>
              </Box>
            </Box>
          </Box>
          <Box sx={{ width: "100%" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="route partner tabs"
            >
              <Tab label="Overview" />
              <Tab label="Bookings" />
            </Tabs>
            <TabPanel value={value} index={0}>
              <ShippingServiceOverview />
            </TabPanel>
            <TabPanel value={value} index={1}></TabPanel>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
