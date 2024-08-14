import { alpha, Box, Button, InputBase, Paper, styled } from "@mui/material";
import React, { useMemo, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { generateShippingServiceColumns } from "./helper";
import DataTableComponent from "../../../components/common/DataTable/DataTable";
import { useNavigate } from "react-router-dom";

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

export default function ShippingServiceList() {
  const [searchValue, setSearchValue] = useState("");
  const navigation = useNavigate();

  const shippingServiceData = [
    {
      id: 1,
      createdOn: "Thu, Aug 17 2023",
      warehouse: "Dunkrik Place",
      routingType: "POSTPAL DIRECT",
      departDelivery: "Thu, Aug 17 2023",
      departTo: "Cameroon",
      weight: 100,
      bookings: 0,
      carrier: "",
      status: "In Progress",
    },
    {
      id: 2,
      createdOn: "Thu, Aug 17 2023",
      warehouse: "Charles",
      routingType: "Crowded Shipper",
      departDelivery: "Thu, Aug 17 2023",
      departTo: "USA",
      weight: 100,
      bookings: 0,
      carrier: "UPS",
      status: "Done",
    },
    {
      id: 3,
      createdOn: "Thu, Aug 17 2023",
      warehouse: "Denish",
      routingType: "POSTPAL FWD",
      departDelivery: "Thu, Aug 17 2023",
      departTo: "India",
      weight: 250,
      bookings: 0,
      carrier: "FedEx",
      status: "Done",
    },
    {
      ide: 4,
      createdOn: "Thu, Aug 17 2023",
      warehouse: "Prayank",
      routingType: "Direct",
      departDelivery: "Thu, Aug 17 2023",
      departTo: "india",
      weight: 200,
      bookings: 0,
      carrier: "UPS",
      status: "In Progress",
    },
  ];

  const menuOptions = useMemo(
    () => [
      {
        id: "Edit",
        iconName: "mdi:square-edit-outline",
        actionName: "Edit",
        // redirectUrl:'/systems/route-partner/addNew',
        // onClickHandle: (row) => {
        //   // console.log("id in edit", row);
        //   //   navigate("/shipping/route-partner/addNew", {
        //   //     state: { id: row?.id },
        //   //   });
        //   openAddDeal(row);
        // },
      },
      {
        id: "Delete",
        iconName: "material-symbols:delete-rounded",
        actionName: "Delete",
        // onClickHandle: (row) => {
        //   setConfirmationModalState((prev) => ({
        //     showModal: true,
        //     dealId: row?.id,
        //   }));
        // },
      },
      {
        id: "view-details",
        iconName: "ic:baseline-remove-red-eye",
        actionName: "View Details",
        onClickHandle: (row) => {
          navigation(`/shipping/shipping-service/view/${row?.id}`);
        },
      },
    ],
    []
  );
  const adminColumns = generateShippingServiceColumns(menuOptions);

  const filteredRows = shippingServiceData?.filter((row) => {
    const includesTerm = row.warehouse
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
              onClick={() => navigation("addNew")}
            >
              Add Shipping Source
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
    </>
  );
}
