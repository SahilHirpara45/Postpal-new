import React, { useState } from "react";
import { Box, Button, LinearProgress, Typography, styled } from "@mui/material";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import EditPackageDrawer from "./EditPackageDrawer";
import current from "../assets/svg/currect.svg";
import star from "../assets/svg/star.svg";
import edit from "../assets/svg/edit.svg";
import package1 from "../assets/svg/package.svg";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

function PackageSplit() {
  const [expanded, setExpanded] = useState("panel2");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box>
      <Box sx={{ paddingTop: "20px", paddingRight: "20px" }}>
        <Box
          display="flex"
          alignItems="center"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "20px",
            marginRight: "0px",
          }}
        >
          <Box key={`step-`} sx={{ textAlign: "left", mx: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="subtitle1" sx={{ color: "red", mr: 1 }}>
                <img src={current} alt="first" />
              </Typography>
              <LinearProgress
                variant="determinate"
                value={100}
                sx={{
                  height: 2,
                  borderRadius: 2,
                  width: 130,
                  bgcolor: "green",
                  "& .MuiLinearProgress-bar": { bgcolor: "green" },
                }}
              />
            </Box>
            <Typography
              variant="subtitle1"
              sx={{
                mb: 1,
                ml: "-8px",
                color: "#1C2630",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {"Pick up"}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{ color: "#959BA1", ml: "-17px" }}
            >
              {"12/11/2023"}
            </Typography>
          </Box>
          <Box key={`step-`} sx={{ textAlign: "left", mx: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="subtitle1"
                sx={{
                  color: "#F68712",
                  mr: 1,
                  border: "1px solid #F68712",
                  borderRadius: "100%",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                2
              </Typography>
              <LinearProgress
                variant="determinate"
                value={100}
                sx={{
                  height: 3,
                  borderRadius: 2,
                  width: 130,
                  bgcolor: "#EDEDED",
                  "& .MuiLinearProgress-bar": { bgcolor: "#EDEDED" },
                }}
              />
            </Box>
            <Typography
              variant="subtitle1"
              sx={{
                mb: 1,
                ml: "-18px",
                color: "#1C2630",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {"Packaging"}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{ color: "#959BA1", ml: "12px" }}
            >
              {"-"}
            </Typography>
          </Box>
          <Box key={`step-`} sx={{ textAlign: "left", mx: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="subtitle1"
                sx={{
                  color: "#959BA1",
                  mr: 1,
                  border: "1px solid #959BA1",
                  borderRadius: "100%",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                3
              </Typography>
              <LinearProgress
                variant="determinate"
                value={100}
                sx={{
                  height: 3,
                  borderRadius: 2,
                  width: 130,
                  bgcolor: "#EDEDED",
                  "& .MuiLinearProgress-bar": { bgcolor: "#EDEDED" },
                }}
              />
            </Box>
            <Typography
              variant="subtitle1"
              sx={{
                mb: 1,
                ml: "-10px",
                color: "#1C2630",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {"Delivery"}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{ color: "#959BA1", ml: "13px" }}
            >
              {"-"}
            </Typography>
          </Box>
          <Box key={`step-`} sx={{ textAlign: "left", mx: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="subtitle1"
                sx={{
                  color: "#959BA1",
                  mr: 1,
                  border: "1px solid #959BA1",
                  borderRadius: "100%",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                4
              </Typography>
            </Box>
            <Typography
              variant="subtitle1"
              sx={{
                mb: 1,
                ml: "-1px",
                color: "#1C2630",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {"Done"}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{ color: "#959BA1", ml: "12px" }}
            >
              {"-"}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ height: "63vh", overflowY: "auto" }}>
        <Accordion
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
        >
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <label
              style={{
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              Package B-1 SD66554232898781
            </label>
          </AccordionSummary>
          <AccordionDetails></AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel2"}
          onChange={handleChange("panel2")}
        >
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <label
              style={{
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              Package B-2 SD66554232898781
            </label>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                margin: "20px",
                marginRight: "0px",
                backgroundColor: "#F9FAFC",
                border: "1px solid #E5E5E8",
                paddingY: "20px",
                paddingX: "40px",
                borderRadius: "4px",
              }}
            >
              <Box sx={{ display: "grid" }}>
                <label
                  style={{
                    color: "#959BA1",
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                >
                  Serial Number
                </label>
                <label
                  style={{
                    color: "#1C2630",
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  24-05000001
                </label>
              </Box>
              <Box sx={{ display: "grid" }}>
                <label
                  style={{
                    color: "#959BA1",
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                >
                  Value
                </label>
                <label
                  style={{
                    color: "#1C2630",
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  $565
                </label>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginLeft: "20px",
                marginTop: "20px",
              }}
            >
              <Box sx={{ display: "grid" }}>
                <label
                  style={{
                    color: "#959BA1",
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                >
                  Merchant
                </label>
                <Box sx={{ display: "flex", marginTop: "5px" }}>
                  <img src={star} alt="star" />
                  <label
                    style={{
                      color: "#1C2630",
                      fontWeight: "bold",
                      fontSize: "16px",
                      marginLeft: "5px",
                    }}
                  >
                    Walmart
                  </label>
                </Box>
              </Box>
              <Box sx={{ display: "grid" }}>
                <label
                  style={{
                    color: "#959BA1",
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                >
                  merchant indicator
                </label>
                <label
                  style={{
                    color: "#1C2630",
                    fontWeight: "bold",
                    fontSize: "16px",
                    marginTop: "5px",
                  }}
                >
                  AYZ Store
                </label>
              </Box>
              <Box sx={{ display: "grid" }}>
                <label
                  style={{
                    color: "#959BA1",
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                >
                  Nickname
                </label>
                <label
                  style={{
                    color: "#1C2630",
                    fontWeight: "bold",
                    fontSize: "16px",
                    marginTop: "5px",
                  }}
                >
                  -
                </label>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginLeft: "20px",
                marginTop: "40px",
              }}
            >
              <Box sx={{ display: "grid" }}>
                <label
                  style={{
                    color: "#959BA1",
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                >
                  Weight
                </label>
                <label
                  style={{
                    color: "#1C2630",
                    fontWeight: "bold",
                    fontSize: "16px",
                    marginTop: "5px",
                  }}
                >
                  7 lb
                </label>
              </Box>
              <Box sx={{ display: "grid" }}>
                <label
                  style={{
                    color: "#959BA1",
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                >
                  Dimention
                </label>
                <label
                  style={{
                    color: "#1C2630",
                    fontWeight: "bold",
                    fontSize: "16px",
                    marginTop: "5px",
                  }}
                >
                  12x12x8
                </label>
              </Box>
              <Box sx={{ display: "grid" }}>
                <label
                  style={{
                    color: "#959BA1",
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                >
                  Shelf ID
                </label>
                <label
                  style={{
                    color: "#1C2630",
                    fontWeight: "bold",
                    fontSize: "16px",
                    marginTop: "5px",
                  }}
                >
                  A1-Level 1
                </label>
              </Box>
            </Box>
            <Box
              sx={{
                marginTop: "40px",
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid #E5E5E8",
                paddingBottom: "30px",
              }}
            >
              <Button
                variant="contained"
                sx={{
                  width: "200px",
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
                onClick={toggleDrawer}
              >
                <img src={edit} alt="star" style={{ marginRight: "10px" }} />
                Edit Package Details
              </Button>
              <EditPackageDrawer open={drawerOpen} onClose={toggleDrawer} />
            </Box>
            <Box
              sx={{
                borderBottom: "1px solid #E5E5E8",
                paddingBottom: "30px",
              }}
            >
              <Box sx={{ marginLeft: "20px", marginTop: "20px" }}>
                <h1
                  style={{
                    textAlign: "left",
                    fontSize: " 26px",
                    fontWeight: "bold",
                  }}
                >
                  Package images
                </h1>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "20px",
                  marginTop: "20px",
                }}
              >
                <Box sx={{ marginRight: "20px" }}>
                  <img src={package1} alt="package" />
                </Box>
                <Box sx={{ marginRight: "20px" }}>
                  <img src={package1} alt="package" />
                </Box>
                <Box sx={{ marginRight: "20px" }}>
                  <img src={package1} alt="package" />
                </Box>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
      <Box>
        <Box
          sx={{
            paddingTop: "20px",
            marginRight: "20px",
            display: "flex",
            justifyContent: "flex-end",
            borderTop: "1px solid #E5E5E8",
            paddingBottom: "20px",
          }}
        >
          <Button
            variant="contained"
            sx={{
              width: "200px",
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
            Decline
          </Button>
          <Button
            variant="contained"
            sx={{
              width: "200px",
              marginLeft: "10px",
              border: "1px solid #E5E5E8",
              borderRadius: "4px",
              boxShadow: "none",
            }}
          >
            Approve
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default PackageSplit;
