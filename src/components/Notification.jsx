import React from "react";
import Drawer from "@mui/material/Drawer";
import { Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import close from "../assets/svg/drawer_close.svg";
import people from "../assets/svg/ellipse.svg";

const Notification = ({ open, onClose }) => {
  return (
    <Drawer
      variant="temporary"
      anchor="right"
      open={open}
      onClose={onClose}
      BackdropProps={{ sx: { background: "rgba(0, 0, 0, 0.5)" } }}
    >
      <Box sx={{ width: "500px" }}>
        <Box
          sx={{
            borderBottom: "1px solid #E5E5E8",
            paddingLeft: "20px",
            paddingTop: "20px",
            paddingBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" component="h5">
            Notification
          </Typography>
          <Box
            sx={{ paddingRight: "20px", cursor: "pointer" }}
            onClick={onClose}
          >
            <img src={close} alt="close" />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            paddingRight: "20px",
            paddingLeft: "30px",
            paddingTop: "30px",
          }}
        >
          <Box sx={{ display: "flex" }}>
            <Box>
              <img width={"36px"} height={"36px"} src={people} alt="people" />
            </Box>
            <Box sx={{ display: "flex", marginLeft: "10px" }}>
              <Box sx={{ width: "290px" }}>
                <label style={{ fontWeight: "bold", fontSize: "14px" }}>
                  Michael Mitc{" "}
                </label>
                <label style={{ fontSize: "14px" }}>
                  requested to split for package 1-A1-US-03 / B-
                  SD66554232898781
                </label>
                <Box sx={{ marginTop: "10px" }}>
                  <Button
                    variant="contained"
                    sx={{ borderRadius: "4px", boxShadow: "none" }}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "white",
                      color: "#481AA3",
                      marginLeft: "10px",
                      border: "1px solid #E5E5E8",
                      borderRadius: "4px",
                      boxShadow: "none",
                      "&:hover": {
                        outline: "none",
                        color: "#481AA3",
                        backgroundColor: "white", // Remove border color on focus
                      },
                    }}
                  >
                    Review
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box>
            <label style={{ fontSize: "14px" }}>2 min ago</label>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Notification;
