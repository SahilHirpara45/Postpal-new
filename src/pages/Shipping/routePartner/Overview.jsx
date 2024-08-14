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
import React, { useContext } from "react";
import SidebarContext from "../../../context/SidebarContext";
import { useNavigate } from "react-router-dom";

export default function Overview({ routePartnerDetails }) {
  const { open } = useContext(SidebarContext);

  const navigate = useNavigate();

  const tableData = [
    {
      label: "PartnerID",
      value: routePartnerDetails?.id,
    },
    {
      label: "Contact Person",
      value: routePartnerDetails?.contactPersonName,
    },
    {
      label: "Email",
      value: routePartnerDetails?.emailId,
    },
    {
      label: "Phone Number",
      value: routePartnerDetails?.contactNumber,
    },
    {
      label: "Joining Date",
      value: new Date(
        routePartnerDetails?.createdAt?.seconds * 1000
      ).toDateString(),
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
                          {item.value}
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
            <Typography>{routePartnerDetails?.about}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              onClick={() =>
                navigate("/shipping/route-partner/addNew", {
                  state: { id: routePartnerDetails?.id },
                })
              }
              sx={{
                backgroundColor: "white",
                color: "black",
                marginLeft: "10px",
                border: "1px solid #E5E5E8",
                borderRadius: "4px",
                boxShadow: "none",
                whiteSpace: "nowrap",
                marginTop: "20px",
                "&:hover": {
                  outline: "none",
                  color: "black",
                  backgroundColor: "white", // Remove border color on focus
                },
              }}
            >
              Edit Details
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
