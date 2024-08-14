import {
  Box,
  Button,
  InputBase,
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
import filter from "../../../assets/svg/filter.svg";
import img from "../../../assets/svg/customer.svg";
import issue from "../../../assets/svg/issue.svg";
import React, { useEffect, useState } from "react";
import SimpleBar from "simplebar-react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import DataTableComponent from "../../../components/common/DataTable/DataTable";
import { issueColumns } from "./helper";

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

export default function Issues({ routePartnerDetails }) {
  const [searchValue, setSearchValue] = useState("");

  const [issueData, setIssueData] = useState([]);

  // console.log(routePartnerDetails, "routePartnerDetails");

  useEffect(() => {
    const querySnapshot = collection(db, "orderIssues");
    const q = query(
      querySnapshot,
      where("routePartnerId", "==", routePartnerDetails?.id)
    );
    let arr = [];

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      setIssueData([]);
      snapshot.forEach(async (d) => {
        if (d.data()?.userId) {
          const docRef = doc(db, "users", d.data()?.userId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            // console.log(docSnap.data(), "docSnap.data()");
            const obj = {
              createdAt: d.data()?.date,
              name: docSnap.data()?.name,
              orderId: d.data()?.orderId,
              issue: d.data()?.issue,
              userId: d.data()?.userId,
              routePartnerId: d.data()?.routePartnerId,
            };
            // console.log(obj, "objs");
            setIssueData((prev) => [...prev, obj]);
            arr.push(obj);
            // console.log(arr,"arr after obj");
          } else {
            console.log("No such document!");
          }
        }
      });

      // console.log(arr, "arr user data");
      // setIssueData(arr);
      // setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // console.log(issueData, "issueData");

  // const filteredRows = data?.filter((row) => {
  //   const includesTerm = row.customerName
  //     .toLowerCase()
  //     .includes(searchValue.toLowerCase());
  //   return includesTerm;
  // });

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

      {issueData && issueData.length > 0 && (
        <DataTableComponent
          data={issueData || []}
          columns={issueColumns}
          // searchHandler={searchHandler}
          // paginationHandler={paginationHandler}
          // pagination={pagination}
        />
      )}

      {/* {filteredRows.length > 0 && (
        <Box sx={{ display: "contents", height: "50vh" }}>
          <Paper
            sx={{
              width: "100%",
              height: "69vh",
              overflow: "hidden",
              border: "1px solid #E5E5E8",
              borderRadius: "4px",
            }}
          >
            <TableContainer sx={{ height: "62vh", overflow: "auto" }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead sx={{ backgroundColor: "#FAFAFA" }}>
                  {headCells.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{
                        minWidth:
                          // column.label === "Issue Details"
                          //   ? "400px"
                          //   : "240px",
                          column.label === "Customer Name" ||
                          "Date" ||
                          "Order Number" ||
                          "Customer Name"
                            ? "240px"
                            : "400px",
                        maxWidth: "400px",
                      }}
                      sx={{
                        textAlign: "left",
                        color: "#959BA1",
                        fontWeight: 500,
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableHead>
                <TableBody>
                  {filteredRows?.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell
                        align="left"
                        sx={{
                          //   minWidth: column.minWidth,
                          lineHeight: "1.5 !important",
                          height: "10px !important",
                          fontWeight: 500,
                        }}
                      >
                        {row.date}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          // minWidth: column.minWidth,
                          lineHeight: "1.5 !important",
                          height: "10px !important",
                          fontWeight: 500,
                        }}
                      >
                        {row.orderNumber}
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
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                          }}
                        >
                          <img src={row.img} alt="remove" />
                          <Box sx={{ marginLeft: "20px" }}>
                            {row.customerName}
                          </Box>
                        </Box>
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
                        {row.issueDetails}
                      </TableCell>
                    </TableRow>
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
      )} */}
      {issueData && issueData.length <= 0 && (
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
    </>
  );
}
