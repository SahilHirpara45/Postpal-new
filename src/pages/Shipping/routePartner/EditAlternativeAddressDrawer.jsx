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
import { Formik, useFormik } from "formik";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { toast } from "react-toastify";
import Countries from "../../../Contries.json";

const initialValue = {
  alternativeAddressName: "",
  address: "",
  zipCode: "",
  city: "",
  state: "",
  country: "",
};

function EditAlternativeAdressDrawer(props) {
  const [initialValues, setInitialValues] = useState(initialValue);
  const [loading, setLoading] = useState(false);

  // console.log(props, "props in EditAlternativeAddressModal");

  const alternativeAddressFormik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,

    onSubmit: async (values, { resetForm }) => {
      console.log(values, "values in EditAlternativeAddressModal");
      setLoading(true);
      if (props?.data?.alternativeAddressId) {
        try {
          await updateDoc(
            doc(
              db,
              "routePartnerMainAddress",
              props?.data?.addressId,
              "alternativeAddress",
              props?.data?.alternativeAddressId
            ),
            {
              ...values,
            }
          ).then((res) => {
            // console.log(res, "response in updated EditAlternativeAddressModal");
            toast.success("Alternative Address Updated Successfully!");
            props.onClose(true);
            setLoading(false);
          });
          setInitialValues(initialValue);
        } catch (error) {
          console.log(error, "error");
        }
      } else {
        try {
          const docRef = doc(
            db,
            "routePartnerMainAddress",
            props?.data?.addressId
          );
          const subcollectionRef = collection(docRef, "alternativeAddress");
          await addDoc(subcollectionRef, values).then((res) => {
            // console.log(res, "res in add EditAlternativeAddressModal");
            toast.success("Alternative Address Added Successfully!");
            props.onClose(true);
            setInitialValues(initialValue);
            setLoading(false);
          });
          resetForm();
        } catch (err) {
          console.log(err);
        }
      }
    },
  });

  useEffect(() => {
    const getForId = async () => {
      if (props?.data?.alternativeAddressId) {
        const docRef = doc(
          db,
          "routePartnerMainAddress",
          props.data.addressId,
          "alternativeAddress",
          props.data.alternativeAddressId
        );
        const docData = await getDoc(docRef);

        if (docData.exists()) {
          console.log(docData.data(), "docdata in EditAlternativeAddressModal");
          setInitialValues(docData.data());
          // alternativeAddressFormik.setFieldValue('country', docData.data().country)
        } else {
          console.log("No such document!");
        }
      }
    };
    getForId();
  }, [props?.data?.alternativeAddressId, props?.data?.addressId]);

  const closeDrawerHandler = () => {
    setInitialValues(initialValue);
    props.onClose();
  };

  return (
    <Drawer
      variant="temporary"
      anchor="right"
      open={props.open}
      onClose={() => closeDrawerHandler()}
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
            {props?.data?.alternativeAddressId
              ? "Edit Alternative Address"
              : "Add Alternative Address"}
          </Typography>
          <Box
            sx={{ paddingRight: "20px", cursor: "pointer" }}
            onClick={() => closeDrawerHandler()}
          >
            <img src={close} alt="close" />
          </Box>
        </Box>
        <Box sx={{ marginX: "20px" }}>
          <Stack direction={"row"} sx={{ marginTop: "20px" }}>
            <Box>
              <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                Alternative Address Name
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
                name="alternativeAddressName"
                type="text"
                placeholder="Alternative Address Name"
                onChange={alternativeAddressFormik.handleChange}
                value={alternativeAddressFormik.values.alternativeAddressName}
              />
            </FormControl>
          </Stack>
          <Stack direction={"row"} sx={{ marginTop: "20px" }}>
            <Box>
              <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                Address
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
                name="address"
                type="text"
                placeholder="Address"
                onChange={alternativeAddressFormik.handleChange}
                value={alternativeAddressFormik.values.address}
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
                  placeholder="Zip Code"
                  onChange={alternativeAddressFormik.handleChange}
                  value={alternativeAddressFormik.values.zipCode}
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
                  placeholder="City"
                  onChange={alternativeAddressFormik.handleChange}
                  value={alternativeAddressFormik.values.city}
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
                  placeholder="State"
                  onChange={alternativeAddressFormik.handleChange}
                  value={alternativeAddressFormik.values.state}
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
                <select
                  removeItemButton
                  name="country"
                  onChange={alternativeAddressFormik.handleChange}
                  value={alternativeAddressFormik.values.country}
                  defaultValue={alternativeAddressFormik.values.country}
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
            </Stack>
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
                backgroundColor: "#481AA3",
              },
            }}
            onClick={alternativeAddressFormik.handleSubmit}
            disabled={loading}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}

export default EditAlternativeAdressDrawer;
