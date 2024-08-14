import React, { useEffect, useState } from "react";
import { Box, Typography, styled } from "@mui/material";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import arrow from "../assets/svg/backspace.svg";
import mobile from "../assets/svg/mobile.svg";
import PreShopping from "./PreShopping";
import Verification from "./Verification";
import PostShopping from "./PostShopping";
import FinalPrice from "./FinalPrice";
import PostShipping from "./PostShipping";
import CustomerReview from "./CustomerReview";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import postpalLogo from "../assets/svg/logo_blue.svg";
import PreShipping from "./PreShipping";

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

function AccordionViaTableRowName({
  handleBack,
  id,
  packageActiveData,
  pageName,
  packageCollection,
  shipmentCollection,
}) {
  const [expanded, setExpanded] = useState("");
  const [itemsData, setItemsData] = useState();

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  // console.log(name, "accordion name");

  useEffect(() => {
    const getitemsData = async () => {
      try {
        const docRef = doc(db, "items", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setItemsData({
            ...data,
            id: docSnap.id,
            tax: data?.tax ? data?.tax : 0,
          });
        }
      } catch (error) {
        console.log(error, "error");
      }
    };
    getitemsData();
  }, [id]);

  console.log(itemsData, "itemsData");

  return (
    <Box>
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", padding: "20px" }}>
          <Box sx={{ cursor: "pointer" }} onClick={handleBack}>
            <img
              src={arrow}
              alt="back_arrow"
              style={{ minHeight: "24px", minWidth: "24px" }}
            />
          </Box>
          <Box sx={{ marginLeft: "20px" }}>
            {itemsData?.itemImageURL ? (
              <img
                src={itemsData?.itemImageURL}
                alt="itemImage"
                style={{ width: "40px", height: "40px", objectFit: "cover" }}
              />
            ) : (
              <img
                src={postpalLogo}
                alt="postpalLogo"
                style={{ width: "40px", height: "40px" }}
              />
            )}
          </Box>
          <Box>
            <label
              style={{
                fontWeight: "bold",
                fontSize: "16px",
                display: "flex",
              }}
            >
              <p
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  marginRight: "5px",
                  marginLeft: "10px",
                  color: "#481AA3",
                }}
              >
                {itemsData?.quantity}
              </p>
              <a
                href={itemsData?.link}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={(e) => {
                  e.target.style.color = "blue";
                  e.target.style.textDecoration = "underline";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "inherit";
                  e.target.style.textDecoration = "none";
                }}
              >
                {itemsData?.shortenedName}
              </a>
            </label>
          </Box>
        </Box>
      </Box>
      <Box>
        <Accordion
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
          // defaultExpanded
        >
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <label
              style={{
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              PRE-SHOPPING
            </label>
          </AccordionSummary>
          <AccordionDetails>
            {itemsData && (
              <PreShopping
                itemsData={itemsData}
                pageName={pageName}
                packageActiveData={packageActiveData}
                packageCollectionName={packageCollection}
              />
            )}
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel2"}
          onChange={handleChange("panel2")}
        >
          <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
            <label
              style={{
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              VERIFICATION
            </label>
          </AccordionSummary>
          <AccordionDetails>
            <Verification
              packageActiveData={packageActiveData}
              pageName={pageName}
              packageCollectionName={packageCollection}
            />
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel3"}
          onChange={handleChange("panel3")}
        >
          <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
            <label
              style={{
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              POST-SHOPPING
            </label>
          </AccordionSummary>
          <AccordionDetails>
            {itemsData && (
              <PostShopping
                itemsData={itemsData}
                pageName={pageName}
                packageActiveData={packageActiveData}
                packageCollection={packageCollection}
              />
            )}
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel4"}
          onChange={handleChange("panel4")}
        >
          <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
            <label
              style={{
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              FINAL PRICE
            </label>
          </AccordionSummary>
          <AccordionDetails>
            <FinalPrice
              packageActiveData={packageActiveData}
              pageName={pageName}
            />
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel5"}
          onChange={handleChange("panel5")}
        >
          <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
            <label
              style={{
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              PRE-SHIPPING (Packing)
            </label>
          </AccordionSummary>
          <AccordionDetails>
            <PreShipping
              itemsData={itemsData}
              pageName={pageName}
              packageActiveData={packageActiveData}
              packageCollection={packageCollection}
            />
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel6"}
          onChange={handleChange("panel6")}
        >
          <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
            <label
              style={{
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              POST-SHIPPING (En-route)
            </label>
          </AccordionSummary>
          <AccordionDetails>
            <PostShipping
              itemsData={itemsData}
              packageActiveData={packageActiveData}
              packageCollectionName={packageCollection}
            />
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel7"}
          onChange={handleChange("panel7")}
        >
          <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
            <label
              style={{
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              CUSTOMER RATING & REVIEW
            </label>
          </AccordionSummary>
          <AccordionDetails>
            <CustomerReview
              packageActiveData={packageActiveData}
              packageCollectionName={packageCollection}
            />
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
}

export default AccordionViaTableRowName;
