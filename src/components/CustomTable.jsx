import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import TableItemCustomsIQ from "./TableItemCustomsIQ";
import TableItemAddOns from "./TableItemAddOns";
import postpalLogo from "../assets/svg/logo_blue.svg";

function CustomTable({
  headCells,
  rows,
  setActiveDataName,
  setActiveDataImage,
  packageActiveData,
  userActiveData,
  packageCollection,
  shipmentCollection,
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [drawerForCustomIQ, setDrawerOpenForCustomIQ] = useState(false);
  const [labelForCustomIQDrawer, setLabelForCustomIQDrawer] = useState("");
  const [drawerForAddons, setDrawerOpenForAddOns] = useState(false);
  const [dataForAddOnDrawer, setdataForAddOnDrawer] = useState(null);
  const [imageForCustomIQDrawer, setImageForCustomIQDrawer] = useState("");

  // console.log("CustomTable", rows);
  console.log(userActiveData, "userActiveData in CustomTable");
  // console.log(
  //   packageCollection,
  //   shipmentCollection,
  //   "shipmentCollection in CustomTable"
  // );

  const toggleDrawerCustomIQ = (data, img) => {
    if (drawerForCustomIQ) {
      setLabelForCustomIQDrawer("");
      setDrawerOpenForCustomIQ(!drawerForCustomIQ);
    } else {
      setLabelForCustomIQDrawer(data);
      setDrawerOpenForCustomIQ(!drawerForCustomIQ);
    }
  };

  const toggleDrawerAddOns = (data, img) => {
    if (drawerForAddons) {
      setdataForAddOnDrawer("");
      setDrawerOpenForAddOns(!drawerForAddons);
    } else {
      setdataForAddOnDrawer(data);
      setDrawerOpenForAddOns(!drawerForAddons);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  console.log(rows, "rows in in in");
  return (
    <>
      <Box>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {headCells.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                      sx={{
                        textAlign:
                          column.label === "No" || column.label === "Qty"
                            ? "center"
                            : "left",
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <>
                    <TableRow key={row.no}>
                      {/* Render other table cells */}
                      <TableCell
                        align="center"
                        sx={{
                          //   minWidth: column.minWidth,
                          lineHeight: "10px !important",
                          height: "10px !important",
                        }}
                      >
                        {row.no}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          //   minWidth: column.minWidth,
                          lineHeight: "10px !important",
                          height: "10px !important",
                          cursor: "pointer",
                        }}
                        onClick={() => setActiveDataName(row?.itemId)}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          {row?.item_img ? (
                            <img
                              src={row?.item_img}
                              alt={"img"}
                              style={{
                                width: "28px",
                                height: "28px",
                                marginRight: "10px",
                              }}
                            />
                          ) : (
                            <img
                              src={postpalLogo}
                              alt={"postpalLogo"}
                              style={{
                                width: "28px",
                                height: "28px",
                                marginRight: "10px",
                              }}
                            />
                          )}
                          {row.name}
                          <img
                            src={row?.path}
                            alt={""}
                            style={{
                              width: "20px",
                              height: "20px",
                              marginLeft: "10px",
                            }}
                          />
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          //   minWidth: column.minWidth,
                          lineHeight: "10px !important",
                          height: "10px !important",
                        }}
                      >
                        {row.qty}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          lineHeight: "10px !important",
                          height: "10px !important",
                          cursor: "pointer",
                        }}
                        onClick={() => toggleDrawerAddOns(row)} // onClick event for Add-ons
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {row.addon}
                          <img
                            src={row.path}
                            alt={row.addon}
                            style={{ width: "20px", marginLeft: "10px" }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          //   minWidth: column.minWidth,
                          lineHeight: "10px !important",
                          height: "10px !important",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          toggleDrawerCustomIQ(row.name, row.item_img)
                        }
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {row.customiq}
                          <img
                            src={row.path}
                            alt={row.customiq}
                            style={{ width: "20px", marginLeft: "10px" }}
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                    <TableItemCustomsIQ
                      title={labelForCustomIQDrawer}
                      img={imageForCustomIQDrawer}
                      open={drawerForCustomIQ}
                      onClose={toggleDrawerCustomIQ}
                      selectedRows={row}
                    />
                  </>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              ".MuiTablePagination-toolbar": {
                maxHeight: "50px",
                overflow: "hidden",
              },
            }}
          />
        </Paper>
      </Box>
      <TableItemAddOns
        data={dataForAddOnDrawer}
        open={drawerForAddons}
        onClose={toggleDrawerAddOns}
        packageActiveData={packageActiveData}
        userActiveData={userActiveData}
        packageCollection={packageCollection}
        shipmentCollection={shipmentCollection}
      />
    </>
  );
}

export default CustomTable;
