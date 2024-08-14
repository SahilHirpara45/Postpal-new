import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import SidebarContext from "../../../context/SidebarContext";
import BrandOverview from "./BrandOverview";
import Deals from "./Deals";
import Products from "./Products";
import Issue from "./Issue";
import loc from "../../../assets/svg/loc.svg";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import EditIcon from "@mui/icons-material/Edit";
import { Icon } from "@iconify/react/dist/iconify.js";

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

export default function BrandDetails() {
  const { open } = useContext(SidebarContext);
  const [value, setValue] = useState(0);
  const [brandDetails, setBrandDetails] = useState([]);

  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  async function handler() {
    try {
      if (id) {
        const docRef = doc(db, "brands", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setBrandDetails(docSnap.data());
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
        }
      }
    } catch (error) {
      console.log(error, "error");
    }
  }

  useEffect(() => {
    // handle();
    handler();
  }, []);

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
        <Box
          sx={{
            height: "80px",
            borderBottom: "1px solid #E5E5E8",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box>
                {brandDetails?.brandLogo ? (
                  <img
                    src={brandDetails.brandLogo}
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                    }}
                    staticImage
                    alt={brandDetails.brandName}
                  />
                ) : (
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                      backgroundColor: "#8770DE",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: "24px",
                    }}
                  >
                    {brandDetails.brandName?.charAt(0).toUpperCase()}
                  </div>
                )}
              </Box>
              <Box sx={{ marginLeft: "20px" }}>
                <label
                  style={{
                    textAlign: "left",
                    fontSize: " 26px",
                    fontWeight: "bold",
                  }}
                >
                  {brandDetails?.brandName}
                </label>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: "12px" }}>
                      {brandDetails?.brandCategory}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: "#000000",
                      width: "3px",
                      height: "3px",
                      marginX: "10px",
                    }}
                  ></Box>
                  <Box>
                    <img src={loc} alt="address" />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: "12px" }}>
                      {brandDetails?.brandLocation}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: "flex" }}>
              <Button
                variant="contained"
                onClick={() => {
                  navigate("/shopping/brand/addNew", {
                    state: { id: brandDetails?.id },
                  });
                }}
                sx={{
                  // backgroundColor: "white",
                  // color: "#000",
                  // border: "1px solid #E5E5E8",
                  boxShadow: "none",
                  marginBottom: "10px",
                  width: "100%",
                  borderRadius: "4px",
                  whiteSpace: "nowrap",
                  // "&:hover": {
                  //   outline: "none",
                  //   color: "#000",
                  //   backgroundColor: "white",
                  // },
                }}
                startIcon={<Icon icon="mdi:square-edit-outline" />}
              >
                Edit Brand
              </Button>
            </Box>
          </Box>
        </Box>
        <Box>
          <Box sx={{ width: "100%" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="route partner tabs"
            >
              <Tab label="Overview" />
              <Tab label="Deals" />
              <Tab label="Products" />
              <Tab label="Issues" />
            </Tabs>
            <TabPanel value={value} index={0}>
              <BrandOverview brandDetails={brandDetails} />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Deals brandDetails={brandDetails} />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <Products />
            </TabPanel>
            <TabPanel value={value} index={3}>
              <Issue brandDetails={brandDetails} />
            </TabPanel>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
