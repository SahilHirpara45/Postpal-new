import {
  Box,
  Button,
  InputBase,
  Typography,
  alpha,
  styled,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import SidebarContext from "../../../context/SidebarContext";
import PageHeader from "../../../components/PageHeader";
import SearchIcon from "@mui/icons-material/Search";
import filter from "../../../assets/svg/filter.svg";
import { Link, useNavigate } from "react-router-dom";
import RoutePartnerList from "./RoutePartnerList";
import img1 from "../../../assets/svg/fedex.svg";
import img2 from "../../../assets/svg/mailcarib.svg";
import img3 from "../../../assets/svg/ups.svg";
import img4 from "../../../assets/svg/parcel.svg";
import action from "../../../assets/svg/action_more.svg";
import route_not_found from "../../../assets/svg/routepatnerNotFound.svg";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

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
    width: "230px",
    // [theme.breakpoints.up("sm")]: {
    //   width: "12ch",
    //   "&:focus": {
    //     width: "20ch",
    //   },
    // },
  },
}));
const data = [
  {
    id: 1,
    name: "FedEx",
    img: img1,
    date: "Thu, Aug 17 2023",
    rating: "0.00/5",
    headquarter: "India",
    totalbays: 25,
    carrier: "No",
    action: action,
  },
  {
    id: 2,
    img: img2,
    name: "MailCarib",
    date: "Thu, Aug 17 2023",
    rating: "0.00/5",
    headquarter: "India",
    totalbays: 12,
    carrier: "No",
    action: action,
  },
  {
    id: 3,
    img: img3,
    name: "UPS",
    date: "Thu, Aug 17 2023",
    rating: "0.00/5",
    headquarter: "India",
    totalbays: "-",
    carrier: "No",
    action: action,
  },
  {
    id: 4,
    img: img4,
    name: "Parcel.com",
    date: "Thu, Aug 17 2023",
    rating: "0.00/5",
    headquarter: "India",
    totalbays: 25,
    carrier: "No",
    action: action,
  },
  {
    id: 5,
    img: img1,
    name: "FedEx",
    date: "Thu, Aug 17 2023",
    rating: "0.00/5",
    headquarter: "India",
    totalbays: 25,
    carrier: "No",
    action: action,
  },
  {
    id: 6,
    img: img1,
    name: "FedEx",
    date: "Thu, Aug 17 2023",
    rating: "0.00/5",
    headquarter: "India",
    totalbays: 25,
    carrier: "No",
    action: action,
  },
  {
    id: 7,
    img: img1,
    name: "FedEx",
    date: "Thu, Aug 17 2023",
    rating: "0.00/5",
    headquarter: "India",
    totalbays: 25,
    carrier: "No",
    action: action,
  },
  {
    id: 8,
    img: img1,
    name: "FedEx",
    date: "Thu, Aug 17 2023",
    rating: "0.00/5",
    headquarter: "India",
    totalbays: 25,
    carrier: "No",
    action: action,
  },
  {
    id: 9,
    img: img1,
    name: "FedEx",
    date: "Thu, Aug 17 2023",
    rating: "0.00/5",
    headquarter: "India",
    totalbays: 25,
    carrier: "No",
    action: action,
  },
  {
    id: 10,
    img: img1,
    name: "FedEx",
    date: "Thu, Aug 17 2023",
    rating: "0.00/5",
    headquarter: "India",
    totalbays: 25,
    carrier: "No",
    action: action,
  },
  {
    id: 11,
    img: img1,
    name: "FedEx",
    date: "Thu, Aug 17 2023",
    rating: "0.00/5",
    headquarter: "India",
    totalbays: 25,
    carrier: "No",
    action: action,
  },
  {
    id: 12,
    img: img1,
    name: "FedEx",
    date: "Thu, Aug 17 2023",
    rating: "0.00/5",
    headquarter: "India",
    totalbays: 25,
    carrier: "No",
    action: action,
  },
  {
    id: 13,
    img: img1,
    name: "FedEx",
    date: "Thu, Aug 17 2023",
    rating: "0.00/5",
    headquarter: "India",
    totalbays: 25,
    carrier: "No",
    action: action,
  },
];

function RoutePartner() {
  const { open } = useContext(SidebarContext);
  const [searchValue, setSearchValue] = useState("");
  const [routePartners, setRoutePartners] = useState([]);

  const navigation = useNavigate();

  useEffect(() => {
    // handler();
    try {
      const querySnapshot = collection(db, "routePartners");
      const q = query(querySnapshot, where("isDeleted", "==", false));
      onSnapshot(q, (snapshot) => {
        const arr = [];
        snapshot.forEach((doc) => {
          arr.push({ ...doc.data(), id: doc.id });
        });
        setRoutePartners(arr);
      });
    } catch (err) {
      console.log(err, "err");
    }
  }, []);

  const searchHandler = async (searchInput) => {
    try {
      const querySnapshot = collection(db, "routePartners");
      const q = query(
        querySnapshot,
        where("isDeleted", "==", false),
        where("name", ">=", searchInput),
        where("name", "<=", searchInput + "\uf8ff")
      );
      onSnapshot(q, (snapshot) => {
        const arr = [];
        snapshot.forEach((doc) => {
          arr.push({ ...doc.data(), id: doc.id });
        });
        setRoutePartners(arr);
      });
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleAddRoutePartner = () => {
    navigation("/shipping/route-partner/addNew");
  };

  const filteredRows = routePartners?.filter((row) =>
    row.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  console.log(filteredRows);

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
      <Box sx={{ borderBottom: "1px solid #E5E5E8" }}>
        <PageHeader pageTitle={"Route Partners"} />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ p: "24px 16px" }}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </Search>
        </Box>
        <Box sx={{ display: "flex" }}>
          <Box>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "white",
                color: "#1C2630",
                border: "1px solid #E5E5E8",
                borderRadius: "4px",
                boxShadow: "none",
                whiteSpace: "nowrap",
                fontWeight: 600,
                marginTop: "20px",
                "&:hover": {
                  outline: "none",
                  color: "#1C2630",
                  backgroundColor: "white", // Remove border color on focus
                },
              }}
              // onClick={() => toggleDrawer(packageActiveData)}
            >
              <img src={filter} alt="star" style={{ marginRight: "10px" }} />
              Filter
            </Button>
          </Box>
          <Box>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#5E17EB",
                color: "#fff",
                marginLeft: "20px",
                border: "1px solid #E5E5E8",
                borderRadius: "4px",
                boxShadow: "none",
                whiteSpace: "nowrap",
                fontWeight: 600,
                marginTop: "20px",
                "&:hover": {
                  outline: "none",
                  color: "#fff",
                  backgroundColor: "#5E17EB", // Remove border color on focus
                },
              }}
              onClick={() => handleAddRoutePartner()}
            >
              Add Route Partner
            </Button>
          </Box>
        </Box>
      </Box>
      {filteredRows.length > 0 && (
        <Box sx={{ display: "flex" }}>
          <RoutePartnerList tableData={filteredRows} />
        </Box>
      )}

      {filteredRows <= 0 && (
        <Box sx={{ marginTop: "10%" }}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <img src={route_not_found} alt="route_patner_not_found" />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "30px",
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: "16px" }}>
              No records found
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography>Try different keyword or Add Route Partner</Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default RoutePartner;
