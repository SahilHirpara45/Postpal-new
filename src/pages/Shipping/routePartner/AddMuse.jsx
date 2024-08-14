import React, { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import SidebarContext from "../../../context/SidebarContext";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import RoutePartnerHeader from "./RoutePartnerHeader";
import camera from "../../../assets/svg/camera.svg";
import SimpleBar from "simplebar-react";
import { useFormik } from "formik";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, storage } from "../../../firebaseConfig";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import FileUploaderMultiple from "../../../components/common/FileUploaderMultiple";
import Countries from "../../../Contries.json";

const initialValue = {
  addressLine1: "",
  addressLine2: "",
  contactPersonName: "",
  emailId: "",
  contactNumber: "",
  city: "",
  state: "",
  country: "",
  about: "",
  logoUrl: "",
  partnerType: "",
  isCrowdShipper: false,
  isTraveller: false,
  isStoreAgent: false,
  isNonProfit: false,
  name: "",
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required!"),
  contactPersonName: Yup.string().required("Contact person name is required!"),
  emailId: Yup.string().required("Email ID is required."),
  contactNumber: Yup.string().required("Contact Number is required."),
  addressLine1: Yup.string().required("Address Line 1 is required!"),
  addressLine2: Yup.string().required("Address Line 2 is required!"),
  city: Yup.string().required("City is required!"),
  state: Yup.string().required("State is required!"),
  country: Yup.string().required("Country is required!"),
  about: Yup.string().required("About is required!"),
  partnerType: Yup.string().required("Partner type is required!"),
});

