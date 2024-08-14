import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateBrandColumns } from "../helper";
import {
  Box,
  Button,
  InputBase,
  Paper,
  Typography,
  alpha,
  styled,
} from "@mui/material";
import DataTableComponent from "../../../components/common/DataTable/DataTable";
import SearchIcon from "@mui/icons-material/Search";
import issue from "../../../assets/svg/issue.svg";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { toast } from "react-toastify";
import { useEffect } from "react";
import ConfirmationModal from "../../../components/common/ConfirmationModal/ConfirmationModal";
import AddDeal from "../AddDeal";

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

export default function BrandList() {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const [brandData, setBrandData] = useState([]);
  const [confirmatioModalState, setConfirmationModalState] = useState({
    showModal: false,
    brandId: "",
  });
  const [approvalConfirmationModalState, setApprovalConfirmationModalState] =
    useState({
      showModal: false,
      brandId: "",
      status: "",
    });
  const [loading, setLoading] = useState(false);
  const [isAddDealOpen, setAddDealOpen] = useState(false);
  const [selectedBrandData, setSelectedBrandData] = useState({});

  useEffect(() => {
    handler();
  }, []);

  async function handler() {
    try {
      const querySnapshot = collection(db, "brands");
      const q = query(querySnapshot, where("isDeleted", "==", false));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const arr = [];
        snapshot.forEach((doc) => {
          arr.push({ ...doc.data(), id: doc.id });
        });
        setBrandData(arr);
      });

      return () => unsubscribe();
    } catch (err) {
      console.log(err, "err");
    }
  }

  const deleteHandler = async () => {
    setLoading(true);
    // try {
    //   const docRef = doc(db, "brands", confirmatioModalState.brandId);
    //   deleteDoc(docRef).then(() => {
    //     setConfirmationModalState({ showModal: false, brandId: "" });
    //     toast.success("Brand deleted Successfully!");
    //     setLoading(false);
    //     handler();
    //   });
    // } catch (error) {
    //   console.log(error);
    //   setLoading(false);
    // }

    try {
      await updateDoc(doc(db, "brands", confirmatioModalState.brandId), {
        isDeleted: true,
      }).then((res) => {
        setConfirmationModalState({ showModal: false, brandId: "" });
        toast.success("Brand Deleted Successfully");
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // const approvalHandler = () => {
  //   setLoading(true);
  //   console.log(
  //     approvalConfirmationModalState,
  //     "approvalConfirmationModalState"
  //   );
  //   if (approvalConfirmationModalState.status === "APPROVED") {
  //     updateDoc(doc(db, "brands", approvalConfirmationModalState.brandId), {
  //       brandStatus: "Active",
  //     }).then((res) => {
  //       toast.success("Brand Approved Successfully");
  //       // navigate("/shopping/brand");
  //       setLoading(false);
  //     });
  //   } else {
  //     const docRef = doc(db, "brands", confirmatioModalState.brandId);
  //     deleteDoc(docRef).then(() => {
  //       toast.success("Brand Rejected Successfully");
  //       setLoading(false);
  //     });
  //   }
  // };

  const approvalHandler = async () => {
    setLoading(true);
    // console.log(
    //   approvalConfirmationModalState,
    //   "approvalConfirmationModalState"
    // );

    try {
      if (approvalConfirmationModalState.status === "APPROVED") {
        await updateDoc(
          doc(db, "brands", approvalConfirmationModalState.brandId),
          {
            brandStatus: "Active",
          }
        );
        toast.success("Brand Approved Successfully");
      } else {
        const docRef = doc(
          db,
          "brands",
          approvalConfirmationModalState.brandId
        );
        await deleteDoc(docRef);
        toast.success("Brand Rejected Successfully");
      }
      setApprovalConfirmationModalState({
        showModal: false,
        brandId: "",
        status: "",
      });
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Error updating document: ", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelHandler = () => {
    setConfirmationModalState({ showModal: false, brandId: "" });
  };

  const openAddDeal = () => {
    setAddDealOpen(true);
  };
  const closeAddDeal = () => {
    setAddDealOpen(false);
  };

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        iconName: "mdi:square-edit-outline",
        actionName: "Edit",
        // redirectUrl:'/systems/route-partner/addNew',
        onClickHandle: (row) => {
          console.log("id in edit", row?.id);
          navigate("/shopping/brand/addNew", {
            state: { id: row?.id },
          });
        },
      },
      {
        id: "delete",
        iconName: "material-symbols:delete-rounded",
        // actionName: "Delete",
        actionName: "Request For Delete",
        isDisable: true,
        onClickHandle: (row) => {
          setConfirmationModalState((prev) => ({
            showModal: true,
            brandId: row?.id,
          }));
        },
      },
      {
        id: "view-details",
        iconName: "ic:baseline-remove-red-eye",
        actionName: "View Details",
        onClickHandle: (row) => {
          navigate(`/shopping/brand/view/${row?.id}`);
        },
      },
      {
        id: "plus",
        iconName: "ic:outline-plus",
        actionName: "Add Deal",
        onClickHandle: (row) => {
          openAddDeal();
          setSelectedBrandData(row);
          // navigate(`/systems/shopping/brand/view/${row?.id}`, {
          //   state: {
          //     id: "deals",
          //   },
          // });
        },
      },
      {
        id: "approve",
        iconName: "gravity-ui:check",
        actionName: "Approve",
        onClickHandle: (row) => {
          console.log(row, "row data");
          setApprovalConfirmationModalState((prev) => ({
            ...prev,
            showModal: true,
            brandId: row?.id,
            status: "APPROVED",
          }));
        },
      },
      {
        id: "reject",
        iconName: "hugeicons:cancel-01",
        actionName: "Reject",
        onClickHandle: (row) => {
          setApprovalConfirmationModalState((prev) => ({
            ...prev,
            showModal: true,
            brandId: row?.id,
            status: "REJECTED",
          }));
          // openAddDeal();
          // setSelectedBrandData(row);s
          // navigate(`/systems/shopping/brand/view/${row?.id}`, {
          //   state: {
          //     id: "deals",
          //   },
          // });
        },
      },
    ],
    []
  );

  const brandColumns = generateBrandColumns(menuOptions);

  const filteredRows = brandData?.filter((row) => {
    const includesTerm = row.brandName
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
              onClick={() => navigate("/shopping/brand/addNew")}
            >
              Add Brand
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
              columns={brandColumns}
              // searchHandler={searchHandler}
              // paginationHandler={paginationHandler}
              // pagination={pagination}
            />
            {/* {tableData && tableData.length > 0 && (
          <DataTableComponent
            data={tableData || []}
            columns={RoutePartnersColumns}
            // searchHandler={searchHandler}
            // paginationHandler={paginationHandler}
            // pagination={pagination}
          />
        )} */}
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
      <AddDeal
        open={isAddDealOpen}
        onClose={closeAddDeal}
        selectedBrandData={selectedBrandData}
      />
      <ConfirmationModal
        showModal={confirmatioModalState.showModal}
        submitHandler={() => deleteHandler()}
        submitText={"Delete"}
        cancelText={"Cancel"}
        cancelHandler={cancelHandler}
        headerText={"Are you sure?"}
        bodyText={"You want to delete this Brand"}
        loading={loading}
      />
      <ConfirmationModal
        showModal={approvalConfirmationModalState.showModal}
        submitHandler={() => approvalHandler()}
        submitText={
          approvalConfirmationModalState.status === "APPROVED"
            ? "Approve"
            : "Reject"
        }
        cancelText={"Cancel"}
        cancelHandler={() =>
          setApprovalConfirmationModalState({
            showModal: false,
            brandId: "",
            status: "",
          })
        }
        headerText={"Are you sure?"}
        bodyText={`You want to ${
          approvalConfirmationModalState.status === "APPROVED"
            ? "approve"
            : "reject"
        } this Brand`}
        loading={loading}
      />
    </>
  );
}
