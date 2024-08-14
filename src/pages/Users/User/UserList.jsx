import {
  Box,
  Button,
  InputBase,
  Paper,
  Typography,
  alpha,
  styled,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import DataTableComponent from "../../../components/common/DataTable/DataTable";
import { generateUserColumns } from "../helper";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import issue from "../../../assets/svg/issue.svg";
import filter from "../../../assets/svg/filter.svg";
import { useEffect } from "react";
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { toast } from "react-toastify";
import ConfirmationModal from "../../../components/common/ConfirmationModal/ConfirmationModal";

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

export default function UserList() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmatioModalState, setConfirmationModalState] = useState({
    showModal: false,
    userId: "",
    status: "",
  });

  // async function handler() {
  //   try {
  //     const querySnapshot = await getDocs(collection(db, "users"));
  //     let arr = querySnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       status: doc.data().status,
  //       ...doc.data(),
  //     }));
  //     setUserData(arr);
  //   } catch (error) {
  //     console.log(error, "error");
  //   }
  // }

  // useEffect(() => {
  //   handler();
  // }, []);

  useEffect(() => {
    const querySnapshot = collection(db, "users");
    const q = query(querySnapshot);
    onSnapshot(q, (snapshot) => {
      const arr = [];
      snapshot.forEach((doc) => {
        arr.push({ ...doc.data(), id: doc.id });
      });
      // console.log(arr,"arr in order");
      setUserData(arr);
    });
  }, []);

  const userStatusChangeHandler = (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Blocked" : "Active";

    updateDoc(doc(db, "users", id), {
      status: newStatus,
    }).then(() => {
      setConfirmationModalState({ showModal: false, userId: "", status: "" });
      toast.success(
        `User ${newStatus === "Active" ? "Activated" : "Blocked"} Successfully`
      );
    });
  };

  const stausHandler = (id, status) => {
    setConfirmationModalState({ showModal: true, userId: id, status: status });
  };

  const submitHandler = () => {
    userStatusChangeHandler(
      confirmatioModalState.userId,
      confirmatioModalState.status
    );
  };

  const cancelHandler = () => {
    setConfirmationModalState({ showModal: false, userId: "", status: "" });
  };

  const menuOptions = useMemo(() => {
    return [
      {
        id: "block",
        iconName: "material-symbols:block",
        actionName: "Block",
        onClickHandle: (row) => {
          stausHandler(row?.id, "Active");
        },
      },
      {
        id: "unblock",
        iconName: "gg:unblock",
        actionName: "Unblock",
        onClickHandle: (row) => {
          stausHandler(row?.id, "Blocked");
        },
      },
      {
        id: "view-details",
        iconName: "ic:baseline-remove-red-eye",
        actionName: "View Details",
        onClickHandle: (row) => {
          navigate(`/users/user/view/${row?.id}`);
        },
      },
    ];
  }, []);
  const userColumns = generateUserColumns(menuOptions);

  const filteredRows = userData?.filter((row) => {
    const includesTerm = row.name
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
              columns={userColumns}
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
            <Typography>Try different keyword</Typography>
          </Box>
        </Box>
      )}

      <ConfirmationModal
        showModal={confirmatioModalState.showModal}
        submitHandler={() => submitHandler()}
        submitText={"Yes"}
        cancelText={"No"}
        cancelHandler={cancelHandler}
        headerText={"Are you sure?"}
        bodyText={`Do You want to ${
          confirmatioModalState.status === "Blocked" ? "Unblocked" : "Blocked"
        } this User?`}
        loading={loading}
      />
    </>
  );
}
