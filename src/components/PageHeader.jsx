import { Box } from "@mui/material";
import React, { useState } from "react";
import Notification from "./Notification";
import Notificationicon from "../assets/svg/notifications.svg";
import help from "../assets/svg/help.svg";

function PageHeader({ pageTitle }) {
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);

  const toggleNotification = () => {
    setNotificationDrawerOpen(!notificationDrawerOpen);
  };

  return (
    <Box sx={{ height: "57px" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <label
            style={{
              textAlign: "left",
              fontSize: " 26px",
              fontWeight: "bold",
            }}
          >
            {pageTitle}
          </label>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Box
            sx={{ marginRight: "20px", cursor: "pointer" }}
            onClick={toggleNotification}
          >
            <img src={Notificationicon} alt="notification_icon" />
          </Box>
          <Notification
            open={notificationDrawerOpen}
            onClose={toggleNotification}
          />
          <Box>
            <img src={help} alt="help_icon" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default PageHeader;
