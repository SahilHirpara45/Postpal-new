import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Modal,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TablePagination,
  Pagination,
} from "@mui/material";
import DataTable from "react-data-table-component";
import { CloseRounded } from "@mui/icons-material";

const expandedComponent = ({ data }) => {
  return (
    <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
      <Typography variant="body2">
        <strong>Name:</strong> {data.name}
      </Typography>
      <Typography variant="body2">
        <strong>Age:</strong> {data.age}
      </Typography>
      <Typography variant="body2">
        <strong>Position:</strong> {data.position}
      </Typography>
      <Typography variant="body2">
        <strong>Company:</strong> {data.company}
      </Typography>
      <Typography variant="body2">
        <strong>Start Date:</strong> {data.startDate}
      </Typography>
      <Typography variant="body2">
        <strong>Salary:</strong> {data.salary}
      </Typography>
    </Box>
  );
};

const customCheckbox = React.forwardRef(({ onClick, ...rest }, ref) => (
  <FormControl>
    <input
      type="checkbox"
      className="form-check-input"
      ref={ref}
      onClick={onClick}
      {...rest}
    />
  </FormControl>
));

function DataTableComponent({
  data,
  columns,
  searchHandler,
  className,
  expandableRows,
  actions,
  selectableRows,
  ...props
}) {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowCount, setRowCount] = useState(data.length);
  const [mobileView, setMobileView] = useState(false);

  useEffect(() => {
    setRowCount(data.length);
    setCurrentPage(0);
  }, [data]);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage - 1); // Pagination component uses 1-based index
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0); // Reset to first page when rows per page changes
  };

  const viewChange = () => {
    if (window.innerWidth < 960 && expandableRows) {
      setMobileView(true);
    } else {
      setMobileView(false);
    }
  };

  useEffect(() => {
    window.addEventListener("load", viewChange);
    window.addEventListener("resize", viewChange);
    return () => {
      window.removeEventListener("resize", viewChange);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box sx={{}}>
      <DataTable
        columns={columns}
        data={data.slice(
          currentPage * rowsPerPage,
          (currentPage + 1) * rowsPerPage
        )}
        customStyles={{
          headRow: {
            style: {
              backgroundColor: "#f5f5f5", // Similar to data-table-head-light
              color: "#959BA1",
              borderBottom: "1px solid #E5E5E8",
            },
          },
          rows: {
            style: {
              // display: 'table-row', // Ensure rows are displayed as table rows for responsive design
              padding: "17px 0",
              borderBottom: "1px solid #E5E5E8",
            },
          },
        }}
        noDataComponent={<Box sx={{ p: 2 }}>There are no records found.</Box>}
        sortIcon={<div className="data-table-sorter"></div>}
        // pagination
        expandableRowsComponent={expandedComponent}
        expandableRows={mobileView}
        selectableRows={selectableRows}
        selectableRowsComponent={customCheckbox}
      />
      <Box
        sx={{
          mt: 2,
          mx: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Pagination
          variant="outlined"
          shape="rounded"
          count={Math.ceil(rowCount / rowsPerPage)}
          page={currentPage + 1} // Pagination component uses 1-based index
          onChange={handlePageChange}
        />
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 100]}
          component="div"
          count={rowCount}
          rowsPerPage={rowsPerPage}
          page={currentPage} // TablePagination uses zero-based index
          onPageChange={(event, newPage) =>
            handlePageChange(event, newPage + 1)
          }
          onRowsPerPageChange={handleRowsPerPageChange}
          sx={{
            ".MuiTablePagination-toolbar": {
              maxHeight: "50px",
              overflow: "hidden",
            },
          }}
        />
      </Box>
    </Box>
  );
}

export default DataTableComponent;
