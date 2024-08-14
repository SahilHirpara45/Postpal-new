import {
  Box,
  Button,
  InputBase,
  Paper,
  Typography,
  alpha,
  styled,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTableComponent from "../../../components/common/DataTable/DataTable";
import { generateDealColumns } from "../helper";
import SearchIcon from "@mui/icons-material/Search";
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
// import AddDeal from "../AddDeal";

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

export default function Deals({ brandDetails }) {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [isAddDealOpen, setAddDealOpen] = useState(false);
  const [brandDeals, setBrandDeals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDealdata, setSelectedDealdata] = useState({});
  const [confirmatioModalState, setConfirmationModalState] = useState({
    showModal: false,
    dealId: "",
  });

  async function handler() {
    try {
      const querySnapshot = collection(db, "deals");
      const q = query(
        querySnapshot,
        where("isDeleted", "==", false),
        where("brandId", "==", brandDetails?.id)
      );
      onSnapshot(q, async (snapshot) => {
        const arr = [];
        snapshot.forEach((doc) => {
          // if (brandDetails?.dealId?.includes(doc.id)) {
          //   arr.push({ ...doc.data(), id: doc.id });
          // }
          arr.push({ ...doc.data(), id: doc.id });
        });

        setBrandDeals(arr);
      });
    } catch (error) {
      console.log(error, "error");
    }
  }
  useEffect(() => {
    handler();
  }, []);

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
    } finally{
      setLoading(false);
    }
  };

  const openAddDeal = () => {
    setAddDealOpen(true);
  };

  const closeAddDeal = () => {
    setAddDealOpen(false);
    setSelectedDealdata({});
  };

  const cancelHandler = () => {
    setConfirmationModalState({ showModal: false, routePartnerId: "" });
  };

  const menuOptions = useMemo(
    () => [
      {
        id: "Edit",
        iconName: "mdi:square-edit-outline",
        actionName: "Edit",
        // redirectUrl:'/systems/route-partner/addNew',
        onClickHandle: (row) => {
          console.log("id in edit", row?.id);
          openAddDeal();
          setSelectedDealdata(row);
        },
      },
      {
        id: "Delete",
        iconName: "material-symbols:delete-rounded",
        actionName: "Delete",
        onClickHandle: (row) => {
          // navigate(`/users/user/view/${row?.id}`);
          setConfirmationModalState((prev) => ({
            showModal: true,
            dealId: row?.id,
          }));
        },
      },
    ],
    []
  );
  const DealColumns = generateDealColumns(menuOptions);

  const filteredRows = brandDeals?.filter((row) => {
    const includesTerm = row?.dealType
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
              onClick={() => {
                openAddDeal();
                setSelectedDealdata({});
              }}
            >
              Add New Deal
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
              columns={DealColumns}
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
            <Typography>Click Add New Deal</Typography>
          </Box>
        </Box>
      )}
      <AddDeal
        open={isAddDealOpen}
        onClose={closeAddDeal}
        selectedBrandData={brandDetails}
        selectedDealData={selectedDealdata}
      />
      <ConfirmationModal
        showModal={confirmatioModalState.showModal}
        submitHandler={() => deleteHandler()}
        submitText={"Delete"}
        cancelText={"Cancel"}
        cancelHandler={cancelHandler}
        headerText={"Are you sure?"}
        bodyText={"You want to delete this Deal"}
      />
    </>
  );
}
