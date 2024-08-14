import React, { useEffect, useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  CircularProgress,
  IconButton,
  InputBase,
  Typography,
  alpha,
  styled,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import VerifiedIcon from "@mui/icons-material/Verified";
import { Icon } from "@iconify/react/dist/iconify.js";
import dummyImage1 from "../../../assets/svg/logo_blue.svg";
import flag from "../../../assets/images/flag.png";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "simplebar-react/dist/simplebar.min.css";
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
import { useSelector } from "react-redux";

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

const AllNoSuites = ({ packageClickHandler, packageActiveData }) => {
  const [packageData, setPackageData] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth.value);

  useEffect(() => {
    setLoading(true);
    if (user?.role) {
      try {
        const q1 = query(
          collection(db, "shelfPackages"),
          where("isNoSuite", "==", true)
        );
        const q2 = query(
          collection(db, "shelfPackages"),
          where("isNoSuite", "==", true),
          where("warehouseRoutePartnerId", "==", user.routePartnerId)
        );

        const querySnapshot = user?.role === "Superadmin" ? q1 : q2;
        const unsubscribe = onSnapshot(querySnapshot, (snapshot) => {
          const arr = [];
          snapshot.forEach((doc) => {
            arr.push({ ...doc.data(), id: doc.id });
          });

          setPackageData(arr);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        setLoading(false);
        console.log(error, "error");
      }
    }
  }, [user]);

  // useEffect(() => {
  //   fetchAllOrders();
  // }, []);

  // console.log(ordersData, "ordersData");
  console.log(packageData, "packageData");

  return (
    <div className="">
      <Box sx={{ p: "0px 16px" }}>
        <Typography variant="h5" sx={{ m: "12px 0 16px 12px" }}>
          Packages
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
            {packageData?.length > 0 ? (
              packageData?.map((item, index) => (
                <Box
                  key={index}
                  onClick={() =>
                    packageClickHandler(item?.packageTrackingId, item)
                  }
                  sx={{
                    // height: "74px",
                    cursor: "pointer",
                    ":hover": { backgroundColor: "#EBE4FA" },
                    backgroundColor:
                      packageActiveData?.packageTrackingId ===
                        item?.packageTrackingId && "#EBE4FA",
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
                        src={dummyImage1}
                        alt=""
                        sx={{ width: "40px", height: "40px" }}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        width: "100%",
                      }}
                    >
                      <Box sx={{ ml: "12px" }}>
                        <Box>
                          <Typography variant="subtitle2">
                            {item?.packageName}
                          </Typography>
                        </Box>
                        <Box sx={{ mt: "6px" }}>
                          <Typography variant="h6">No Suite</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))
            ) : (
              <Box sx={{ textAlign: "center", mt: "20px" }}>
                No Packages Found
              </Box>
            )}
          </Box>
        </SimpleBar>
      )}
    </div>
  );
};

export default AllNoSuites;
