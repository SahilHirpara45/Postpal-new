import {
  Autocomplete,
  Box,
  FormControl,
  IconButton,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import remove from "../../../assets/svg/remove.svg";
import add_new from "../../../assets/svg/add.svg";
import search from "../../../assets/svg/search.svg";
import AddNewServices from "./AddNewServices";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { toast } from "react-toastify";
import { getAllCourier } from "./APIService";
import { Field, Form, Formik, useFormik } from "formik";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { update } from "firebase/database";
import { useSelector } from "react-redux";

const initialValues = {
  labelMarkupRate: 0,
  quoteMarkupRate: 0,
  insuranceMarkupRate: 0,
};

function IntegrationTable({ headCells, rows = [], apiKey }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchField, setSearchField] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [quoteMarkupFilter, setQuoteMarkupFilter] = useState("");
  const [labelMarkupFilter, setLabelMarkupFilter] = useState("");
  const [insuranceMarkupFilter, setInsuranceMarkupFilter] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [allCourierData, setAllCourierData] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [editingCell, setEditingCell] = useState({
    row: null,
    field: null,
  });
  const userData = useSelector((state) => state.auth.value);

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const handleSearchCourier = async (selService) => {
    if (!selService) {
      setAllServices([]);
      return;
    }
    const data = await getAllCourier(apiKey, selService, "");
    // console.log(data, "data");
    if (data?.couriers?.length > 0) {
      const uniqueCourierNames = {};
      data.couriers.forEach((courier) => {
        uniqueCourierNames[courier.service_name] = courier;
      });

      const uniqueCourierArray = Object.values(uniqueCourierNames);
      // console.log(uniqueCourierArray, "uniqueCourierArray");

      const addIntialVal = uniqueCourierArray?.map(
        (courier) => courier.service_name
      );
      // console.log(addIntialVal, "addIntialVal");
      setAllCourierData(data?.couriers);
      setAllServices(addIntialVal);
    } else {
      toast.warn("No courier service found");
      console.log(data?.error?.message);
      toast.error(data?.error?.message);
    }
  };

  // console.log(allServices, "allServices data");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleServiceNameChange = (event, row) => {
    row.serviceName = event.target.value;
  };

  const handleRowHover = (index) => {
    setHoveredRow(index);
  };

  const handleSearchChange = (event, newValue) => {
    setSearchValue(newValue || "");
    if (!newValue || "") {
      setSelectedService(null);
    }
    handleSearchCourier(newValue);
  };
  // console.log(allServices, "allServices data");

  const handleServiceChange = (event, value) => {
    setSelectedService(value);
    // setPage(0);
  };

  const handleQuoteMarkupFilterChange = (event) => {
    setQuoteMarkupFilter(event.target.value);
    // setPage(0); // Reset page to the first page when filter value changes
  };

  const handleLabelMarkupFilterChange = (event) => {
    setLabelMarkupFilter(event.target.value);
    // setPage(0); // Reset page to the first page when filter value changes
  };

  const handleInsuranceMarkupFilterChange = (event) => {
    setInsuranceMarkupFilter(event.target.value);
    // setPage(0); // Reset page to the first page when filter value changes
  };

  // const filteredRows = rows.filter((row) => {
  //   const includesTerm = row.courier
  //     .toLowerCase()
  //     .includes(searchValue.toLowerCase());
  //   console.log(`Row: ${row.courier}, Includes Term: ${includesTerm}`);
  //   return includesTerm;
  // });

  const filteredRows = rows?.filter((row) => {
    const includesTerm = row.courier
      .toLowerCase()
      .includes(searchValue.toLowerCase());
    const matchesQuoteMarkup = row.quote_markup_rate
      .toString()
      .includes(quoteMarkupFilter);
    const matchesLabelMarkup = row.label_markup_rate
      .toString()
      .includes(labelMarkupFilter);
    const matchesInsuranceMarkup = row.insurance_markup_rate
      .toString()
      .includes(insuranceMarkupFilter);
    const matchesService =
      !selectedService || row.serviceName === selectedService;

    return (
      includesTerm &&
      (quoteMarkupFilter === "" || matchesQuoteMarkup) &&
      (labelMarkupFilter === "" || matchesLabelMarkup) &&
      (insuranceMarkupFilter === "" || matchesInsuranceMarkup) &&
      matchesService
    );
  });

  const couriers = filteredRows.map((row) => row.courier);
  const serviceNames = filteredRows.map((row) => row.serviceName);
  // console.log(couriers);

  const uniqueCouriers = Array.from(
    new Set(rows?.map((row) => row.courier))
  ).map((courier, index) => courier);
  const uniqueServiceNames = Array.from(
    new Set(rows?.map((row) => row.serviceName))
  ).map((serviceName, index) => serviceName);

  // console.log(uniqueCouriers);

  // console.log("Filtered Rows:", filteredRows);
  // console.log(rows, "rows in table");

  const handleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleDelete = async (row, e) => {
    console.log(row, "row");
    e.stopPropagation();
    try {
      const q = query(
        collection(db, "couriers"),
        where("umbrella_name", "==", row?.courier),
        where("adminId", "==", userData?.id),
        where("service_name", "==", row?.serviceName)
      );
      const querySnapshot = await getDocs(q);


      const deletePromises = querySnapshot.docs.map((document) =>
        deleteDoc(doc(db, "couriers", document.id))
      );

      await Promise.all(deletePromises);
      toast.success("Service deleted successfully!");
    } catch (error) {
      console.error("Error removing documents: ", error);
      toast.error("Failed to delete Service!");
    }
  };

  const handleEditClick = (rowIndex, field) => {
    setEditingCell({
      row: rowIndex,
      field: field,
    });
  };

  const handleSaveEdit = (e, value, id, fieldKey) => {
    e.stopPropagation();
    // console.log("Saved value:", value, id, fieldKey);
    // Update state or database with the new value
    updateDoc(doc(db, "couriers", id), {
      [fieldKey]: value,
    })
      .then(() => {
        toast.success("Saved successfully!");
        setEditingCell({ row: null, field: null, value: "" });
      })
      .catch((error) => {
        console.error("Error updating document: ", error);
        toast.error("Failed to save!");
      });
  };

  const handleCancelEdit = (e) => {
    e.stopPropagation();
    setEditingCell({ row: null, field: null, value: "" });
  };

  // console.log(editingCell, "Editing Cell");

  return (
    <Box>
      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          border: "1px solid #E5E5E8",
          borderRadius: "4px",
          marginTop: "40px",
        }}
      >
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableRow sx={{ backgroundColor: "#FAFAFA" }}>
              {headCells.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    minWidth:
                      // column.label === "Quote Markup Rate" ||
                      // "Label Markup Rate" ||
                      // "Insurance Markup Rate"
                      //   ? "190px"
                      //   : "240px",
                      column.label === "No"
                        ? "50px"
                        : column.label === "Quote Markup Rate" ||
                          "Label Markup Rate" ||
                          "Insurance Markup Rate"
                        ? "190px"
                        : "240px",
                  }}
                  sx={{
                    textAlign: "left",
                    border: "1px solid #E5E5E8",
                    color: "#959BA1",
                    fontWeight: 500,
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
            <TableBody>
              <TableRow key="add_new">
                <TableCell
                  align="left"
                  sx={{
                    lineHeight: "10px !important",
                    height: "10px !important",
                    border: "1px solid #E5E5E8",
                    borderRight: "1px solid #E5E5E8",
                    fontWeight: 500,
                  }}
                >
                  <Box
                    onClick={() => handleDrawer()}
                    sx={{ cursor: "pointer" }}
                  >
                    <Tooltip title="Add New Service" sx={{ padding: "0px" }}>
                      <IconButton>
                        <img src={add_new} alt="add_new_service" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    lineHeight: "10px !important",
                    height: "10px !important",
                    border: "1px solid #E5E5E8",
                    borderRight: "1px solid #E5E5E8",
                    fontWeight: 500,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "left",
                      alignItems: "center",
                    }}
                  >
                    <>
                      {/* <img src={search} alt="search" /> */}
                      <Autocomplete
                        options={uniqueCouriers}
                        getOptionLabel={(option) => option}
                        value={searchValue}
                        onChange={handleSearchChange}
                        isOptionEqualToValue={(option, value) =>
                          option === value
                        }
                        size="small"
                        sx={{
                          width: "100%",
                          margin: "0px",
                          ".MuiTextField-root": {
                            margin: "0px",
                          },
                          // ".MuiOutlinedInput-notchedOutline": {
                          //   border: "none",
                          // },
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            margin="normal"
                            placeholder="Search curier..."
                          />
                        )}
                      />
                    </>
                  </Box>
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    lineHeight: "10px !important",
                    height: "10px !important",
                    borderLeft: "1px solid #E5E5E8",
                    border: "1px solid #E5E5E8",
                    borderRight: "1px solid #E5E5E8",
                    fontWeight: 500,
                  }}
                >
                  {/* <Box
                    sx={{
                      display: "flex",
                      justifyContent: "left",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <Typography sx={{ color: "#481AA3", fontWeight: 600 }}>
                      Add New Service
                    </Typography>
                  </Box> */}
                  <Autocomplete
                    options={allServices}
                    getOptionLabel={(option) => option}
                    value={selectedService}
                    onChange={handleServiceChange}
                    disabled={allServices.length === 0}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        size="small"
                        placeholder="Select Service"
                      />
                    )}
                  />
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    lineHeight: "10px !important",
                    height: "10px !important",
                    border: "1px solid #E5E5E8",
                    borderRight: "1px solid #E5E5E8",
                    fontWeight: 500,
                  }}
                >
                  <TextField
                    type="number"
                    variant="outlined"
                    autoComplete="off"
                    size="small"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 1,
                    }}
                    placeholder="Search Markup Rate"
                    onChange={(e) => handleQuoteMarkupFilterChange(e)}
                  />
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    lineHeight: "10px !important",
                    height: "10px !important",
                    border: "1px solid #E5E5E8",
                    borderRight: "1px solid #E5E5E8",
                    fontWeight: 500,
                  }}
                >
                  <TextField
                    type="number"
                    variant="outlined"
                    size="small"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 1,
                    }}
                    placeholder="Search Markup Rate"
                    onChange={(e) => handleLabelMarkupFilterChange(e)}
                  />
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    lineHeight: "10px !important",
                    height: "10px !important",
                    borderRight: "1px solid #E5E5E8",
                    border: "1px solid #E5E5E8",
                    fontWeight: 500,
                  }}
                >
                  <TextField
                    type="number"
                    variant="outlined"
                    size="small"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 1,
                    }}
                    placeholder="Search Markup Rate"
                    onChange={(e) => handleInsuranceMarkupFilterChange(e)}
                  />
                </TableCell>
              </TableRow>
              {filteredRows.length > 0 ? (
                filteredRows.map((row, index) => {
                  // const isEditing = editingRow === row.no;
                  return (
                    <TableRow
                      key={row.no}
                      onMouseEnter={() => handleRowHover(index)}
                      onMouseLeave={() => handleRowHover(null)}
                    >
                      <TableCell
                        align="left"
                        sx={{
                          //   minWidth: column.minWidth,
                          lineHeight: "10px !important",
                          height: "10px !important",
                          border: "1px solid #E5E5E8",
                          fontWeight: 500,
                        }}
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          lineHeight: "10px !important",
                          height: "10px !important",
                          border: "1px solid #E5E5E8",
                          fontWeight: 500,
                        }}
                      >
                        {row.courier}
                      </TableCell>
                      {/* <TableCell
                      align="left"
                      sx={{
                        // minWidth: column.minWidth,
                        lineHeight: "10px !important",
                        height: "10px !important",
                        cursor: "pointer",
                        border: "1px solid #E5E5E8",
                        fontWeight: 500,
                      }}
                    >
                      <Select
                        value={row.serviceName}
                        onChange={(event) =>
                          handleServiceNameChange(event, row)
                        }
                        displayEmpty
                        sx={{
                          fontWeight: 500,
                          width: "100%",
                          border: "none",
                          "& .MuiSelect-icon": {
                            display: "none",
                          },
                          "&:hover": {
                            "& .MuiSelect-icon": {
                              display: "flex",
                            },
                          },
                          ".MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          ".MuiSelect-select": {
                            padding: "0px",
                          },
                        }}
                      >
                        {serviceNames.map((serviceName) => (
                          <MenuItem
                            key={serviceName.index}
                            value={serviceName.value}
                          >
                            {serviceName.value}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell> */}
                      <TableCell
                        align="left"
                        sx={{
                          lineHeight: "10px !important",
                          height: "10px !important",
                          border: "1px solid #E5E5E8",
                          fontWeight: 500,
                        }}
                      >
                        {row.serviceName}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          border: "1px solid #E5E5E8",
                          fontWeight: 500,
                          padding:
                            editingCell.row === index &&
                            editingCell.field === "quoteMarkupRate"
                              ? "4px"
                              : "16px",
                        }}
                        onClick={() =>
                          handleEditClick(index, "quoteMarkupRate")
                        }
                      >
                        {editingCell.row === index &&
                        editingCell.field === "quoteMarkupRate" ? (
                          <Box display="flex" alignItems="center">
                            <OutlinedInput
                              type="number"
                              size="small"
                              name="quoteMarkupRate"
                              defaultValue={row.quote_markup_rate}
                              // value={formik.values.quoteMarkupRate}
                              onChange={formik.handleChange}
                              sx={{ width: "100%" }}
                            />
                            <IconButton
                              onClick={(e) =>
                                handleSaveEdit(
                                  e,
                                  formik.values.quoteMarkupRate,
                                  row?.id,
                                  "quote_markup_rate"
                                )
                              }
                              sx={{ padding: "4px" }}
                            >
                              <CheckIcon color="primary" />
                            </IconButton>
                            <IconButton
                              onClick={(e) => handleCancelEdit(e)}
                              sx={{ padding: "4px" }}
                            >
                              <CloseIcon color="secondary" />
                            </IconButton>
                          </Box>
                        ) : (
                          row.quote_markup_rate
                        )}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          border: "1px solid #E5E5E8",
                          fontWeight: 500,
                          padding:
                            editingCell.row === index &&
                            editingCell.field === "labelMarkupRate"
                              ? "4px"
                              : "16px",
                        }}
                        onClick={() =>
                          handleEditClick(index, "labelMarkupRate")
                        }
                      >
                        {editingCell.row === index &&
                        editingCell.field === "labelMarkupRate" ? (
                          <Box display="flex" alignItems="center">
                            <OutlinedInput
                              type="number"
                              size="small"
                              name="labelMarkupRate"
                              defaultValue={row.label_markup_rate}
                              // value={formik.values.labelMarkupRate}
                              onChange={formik.handleChange}
                              sx={{ width: "100%" }}
                            />
                            <IconButton
                              onClick={(e) =>
                                handleSaveEdit(
                                  e,
                                  formik.values.labelMarkupRate,
                                  row?.id,
                                  "label_markup_rate"
                                )
                              }
                              sx={{ padding: "4px" }}
                            >
                              <CheckIcon color="primary" />
                            </IconButton>
                            <IconButton
                              onClick={(e) => handleCancelEdit(e)}
                              sx={{ padding: "4px" }}
                            >
                              <CloseIcon color="secondary" />
                            </IconButton>
                          </Box>
                        ) : (
                          row.label_markup_rate
                        )}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          border: "1px solid #E5E5E8",
                          fontWeight: 500,
                          padding:
                            editingCell.row === index &&
                            editingCell.field === "insuranceMarkupRate"
                              ? "4px"
                              : "14px",
                        }}
                        onClick={() =>
                          handleEditClick(index, "insuranceMarkupRate")
                        }
                      >
                        {editingCell.row === index &&
                        editingCell.field === "insuranceMarkupRate" ? (
                          <Box display="flex" alignItems="center">
                            <OutlinedInput
                              type="number"
                              size="small"
                              name="insuranceMarkupRate"
                              defaultValue={row.insurance_markup_rate}
                              // value={formik.values.insuranceMarkupRate}
                              onChange={formik.handleChange}
                              sx={{ width: "100%" }}
                            />
                            <IconButton
                              onClick={(e) =>
                                handleSaveEdit(
                                  e,
                                  formik.values.insuranceMarkupRate,
                                  row?.id,
                                  "insurance_markup_rate"
                                )
                              }
                              sx={{ padding: "4px" }}
                            >
                              <CheckIcon color="primary" />
                            </IconButton>
                            <IconButton
                              onClick={(e) => handleCancelEdit(e)}
                              sx={{ padding: "4px" }}
                            >
                              <CloseIcon color="secondary" />
                            </IconButton>
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <span>{row.insurance_markup_rate}</span>
                            {hoveredRow === index && (
                              <IconButton
                                onClick={(e) => handleDelete(row, e)}
                                sx={{
                                  padding: "0px",
                                  height: "20px",
                                  width: "20px",
                                }}
                              >
                                <img src={remove} alt="edit_icon" />
                              </IconButton>
                            )}
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={headCells.length} align="center">
                    Data not found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <TablePagination
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
        /> */}
      </Paper>
      <AddNewServices
        open={drawerOpen}
        onClose={handleDrawer}
        apiKey={apiKey}
      />
    </Box>
  );
}

export default IntegrationTable;
