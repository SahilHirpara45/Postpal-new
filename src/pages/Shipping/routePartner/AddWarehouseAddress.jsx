import React, { useContext, useState } from "react";
import * as Yup from "yup";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Tooltip,
  Typography,
} from "@mui/material";
import RoutePartnerHeader from "./RoutePartnerHeader";
import SidebarContext from "../../../context/SidebarContext";
import { useLocation, useNavigate } from "react-router-dom";
import SimpleBar from "simplebar-react";
import { useFormik } from "formik";
import Countries from "../../../Contries.json";
import { db } from "../../../firebaseConfig";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { IoAlertCircle } from "react-icons/io5";

const initialValue = {
  warehouseName: "",
  addressLine1: "",
  addressLine2: "",
  zipCode: "",
  city: "",
  state: "",
  country: "",
  currency: "",
  // isTaxFreeAddress: "",
  paymentMethod: "",
  specialServices: {
    fastLane: false,
    greenerShipping: false,
    guaranteedDelivery: false,
    internationalReturn: false,
    nationalReturn: false,
    ownershipCertificate: false,
    packageInspection: false,
    personalShopping: false,
    scanMail: false,
    storeMediationService: false,
    taxFreeAddress: false,
    taxExemptItems: false,
  },
  specializedServices: {
    hazmat: false,
    medical: false,
    traveller: false,
    pickup: false,
  },
  auxiliaryServices: {
    exportForwarder: false,
    importForwarding: false,
    importForwardingPrice: 0,
    lastMileDelivery: false,
    lastMilePrice: 0,
    pickupService: false,
    pickupPrice: 0,
  },
};

const validationSchema = Yup.object().shape({
  warehouseName: Yup.string().required("Warehouse Name is required!"),
  addressLine1: Yup.string().required("Address Line 1 is required!"),
  addressLine2: Yup.string().required("Address Line 2 is required!"),
  zipCode: Yup.string().required("Pincode is required."),
  city: Yup.string().required("City is required!"),
  state: Yup.string().required("State is required!"),
  PaymentMethod: Yup.string().required("PaymentMethod is required."),
});

