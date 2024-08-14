import {
  Box,
  Button,
  Drawer,
  FormControl,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import close from "../../../assets/svg/drawer_close.svg";
import { useFormik } from "formik";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { toast } from "react-toastify";
import Countries from "../../../Currencies.json";

const initialValue = {
  warehouseName: "",
  addressLine1: "",
  addressLine2: "",
  zipCode: "",
  city: "",
  state: "",
  country: "",
  currency: "",
};

function EditMainAdressDrawer({ open, onClose, addressId }) {
  const [docData, setDocData] = useState(initialValue);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: docData,
    enableReinitialize: true,

    onSubmit: async (values) => {
      console.log(values, " <-----values which is edited<<<");
      setLoading(true);

      try {
        updateDoc(doc(db, "routePartnerMainAddress", addressId), {
          ...values,
        }).then((res) => {
          toast.success("Route Partner Updated Successfully!");
          setLoading(false);

          onClose();
        });
      } catch (error) {
        console.log(error, "error");
      }
    },
  });

  // console.log(addressId,"idd");
  useEffect(() => {
    const getForId = async () => {
      if (addressId) {
        const docRef = doc(db, "routePartnerMainAddress", addressId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("Document dataaaaaaaa:", docSnap.data());
          setDocData(docSnap.data());
        } else {
          console.log("No such document!");
        }
      }
    };
    getForId();
  }, [addressId]);

  const countryChangeHandler = (event) => {
    formik.handleChange(event);

    const country = Countries.find((item) => item.name == event.target.value);

    formik.setFieldValue(
      "currency",
      `${country.currency} (${country?.currencySymbol})`
    );
  };

  return (
    <Drawer
      variant="temporary"
      anchor="right"
      open={open}
      onClose={onClose}
      BackdropProps={{ sx: { background: "rgba(0, 0, 0, 0.5)" } }}
    >
      <Box sx={{ width: "600px" }}>
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
            Edit Main Address
          </Typography>
          <Box
            sx={{ paddingRight: "20px", cursor: "pointer" }}
            onClick={onClose}
          >
            <img src={close} alt="close" />
          </Box>
        </Box>
        <Box sx={{ marginX: "20px" }}>
          <Stack direction={"row"} sx={{ marginTop: "20px" }}>
            <Box>
              <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                Warehouse Name
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
              }}
              size="small"
            >
              <OutlinedInput
                name="warehouseName"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.warehouseName}
                placeholder="Warehouse Name"
              />
            </FormControl>
          </Stack>
          <Stack direction={"row"} sx={{ marginTop: "20px" }}>
            <Box>
              <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                Address Line 1
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
              }}
              size="small"
            >
              <OutlinedInput
                name="addressLine1"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.addressLine1}
                placeholder="Address Line 1"
              />
            </FormControl>
          </Stack>
          <Stack direction={"row"} sx={{ marginTop: "20px" }}>
            <Box>
              <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                Address Line 2
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
              }}
              size="small"
            >
              <OutlinedInput
                name="addressLine2"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.addressLine2}
                placeholder="Address Line 2"
              />
            </FormControl>
          </Stack>
          <Stack direction={"row"} sx={{ marginTop: "20px" }} gap={3}>
            <Stack>
              <Box sx={{ marginBottom: "10px" }}>
                <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                  Zip Code
                </Typography>
              </Box>
              <FormControl
                sx={{
                  minHeight: "30px",
                  marginLeft: "0px",
                  // width: matches ? "100%" : "50%",
                }}
                size="small"
              >
                <OutlinedInput
                  name="zipCode"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.zipCode}
                  placeholder="Zip Code"
                />
              </FormControl>
            </Stack>
            <Stack>
              <Box sx={{ marginBottom: "10px" }}>
                <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                  City
                </Typography>
              </Box>
              <FormControl
                sx={{
                  minHeight: "30px",
                  marginLeft: "0px",
                  // width: matches ? "100%" : "50%",
                }}
                size="small"
              >
                <OutlinedInput
                  name="city"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.city}
                  placeholder="City"
                />
              </FormControl>
            </Stack>
          </Stack>
          <Stack direction={"row"} sx={{ marginTop: "20px" }} gap={3}>
            <Stack>
              <Box sx={{ marginBottom: "10px" }}>
                <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                  State
                </Typography>
              </Box>
              <FormControl
                sx={{
                  minHeight: "30px",
                  marginLeft: "0px",
                  // width: matches ? "100%" : "50%",
                }}
                size="small"
              >
                <OutlinedInput
                  name="state"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.state}
                  placeholder="State"
                />
              </FormControl>
            </Stack>
            <Stack>
              <Box sx={{ marginBottom: "10px" }}>
                <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                  Country
                </Typography>
              </Box>
              <FormControl
                sx={{
                  minHeight: "30px",
                  marginLeft: "0px",
                  width: "100%",
                }}
                size="small"
              >
                <div className="form-control-wrap">
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
                </div>
              </FormControl>
            </Stack>
          </Stack>
          <Stack direction={"row"} sx={{ marginTop: "20px" }}>
            <Box>
              <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                Currency
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
              }}
              size="small"
            >
              <OutlinedInput
                type="text"
                id="currency"
                placeholder="Currency"
                name="currency"
                value={formik.values.currency}
                onChange={formik.handleChange}
                disabled={true}
              />
            </FormControl>
          </Stack>
        </Box>
        <Box
          sx={{
            position: "absolute",
            bottom: 10,
            right: 20,
          }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#481AA3",
              color: "#fff",
              border: "1px solid #5E17EB",
              boxShadow: "none",
              marginBottom: "10px",
              width: "190px",
              borderRadius: "4px",
              whiteSpace: "nowrap",
              "&:hover": {
                outline: "none",
                color: "#fff",
                backgroundColor: "#481AA3", // Remove border color on focus
              },
            }}
            onClick={formik.handleSubmit}
            disabled={loading}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}

export default EditMainAdressDrawer;
