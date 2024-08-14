import React, { useEffect, useMemo, useState } from "react";
import { generateAllDealsColumns } from "../helper";
import {
  alpha,
  Box,
  InputBase,
  Paper,
  styled,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import DataTableComponent from "../../../components/common/DataTable/DataTable";
import issue from "../../../assets/svg/issue.svg";
import AddDeal from "../AddDeal";
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

export default function DealList() {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const [dealsdata, setDealsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddDealOpen, setAddDealOpen] = useState(false);
  const [editdealsData, setEditDealsData] = useState({});
  const [confirmatioModalState, setConfirmationModalState] = useState({
    showModal: false,
    dealId: "",
  });

  useEffect(() => {
    handler();
  }, []);

  async function handler() {
    try {
      const querySnapshot = collection(db, "deals");
      const q = query(querySnapshot, where("isDeleted", "==", false));
      onSnapshot(q, (snapshot) => {
        const arr = [];
        snapshot.forEach((doc) => {
          arr.push({ ...doc.data(), id: doc.id });
        });
        setDealsData(arr);
      });
    } catch (err) {
      console.log(err, "err");
    }
  }

  const openAddDeal = (row) => {
    setAddDealOpen(true);
    setEditDealsData(row);
  };

  const closeAddDeal = () => {
    setAddDealOpen(false);
  };

  const cancelHandler = () => {
    setConfirmationModalState({ showModal: false, dealId: "" });
  };

  const deleteHandler = async () => {
    setLoading(true);
    try {
      await updateDoc(doc(db, "deals", confirmatioModalState.dealId), {
        isDeleted: true,
      }).then((res) => {
        setConfirmationModalState({ showModal: false, dealId: "" });
        toast.success("Deal Deleted Successfully");
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
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
          openAddDeal(row);
        },
      },
      {
        id: "Delete",
        iconName: "material-symbols:delete-rounded",
        actionName: "Delete",
        onClickHandle: (row) => {
          setConfirmationModalState((prev) => ({
            showModal: true,
            dealId: row?.id,
          }));
        },
      },
    ],
    []
  );
  const dealsColumns = generateAllDealsColumns(menuOptions);

  const filteredRows = dealsdata?.filter((row) => {
    const includesTerm = row.dealType
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
              columns={dealsColumns}
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
            <Typography>Try different keywords</Typography>
          </Box>
        </Box>
      )}
      <AddDeal
        open={isAddDealOpen}
        onClose={closeAddDeal}
        selectedDealData={editdealsData}
      />
      <ConfirmationModal
        showModal={confirmatioModalState.showModal}
        submitHandler={() => deleteHandler()}
        submitText={"Delete"}
        cancelText={"Cancel"}
        cancelHandler={cancelHandler}
        headerText={"Are you sure?"}
        bodyText={"You want to delete this Deal"}
        loading={loading}
      />
    </>
  );
}
