import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import SidebarContext from "../../../context/SidebarContext";
import loc from "../../../assets/svg/loc.svg";
import up from "../../../assets/svg/up.svg";
import down from "../../../assets/svg/down.svg";
import UserOverview from "./UserOverview";
import Ship from "./Ship";
import Shop from "./Shop";
import TrustScore from "./TrustStore";
import Wallet from "./Wallet";
import Connection from "./Connection";
import Issue from "./Issues";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

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

function UserDetails() {
  const { open } = useContext(SidebarContext);
  const [value, setValue] = useState(0);
  const [userDetails, setUserDetails] = useState([]);
  const { id } = useParams();

  async function handler() {
    try {
      if (id) {
        const docRef = doc(db, "users", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
        } else {
          console.log("No such document!");
        }
      }
    } catch (error) {
      console.log(error, "error");
    }
  }
  useEffect(() => {
    handler();
  }, [id]);

  // console.log(userDetails, "userDetails");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const issueData = [
    {
      createdAt: "Thu, Aug 17 2023",
      orderId: "PSSM-5451-4546-8970",
      name: "Arlene McCoy",
      issue: "kgxjyxidyoydoufoufuofoyfod",
    },
    {
      createdAt: "Thu, Aug 17 2023",
      orderId: "PSSM-5451-4546-8970",
      name: "James",
      issue:
        "kgxjyxidyoydoufoufuofoyfodkgxjyxidyoydoufoufuofoyfodkgxjyxidyoydoufoufuofoyfodkgxjyxidyoydoufoufuofoyfodkgxjyxidyoydoufoufuofoyfodkgxjyxidyoydoufoufuofoyfodkgxjyxidyoydoufoufuofoyfodkgxjyxidyoydoufoufuofoyfod",
    },
    {
      createdAt: "Thu, Aug 17 2023",
      orderId: "PSSM-5451-4546-8970",
      name: "Charles",
      issue: "kgxjyxidyoydoufoufuofoyfod",
    },
    {
      createdAt: "Thu, Aug 17 2023",
      orderId: "PSSM-5451-4546-8970",
      name: "Arlene McCoy",
      issue:
        "kgxjyxidyoydoufoufuofoyfodkgxjyxidyoydoufoufuofoyfodkgxjyxidyoydoufoufuofoyfodkgxjyxidyoydoufoufuofoyfodkgxjyxidyoydoufoufuofoyfodkgxjyxidyoydoufoufuofoyfodkgxjyxidyoydoufoufuofoyfodkgxjyxidyoydoufoufuofoyfod",
    },
    {
      createdAt: "Thu, Aug 17 2023",
      orderId: "PSSM-5451-4546-8970",
      name: "Peter",
      issue: "kgxjyxidyoydoufoufuofoyfod",
    },
    {
      createdAt: "Thu, Aug 17 2023",
      orderId: "PSSM-5451-4546-8970",
      name: "McCoy",
      issue: "kgxjyxidyoydoufoufuofoyfod",
    },
  ];

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
                {userDetails?.profileImage ? (
                  <img
                    src={userDetails?.profileImage}
                    style={{
                      width: "56px",
                      height: "56px",
                    }}
                    staticImage
                    alt={userDetails?.name}
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
                      fontSize: "26px",
                    }}
                  >
                    {userDetails?.name?.charAt(0)?.toUpperCase()}
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
                  {userDetails?.name}
                </label>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box>
                    <img src={loc} alt="address" />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: "12px" }}>
                      {userDetails?.country}
                    </Typography>
                  </Box>
                </Box>
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
              <Tab label="Ship" />
              <Tab label="Shop" />
              <Tab label="Trust Score" />
              <Tab label="Wallet" />
              <Tab label="Connections" />
              <Tab label="Issues" />
            </Tabs>
            <TabPanel value={value} index={0}>
              <UserOverview userDetails={userDetails} />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Ship />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <Shop />
            </TabPanel>
            <TabPanel value={value} index={3}>
              <TrustScore />
            </TabPanel>
            <TabPanel value={value} index={4}>
              <Wallet />
            </TabPanel>
            <TabPanel value={value} index={5}>
              <Connection />
            </TabPanel>
            <TabPanel value={value} index={6}>
              <Issue userDetails={userDetails} />
            </TabPanel>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default UserDetails;
