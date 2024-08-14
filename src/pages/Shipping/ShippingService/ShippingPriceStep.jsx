import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  OutlinedInput,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import SimpleBar from "simplebar-react";

export default function ShippingPriceStep() {
  const [checked, setChecked] = useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const add_customs = [
    "Delivery Duty Paid",
    "Friendly Customs",
    "Delivery Duty Unpaid",
    "Automated Customs",
    "Ship every Monday",
    "Ship every Tuesday",
    "Ship every Wednesday",
    "Ship every Thrusday",
    "Ship every Saturday",
    "Ship every Sunday",
  ];

  const [checkedCustoms, setCheckedCustoms] = useState(
    add_customs.reduce((acc, item) => ({ ...acc, [item]: false }), {})
  );

  const handleCustomsChange = (item) => (event) => {
    setCheckedCustoms((prevChecked) => ({
      ...prevChecked,
      [item]: event.target.checked,
    }));
  };

  return (
    <SimpleBar
      forceVisible="x"
      autoHide={true}
      style={{
        overflowX: "auto",
        maxHeight: "calc(100vh - 356px)",
        minHeight: "calc(100vh - 356)",
      }}
      className="custom-scrollbar"
    >
      <Box
        sx={{
          width: "50%",
          margin: "0 auto",
          padding: "20px",
          backgroundColor: "white",
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: "20px" }}>
            For each weight, enter cost & shipping per pound (lb)
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ border: "1px solid #E5E5E8" }}></TableCell>
                <TableCell
                  sx={{
                    color: "#959BA1",
                    fontWeight: 500,
                    border: "1px solid #E5E5E8",
                  }}
                >
                  Min. Weight (lb)
                </TableCell>
                <TableCell
                  sx={{
                    color: "#959BA1",
                    fontWeight: 500,
                    border: "1px solid #E5E5E8",
                  }}
                >
                  Max. Weight (lb)
                </TableCell>
                <TableCell
                  sx={{
                    color: "#959BA1",
                    fontWeight: 500,
                    border: "1px solid #E5E5E8",
                  }}
                >
                  Price/lb ($)
                </TableCell>
                <TableCell
                  sx={{
                    color: "#959BA1",
                    fontWeight: 500,
                    border: "1px solid #E5E5E8",
                  }}
                >
                  Buy-in
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ border: "1px solid #E5E5E8" }}>
                    <Checkbox
                      sx={{ padding: 0 }}
                      checked={checked}
                      onChange={handleChange}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  </TableCell>
                  {Array(4)
                    .fill()
                    .map((_, i) => (
                      <TableCell key={i} sx={{ border: "1px solid #E5E5E8" }}>
                        {/* 0 */}
                        <TextField
                          id="standard-basic"
                          variant="standard"
                          sx={{
                            "& .MuiInput-underline:before": {
                              borderBottom: "none",
                            },
                            "& .MuiInput-underline:after": {
                              borderBottom: "none",
                            },
                          }}
                        />
                      </TableCell>
                    ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Typography sx={{ fontWeight: 500, fontSize: "17px", marginTop: 2 }}>
            Buy-in-rate Range $0 - $4
          </Typography>
        </Box>
        <Box>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "20px",
              marginTop: 2,
            }}
          >
            Max lb/package
          </Typography>
          <Box display="flex" flexWrap="wrap">
            <FormControl
              sx={{
                m: 1,
                minHeight: "35px",
                width: "23vw",
                marginX: "0px",
              }}
              size="small"
            >
              <OutlinedInput
                type="text"
                name="manualSortFee"
                sx={{
                  marginX: "0px",
                  ".MuiOutlinedInput-notchedOutline": {
                    width: "23vw",
                  },
                }}
                startAdornment={
                  <InputAdornment position="start">lb</InputAdornment>
                }
              />
            </FormControl>
          </Box>
        </Box>
        <Box>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "20px",
              marginTop: 2,
            }}
          >
            Additional lb/package
          </Typography>
          <Box display="flex" flexWrap="wrap">
            <FormControl
              sx={{
                m: 1,
                minHeight: "35px",
                width: "23vw",
                marginX: "0px",
              }}
              size="small"
            >
              <OutlinedInput
                type="text"
                name="manualSortFee"
                sx={{
                  marginX: "0px",
                  ".MuiOutlinedInput-notchedOutline": {
                    width: "23vw",
                  },
                }}
                startAdornment={
                  <InputAdornment position="start">$</InputAdornment>
                }
              />
            </FormControl>
          </Box>
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: "20px", marginTop: 2 }}>
            Add Customs
          </Typography>
          <Box display="flex" flexWrap="wrap">
            {add_customs.map((item) => (
              <Box key={item} width="50%" display="flex" alignItems="center">
                <FormControlLabel
                  label={item}
                  control={
                    <Checkbox
                      checked={checkedCustoms[item] || false}
                      onChange={handleCustomsChange(item)}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  }
                />
              </Box>
            ))}
          </Box>
        </Box>
        <Box>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "20px",
              marginTop: 2,
            }}
          >
            Basic Insurance
          </Typography>
          <Box display="flex" flexWrap="wrap">
            <FormControl
              sx={{
                m: 1,
                minHeight: "35px",
                width: "23vw",
                marginX: "0px",
              }}
              size="small"
            >
              <OutlinedInput
                type="text"
                name="manualSortFee"
                sx={{
                  marginX: "0px",
                  ".MuiOutlinedInput-notchedOutline": {
                    width: "23vw",
                  },
                }}
                startAdornment={
                  <InputAdornment position="start">$</InputAdornment>
                }
              />
            </FormControl>
          </Box>
        </Box>
        <Box>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "20px",
              marginTop: 2,
            }}
          >
            Tracking
          </Typography>
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="postShipping.shippingStatusUpdates"
              row
            >
              <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="No" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Box>
        <Box>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "20px",
              marginTop: 2,
            }}
          >
            Route Type
          </Typography>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "16px",
            }}
          >
            Based on your selection your route type is CrowdShipper
          </Typography>
        </Box>
      </Box>
    </SimpleBar>
  );
}