export default function AddWarehouseAddress() {
  const { open } = useContext(SidebarContext);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const Location = useLocation();
  const { state } = Location;

  const handleCancle = () => {
    navigate("/shipping/route-partner");
  };

  const formik = useFormik({
    initialValues: initialValue,
    enableReinitialize: true,

    onSubmit: async (values) => {
      console.log(values, "values in AddMainAddress");
      setLoading(true);
      const selectedCountry = Countries.find((c) => c.name === values.country);
      // console.log(selectedCountry, " value in selectedCountry");
      try {
        const docRef = await addDoc(collection(db, "routePartnerMainAddress"), {
          ...values,
          country: selectedCountry.name,
          routePartnerId: state.routerId,
          countryCode: selectedCountry.iso2,
          createdAt: serverTimestamp(),
        }).then(async (res) => {
          // console.log(res, "res in AddMainAddress");
          toast.success("Main Address added Successfully");
          navigate("/shipping/route-partner");
          setLoading(false);
          await updateDoc(doc(db, "routePartnerMainAddress", res.id), {
            id: res.id,
          }).then((res) => {
            // console.log(res, " res in Update MainAddress");
          });
          await updateDoc(doc(db, "routePartners", state?.routerId), {
            countries: arrayUnion(selectedCountry.iso2),
          }).then((res) => {
            // console.log(res, " res in Update countries");
          });
        });
      } catch (error) {
        console.log(error, "error");
      }
    },
  });

  const countryChangeHandler = (event) => {
    formik.handleChange(event);

    const country = Countries.find((item) => item.name == event.target.value);

    formik.setFieldValue(
      "currency",
      `${country.currency} (${country?.currencySymbol})`
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "96vh",
        margin: "20px",
        marginRight: "0px",
        width: open === true ? "calc(98vw - 240px)" : "calc(98vw - 80px)",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "12px",
      }}
    >
      <Box sx={{ borderBottom: "1px solid #E5E5E8" }}>
        <RoutePartnerHeader
          pageTitle={"Add Warehouse Address"}
          currentRoute={"Add Warehouse Address"}
          buttonName={"Add Main Address"}
          handleCancle={() => handleCancle()}
          handleSave={formik.handleSubmit}
          loading={loading}
        />
      </Box>
      <SimpleBar
        forceVisible="y"
        autoHide={true}
        style={{
          maxHeight: "82vh",
        }}
        className="custom-scrollbar"
      >
        <Box>
          <Box sx={{ marginTop: "20px" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ marginRight: "40px" }}>
                <Typography
                  sx={{ fontWeight: 600, fontSize: "14px", color: "#1C2630" }}
                >
                  Warehouse Name
                </Typography>
                <FormControl
                  sx={{
                    m: 1,
                    minHeight: "35px",
                    width: "50vw",
                    marginX: "0px",
                  }}
                  size="small"
                >
                  <OutlinedInput
                    name="warehouseName"
                    placeholder="Warehouse Name"
                    value={formik.values.warehouseName}
                    onChange={formik.handleChange}
                    sx={{
                      marginX: "0px",
                      ".MuiOutlinedInput-notchedOutline": {
                        width: "50vw",
                      },
                    }}
                  />
                </FormControl>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <Box sx={{ marginRight: "40px" }}>
                <Typography
                  sx={{ fontWeight: 600, fontSize: "14px", color: "#1C2630" }}
                >
                  Address Line 1
                </Typography>
                <FormControl
                  sx={{
                    m: 1,
                    minHeight: "35px",
                    width: "50vw",
                    marginX: "0px",
                  }}
                  size="small"
                >
                  <OutlinedInput
                    name="addressLine1"
                    placeholder="Address Line 1"
                    value={formik.values.addressLine1}
                    onChange={formik.handleChange}
                    sx={{
                      marginX: "0px",
                      ".MuiOutlinedInput-notchedOutline": {
                        width: "50vw",
                      },
                    }}
                  />
                </FormControl>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <Box sx={{ marginRight: "40px" }}>
                <Typography
                  sx={{ fontWeight: 600, fontSize: "14px", color: "#1C2630" }}
                >
                  Address Line 2
                </Typography>
                <FormControl
                  sx={{
                    m: 1,
                    minHeight: "35px",
                    width: "50vw",
                    marginX: "0px",
                  }}
                  size="small"
                >
                  <OutlinedInput
                    name="addressLine2"
                    placeholder="Address Line 2"
                    onChange={formik.handleChange}
                    sx={{
                      marginX: "0px",
                      ".MuiOutlinedInput-notchedOutline": {
                        width: "50vw",
                      },
                    }}
                  />
                </FormControl>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <Box sx={{ marginRight: "2vw" }}>
                <Typography
                  sx={{ fontWeight: 600, fontSize: "14px", color: "#1C2630" }}
                >
                  Pincode
                </Typography>
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
                    placeholder="Pincode"
                    name="zipCode"
                    onChange={formik.handleChange}
                    sx={{
                      marginX: "0px",
                      ".MuiOutlinedInput-notchedOutline": {
                        width: "23vw",
                      },
                    }}
                  />
                </FormControl>
              </Box>
              <Box sx={{ marginLeft: "2vw" }}>
                <Typography
                  sx={{ fontWeight: 600, fontSize: "14px", color: "#1C2630" }}
                >
                  City
                </Typography>
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
                    placeholder="City"
                    name="city"
                    onChange={formik.handleChange}
                    sx={{
                      marginX: "0px",
                      ".MuiOutlinedInput-notchedOutline": {
                        width: "23vw",
                      },
                    }}
                  />
                </FormControl>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <Box sx={{ marginRight: "2vw" }}>
                <Typography
                  sx={{ fontWeight: 600, fontSize: "14px", color: "#1C2630" }}
                >
                  State
                </Typography>
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
                    placeholder="State"
                    name="state"
                    onChange={formik.handleChange}
                    sx={{
                      marginX: "0px",
                      ".MuiOutlinedInput-notchedOutline": {
                        width: "23vw",
                      },
                    }}
                  />
                </FormControl>
              </Box>
              <Box sx={{ marginLeft: "2vw" }}>
                <Typography
                  sx={{ fontWeight: 600, fontSize: "14px", color: "#1C2630" }}
                >
                  Country
                </Typography>
                <FormControl
                  sx={{
                    m: 1,
                    minHeight: "35px",
                    width: "23vw",
                    marginX: "0px",
                  }}
                  size="small"
                >
                  <select
                    removeItemButton
                    name="country"
                    onChange={countryChangeHandler}
                    value={formik.values.country}
                    defaultValue={formik.values.country}
                    className="w-100"
                    style={{
                      height: "44px",
                      border: "1px solid #d2d4e4",
                      borderRadius: "0.45rem",
                      padding: "0.5625rem 0.9rem",
                      fontSize: "0.875rem",
                      color: "#43476b",
                      outline: "0",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "rgba(95, 56, 249, 0.65)";
                      e.target.style.boxShadow =
                        "0 0 5px 0px rgba(95, 56, 249, 0.2)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#d2d4e4";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    <option value={"0"}>Select Country</option>
                    {Countries.map((country, i) => (
                      <option key={i} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <Box sx={{ marginRight: "40px" }}>
                <Typography
                  sx={{ fontWeight: 600, fontSize: "14px", color: "#1C2630" }}
                >
                  Currency
                </Typography>
                <FormControl
                  sx={{
                    m: 1,
                    minHeight: "35px",
                    width: "50vw",
                    marginX: "0px",
                  }}
                  size="small"
                >
                  <OutlinedInput
                    placeholder="Currency"
                    name="currency"
                    value={formik.values.currency}
                    onChange={formik.handleChange}
                    disabled={true}
                    sx={{
                      marginX: "0px",
                      ".MuiOutlinedInput-notchedOutline": {
                        width: "50vw",
                      },
                    }}
                  />
                </FormControl>
              </Box>
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  paddingY: "1%",
                }}
              >
                Special Services
              </Typography>
            </Box>
            <Box
              sx={{
                border: "1px solid #E5E5E8",
                borderRadius: "4px",
                padding: "1%",
                paddingY: "1%",
                maxWidth: "50vw",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                <Box
                  sx={{
                    width: "48%",
                    display: "flex",
                  }}
                >
                  <FormGroup>
                    <FormControlLabel
                      label={"Fast Lane"}
                      control={
                        <Checkbox
                          size="small"
                          name={"specialServices.fastLane"}
                          onChange={formik.handleChange}
                          checked={formik.values.specialServices.fastLane}
                        />
                      }
                      sx={{
                        ".MuiFormControlLabel-label": {
                          fontSize: "14px",
                          fontWeight: 600,
                        },
                        mr: 0,
                      }}
                    />
                  </FormGroup>
                  <Tooltip
                    title="Included in Premium plan"
                    placement="right-start"
                  >
                    <IconButton>
                      <IoAlertCircle size={16} color="#000000" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box
                  sx={{
                    width: "48%",
                    display: "flex",
                  }}
                >
                  <FormGroup>
                    <FormControlLabel
                      label="Greener Shipping"
                      control={
                        <Checkbox
                          size="small"
                          name={"specialServices.greenerShipping"}
                          onChange={formik.handleChange}
                          checked={
                            formik.values.specialServices.greenerShipping
                          }
                          // value={formik.values.auxiliaryServices.importForwarding}
                        />
                      }
                      sx={{
                        ".MuiFormControlLabel-label": {
                          fontSize: "14px",
                          fontWeight: 600,
                        },
                        mr: 0,
                      }}
                    />
                  </FormGroup>
                  <Tooltip
                    title="Select if you offer service"
                    placement="right-start"
                  >
                    <IconButton>
                      <IoAlertCircle size={16} color="#000000" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box
                  sx={{
                    width: "48%",
                    display: "flex",
                  }}
                >
                  <FormGroup>
                    <FormControlLabel
                      label="Guaranteed Delivery"
                      control={
                        <Checkbox
                          size="small"
                          name={"specialServices.guaranteedDelivery"}
                          onChange={formik.handleChange}
                          checked={
                            formik.values.specialServices.guaranteedDelivery
                          }
                        />
                      }
                      sx={{
                        ".MuiFormControlLabel-label": {
                          fontSize: "14px",
                          fontWeight: 600,
                        },
                        mr: 0,
                      }}
                    />
                  </FormGroup>
                  <Tooltip
                    title="Available in Free plan"
                    placement="right-start"
                  >
                    <IconButton>
                      <IoAlertCircle size={16} color="#000000" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box
                  sx={{
                    width: "48%",
                    display: "flex",
                  }}
                >
                  <FormGroup>
                    <FormControlLabel
                      label="International Return"
                      control={
                        <Checkbox
                          size="small"
                          name={"specialServices.internationalReturn"}
                          onChange={formik.handleChange}
                          checked={
                            formik.values.specialServices.internationalReturn
                          }
                        />
                      }
                      sx={{
                        ".MuiFormControlLabel-label": {
                          fontSize: "14px",
                          fontWeight: 600,
                        },
                        mr: 0,
                      }}
                    />
                  </FormGroup>
                  <Tooltip
                    title=" $2 per item + shipping cost."
                    placement="right-start"
                  >
                    <IconButton>
                      <IoAlertCircle size={16} color="#000000" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box
                  sx={{
                    width: "48%",
                    display: "flex",
                  }}
                >
                  <FormGroup>
                    <FormControlLabel
                      label="National Return"
                      control={
                        <Checkbox
                          size="small"
                          name={"specialServices.nationalReturn"}
                          onChange={formik.handleChange}
                          checked={formik.values.specialServices.nationalReturn}
                        />
                      }
                      sx={{
                        ".MuiFormControlLabel-label": {
                          fontSize: "14px",
                          fontWeight: 600,
                        },
                        mr: 0,
                      }}
                    />
                  </FormGroup>
                  <Tooltip
                    title="$2 per return + shipping cost"
                    placement="right-start"
                  >
                    <IconButton>
                      <IoAlertCircle size={16} color="#000000" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box
                  sx={{
                    width: "48%",
                    display: "flex",
                  }}
                >
                  <FormGroup>
                    <FormControlLabel
                      label="Ownership Certificate"
                      control={
                        <Checkbox
                          size="small"
                          name={"specialServices.ownershipCertificate"}
                          onChange={formik.handleChange}
                          checked={
                            formik.values.specialServices.ownershipCertificate
                          }
                        />
                      }
                      sx={{
                        ".MuiFormControlLabel-label": {
                          fontSize: "14px",
                          fontWeight: 600,
                        },
                        mr: 0,
                      }}
                    />
                  </FormGroup>
                  <Tooltip
                    title="$3 per certificate registration"
                    placement="right-start"
                  >
                    <IconButton>
                      <IoAlertCircle size={16} color="#000000" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box
                  sx={{
                    width: "48%",
                    display: "flex",
                  }}
                >
                  <FormGroup>
                    <FormControlLabel
                      label="Package Inspection"
                      control={
                        <Checkbox
                          size="small"
                          name={"specialServices.packageInspection"}
                          onChange={formik.handleChange}
                          checked={
                            formik.values.specialServices.packageInspection
                          }
                        />
                      }
                      sx={{
                        ".MuiFormControlLabel-label": {
                          fontSize: "14px",
                          fontWeight: 600,
                        },
                        mr: 0,
                      }}
                    />
                  </FormGroup>
                  <Tooltip
                    title="$3 per measurement insp, $5 per functional insp"
                    placement="right-start"
                  >
                    <IconButton>
                      <IoAlertCircle size={16} color="#000000" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box
                  sx={{
                    width: "48%",
                    display: "flex",
                  }}
                >
                  <FormGroup>
                    <FormControlLabel
                      label="Personal Shopping"
                      control={
                        <Checkbox
                          size="small"
                          name={"specialServices.personalShopping"}
                          onChange={formik.handleChange}
                          checked={
                            formik.values.specialServices.personalShopping
                          }
                        />
                      }
                      sx={{
                        ".MuiFormControlLabel-label": {
                          fontSize: "14px",
                          fontWeight: 600,
                        },
                        mr: 0,
                      }}
                    />
                  </FormGroup>
                  <Tooltip
                    title="Select if you offer service"
                    placement="right-start"
                  >
                    <IconButton>
                      <IoAlertCircle size={16} color="#000000" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box
                  sx={{
                    width: "48%",
                    display: "flex",
                  }}
                >
                  <FormGroup>
                    <FormControlLabel
                      label="Scan Mail"
                      control={
                        <Checkbox
                          size="small"
                          name={"specialServices.scanMail"}
                          onChange={formik.handleChange}
                          checked={formik.values.specialServices.scanMail}
                        />
                      }
                      sx={{
                        ".MuiFormControlLabel-label": {
                          fontSize: "14px",
                          fontWeight: 600,
                        },
                        mr: 0,
                      }}
                    />
                  </FormGroup>
                  <Tooltip title="$1/page" placement="right-start">
                    <IconButton>
                      <IoAlertCircle size={16} color="#000000" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box
                  sx={{
                    width: "48%",
                    display: "flex",
                  }}
                >
                  <FormGroup>
                    <FormControlLabel
                      label="Store Mediation Service"
                      control={
                        <Checkbox
                          size="small"
                          name={"specialServices.storeMediationService"}
                          onChange={formik.handleChange}
                          checked={
                            formik.values.specialServices.storeMediationService
                          }
                        />
                      }
                      sx={{
                        ".MuiFormControlLabel-label": {
                          fontSize: "14px",
                          fontWeight: 600,
                        },
                        mr: 0,
                      }}
                    />
                  </FormGroup>
                  <Tooltip title="$5 per mediation" placement="right-start">
                    <IconButton>
                      <IoAlertCircle size={16} color="#000000" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box
                  sx={{
                    width: "48%",
                    display: "flex",
                  }}
                >
                  <FormGroup>
                    <FormControlLabel
                      label="Tax-free address"
                      control={
                        <Checkbox
                          size="small"
                          name={"specialServices.taxFreeAddress"}
                          onChange={formik.handleChange}
                          checked={formik.values.specialServices.taxFreeAddress}
                        />
                      }
                      sx={{
                        ".MuiFormControlLabel-label": {
                          fontSize: "14px",
                          fontWeight: 600,
                        },
                        mr: 0,
                      }}
                    />
                  </FormGroup>
                  <Tooltip
                    title="This state does not charge sales tax when you buy a product."
                    placement="right-start"
                  >
                    <IconButton>
                      <IoAlertCircle size={16} color="#000000" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box
                  sx={{
                    width: "48%",
                    display: "flex",
                  }}
                >
                  <FormGroup>
                    <FormControlLabel
                      label="Tax-exempt items"
                      control={
                        <Checkbox
                          size="small"
                          name={"specialServices.taxExemptItems"}
                          onChange={formik.handleChange}
                          checked={formik.values.specialServices.taxExemptItems}
                        />
                      }
                      sx={{
                        ".MuiFormControlLabel-label": {
                          fontSize: "14px",
                          fontWeight: 600,
                        },
                        mr: 0,
                      }}
                    />
                  </FormGroup>
                  <Tooltip
                    title="Many items like clothing, shoes,over-the-counter medicine, food and ingredients maybe exempt."
                    placement="right-start"
                  >
                    <IconButton>
                      <IoAlertCircle size={16} color="#000000" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  paddingY: "1%",
                }}
              >
                Specialized Services
              </Typography>
            </Box>
            <Box
              sx={{
                border: "1px solid #E5E5E8",
                borderRadius: "4px",
                padding: "1%",
                paddingY: "1%",
                maxWidth: "50vw",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "2%",
                }}
              >
                <Box
                  sx={{
                    width: "48%",
                  }}
                >
                  <FormGroup>
                    <FormControlLabel
                      label="Hazmat"
                      control={
                        <Checkbox
                          size="small"
                          name={"specializedServices.hazmat"}
                          onChange={formik.handleChange}
                          checked={formik.values.specializedServices.hazmat}
                        />
                      }
                      sx={{
                        ".MuiFormControlLabel-label": {
                          fontSize: "14px",
                          fontWeight: 600,
                        },
                      }}
                    />
                  </FormGroup>
                </Box>
                <Box
                  sx={{
                    width: "48%",
                  }}
                >
                  <FormGroup>
                    <FormControlLabel
                      label="medical"
                      control={
                        <Checkbox
                          size="small"
                          name={"specializedServices.medical"}
                          onChange={formik.handleChange}
                          checked={formik.values.specializedServices.medical}
                        />
                      }
                      sx={{
                        ".MuiFormControlLabel-label": {
                          fontSize: "14px",
                          fontWeight: 600,
                        },
                      }}
                    />
                  </FormGroup>
                </Box>
                <Box
                  sx={{
                    width: "48%",
                  }}
                >
                  <FormGroup>
                    <FormControlLabel
                      label="traveler"
                      control={
                        <Checkbox
                          size="small"
                          name={"specializedServices.traveller"}
                          onChange={formik.handleChange}
                          checked={formik.values.specializedServices.traveller}
                        />
                      }
                      sx={{
                        ".MuiFormControlLabel-label": {
                          fontSize: "14px",
                          fontWeight: 600,
                        },
                      }}
                    />
                  </FormGroup>
                </Box>
                <Box
                  sx={{
                    width: "48%",
                  }}
                >
                  <FormGroup>
                    <FormControlLabel
                      label="Pick up"
                      control={
                        <Checkbox
                          size="small"
                          name={"specializedServices.pickup"}
                          onChange={formik.handleChange}
                          checked={formik.values.specializedServices.pickup}
                        />
                      }
                      sx={{
                        ".MuiFormControlLabel-label": {
                          fontSize: "14px",
                          fontWeight: 600,
                        },
                      }}
                    />
                  </FormGroup>
                </Box>
              </Box>
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  paddingY: "1%",
                }}
              >
                Auxiliary Services
              </Typography>
            </Box>
            <Box
              sx={{
                border: "1px solid #E5E5E8",
                borderRadius: "4px",
                padding: "1%",
                paddingY: "1%",
                maxWidth: "50vw",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "2%",
                }}
              >
                <Box
                  sx={{
                    width: "48%",
                    display: "flex",
                  }}
                >
                  <FormGroup>
                    <FormControlLabel
                      label="Export Forwarder"
                      control={
                        <Checkbox
                          size="small"
                          name={"auxiliaryServices.exportForwarder"}
                          onChange={formik.handleChange}
                          checked={
                            formik.values.auxiliaryServices.exportForwarder
                          }
                        />
                      }
                      sx={{
                        ".MuiFormControlLabel-label": {
                          fontSize: "14px",
                          fontWeight: 600,
                        },
                        mr: 0,
                      }}
                    />
                  </FormGroup>
                  <Tooltip
                    title="Do you export /ship abroad?"
                    placement="right-start"
                  >
                    <IconButton>
                      <IoAlertCircle size={16} color="#000000" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box
                  sx={{
                    width: "48%",
                    display: "flex",
                  }}
                >
                  <FormGroup>
                    <FormControlLabel
                      label="Import Forwarding"
                      control={
                        <Checkbox
                          size="small"
                          name={"auxiliaryServices.importForwarding"}
                          onChange={formik.handleChange}
                          checked={
                            formik.values.auxiliaryServices.importForwarding
                          }
                        />
                      }
                      sx={{
                        ".MuiFormControlLabel-label": {
                          fontSize: "14px",
                          fontWeight: 600,
                        },
                        mr: 0,
                      }}
                    />
                  </FormGroup>
                  <Tooltip
                    title="Do you accept shipment from other route/forwarding partners?"
                    placement="right-start"
                  >
                    <IconButton>
                      <IoAlertCircle size={16} color="#000000" />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Box sx={{ marginTop: "20px" }}>
                  {formik.values.auxiliaryServices.importForwarding && (
                    <Box>
                      <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
                        Import Forwarding Fee
                      </Typography>
                      <FormControl
                        sx={{
                          m: 1,
                          minHeight: "35px",
                          width: "48vw",
                          marginX: "0px",
                        }}
                        size="small"
                      >
                        <OutlinedInput
                          type="number"
                          name="auxiliaryServices.importForwardingPrice"
                          placeholder="Import Forwarding Free"
                          onChange={formik.handleChange}
                          value={
                            formik.values.auxiliaryServices
                              .importForwardingPrice
                          }
                          sx={{
                            marginX: "0px",
                            ".MuiOutlinedInput-notchedOutline": {
                              width: "48vw",
                            },
                          }}
                          startAdornment={
                            <InputAdornment position="start">$</InputAdornment>
                          }
                        />
                      </FormControl>
                    </Box>
                  )}
                  {formik.values.auxiliaryServices.importForwarding && (
                    <Box>
                      <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
                        List-Mile (Door to Door) Delivery Fee
                      </Typography>
                      <FormControl
                        sx={{
                          m: 1,
                          minHeight: "35px",
                          width: "48vw",
                          marginX: "0px",
                        }}
                        size="small"
                      >
                        <OutlinedInput
                          type="number"
                          name="auxiliaryServices.lastMilePrice"
                          placeholder="Last-Mile Delivery Price"
                          onChange={formik.handleChange}
                          value={formik.values.auxiliaryServices.lastMilePrice}
                          sx={{
                            marginX: "0px",
                            ".MuiOutlinedInput-notchedOutline": {
                              width: "48vw",
                            },
                          }}
                          startAdornment={
                            <InputAdornment position="start">$</InputAdornment>
                          }
                        />
                      </FormControl>
                    </Box>
                  )}
                  {formik.values.auxiliaryServices.importForwarding && (
                    <Box>
                      <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
                        Pickup Service Fee
                      </Typography>
                      <FormControl
                        sx={{
                          m: 1,
                          minHeight: "35px",
                          width: "48vw",
                          marginX: "0px",
                        }}
                        size="small"
                      >
                        <OutlinedInput
                          type="number"
                          name="auxiliaryServices.pickupPrice"
                          placeholder="Pickup Service Price"
                          onChange={formik.handleChange}
                          value={formik.values.auxiliaryServices.pickupPrice}
                          sx={{
                            marginX: "0px",
                            ".MuiOutlinedInput-notchedOutline": {
                              width: "48vw",
                            },
                          }}
                          startAdornment={
                            <InputAdornment position="start">$</InputAdornment>
                          }
                        />
                      </FormControl>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </SimpleBar>
    </Box>
  );
}
