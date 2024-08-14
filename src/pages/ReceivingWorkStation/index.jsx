import { Box, Tab, Tabs, Typography } from "@mui/material";
import React, { useState } from "react";
import PackageDetails from "./PackageDetails";
import packageicon from "../../assets/svg/mdi_package.svg";
import helpicon from "../../assets/svg/mdi_help.svg";
import packageicon_1 from "../../assets/svg/mdi_package_deactive.svg";
import helpicon_1 from "../../assets/svg/mdi_help_active.svg";
import Guider from "./Guider";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{
        minHeight: "91vh",
        maxHeight: "91vh",
      }}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

export default function ReceivingWorkstation() {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        overflowY: "auto",
        minHeight: "100vh",
        backgroundColor: "#fff",
      }}
    >
      <TabPanel value={value} index={0}>
        <PackageDetails />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Guider />
      </TabPanel>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="route partner tabs"
        sx={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          backgroundColor: "background.paper",
          boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
        }}
        variant="fullWidth"
      >
        <Tab
          label="Package"
          icon={<img src={value === 0 ? packageicon : packageicon_1} alt="package_icon" />}
          sx={{ backgroundColor: value === 0 && "#F3EDFF" }}
        />
        <Tab
          label="Guider"
          icon={<img src={value === 1 ? helpicon_1 : helpicon} alt="help_icon" />}
          sx={{ backgroundColor: value === 1 && "#F3EDFF" }}
        />
      </Tabs>
    </Box>
  );
}
