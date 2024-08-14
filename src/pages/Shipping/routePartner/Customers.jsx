import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  InputBase,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  alpha,
  styled,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import img from "../../../assets/svg/customer.svg";
import action from "../../../assets/svg/action_more.svg";
import receive_shipment from "../../../assets/svg/receive_shipment.svg";
import block from "../../../assets/svg/block.svg";
import report from "../../../assets/svg/report.svg";
import filter from "../../../assets/svg/filter.svg";
import customer from "../../../assets/svg/noCustomer.svg";
import Swal from "sweetalert2";
import ReportDetailsDrawer from "./ReportDetailsDrawer";
import { renderToStaticMarkup } from "react-dom/server";
import DataTableComponent from "../../../components/common/DataTable/DataTable";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { toast } from "react-toastify";
import { customersDetailsColumns } from "./helper";
import ConfirmationModal from "../../../components/common/ConfirmationModal/ConfirmationModal";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

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

export default function Customers({ routePartnerDetails }) {
  const [searchValue, setSearchValue] = useState("");

  const [usersData, setUsersData] = useState([]);
  const [reportDrawerOpen, setReportDrawerOpen] = useState({
    showModal: false,
    userId: "",
    routePartnerName: "",
  });
  const [loading, setLoading] = useState(false);
  const [confirmatioModalState, setConfirmationModalState] = useState({
    showModal: false,
    userId: "",
    status: "",
    orderIds: [],
  });

  const toggleReportDrawer = () => {
    setReportDrawerOpen({ showModal: false, userId: "", routePartnerName: "" });
  };

  const handleBlockClick = () => {
    const titleHtml = renderToStaticMarkup(
      <Typography
        style={{
          fontSize: "18px",
          fontWeight: 700,
          color: "#1C2630",
          lineHeight: "20px",
          marginTop: "20px",
          marginBottom: "15px",
        }}
      >
        Are you sure to block this user?
      </Typography>
    );

    Swal.fire({
      title: titleHtml,
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonColor: "#EB5757",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Block",
      didRender: () => {
        const cancelButton = Swal.getCancelButton();
        const confirmButton = Swal.getConfirmButton();
        if (cancelButton) {
          cancelButton.style.backgroundColor = "#fff";
          cancelButton.style.color = "#1C2630";
          cancelButton.style.border = "1px solid #E5E5E8";
          cancelButton.style.fontWeight = 600;
          cancelButton.style.width = "120px";
        }
        if (confirmButton) {
          confirmButton.style.width = "120px";
          confirmButton.style.fontWeight = 600;
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Swal.fire({
        //   title: "Blocked!",
        //   text: "User Blocked.",
        //   icon: "success",
        // });
        console.log("User Blocked.");
      }
    });
  };
  // console.log(routePartnerDetails, "routePartnerDetails >>");

  useEffect(() => {
    const querySnapshot = collection(db, "mapUserRoutePartners");
    const q = query(
      querySnapshot,
      where("routePartnerId", "==", routePartnerDetails?.id)
    );
    let arr = [];

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      setUsersData([]);
      snapshot.forEach(async (d) => {
        if (d.data()?.userId) {
          const docRef = doc(db, "users", d.data()?.userId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            // console.log(docSnap.data(), "docSnap.data()");
            const obj = {
              createdAt: docSnap.data().createdAt,
              country: docSnap.data().country,
              name: docSnap.data().name,
              status: d.data().status,
              profileImage: docSnap.data().profileImage,
              bayNo: d.data().uniqueAddressCode,
              userId: d.data().userId,
              routePartnerId: d.data().routePartnerId,
              orderIds: 0,
              // orderIds: docSnap.data().orderIds,
            };
            // console.log(obj, "objs");
            setUsersData((prev) => [...prev, obj]);
            arr.push(obj);
            // console.log(arr,"arr after obj");
          } else {
            console.log("No such document!");
          }
        }
      });

      // console.log(arr, "arr user data");
      // setUsersData(arr);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  // console.log(usersData, "usersData");

  const userStatusChangeHandler = async (
    id,
    currentStatus,
    routePartnerId,
    orderIds
  ) => {
    // console.log(id, "id in ><<>>");
    // console.log(routePartnerId, "routePartnerId in ><<>>");
    const newStatus = currentStatus === "Active" ? "Blocked" : "Active";
    setLoading(true);
    try {
      const q = query(
        collection(db, "mapUserRoutePartners"),
        where("routePartnerId", "==", routePartnerId),
        where("userId", "==", id)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((d) => {
          const docRef = d.ref; // Get the reference to the document
          // console.log("Document data:", d.data());

          // Now, you can update the document using docRef
          updateDoc(docRef, {
            status: newStatus,
          }).then(() => {
            setConfirmationModalState({
              showModal: false,
              userId: "",
              status: "",
              routePartnerId: "",
              orderIds: [],
            });
            toast.success(
              `User ${
                newStatus === "Active" ? "Activated" : "Blocked"
              } Successfully`
            );
            setLoading(false);
          });

          // if (currentStatus === "Active") {
          //   orderIds.forEach((id) => {
          //     const docRef1 = doc(db, "order", id);
          //     getDoc(docRef1).then((docSnap) => {
          //       if (docSnap.exists()) {
          //         const docData = docSnap.data();
          //         console.log(docData, "docData of order");
          //         if (
          //           docData.status !== "ENROUTE" &&
          //           docData.status !== "CLOSED" &&
          //           docData.status !== "CANCELED"
          //         ) {
          //           updateDoc(docRef1, {
          //             status: "CANCELED",
          //           }).then((res) => {
          //             toast.success("Status Change to CANCELED Successfully!");
          //             console.log(res, "res");
          //           });
          //         }
          //       }
          //     });
          //   });
          // }
        });
      } else {
        setLoading(false);
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error updating document:", error);
    } finally {
      setLoading(false);
    }
  };

  const stausHandler = (id, status, routePartnerId, orderIds) => {
    setConfirmationModalState({
      showModal: true,
      userId: id,
      status: status,
      routePartnerId: routePartnerId,
      orderIds: orderIds,
    });
  };

  const addOrderHandler = (userId, routePartnerId) => {
    // console.log(userId, "useR===");
    // console.log(routePartnerId, "routePId===");

    setLoading(true);
    try {
      getDoc(doc(db, "masterData", "orderSetting")).then((docSnap) => {
        if (docSnap.exists()) {
          const docData = docSnap.data();
          const docRef = setDoc(
            doc(
              db,
              "order",
              `PSSA-${docData.currentId
                .toString()
                .slice(0, 4)}-${docData.currentId
                .toString()
                .slice(4, 8)}-${docData.currentId.toString().slice(8, 12)}`
            ),
            {
              date: serverTimestamp(),
              amount: 0,
              id: `PSSA-${docData.currentId
                .toString()
                .slice(0, 4)}-${docData.currentId
                .toString()
                .slice(4, 8)}-${docData.currentId.toString().slice(8, 12)}`,
              isExpressService: false,
              isVarified: false,
              isDeleted: false,
              itemId: [],
              status: "DRAFT",
              routePartnerId: routePartnerId,
              routePartnerName: "",
              routeType: "",
              shippingServiceId: "",
              trustScore: 0,
              warehouse: "",
              warehouseId: "",
              userId: userId,
            }
          ).then(async (res) => {
            toast.success("Order added Successfully");
            updateDoc(doc(db, "masterData", "orderSetting"), {
              currentId: docData.currentId + docData.incrementBy,
            });
          });
        }
      });
    } catch (error) {
      console.log(error, "error");
    }
  };

  const submitHandler = () => {
    userStatusChangeHandler(
      confirmatioModalState.userId,
      confirmatioModalState.status,
      confirmatioModalState.routePartnerId,
      confirmatioModalState.orderIds
    );
  };

  const cancelHandler = () => {
    setConfirmationModalState({
      showModal: false,
      userId: "",
      status: "",
      routePartnerId: "",
      orderIds: [],
    });
  };

  const menuOptions = useMemo(() => {
    return [
      {
        id: "start-order",
        iconName: "start-order",
        actionName: "Start Order",
        onClickHandle: (id, routePartnerId) => {
          // addOrderHandler(id, routePartnerId);
        },
      },
      {
        id: "block",
        iconName: "",
        actionName: "Block",
        onClickHandle: (row) => {
          stausHandler(
            row?.userId,
            "Active",
            row?.routePartnerId,
            row?.orderIds
          );
        },
      },
      {
        id: "unblock",
        iconName: "",
        actionName: "Unblock",
        onClickHandle: (row) => {
          stausHandler(
            row?.userId,
            "Blocked",
            row?.routePartnerId,
            row?.orderIds
          );
        },
      },
      {
        id: "report",
        iconName: "report",
        actionName: "Report",
        onClickHandle: (row) => {
          setReportDrawerOpen((prev) => ({
            showModal: true,
            userId: row?.userId,
            routePartnerName: routePartnerDetails?.name,
          }));
          // navigate(`/systems/user/view/${id}`);
          // console.log(id, "id")

          // window.open(`/contactReportForm?id=${id}`);
        },
      },
    ];
  }, []);

  const customerColumns = customersDetailsColumns(menuOptions);

  const cancelReportHandler = () => {
    setReportDrawerOpen({ showModal: false });
  };

  const filteredRows = usersData?.filter((row) => {
    const includesTerm = row.name
      .toLowerCase()
      .includes(searchValue.toLowerCase());
    return includesTerm;
  });

  console.log(filteredRows);

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
      {filteredRows && filteredRows.length > 0 && (
        <DataTableComponent
          data={filteredRows || []}
          columns={customerColumns}
          // searchHandler={searchHandler}
          // paginationHandler={paginationHandler}
          // pagination={pagination}
        />
      )}
      <ReportDetailsDrawer
        open={reportDrawerOpen.showModal}
        onClose={toggleReportDrawer}
        userId={reportDrawerOpen.userId}
        routePartnerName={reportDrawerOpen.routePartnerName}
      />

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

      {usersData.length <= 0 && (
        <Box sx={{ marginTop: "10%" }}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <img src={customer} alt="customer_not_found" />
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
