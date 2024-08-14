import { Box, Tab, Tabs, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import SidebarContext from "../../../context/SidebarContext";
import logo from "../../../assets/svg/fedex.svg";
import loc from "../../../assets/svg/loc.svg";
import up from "../../../assets/svg/up.svg";
import down from "../../../assets/svg/down.svg";
import Overview from "./Overview";
import Customers from "./Customers";
import Issues from "./Issues";
import Warehouses from "./Warehouses";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

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

export default function RoutePartnerDetails() {
  const { open } = useContext(SidebarContext);
  const [data, setData] = useState();
  const [routePartnerName, setRoutePartnerName] = useState("");
  const [value, setValue] = useState(0);
  const [activeTabId, setActiveTabId] = useState(1);
  const [routePartnerDetails, setRoutePartnerDetails] = useState({});
  const [handledDetails, setHandledDetails] = useState([]);
  const { id } = useParams();
  const location = useLocation();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getRoutePartnerDetailsHandler = async () => {
    if (id) {
      const docRef = doc(db, "routePartners", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data());
        setRoutePartnerDetails(docSnap.data());
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    }
  };

  useEffect(() => {
    getRoutePartnerDetailsHandler();
  }, [id]);

  // console.log(routePartnerDetails, "routePartnerDetails");

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
                {routePartnerDetails?.logoUrl ? (
                  <img
                    src={routePartnerDetails.logoUrl}
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                    }}
                    staticImage
                    alt={routePartnerDetails.name}
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
                    {routePartnerDetails.name?.charAt(0).toUpperCase()}
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
                  {routePartnerDetails?.name}
                </label>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box>
                    <img src={loc} alt="address" />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: "12px" }}>
                      {`${routePartnerDetails?.state},${routePartnerDetails?.country}`}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: "flex" }}>
              <Box
                sx={{
                  marginRight: "20px",
                  border: "1px solid #E5E5E8",
                  paddingX: "12px",
                  paddingY: "8px",
                  borderRadius: "4px",
                  width: "100px",
                }}
              >
                <Box sx={{ display: "flex" }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: "24px",
                      marginRight: "5px",
                    }}
                  >
                    0 lb
                  </Typography>
                  <img src={up} alt="up" />
                </Box>
                <Typography
                  sx={{ color: "#959BA1", fontWeight: 500, fontSize: "12px" }}
                >
                  Handled
                </Typography>
              </Box>
              <Box
                sx={{
                  border: "1px solid #E5E5E8",
                  paddingX: "12px",
                  paddingY: "8px",
                  borderRadius: "4px",
                  width: "100px",
                }}
              >
                <Box sx={{ display: "flex" }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: "24px",
                      marginRight: "5px",
                    }}
                  >
                    $0
                  </Typography>
                  <img src={down} alt="down" />
                </Box>
                <Typography
                  sx={{ color: "#959BA1", fontWeight: 500, fontSize: "12px" }}
                >
                  Value
                </Typography>
              </Box>
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
              <Tab label="Warehouses" />
              <Tab label="Customers" />
              <Tab label="Issues" />
            </Tabs>
            <TabPanel value={value} index={0}>
              <Overview routePartnerDetails={routePartnerDetails} />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Warehouses routePartnerDetails={routePartnerDetails} />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <Customers routePartnerDetails={routePartnerDetails} />
            </TabPanel>
            <TabPanel value={value} index={3}>
              <Issues routePartnerDetails={routePartnerDetails} />
            </TabPanel>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
