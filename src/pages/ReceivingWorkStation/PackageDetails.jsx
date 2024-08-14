import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  InputBase,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Package_img from "../../assets/svg/camera.svg";
import SimpleBar from "simplebar-react";
import specker from "../../assets/svg/speaker.svg";
import barcode from "../../assets/svg/bx_barcode.svg";
import copy from "../../assets/svg/copy.svg";
import close from "../../assets/svg/drawer_close.svg";
import like from "../../assets/svg/like.svg";
import unlike from "../../assets/svg/unlike.svg";
import refresh from "../../assets/svg/refresh.svg";

import { Sheet } from "react-modal-sheet";

export default function PackageDetails() {
  const [isOpen, setOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [merchant, setMerchant] = useState("");
  const [indicator, setIndicator] = useState("");
  const [dimentionL, setDimentionL] = useState("");
  const [dimentionW, setDimentionW] = useState("");
  const [dimentionH, setDimentionH] = useState("");
  const [suite, SetSuite] = useState("");
  const [shelfId, setShelfId] = useState("");
  const [weight, setWeight] = useState("");
  const matches = useMediaQuery("(max-width:700px)");

  return (
    <>
      <Box
        sx={{
          paddingLeft: "20px",
          paddingRight: "20px",
          paddingTop: "15px",
          paddingBottom: "15px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #E5E5E8",
        }}
      >
        <Typography variant="h5" component="h5" sx={{ fontSize: "18px" }}>
          Receiving Workstation
        </Typography>
        <Box
          sx={{
            paddingX: "12px",
            paddingY: "4px",
            border: "1px solid #5E17EB",
            borderRadius: "8px",
            backgroundColor: "#F3EDFF",
          }}
        >
          <img src={specker} alt="specker" />
        </Box>
      </Box>
      <SimpleBar
        forceVisible="y"
        autoHide={true}
        style={{
          overflowY: "auto",
          maxHeight: "calc(100vh - 243px)",
          marginBottom: "10px",
        }}
        className="custom-scrollbar"
      >
        <Box sx={{ marginTop: "16px", marginX: "20px" }}>
          <Stack direction={"row"}>
            <Box>
              <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                Package image
              </Typography>
            </Box>
          </Stack>
          <SimpleBar
            forceVisible="x"
            autoHide={true}
            style={{
              overflowX: "auto",
            }}
            className="custom-scrollbar"
          >
            <Stack direction={"row"} gap={1} sx={{ marginTop: "5px" }}>
              <Box
                sx={{
                  maxWidth: "79px",
                  maxHeight: "79px",
                  minWidth: "79px",
                  minHeight: "79px",
                  backgroundColor: "#F1F1F1",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {/* <Box> */}
                <img src={Package_img} alt="specker" />
                {/* </Box> */}
              </Box>
              <Box
                sx={{
                  maxWidth: "79px",
                  maxHeight: "79px",
                  minWidth: "79px",
                  minHeight: "79px",
                  backgroundColor: "#F1F1F1",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {/* <Box> */}
                <img src={Package_img} alt="specker" />
                {/* </Box> */}
              </Box>
              <Box
                sx={{
                  maxWidth: "79px",
                  maxHeight: "79px",
                  minWidth: "79px",
                  minHeight: "79px",
                  backgroundColor: "#F1F1F1",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {/* <Box> */}
                <img src={Package_img} alt="specker" />
                {/* </Box> */}
              </Box>
              <Box
                sx={{
                  maxWidth: "79px",
                  maxHeight: "79px",
                  minWidth: "79px",
                  minHeight: "79px",
                  backgroundColor: "#F1F1F1",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {/* <Box> */}
                <img src={Package_img} alt="specker" />
                {/* </Box> */}
              </Box>
            </Stack>
          </SimpleBar>
          <Stack direction={"row"} sx={{ marginTop: "20px" }}>
            <Box>
              <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                Tracking number
              </Typography>
            </Box>
          </Stack>
          <Box>
            <Stack>
              <Paper
                component="form"
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #E5E5E8",
                  // width: matches ? "100%" : "50%",
                  width: "100%",
                  height: 35,
                  marginTop: "10px",
                }}
              >
                <SearchIcon />
                <InputBase
                  sx={{ ml: 1, flex: 1, fontSize: "13px" }}
                  placeholder="Search... "
                  inputProps={{ "aria-label": "search" }}
                  size="small"
                  name="trackingNumber"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                />
                <IconButton
                  color="primary"
                  sx={{ p: "10px" }}
                  aria-label="directions"
                >
                  <Typography sx={{ fontSize: "13px", fontWeight: 600 }}>
                    validate
                  </Typography>
                </IconButton>
              </Paper>
            </Stack>
            <Stack direction={"row"}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      name="isNoTracking"
                      //   checked={formik.values.isNoTracking}
                      //   onChange={formik.handleChange}
                      //   disabled={!!formik.values.trackingNumber}
                    />
                  }
                  label="No Tracking"
                  sx={{ ".MuiFormControlLabel-label": { fontSize: "13px" } }}
                />
              </FormGroup>
            </Stack>
          </Box>
          <Stack direction={"row"} sx={{ marginTop: "10px" }}>
            <Box>
              <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                Search User by Suite number
              </Typography>
            </Box>
          </Stack>
          <Box>
            <Stack>
              <Paper
                component="form"
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #E5E5E8",
                  // width: matches ? "100%" : "50%",
                  width: "100%",
                  height: 35,
                  marginTop: "10px",
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1, fontSize: "13px" }}
                  placeholder="Suit Number... "
                  inputProps={{ "aria-label": "search" }}
                  size="small"
                  name="suiteNumber"
                  value={suite}
                  onChange={(e) => SetSuite(e.target.value)}
                />
              </Paper>
            </Stack>
            <Stack direction={"row"}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      name="isSuite"
                      //   checked={formik.values.isNoTracking}
                      //   onChange={formik.handleChange}
                      //   disabled={!!formik.values.trackingNumber}
                    />
                  }
                  label="No Suite"
                  sx={{ ".MuiFormControlLabel-label": { fontSize: "13px" } }}
                />
              </FormGroup>
            </Stack>
          </Box>
          <Stack direction={"row"} sx={{ marginTop: "10px" }}>
            <Box>
              <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                Search the merchant
              </Typography>
            </Box>
          </Stack>
          <Box>
            <Stack>
              <FormControl
                sx={{
                  m: 1,
                  // width: matches ? "100%" : "50%",
                  width: "100%",
                  minHeight: "35px",
                  maxHeight: "35px",
                  marginLeft: "0px",
                }}
                size="small"
              >
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                >
                  <MenuItem value={"Merchant One"}>Merchant One</MenuItem>
                  <MenuItem value={"Merchant One"}>Merchant One</MenuItem>
                  <MenuItem value={"Merchant One"}>Merchant One</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <Stack direction={"row"}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      name="unknown"
                      //   checked={formik.values.isNoTracking}
                      //   onChange={formik.handleChange}
                      //   disabled={!!formik.values.trackingNumber}
                    />
                  }
                  label="Unknown"
                  sx={{ ".MuiFormControlLabel-label": { fontSize: "13px" } }}
                />
              </FormGroup>
            </Stack>
          </Box>
          <Stack direction={"row"} sx={{ marginTop: "10px" }}>
            <Box>
              <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                Merchant indicator
              </Typography>
            </Box>
          </Stack>
          <Stack>
            <Paper
              component="form"
              sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                border: "1px solid #E5E5E8",
                // width: matches ? "100%" : "50%",
                width: "100%",
                height: 35,
                marginTop: "10px",
              }}
            >
              <SearchIcon />
              <InputBase
                sx={{ ml: 1, flex: 1, fontSize: "13px" }}
                placeholder="Search... "
                inputProps={{ "aria-label": "search" }}
                size="small"
                name="merchantIndicator"
                value={indicator}
                onChange={(e) => setIndicator(e.target.value)}
              />
            </Paper>
          </Stack>
          <Stack direction={"row"} sx={{ marginTop: "20px" }}>
            <Box>
              <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                Dimentions (cm)
              </Typography>
            </Box>
          </Stack>
          <Stack>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <FormLabel sx={{ fontSize: "13px" }}>L</FormLabel>
              <Box>
                <FormControl
                  sx={{ m: 1, minWidth: "30%", minHeight: "35px" }}
                  size="small"
                >
                  <OutlinedInput
                    type="number"
                    name="dimentionL"
                    value={dimentionL}
                    onChange={(e) => setDimentionL(e.target.value)}
                    sx={{ height: "35px" }}
                  />
                </FormControl>
              </Box>
              <FormLabel sx={{ fontSize: "13px" }}>W</FormLabel>
              <Box>
                <FormControl
                  sx={{ m: 1, minWidth: "30%", minHeight: "35px" }}
                  size="small"
                >
                  <OutlinedInput
                    type="number"
                    name="dimensionW"
                    value={dimentionW}
                    onChange={(e) => setDimentionW(e.target.value)}
                    sx={{ height: "35px" }}
                  />
                </FormControl>
              </Box>
              <FormLabel sx={{ fontSize: "13px" }}>H</FormLabel>
              <Box>
                <FormControl
                  sx={{ m: 1, minWidth: "30%", minHeight: "35px" }}
                  size="small"
                >
                  <OutlinedInput
                    type="number"
                    name="dimensionH"
                    value={dimentionH}
                    onChange={(e) => setDimentionH(e.target.value)}
                    sx={{ height: "35px" }}
                  />
                </FormControl>
              </Box>
            </Box>
          </Stack>
          <Stack direction={"row"} sx={{ marginTop: "20px" }}>
            <Box>
              <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                Weight (lb)
              </Typography>
            </Box>
          </Stack>
          <Stack>
            <FormControl
              sx={{
                m: 1,
                minHeight: "30px",
                marginLeft: "0px",
                // width: matches ? "100%" : "50%",
                width: "100%",
              }}
              size="small"
            >
              <OutlinedInput
                type="number"
                name="packageTotalWeight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </FormControl>
          </Stack>
          <Stack direction={"row"} sx={{ marginTop: "20px" }}>
            <Box>
              <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                Shelf ID
              </Typography>
            </Box>
          </Stack>
          <Stack>
            <FormControl
              sx={{
                m: 1,
                minHeight: "30px",
                marginLeft: "0px",
                // width: matches ? "100%" : "50%",
                width: "100%",
              }}
              size="small"
            >
              <OutlinedInput
                type="number"
                name="packageShelfID"
                value={shelfId}
                onChange={(e) => setShelfId(e.target.value)}
              />
            </FormControl>
          </Stack>
          <Sheet
            isOpen={isOpen}
            onClose={() => setOpen(false)}
            snapPoints={[1, 0.6]}
            initialSnap={1}
          >
            <Sheet.Container>
              <Sheet.Header />
              <Sheet.Content>
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginX: "20px",
                    }}
                  >
                    <Typography
                      variant="h5"
                      component="h5"
                      sx={{ fontSize: "18px" }}
                    >
                      Package label palceholder
                    </Typography>
                    <Box onClick={() => setOpen(false)}>
                      <img src={close} alt="close" />
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      marginX: "20px",
                      alignContent: "center",
                      backgroundColor: "#FAFAFA",
                      padding: "24px",
                      border: "1px solid #E5E5E8",
                      borderRadius: "8px",
                      marginTop: "20px",
                    }}
                  >
                    <Stack
                      direction={"row"}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "20px",
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
                          Suite Number:
                        </Typography>
                      </Box>
                      <Box sx={{ marginLeft: "5px" }}>
                        <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
                          A-44553322
                        </Typography>
                      </Box>
                      <Box sx={{ marginLeft: "7px", marginBottom: "2px" }}>
                        <img src={copy} alt="copy_icon" />
                      </Box>
                    </Stack>
                    <Stack
                      direction={"row"}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "20px",
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
                          Tracking Number:
                        </Typography>
                      </Box>
                      <Box sx={{ marginLeft: "5px" }}>
                        <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
                          ZSW3344
                        </Typography>
                      </Box>
                      <Box sx={{ marginLeft: "7px", marginBottom: "2px" }}>
                        <img src={copy} alt="copy_icon" />
                      </Box>
                    </Stack>
                    <Stack
                      direction={"row"}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "20px",
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
                          Merchant:
                        </Typography>
                      </Box>
                      <Box sx={{ marginLeft: "5px" }}>
                        <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
                          Walmart
                        </Typography>
                      </Box>
                      <Box sx={{ marginLeft: "7px", marginBottom: "2px" }}>
                        <img src={copy} alt="copy_icon" />
                      </Box>
                    </Stack>
                    <Stack
                      direction={"row"}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "20px",
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
                          Merchant Indicator:
                        </Typography>
                      </Box>
                      <Box sx={{ marginLeft: "5px" }}>
                        <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
                          Unknown
                        </Typography>
                      </Box>
                      <Box sx={{ marginLeft: "7px", marginBottom: "2px" }}>
                        <img src={copy} alt="copy_icon" />
                      </Box>
                    </Stack>
                    <Stack
                      direction={"row"}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "20px",
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
                          Dimention:
                        </Typography>
                      </Box>
                      <Box sx={{ marginLeft: "5px" }}>
                        <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
                          17 x 13 x 7
                        </Typography>
                      </Box>
                      <Box sx={{ marginLeft: "7px", marginBottom: "2px" }}>
                        <img src={copy} alt="copy_icon" />
                      </Box>
                    </Stack>
                    <Stack
                      direction={"row"}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "20px",
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
                          Weight:
                        </Typography>
                      </Box>
                      <Box sx={{ marginLeft: "5px" }}>
                        <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
                          6lb
                        </Typography>
                      </Box>
                      <Box sx={{ marginLeft: "7px", marginBottom: "2px" }}>
                        <img src={copy} alt="copy_icon" />
                      </Box>
                    </Stack>
                    <Stack
                      direction={"row"}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Box>
                        <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
                          Suggested Shelf ID:
                        </Typography>
                      </Box>
                      <Box sx={{ marginLeft: "5px" }}>
                        <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
                          A1-4
                        </Typography>
                      </Box>
                      <Box sx={{ marginLeft: "7px", marginBottom: "2px" }}>
                        <img src={copy} alt="copy_icon" />
                      </Box>
                    </Stack>
                    <Stack
                      direction={"row"}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "20px",
                      }}
                    >
                      <Box sx={{ display: "flex", margin: "0px" }}>
                        <Box>
                          <img
                            src={like}
                            style={{ marginRight: "6px" }}
                            alt="like"
                          />
                        </Box>
                        <Box>
                          <img
                            src={unlike}
                            style={{ marginRight: "5px" }}
                            alt="like"
                          />
                        </Box>
                        <Box>
                          <img src={refresh} alt="like" />
                        </Box>
                      </Box>
                    </Stack>
                  </Box>
                </Box>
              </Sheet.Content>
            </Sheet.Container>
            <Sheet.Backdrop />
          </Sheet>
        </Box>
      </SimpleBar>
      <Box
        sx={{
          position: "absolute",
          bottom: 80,
          width: "100%",
          backgroundColor: "#fff",
        }}
      >
        <Stack sx={{ display: "flex", marginTop: "20px" }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "white",
              color: "#481AA3",
              border: "1px solid #5E17EB",
              boxShadow: "none",
              marginBottom: "10px",
              // width: matches ? "100%" : "50%",
              width: "100%",
              borderRadius: "4px",
              whiteSpace: "nowrap",
              "&:hover": {
                outline: "none",
                color: "#481AA3",
                backgroundColor: "white", // Remove border color on focus
              },
            }}
            onClick={() => setOpen(true)}
          >
            <img src={barcode} alt="slip" style={{ marginRight: "10px" }} />
            See label placeholder
          </Button>
        </Stack>
        <Stack sx={{ display: "flex" }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#481AA3",
              color: "#fff",
              border: "1px solid #E5E5E8",
              // width: matches ? "100%" : "50%",
              width: "100%",
              boxShadow: "none",
              borderRadius: "4px",
              whiteSpace: "nowrap",
              "&:hover": {
                outline: "none",
                color: "#fff",
                backgroundColor: "#481AA3", // Remove border color on focus
              },
            }}
          >
            Add Package
          </Button>
        </Stack>
      </Box>
    </>
  );
}
