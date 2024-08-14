import {
  alpha,
  Box,
  InputBase,
  Paper,
  styled,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import DataTableComponent from "../../../components/common/DataTable/DataTable";
import ConfirmationModal from "../../../components/common/ConfirmationModal/ConfirmationModal";
import SearchIcon from "@mui/icons-material/Search";
import { issueColumns } from "../helper";
import issue from "../../../assets/svg/issue.svg";
import { collection, getDocs } from "firebase/firestore";
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

export default function IssueList() {
  const [searchValue, setSearchValue] = useState("");
  const [issuedata, setIssueData] = useState([]);

  const [confirmatioModalState, setConfirmationModalState] = useState({
    showModal: false,
    IssueId: "",
  });

  useEffect(() => {
    handler();
  }, []);

  async function handler() {
    try {
      const querySnapshot = await getDocs(collection(db, "brandIssues"));
      let arr = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setIssueData(arr);
    } catch (error) {
      console.log(error, "error");
    }
  }

  // const cancelHandler = () => {
  //   setConfirmationModalState({ showModal: false, IssueId: "" });
  // };

  // const deleteHandler = async () => {
  //   console.log("delete");
  // };

  // const menuOptions = useMemo(
  //   () => [
  //     {
  //       id: "Edit",
  //       iconName: "mdi:square-edit-outline",
  //       actionName: "Edit",
  //       // redirectUrl:'/systems/route-partner/addNew',
  //       onClickHandle: (row) => {
  //         console.log("id in edit", row?.id);
  //         //   navigate("/shipping/route-partner/addNew", {
  //         //     state: { id: row?.id },
  //         //   });
  //         openAddDeal();
  //       },
  //     },
  //     {
  //       id: "Delete",
  //       iconName: "material-symbols:delete-rounded",
  //       actionName: "Delete",
  //       onClickHandle: (row) => {
  //         setConfirmationModalState((prev) => ({
  //           showModal: true,
  //           routePartnerId: row?.id,
  //         }));
  //       },
  //     },
  //   ],
  //   []
  // );

  const filteredRows = issuedata?.filter((row) => {
    const includesTerm = row?.userName
      .toLowerCase()
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
        <Box sx={{ p: "24px 16px", paddingLeft: "0px" }}>
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
      </Box>
      {filteredRows?.length > 0 && (
        <Box sx={{ display: "contents" }}>
          <Paper
            sx={{
              width: "100%",
              // height: "75vh",
              border: "1px solid #E5E5E8",
              borderRadius: "4px",
            }}
          >
            <DataTableComponent
              data={filteredRows || []}
              columns={issueColumns}
              // searchHandler={searchHandler}
              // paginationHandler={paginationHandler}
              // pagination={pagination}
            />
          </Paper>
        </Box>
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
            <Typography>Try Different Keywords</Typography>
          </Box>
        </Box>
      )}
      <ConfirmationModal
        showModal={confirmatioModalState.showModal}
        // submitHandler={() => deleteHandler()}
        submitText={"Delete"}
        cancelText={"Cancel"}
        // cancelHandler={cancelHandler}
        headerText={"Are you sure?"}
        bodyText={"You want to delete this Deal"}
      />
    </>
  );
}
