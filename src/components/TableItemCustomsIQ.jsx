import React, { useState } from "react";
import {
  Box,
  Checkbox,
  Drawer,
  FormControlLabel,
  FormGroup,
  InputBase,
  Paper,
  Typography,
  styled,
} from "@mui/material";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import close from "../assets/svg/drawer_close.svg";
import arrow from "../assets/svg/backspace.svg";
import speaker from "../assets/svg/speaker.svg";
import volumn_on from "../assets/svg/volume_on.svg";
import volumn_off from "../assets/svg/volume_off.svg";
import send from "../assets/svg/send.svg";
import refresh from "../assets/svg/sync.svg";
import postpalLogo from "../assets/svg/logo_blue.svg";
import CommonRestrictionTable from "./CommonRestrictionTable";
import ShipmentCustomIQ from "./ShipmentCustomIQ";
import SimpleBar from "simplebar-react";

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

function TableItemCustomsIQ({ title, img, open, onClose, selectedRows }) {
  const [expanded, setExpanded] = useState("");
  const [expandedTwo, setExpandedTwo] = useState("");
  const [customIqs,setCustomIqs]=useState(selectedRows?.customsIQ||{});

  console.log(selectedRows,"selectedRows in TableItemCustomsIQ")

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleChangeTwo = (panel) => (event, newExpanded) => {
    setExpandedTwo(newExpanded ? panel : false);
  };

  const handleCloseDrawer = () => {
    setExpanded("");
    onClose();
  };

  return (
    <Drawer
      variant="temporary"
      anchor="right"
      open={open}
      onClose={onClose}
      BackdropProps={{ sx: { background: "rgba(0, 0, 0, 0.5)" } }}
    >
      <Box sx={{ width: "1052px", display: "flex" }}>
        <Box>
          <Box
            sx={{
              borderBottom: "1px solid #E5E5E8",
              paddingLeft: "20px",
              paddingTop: "20px",
              paddingBottom: "5px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "572px",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{ cursor: "pointer", marginRight: "20px" }}
                onClick={handleCloseDrawer}
              >
                <img
                  src={arrow}
                  alt="back_arrow"
                  style={{ minWidth: "24px", minHeight: "24px" }}
                />
              </Box>
              <Box sx={{ cursor: "pointer", marginRight: "20px" }}>
                <img src={selectedRows?.item_img||""} alt="item_image" width="40px" height="40px" />
              </Box>
              <Typography variant="h5" component="h5">
                {title}'s CustomeIQ
              </Typography>
            </Box>
            <Box
              sx={{ paddingRight: "20px", cursor: "pointer" }}
              onClick={handleCloseDrawer}
            >
              <img src={close} alt="close" />
            </Box>
          </Box>
          <SimpleBar
            forceVisible="y"
            autoHide={true}
            style={{ maxHeight: "90vh" }}
            className="custom-scrollbar"
          >
            <Box>
              <Accordion
                expanded={expanded === "panel1"}
                onChange={handleChange("panel1")}
                sx={{ width: 572 }}
              >
                <AccordionSummary
                  aria-controls="panel1d-content"
                  id="panel1d-header"
                >
                  <label
                    style={{
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    {`Items CustomIQ (${Object.keys(customIqs)?.length||0})`}
                  </label>
                </AccordionSummary>
                <AccordionDetails>
                  <Box>
                    <Box
                      sx={{
                        backgroundColor: "#F3EDFF",
                        paddingX: "20px",
                        border: "1px solid #5E17EB",
                        borderRadius: "4px",
                        paddingY: "10px",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <label
                          style={{
                            fontWeight: "bold",
                            fontSize: "14px",
                          }}
                        >
                          Category :{" "}
                        </label>
                        <label
                          style={{
                            fontSize: "14px",
                          }}
                        >
                          {" "}
                          {selectedRows?.category}
                        </label>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "10px",
                        }}
                      >
                        <label
                          style={{
                            fontWeight: "bold",
                            fontSize: "14px",
                          }}
                        >
                          subcategory :{" "}
                        </label>
                        <label
                          style={{
                            fontSize: "14px",
                          }}
                        >
                          {" "}
                          {selectedRows?.subCategory}
                        </label>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "10px",
                        }}
                      >
                        <label
                          style={{
                            fontWeight: "bold",
                            fontSize: "14px",
                          }}
                        >
                          Shortend name :{" "}
                        </label>
                        <label
                          style={{
                            fontSize: "14px",
                          }}
                        >
                          {" "}
                          {selectedRows?.name}
                        </label>
                      </Box>
                    </Box>
                    <Box sx={{ marginTop: "10px" }}>
                      <CommonRestrictionTable customIqs={customIqs} itemId={selectedRows?.itemId} selectedRows={selectedRows}/>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
              <Accordion
                expanded={expanded === "panel2"}
                onChange={handleChange("panel2")}
                sx={{ width: 572 }}
              >
                <AccordionSummary
                  aria-controls="panel1d-content"
                  id="panel1d-header"
                >
                  <label
                    style={{
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    Shipments CustomIQ (3)
                  </label>
                </AccordionSummary>
                <AccordionDetails>
                  <Box>
                    <ShipmentCustomIQ />
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
          </SimpleBar>
        </Box>
        <Box sx={{ backgroundColor: "#FAFAFA" }}>
          <Box
            sx={{
              borderBottom: "1px solid #E5E5E8",
              paddingLeft: "20px",
              paddingTop: "20px",
              paddingBottom: "13px",
              display: "flex",
              justifyContent: "space-between",
              width: "462px",
              backgroundColor: "#FAFAFA",
            }}
          >
            <Typography variant="h5" component="h5">
              Shipping Guider
            </Typography>
            <Box
              sx={{
                paddingX: "10px",
                paddingY: "3px",
                cursor: "pointer",
                display: "flex",
                border: "1px solid #5E17EB",
                borderRadius: "8px",
                backgroundColor: "#F3EDFF",
              }}
            >
              <img src={speaker} alt="speaker_icon" />
              <label style={{ marginLeft: "10px" }}>speaker mode</label>
            </Box>
          </Box>
          <Box sx={{ height: "84vh" }}>
            <Accordion
              expanded={expandedTwo === "panel1"}
              onChange={handleChangeTwo("panel1")}
              sx={{ width: 462 }}
            >
              <AccordionSummary
                aria-controls="panel1d-content"
                id="panel1d-header"
              >
                <label
                  style={{
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  Packaging Guider
                </label>
                <img src={refresh} alt="refresh" />
              </AccordionSummary>
              <AccordionDetails>
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "#FAFAFA",
                      paddingX: "10px",
                      border: "1px solid #E5E5E8",
                      marginTop: "10px",
                      borderRadius: "4px",
                    }}
                  >
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox />}
                        label="Lorem ipsum dolor sit amet"
                      />
                    </FormGroup>
                    <img src={volumn_on} alt="volumn_on" />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "#FAFAFA",
                      paddingX: "10px",
                      border: "1px solid #E5E5E8",
                      marginTop: "10px",
                      borderRadius: "4px",
                    }}
                  >
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox />}
                        label="Lorem ipsum dolor sit amet"
                      />
                    </FormGroup>
                    <img src={volumn_on} alt="volumn_on" />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "#FAFAFA",
                      paddingX: "10px",
                      border: "1px solid #E5E5E8",
                      marginTop: "10px",
                      borderRadius: "4px",
                      paddingBottom: "20px",
                    }}
                  >
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox />}
                        label="Lorem ipsum dolor sit amet"
                      />
                    </FormGroup>
                    <img src={volumn_off} alt="volumn_on" />
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expandedTwo === "panel2"}
              onChange={handleChangeTwo("panel2")}
              sx={{ width: 462 }}
            >
              <AccordionSummary
                aria-controls="panel1d-content"
                id="panel1d-header"
              >
                <label
                  style={{
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  General Shipping Procedure
                </label>
                <img src={refresh} alt="refresh" />
              </AccordionSummary>
              <AccordionDetails>
                <Box></Box>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expandedTwo === "panel3"}
              onChange={handleChangeTwo("panel3")}
              sx={{ width: 462 }}
            >
              <AccordionSummary
                aria-controls="panel1d-content"
                id="panel1d-header"
              >
                <label
                  style={{
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  Warning and Directives
                </label>
                <img src={refresh} alt="refresh" />
              </AccordionSummary>
              <AccordionDetails>
                <Box></Box>
              </AccordionDetails>
            </Accordion>
          </Box>
          <Box
            sx={{
              paddingLeft: "24px",
              marginTop: "20px",
              marginRight: "40px",
            }}
          >
            <Box>
              <Paper
                component="form"
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #E5E5E8",
                  width: 350,
                  height: 40,
                  marginTop: "10px",
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Search... "
                  inputProps={{ "aria-label": "Ask me a question" }}
                  size="small"
                />
                <img src={send} alt="send" />
              </Paper>
            </Box>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}

export default TableItemCustomsIQ;
