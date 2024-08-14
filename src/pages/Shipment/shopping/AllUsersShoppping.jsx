import React, { useEffect, useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  CircularProgress,
  IconButton,
  InputBase,
  Tooltip,
  Typography,
  alpha,
  styled,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import VerifiedIcon from "@mui/icons-material/Verified";
import { Icon } from "@iconify/react/dist/iconify.js";
import dummyImage1 from "../../../assets/images/dummyimg1.png";
import flag from "../../../assets/images/flag.png";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "simplebar-react/dist/simplebar.min.css";
import countryFlags from "../../../CountryFlags.json";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import SimpleBar from "simplebar-react";
import { VscUnverified } from "react-icons/vsc";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "12px",
  backgroundColor: "#FAFAFA",
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  // width: "230px",
  height: "40px",
  [theme.breakpoints.up("sm")]: {
    // marginLeft: theme.spacing(1),
    // width: "auto",
  },
  border: "1px solid #EEEEEE",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const AllUsersShopping = ({ userClickHandler, userActiveData }) => {
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    try {
      const querySnapshot = query(
        collection(db, "mapUserRoutePartners"),
        where("routePartnerId", "==", "611118")
      );
      onSnapshot(querySnapshot, async (snapshot) => {
        const arr = [];

        for (const docSnapshot of snapshot.docs) {
          const mapUserData = docSnapshot.data();
          //   console.log(mapUserData, "mapUserData");
          const userId = docSnapshot.data().userId;

          if (userId) {
            const userDocRef = doc(db, "users", userId);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
              arr.push({
                ...mapUserData,
                ...userDocSnap.data(),
              });
            } else {
              console.log(`User document not found for userId: ${userId}`);
            }
          } else {
            arr.push({ ...mapUserData });
          }
        }

        // console.log(arr, "arr in AllUsers");
        setUsersData(arr);
        setLoading(false);
      });
    } catch (error) {
      setLoading(false);
      console.log(error, "error");
    }
  }, []);

  // useEffect(() => {
  //   fetchAllOrders();
  // }, []);

  // console.log(ordersData, "ordersData");
  console.log(usersData, "usersData");

  const getImageUrlByCountryCode = (countryName) => {
    const country = countryFlags.find(
      (country) => country?.name === countryName
    );
    return country ? country.image : "";
  };

  return (
    <div className="">
      <Box sx={{ p: "0px 16px" }}>
        <Typography variant="h5" sx={{ m: "12px 0 16px 12px" }}>
          Shoppings
        </Typography>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
          />
        </Search>
      </Box>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            mt: "16px",
          }}
        >
          <CircularProgress size={30} />
        </Box>
      ) : (
        <SimpleBar
          forceVisible="y"
          autoHide={true}
          style={{ maxHeight: "75vh", marginTop: "16px" }}
        >
          <Box>
            {usersData?.length > 0 &&
              usersData?.map((item, index) => (
                <Box
                  key={index}
                  onClick={() => userClickHandler(item?.userId, item)}
                  sx={{
                    height: "74px",
                    cursor: "pointer",
                    ":hover": { backgroundColor: "#EBE4FA" },
                    backgroundColor:
                      userActiveData?.userId === item?.userId && "#EBE4FA",
                  }}
                >
                  <Box
                    sx={{
                      p: "10px 24px",
                      display: "flex",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box sx={{ position: "relative" }}>
                      <Avatar
                        src={
                          item?.profileImage ? item?.profileImage : dummyImage1
                        }
                        alt=""
                        sx={{ width: "40px", height: "40px" }}
                      />
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          position: "absolute",
                          bottom: -5,
                          right: -5,
                        }}
                      >
                        <Tooltip
                          title="POSTPAL Import Trust Score (PITS)"
                          arrow
                        >
                          <div>
                            <CircularProgressbar
                              value={item?.trustScore ? item?.trustScore : 0}
                              text={`${
                                item?.trustScore ? item?.trustScore : "--"
                              }`}
                              strokeWidth={15}
                              background={true}
                              styles={buildStyles({
                                textSize: "50px",
                                pathColor: "#2DC58C",
                                textColor: "#2DC58C",
                                transformOrigin: "center center",
                                backgroundColor: "#fff",
                                fontSize: 600,
                              })}
                            />
                          </div>
                        </Tooltip>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        width: "100%",
                      }}
                    >
                      <Box sx={{ ml: "12px" }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography variant="subtitle2">
                            {/* {item?.routePartnerName} */}
                            {item?.name}
                          </Typography>
                          {item?.phoneVerified === true ? (
                            <VerifiedIcon
                              sx={{
                                ml: "4px",
                                color: "primary.main",
                                fontSize: "16px",
                              }}
                            />
                          ) : (
                            <VscUnverified
                              style={{
                                marginLeft: "4px",
                                color: "#F0AD4E",
                                fontSize: "18px",
                              }}
                            />
                          )}
                        </Box>
                        <Box
                          sx={{
                            mt: "6px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="h6">
                            {item?.uniqueAddressCode
                              ? item?.uniqueAddressCode
                              : "N/A"}
                          </Typography>
                          {/* <img src={item?.country} alt="" style={{ marginLeft: "4px" }} /> */}
                          {item?.country && (
                            <img
                              src={getImageUrlByCountryCode(item?.country)}
                              alt={`Flag of ${item?.country}`}
                              style={{ marginLeft: "4px" }}
                              width={12}
                              height={14}
                            />
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
          </Box>
        </SimpleBar>
      )}
    </div>
  );
};

export default AllUsersShopping;
