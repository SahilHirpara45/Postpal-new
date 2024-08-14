import {
  Box,
  Button,
  InputBase,
  Typography,
  alpha,
  styled,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import DataTableComponent from "../../../components/common/DataTable/DataTable";
import SearchIcon from "@mui/icons-material/Search";
import { issueColumns } from "../helper";
import filter from "../../../assets/svg/filter.svg";
import issue from "../../../assets/svg/issue.svg";
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

export default function Issue({ brandDetails }) {
  const [searchValue, setSearchValue] = useState("");
  const [brandIssuedata, setBrandIssueData] = useState([]);

  async function handler() {
    try {
      const querySnapshot = collection(db, "brandIssues");
      const q = query(querySnapshot, where("brandId", "==", brandDetails?.id));
      onSnapshot(q, async (snapshot) => {
        const arr = [];
        snapshot.forEach((doc) => {
          arr.push({ ...doc.data(), id: doc.id });
        });
        setBrandIssueData(arr);
      });
    } catch (error) {
      console.log(error, "error");
    }
  }

  useEffect(() => {
    handler();
  }, []);

  const filteredRows = brandIssuedata?.filter((row) => {
    const includesTerm = row?.userName
      ?.toLowerCase()
      .includes(searchValue.toLowerCase());
    return includesTerm;
  });

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ p: "24px 16px", paddingTop: "0px" }}>
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
        <Box sx={{ paddingBottom: "16px" }}>
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
              //   marginTop: "20px",
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
      </Box>
      {filteredRows?.length > 0 && (
        <DataTableComponent
          data={filteredRows || []}
          columns={issueColumns}
          // searchHandler={searchHandler}
          // paginationHandler={paginationHandler}
          // pagination={pagination}
        />
      )}
      {filteredRows && filteredRows.length <= 0 && (
        <Box sx={{ marginTop: "10%" }}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <img src={issue} alt="issue_not_found" />
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
            <Typography>Try different keyword</Typography>
          </Box>
        </Box>
      )}
    </>
  );
}
