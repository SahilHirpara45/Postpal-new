import { alpha, Box, Button, InputBase, Paper, styled } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import filter from "../../../assets/svg/filter.svg";
import { generateAdminColumns } from "../helper";
import DataTableComponent from "../../../components/common/DataTable/DataTable";
import AddAdmin from "./AddAdmin";
import ConfirmationModal from "../../../components/common/ConfirmationModal/ConfirmationModal";
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { toast } from "react-toastify";

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

export default function AllAdminList() {
  const [searchValue, setSearchValue] = useState("");
  const [adminsData, setAdminsData] = useState([]);
  const [isAddAdminOpen, setAddAdminOpen] = useState(false);
  const [editadminsData, setEditAdminsData] = useState({});
  const [loading, setLoading] = useState(false);
  const [confirmatioModalState, setConfirmationModalState] = useState({
    showModal: false,
    adminId: "",
  });

  useEffect(() => {
    try {
      const querySnapshot = collection(db, "admins");
      const q = query(querySnapshot, where("isDeleted", "==", false));
      onSnapshot(q, (snapshot) => {
        const arr = [];
        snapshot.forEach((doc) => {
          arr.push({ ...doc.data(), id: doc.id });
        });
        setAdminsData(arr);
      });
    } catch (err) {
      console.log(err, "err");
    }
  }, []);

  // console.log(adminsData, "adminsData");

  const deleteHandler = async () => {
    setLoading(true);
    try {
      await updateDoc(doc(db, "admins", confirmatioModalState.adminId), {
        isDeleted: true,
      }).then((res) => {
        setConfirmationModalState({ showModal: false, adminId: "" });
        toast.success("Admin Deleted Successfully");
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const cancelHandler = () => {
    setConfirmationModalState({ showModal: false, dealId: "" });
  };

  const openAddAdmin = () => {
    setAddAdminOpen(true);
    setEditAdminsData({});
  };

  const closeAddAdmin = () => {
    setAddAdminOpen(false);
    setEditAdminsData({});
  };

  const menuOptions = useMemo(
    () => [
      {
        id: "Edit",
        iconName: "mdi:square-edit-outline",
        actionName: "Edit",
        // redirectUrl:'/systems/route-partner/addNew',
        onClickHandle: (row) => {
          // console.log("id in edit", row);
          //   navigate("/shipping/route-partner/addNew", {
          //     state: { id: row?.id },
          //   });
          openAddAdmin();
          setEditAdminsData(row);
        },
      },
      {
        id: "Delete",
        iconName: "material-symbols:delete-rounded",
        actionName: "Delete",
        onClickHandle: (row) => {
          setConfirmationModalState((prev) => ({
            showModal: true,
            adminId: row?.id,
          }));
        },
      },
    ],
    []
  );
  const adminColumns = generateAdminColumns(menuOptions);

  const filteredRows = adminsData?.filter((row) => {
    const includesTerm = row?.name
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
                backgroundColor: "#5E17EB",
                color: "#fff",
                border: "1px solid #5E17EB",
                borderRadius: "4px",
                boxShadow: "none",
                whiteSpace: "nowrap",
                fontWeight: 600,
                marginTop: "20px",
                "&:hover": {
                  outline: "none",
                  color: "#fff",
                  backgroundColor: "#5E17EB",
                },
              }}
              onClick={() => openAddAdmin()}
            >
              Add Admin
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
              columns={adminColumns}
              // searchHandler={searchHandler}
              // paginationHandler={paginationHandler}
              // pagination={pagination}
            />
          </Paper>
        </Box>
      )}
      <AddAdmin
        open={isAddAdminOpen}
        onClose={closeAddAdmin}
        selectedAdminData={editadminsData}
      />
      <ConfirmationModal
        showModal={confirmatioModalState.showModal}
        submitHandler={() => deleteHandler()}
        submitText={"Delete"}
        cancelText={"Cancel"}
        cancelHandler={cancelHandler}
        headerText={"Are you sure?"}
        bodyText={"You want to delete this Admin"}
        loading={loading}
      />
    </>
  );
}
