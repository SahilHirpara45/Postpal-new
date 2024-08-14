import {
  Box,
  Button,
  Drawer,
  FormControl,
  InputAdornment,
  OutlinedInput,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import close from "../../../assets/svg/drawer_close.svg";

export default function EditPriceWeight({ open, onClose }) {
  const [booked, setBooked] = useState("");
  const [available, setAvailable] = useState("");
  const [firtPriceRange, setFirtPriceRange] = useState("");
  const [secondPriceRange, setSecondPriceRange] = useState("");
  const [thirdPriceRange, setThirdPriceRange] = useState("");
  const [fourthPriceRange, setFourthPriceRange] = useState("");
  return (
    <Drawer
      variant="temporary"
      anchor="right"
      open={open}
      onClose={onClose}
      BackdropProps={{ sx: { background: "rgba(0, 0, 0, 0.5)" } }}
    >
      <Box sx={{ width: "500px" }}>
        <Box
          sx={{
            borderBottom: "1px solid #E5E5E8",
            paddingLeft: "20px",
            paddingTop: "20px",
            paddingBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" component="h5">
            Edit Price & Weight
          </Typography>
          <Box
            sx={{ paddingRight: "20px", cursor: "pointer" }}
            onClick={onClose}
          >
            <img src={close} alt="close" />
          </Box>
        </Box>
        <Box sx={{ minHeight: "84vh", borderBottom: "1px solid #E5E5E8" }}>
          <Box
            sx={{
              paddingLeft: "20px",
              paddingTop: "10px",
            }}
          >
            <Typography variant="body1" fontWeight="bold">
              Weight
            </Typography>
            <Typography
              sx={{ marginTop: 2 }}
              variant="body1"
              fontWeight="normal"
            >
              Booked Weight
            </Typography>
            <Box>
              <FormControl
                sx={{
                  m: 1,
                  minWidth: 270,
                  minHeight: "35px",
                  marginLeft: "0px",
                }}
                size="small"
              >
                <OutlinedInput
                  name="merchantIndicator"
                  value={booked}
                  onChange={(e) => setBooked(e.target.value)}
                />
              </FormControl>
            </Box>
          </Box>
          <Box
            sx={{
              paddingLeft: "20px",
              paddingTop: "10px",
            }}
          >
            <Typography variant="body1" fontWeight="normal">
              Available Weight
            </Typography>
            <Box>
              <FormControl
                sx={{
                  m: 1,
                  minWidth: 270,
                  minHeight: "35px",
                  marginLeft: "0px",
                }}
                size="small"
              >
                <OutlinedInput
                  name="merchantIndicator"
                  value={available}
                  onChange={(e) => setAvailable(e.target.value)}
                />
              </FormControl>
            </Box>
          </Box>
          <Box
            sx={{
              paddingLeft: "20px",
              paddingTop: "10px",
            }}
          >
            <Typography variant="body1" fontWeight="bold">
              Price
            </Typography>
            <Typography
              sx={{ marginTop: 2 }}
              variant="body1"
              fontWeight="normal"
            >
              0lb - 5lb
            </Typography>
            <Box>
              <FormControl
                sx={{
                  m: 1,
                  minWidth: 270,
                  minHeight: "35px",
                  marginLeft: "0px",
                }}
                size="small"
              >
                <OutlinedInput
                  name="merchantIndicator"
                  value={firtPriceRange}
                  onChange={(e) => setFirtPriceRange(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">$</InputAdornment>
                  }
                />
              </FormControl>
            </Box>
          </Box>
          <Box
            sx={{
              paddingLeft: "20px",
              paddingTop: "10px",
            }}
          >
            <Typography
              sx={{ marginTop: 2 }}
              variant="body1"
              fontWeight="normal"
            >
              6lb - 10lb
            </Typography>
            <Box>
              <FormControl
                sx={{
                  m: 1,
                  minWidth: 270,
                  minHeight: "35px",
                  marginLeft: "0px",
                }}
                size="small"
              >
                <OutlinedInput
                  name="merchantIndicator"
                  value={secondPriceRange}
                  onChange={(e) => setSecondPriceRange(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">$</InputAdornment>
                  }
                />
              </FormControl>
            </Box>
          </Box>
          <Box
            sx={{
              paddingLeft: "20px",
              paddingTop: "10px",
            }}
          >
            <Typography
              sx={{ marginTop: 2 }}
              variant="body1"
              fontWeight="normal"
            >
              11lb - 25lb
            </Typography>
            <Box>
              <FormControl
                sx={{
                  m: 1,
                  minWidth: 270,
                  minHeight: "35px",
                  marginLeft: "0px",
                }}
                size="small"
              >
                <OutlinedInput
                  name="merchantIndicator"
                  value={thirdPriceRange}
                  onChange={(e) => setThirdPriceRange(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">$</InputAdornment>
                  }
                />
              </FormControl>
            </Box>
          </Box>
          <Box
            sx={{
              paddingLeft: "20px",
              paddingTop: "10px",
            }}
          >
            <Typography
              sx={{ marginTop: 2 }}
              variant="body1"
              fontWeight="normal"
            >
              26lb - above
            </Typography>
            <Box>
              <FormControl
                sx={{
                  m: 1,
                  minWidth: 270,
                  minHeight: "35px",
                  marginLeft: "0px",
                }}
                size="small"
              >
                <OutlinedInput
                  name="merchantIndicator"
                  value={fourthPriceRange}
                  onChange={(e) => setFourthPriceRange(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">$</InputAdornment>
                  }
                />
              </FormControl>
            </Box>
          </Box>
        </Box>
        <Button
          type="submit"
          variant="contained"
          sx={{
            minWidth: "189px",
            position: "absolute",
            bottom: 20,
            right: 20,
            borderRadius: "4px",
          }}
        >
          Save
        </Button>
      </Box>
    </Drawer>
  );
}