export default function AddMuse() {
  const { open } = useContext(SidebarContext);

  const [selectedFiles, setSelectedFiles] = useState(null);
  const [initialValues, setInitialValues] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const addMuseFormik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      console.log(values, "values>>>");
      setLoading(true);
      const newValues = {
        ...values,
        isCrowdShipper: values.partnerType === "CrowdShipper",
        isTraveller: values.partnerType === "Traveller",
        isStoreAgent: values.partnerType === "StoreAgent",
        isNonProfit: values.partnerType === "NonProfit",
      };
      try {
        if (!selectedFiles || selectedFiles?.length === 0) {
          const docRef = await addDoc(collection(db, "musePartners"), {
            ...newValues,
            updatedAt: serverTimestamp(),
            createdAt: serverTimestamp(),
            routePartnerId: location?.state?.routerId,
            isDeleted: false,
          }).then(async (res) => {
            toast.success("Add Muse added Successfully");
            navigate("/shipping/route-partner");
            setLoading(false);
            resetForm();
          });
        } else if (selectedFiles) {
          const storageRef = ref(
            storage,
            `/musePartner/${selectedFiles[0]?.name}`
          );
          const uploadTask = uploadBytesResumable(
            storageRef,
            selectedFiles[0]
          ).then(async () => {
            const logoUrl = await getDownloadURL(storageRef);

            if (logoUrl) {
              const docRef = await addDoc(collection(db, "musePartners"), {
                ...newValues,
                updatedAt: serverTimestamp(),
                createdAt: serverTimestamp(),
                routePartnerId: location?.state?.routerId,
                isDeleted: false,
                logoUrl,
              }).then(async (res) => {
                toast.success("Add Muse added Successfully");
                navigate("/shipping/route-partner");
                setLoading(false);
                resetForm();
              });
            }
          });
        }
      } catch (error) {
        console.log(error, "error");
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    },
  });

  const onUploadChange = (file) => {
    console.log(file, "file");
    setSelectedFiles(file);
  };

  const handleCancle = () => {
    navigate("/shipping/route-partner");
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
          pageTitle={"Add A Muse"}
          handleCancle={() => handleCancle()}
          currentRoute="Add Muse"
          buttonName="Save"
          handleSave={addMuseFormik.handleSubmit}
          loading={loading}
        />
      </Box>
      <Box>
        <SimpleBar
          forceVisible="y"
          autoHide={true}
          style={{
            maxHeight: "80vh",
            ".simplebar-scrollbar": {
              background: "red",
            },
          }}
          className="custom-scrollbar"
        >
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: "24px",
                width: "200px",
              }}
            >
              <FileUploaderMultiple
                name={"images"}
                value={addMuseFormik.values.logoUrl}
                onChange={onUploadChange}
              />
            </Box>
            {addMuseFormik.touched.logoUrl && addMuseFormik.errors.logoUrl && (
              <span className="small text-danger">
                {addMuseFormik.errors.logoUrl}
              </span>
            )}
          </Box>
          <Box>
            <Box
              sx={{
                marginTop: "20px",
              }}
            >
              <Box>
                <Typography>What type of partner are you adding ?</Typography>
              </Box>
              <Box>
                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="partnerType"
                    name="partnerType"
                    row
                    value={addMuseFormik.values.partnerType}
                    onChange={addMuseFormik.handleChange}
                  >
                    <FormControlLabel
                      value="CrowdShipper"
                      control={<Radio />}
                      label="CrowdShipper"
                    />
                    <FormControlLabel
                      value="Traveller"
                      control={<Radio />}
                      label="Traveller"
                    />
                    <FormControlLabel
                      value="StoreAgent"
                      control={<Radio />}
                      label="Store Agent"
                      disabled
                    />
                    <FormControlLabel
                      value="NonProfit"
                      control={<Radio />}
                      label="Non-Profit"
                      disabled
                    />
                  </RadioGroup>
                </FormControl>
                {addMuseFormik.touched.partnerType &&
                  addMuseFormik.errors.partnerType && (
                    <span className="small text-danger">
                      {addMuseFormik.errors.partnerType}
                    </span>
                  )}
              </Box>
            </Box>
          </Box>
          <Box sx={{ marginTop: "20px" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ marginRight: "40px" }}>
                <Typography
                  sx={{ fontWeight: 600, fontSize: "14px", color: "#1C2630" }}
                >
                  Muse Name
                </Typography>
                <FormControl
                  sx={{
                    m: 1,
                    minHeight: "35px",
                    width: "330px",
                    marginX: "0px",
                  }}
                  size="small"
                >
                  <OutlinedInput
                    placeholder="Muse Name"
                    name="name"
                    value={addMuseFormik.values.name}
                    onChange={addMuseFormik.handleChange}
                    sx={{
                      marginX: "0px",
                      ".MuiOutlinedInput-notchedOutline": {
                        width: "330px",
                      },
                    }}
                  />
                  {addMuseFormik.touched.name && addMuseFormik.errors.name && (
                    <span className="small text-danger">
                      {addMuseFormik.errors.name}
                    </span>
                  )}
                </FormControl>
              </Box>
              <Box>
                <Typography
                  sx={{ fontWeight: 600, fontSize: "14px", color: "#1C2630" }}
                >
                  Contact Person Name
                </Typography>
                <FormControl
                  sx={{
                    m: 1,
                    minHeight: "35px",
                    width: "330px",
                    marginX: "0px",
                  }}
                  size="small"
                >
                  <OutlinedInput
                    name="contactPersonName"
                    placeholder="Contact Person Name"
                    value={addMuseFormik.values.contactPersonName}
                    onChange={addMuseFormik.handleChange}
                    sx={{
                      marginX: "0px",
                      ".MuiOutlinedInput-notchedOutline": {
                        width: "330px",
                      },
                    }}
                  />
                  {addMuseFormik.touched.contactPersonName &&
                    addMuseFormik.errors.contactPersonName && (
                      <span className="small text-danger">
                        {addMuseFormik.errors.contactPersonName}
                      </span>
                    )}
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
                  Email Id
                </Typography>
                <FormControl
                  sx={{
                    m: 1,
                    minHeight: "35px",
                    width: "330px",
                    marginX: "0px",
                  }}
                  size="small"
                >
                  <OutlinedInput
                    placeholder="Email Id"
                    name="emailId"
                    value={addMuseFormik.values.emailId}
                    onChange={addMuseFormik.handleChange}
                    sx={{
                      marginX: "0px",
                      ".MuiOutlinedInput-notchedOutline": {
                        width: "330px",
                      },
                    }}
                  />
                </FormControl>
                {addMuseFormik.touched.emailId &&
                  addMuseFormik.errors.emailId && (
                    <span className="small text-danger">
                      {addMuseFormik.errors.emailId}
                    </span>
                  )}
              </Box>
              <Box>
                <Typography
                  sx={{ fontWeight: 600, fontSize: "14px", color: "#1C2630" }}
                >
                  Contact Number
                </Typography>
                <FormControl
                  sx={{
                    m: 1,
                    minHeight: "35px",
                    width: "330px",
                    marginX: "0px",
                  }}
                  size="small"
                >
                  <OutlinedInput
                    name="contactNumber"
                    placeholder="Contact Number"
                    value={addMuseFormik.values.contactNumber}
                    onChange={addMuseFormik.handleChange}
                    sx={{
                      marginX: "0px",
                      ".MuiOutlinedInput-notchedOutline": {
                        width: "330px",
                      },
                    }}
                  />
                </FormControl>
                {addMuseFormik.touched.contactNumber &&
                  addMuseFormik.errors.contactNumber && (
                    <span className="small text-danger">
                      {addMuseFormik.errors.contactNumber}
                    </span>
                  )}
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <Box>
                <Typography
                  sx={{ fontWeight: 600, fontSize: "14px", color: "#1C2630" }}
                >
                  Address Line 1
                </Typography>
                <FormControl
                  sx={{
                    m: 1,
                    minHeight: "35px",
                    width: "700px",
                    marginX: "0px",
                  }}
                  size="small"
                >
                  <OutlinedInput
                    placeholder="Address Line 1"
                    name="addressLine1"
                    value={addMuseFormik.values.addressLine1}
                    onChange={addMuseFormik.handleChange}
                    sx={{
                      marginX: "0px",
                      ".MuiOutlinedInput-notchedOutline": {
                        width: "700px",
                      },
                    }}
                  />
                </FormControl>
                {addMuseFormik.touched.addressLine1 &&
                  addMuseFormik.errors.addressLine1 && (
                    <span className="small text-danger">
                      {addMuseFormik.errors.addressLine1}
                    </span>
                  )}
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <Box>
                <Typography
                  sx={{ fontWeight: 600, fontSize: "14px", color: "#1C2630" }}
                >
                  Address Line 2
                </Typography>
                <FormControl
                  sx={{
                    m: 1,
                    minHeight: "35px",
                    width: "700px",
                    marginX: "0px",
                  }}
                  size="small"
                >
                  <OutlinedInput
                    placeholder="Address Line 2"
                    name="addressLine2"
                    value={addMuseFormik.values.addressLine2}
                    onChange={addMuseFormik.handleChange}
                    sx={{
                      marginX: "0px",
                      ".MuiOutlinedInput-notchedOutline": {
                        width: "700px",
                      },
                    }}
                  />
                </FormControl>
                {addMuseFormik.touched.addressLine2 &&
                  addMuseFormik.errors.addressLine2 && (
                    <span className="small text-danger">
                      {addMuseFormik.errors.addressLine2}
                    </span>
                  )}
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
                  City
                </Typography>
                <FormControl
                  sx={{
                    m: 1,
                    minHeight: "35px",
                    width: "330px",
                    marginX: "0px",
                  }}
                  size="small"
                >
                  <OutlinedInput
                    name="city"
                    placeholder="City"
                    value={addMuseFormik.values.city}
                    onChange={addMuseFormik.handleChange}
                    sx={{
                      marginX: "0px",
                      ".MuiOutlinedInput-notchedOutline": {
                        width: "330px",
                      },
                    }}
                  />
                </FormControl>
                {addMuseFormik.touched.city && addMuseFormik.errors.city && (
                  <span className="small text-danger">
                    {addMuseFormik.errors.city}
                  </span>
                )}
              </Box>
              <Box>
                <Typography
                  sx={{ fontWeight: 600, fontSize: "14px", color: "#1C2630" }}
                >
                  State
                </Typography>
                <FormControl
                  sx={{
                    m: 1,
                    minHeight: "35px",
                    width: "330px",
                    marginX: "0px",
                  }}
                  size="small"
                >
                  <OutlinedInput
                    name="state"
                    placeholder="State"
                    value={addMuseFormik.values.state}
                    onChange={addMuseFormik.handleChange}
                    sx={{
                      marginX: "0px",
                      ".MuiOutlinedInput-notchedOutline": {
                        width: "330px",
                      },
                    }}
                  />
                </FormControl>
                {addMuseFormik.touched.state && addMuseFormik.errors.state && (
                  <span className="small text-danger">
                    {addMuseFormik.errors.state}
                  </span>
                )}
              </Box>
            </Box>
            <Box>
              <Typography
                sx={{ fontWeight: 600, fontSize: "14px", color: "#1C2630" }}
              >
                Country
              </Typography>
              <Box>
                <FormControl
                  sx={{
                    m: 1,
                    minWidth: 350,
                    minHeight: "35px",
                    marginLeft: "0px",
                  }}
                  size="small"
                >
                  <select
                    removeItemButton
                    name="country"
                    onChange={addMuseFormik.handleChange}
                    value={addMuseFormik.values.country}
                    defaultValue={addMuseFormik.values.country}
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
                {addMuseFormik.touched.country &&
                  addMuseFormik.errors.country && (
                    <span className="small text-danger">
                      {addMuseFormik.errors.country}
                    </span>
                  )}
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
                  About
                </Typography>
                <FormControl
                  sx={{
                    m: 1,
                    minHeight: "35px",
                    width: "330px",
                    marginX: "0px",
                  }}
                  size="small"
                >
                  <TextareaAutosize
                    name="about"
                    placeholder="About"
                    value={addMuseFormik.values.about}
                    onChange={addMuseFormik.handleChange}
                    aria-label="textarea"
                    minRows={4}
                    style={{
                      width: "700px",
                      border: "1px solid #E5E5E8",
                      borderRadius: "4px",
                      padding: "10px",
                      marginTop: "10px",
                      "&:focus": {
                        outline: "none",
                        borderColor: "transparent", // Remove border color on focus
                      },
                    }}
                  />
                </FormControl>
                {addMuseFormik.touched.about && addMuseFormik.errors.about && (
                  <span className="small text-danger">
                    {addMuseFormik.errors.about}
                  </span>
                )}
              </Box>
            </Box>
          </Box>
        </SimpleBar>
      </Box>
    </Box>
  );
}
