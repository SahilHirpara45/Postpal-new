import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import Edit from "../../../assets/svg/edit.svg";
import { Icon } from "@iconify/react/dist/iconify.js";
import EditPriceWeight from "./EditPriceWeight";

export default function ShippingServiceOverview() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const tableData = [
    {
      label: "Sevice ID",
      value: 600918,
    },
    {
      label: "Shipping Date",
      value: "Fri Oct 13 2023",
    },
    {
      label: "Shipping Route",
      value: "United States - India",
    },
    {
      label: "Route Type",
      value: "POSTPAL FWD",
    },
    {
      label: "Carrier",
      value: "UPS",
    },
    {
      label: "Warehouse",
      value: "1234 Yuma lane N Plymouth - 55446 United States",
    },
    {
      label: "Status",
      value: "In Progress",
    },
    {
      label: "Airway Bill",
      value: "In Testing",
    },
  ];

  const weightData = [
    {
      label: "Booked Weight",
      value: 0,
    },
    {
      label: "Available Weight",
      value: 150,
    },
  ];

  const priceData = [
    {
      label: "0lb - 5lb",
      value: 0,
    },
    {
      label: "6lb - 10lb",
      value: 150,
    },
    {
      label: "11lb - 25lb",
      value: 0,
    },
    {
      label: "26lb - above",
      value: 150,
    },
  ];

  return (
    <Box sx={{ flex: 1, backgroundColor: "white" }}>
      <Grid container spacing={0}>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <Box
            sx={{
              paddingX: "3%",
              paddingY: "3%",
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: "16px" }}>
              Details
            </Typography>
          </Box>
          <Box sx={{ paddingX: "2%" }}>
            <Box>
              <Paper
                sx={{
                  //   width: "70%",
                  overflow: "hidden",
                  border: "1px solid #E5E5E8",
                  borderRadius: "8px",
                }}
              >
                <TableContainer>
                  <Table stickyHeader aria-label="sticky table">
                    {tableData.map((item, index) => (
                      <TableRow sx={{ backgroundColor: "#FAFAFA" }}>
                        <TableCell
                          align="left"
                          sx={{
                            //   minWidth: column.minWidth,
                            lineHeight: "1.5 !important",
                            height: "10px !important",
                            fontWeight: 500,
                          }}
                        >
                          {item.label}
                        </TableCell>
                        <TableCell
                          align="left"
                          sx={{
                            //   minWidth: column.minWidth,
                            lineHeight: "1.5 !important",
                            height: "10px !important",
                            fontWeight: 500,
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Box
                              sx={{
                                backgroundColor:
                                  item.value === "In Progress"
                                    ? "#F2994A"
                                    : item.value === "In Testing"
                                    ? "#D04AF2"
                                    : "",
                                width: "fit-content",
                                color:
                                  (item.value === "In Progress" ||
                                    item.value === "In Testing") &&
                                  "#ffffff",
                                paddingX:
                                  (item.value === "In Progress" ||
                                    item.value === "In Testing") &&
                                  "8px",
                                paddingY:
                                  (item.value === "In Progress" ||
                                    item.value === "In Testing") &&
                                  "4px",
                              }}
                            >
                              {item.value}
                            </Box>
                            <Box sx={{ marginLeft: 1 }}>
                              {item.label === "Airway Bill" && (
                                <Icon
                                  icon="mdi:eye"
                                  width={20}
                                  height={20}
                                  style={{
                                    cursor: "pointer",
                                    color: "#481AA3",
                                    marginRight: 3,
                                  }}
                                />
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </Table>
                </TableContainer>
              </Paper>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <Box
            sx={{
              paddingX: "3%",
              paddingY: "3%",
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: "16px" }}>
              Price & Weight
            </Typography>
          </Box>
          <Box
            sx={{
              paddingBottom: "2%",
              paddingX: "3%",
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: "16px" }}>
              Weight
            </Typography>
          </Box>
          <Box sx={{ paddingX: "2%" }}>
            <Box>
              <Paper
                sx={{
                  //   width: "70%",
                  overflow: "hidden",
                  border: "1px solid #E5E5E8",
                  borderRadius: "8px",
                }}
              >
                <TableContainer>
                  <Table stickyHeader aria-label="sticky table">
                    {weightData.map((item, index) => (
                      <TableRow sx={{ backgroundColor: "#FAFAFA" }}>
                        <TableCell
                          align="left"
                          sx={{
                            //   minWidth: column.minWidth,
                            lineHeight: "1.5 !important",
                            height: "10px !important",
                            fontWeight: 500,
                          }}
                        >
                          {item.label}
                        </TableCell>
                        <TableCell
                          align="left"
                          sx={{
                            //   minWidth: column.minWidth,
                            lineHeight: "1.5 !important",
                            height: "10px !important",
                            fontWeight: 500,
                          }}
                        >
                          <Box>{item.value}</Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </Table>
                </TableContainer>
              </Paper>
            </Box>
          </Box>
          <Box
            sx={{
              paddingY: "2%",
              paddingX: "3%",
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: "16px" }}>
              Price
            </Typography>
          </Box>
          <Box sx={{ paddingX: "2%" }}>
            <Box>
              <Paper
                sx={{
                  //   width: "70%",
                  overflow: "hidden",
                  border: "1px solid #E5E5E8",
                  borderRadius: "8px",
                }}
              >
                <TableContainer>
                  <Table stickyHeader aria-label="sticky table">
                    {priceData.map((item, index) => (
                      <TableRow sx={{ backgroundColor: "#FAFAFA" }}>
                        <TableCell
                          align="left"
                          sx={{
                            //   minWidth: column.minWidth,
                            lineHeight: "1.5 !important",
                            height: "10px !important",
                            fontWeight: 500,
                          }}
                        >
                          {item.label}
                        </TableCell>
                        <TableCell
                          align="left"
                          sx={{
                            //   minWidth: column.minWidth,
                            lineHeight: "1.5 !important",
                            height: "10px !important",
                            fontWeight: 500,
                          }}
                        >
                          <Box>{item.value}</Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </Table>
                </TableContainer>
              </Paper>
            </Box>
          </Box>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "white",
              color: "#481AA3",
              marginLeft: "10px",
              borderRadius: "4px",
              boxShadow: "none",
              whiteSpace: "nowrap",
              marginTop: "10px",
              "&:hover": {
                outline: "none",
                color: "#481AA3",
                backgroundColor: "white", // Remove border color on focus
              },
            }}
            onClick={toggleDrawer}
          >
            {/* <img src={Edit} alt="edit_icon" /> */}
            <Icon
              icon="bx:edit"
              width={20}
              height={20}
              style={{ cursor: "pointer", color: "#481AA3", marginRight: 3 }}
            />
            Edit Details
          </Button>
        </Grid>
      </Grid>
      <EditPriceWeight open={drawerOpen} onClose={toggleDrawer} />
    </Box>
  );
}
