import {
  Box,
  Grid,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import warning from "../../../assets/svg/warning.svg";
import approve from "../../../assets/svg/approve.svg";

export default function UserOverview({ userDetails }) {
  const tableData = [
    {
      label: "Email ID",
      value: userDetails?.emailId,
      status: userDetails?.emailVerified,
    },
    {
      label: "Phone No",
      value: "+" + userDetails?.phoneCode + " " + userDetails?.phoneNumber,
      status: userDetails?.phoneVerified,
    },
    {
      label: "Country",
      value: userDetails?.country,
    },
    {
      label: "Status",
      value: userDetails?.status && (
        <span
          style={{
            fontSize: "14px",
            fontWeight: 500,
            padding: "4px 8px",
            backgroundColor:
              userDetails.status === "Active" ? "#2DC58C" : "#EB5757",
            borderRadius: "2px",
            color: "white",
          }}
        >
          {userDetails.status}
        </span>
      ),
    },
    {
      label: "Joining Date",
      value: new Date(userDetails?.createdAt?.seconds * 1000).toDateString(),
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
                  width: "70%",
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
                          <Typography sx={{ fontSize: "14px" }}>
                            {item.label}
                          </Typography>
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
                            <Typography
                              sx={{ marginRight: "5px", fontSize: "14px" }}
                            >
                              {item.value}
                            </Typography>
                            {item.label === "Email ID" && (
                              <img
                                src={item.status ? approve : warning}
                                alt="status"
                              />
                            )}
                            {item.label === "Phone No" && (
                              <img
                                src={item.status ? approve : warning}
                                alt="status"
                              />
                            )}
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
              About
            </Typography>
          </Box>
          <Box sx={{ marginTop: "20px", paddingX: "3%" }}>
            <Typography>{}</Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
