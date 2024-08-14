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

export default function BrandOverview({ brandDetails }) {
  // console.log(brandDetails, "brandDetails");
  const tableData = [
    {
      label: "Brand Name",
      value: brandDetails?.brandName,
    },
    {
      label: "Currency",
      value: brandDetails?.brandCurrency,
    },
    {
      label: "Category",
      value: brandDetails?.brandCategory,
    },
    {
      label: "Partner",
      value: brandDetails?.integratedPartner,
    },
    {
      label: "Is Popular",
      value: brandDetails?.isPopular,
    },
    {
      label: "Saved Products",
      value: "-",
    },
    {
      label: "Followers",
      value: 0,
    },
    {
      label: "Deals",
      value: 0,
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
            <Typography>{brandDetails?.aboutBrand}</Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
