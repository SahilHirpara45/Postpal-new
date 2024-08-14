import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Input,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useFormik } from "formik";
import { useLocation } from "react-router-dom";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db, storage } from "../../firebaseConfig";
import FileUploaderMultiple from "../../components/common/FileUploaderMultiple";
import { toast } from "react-toastify";
import { getDownloadURL, uploadBytesResumable, ref } from "firebase/storage";

const initialValue = {
  productname: "",
  ordernumber: "",
  productid: "",
  storename: "",
  userName: "",
  routePartnerName: "",
  inspectionPackage: "",
  serialnumberBox: "",
  serialnumberProduct: "",
  serialnumberInformation: "",
  packagingCheck: false,
  packageDamage: false,
  status: "",
  powerCheck: {
    charger: false,
    acCable: false,
    powerCode: false,
    powerOn: false,
  },
  soundCheck: false,
  maxSound: "",
  minSound: "",
  screenCheck: false,
  screenRunning: false,
  screenCrack: false,
  videoCheck: false,
  serialnumber: false,
  commentFeedback: "",
  inspectionUploadImg: "",
  inspectionConfirmation: false,
  adminName: "",
  inspectionReport: "",
};

export default function InspectionForm() {
  const location = useLocation();
  const [initialValues, setInitialValues] = useState(initialValue);
  const [itemData, setItemData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [packageData, setPackageData] = useState([]);
  const [selectedfiles, setSelectedFiles] = useState([]);

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const itemId = urlParams.get("itemId");

  useEffect(() => {
    const getForId = async () => {
      if (id) {
        const docRef = doc(db, "shelfPackages", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPackageData(docSnap.data());
          // setInitialValues(docSnap.data());
          formik.setFieldValue(
            "ordernumber",
            docSnap.data()?.packageTrackingId
          );
          // formik.setFieldValue(
          //   "routePartnerName",
          //   docSnap.data()?.routePartnerName
          // );
        } else {
          console.log("No such document!");
        }
      }
    };
    const getForItemId = async () => {
      if (itemId) {
        const docRef = doc(db, "items", itemId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // setOrderData(docSnap.data());
          // setInitialValues(docSnap.data());
          setItemData(docSnap.data());
          formik.setFieldValue("productname", docSnap.data()?.shortenedName);
          formik.setFieldValue("productid", docSnap.data()?.id);
        } else {
          console.log("No such document!");
        }
      }
    };
    getForId();
    getForItemId();
  }, [id, itemId]);

  const onUploadPhoto = (file) => {
    setSelectedFiles(file);
  };

  useEffect(() => {
    if (packageData?.userId) {
      const docRef = doc(db, "users", packageData?.userId);
      getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
          setCustomerData(docSnap.data());
          formik.setFieldValue("userName", docSnap?.data()?.name);
        } else {
          console.log("No such document!");
        }
      });
    }
  }, [packageData?.userId]);

  const uploadFiles = async (files, values) => {
    const imgUrls = [];
    const uploadPromises = files.map(async (file) => {
      const storageRef = ref(storage, `/forms/${file.name}`);
      try {
        const uploadTask = uploadBytesResumable(storageRef, file);
        const logoUrl = await getDownloadURL(storageRef);
        imgUrls.push(logoUrl);
        formik.setFieldValue("inspectionUploadImg", imgUrls);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    });
    // if (imgUrls.length > 0) {
    await Promise.all(uploadPromises);
    const docRef = setDoc(
      doc(db, "forms", itemId),
      {
        InspectionForm: {
          ...values,
          date: serverTimestamp(),
          isFunctionInspection: true,
          inspectionUploadImg: imgUrls,
        },
      },
      { merge: true }
    );
    // await docRef;
    // }

    try {
      await docRef;
      toast.success("All files uploaded successfully");
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Error uploading files");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const masterDataDocRef = doc(db, "masterData", "inspectionForm");
        const docSnap = await getDoc(masterDataDocRef);

        if (docSnap.exists()) {
          const docData = docSnap.data();
          const newInspectionReport = `F-${docData.currentId
            .toString()
            .slice(0, 3)}-${docData.currentId
            .toString()
            .slice(3, 6)}-${docData.currentId.toString().slice(6)}`;

          formik.setFieldValue("inspectionReport", newInspectionReport);
        }
      } catch (err) {
        console.log(err, "err");
      }
    };
    fetchData();
  }, []);

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: async (values) => {
      // console.log(values, ">>Values");
      try {
        if (!selectedfiles) {
          const docRef = setDoc(
            doc(db, "forms", itemId),
            {
              InspectionForm: {
                date: serverTimestamp(),
                isFunctionInspection: true,
                ...values,
              },
            },
            { merge: true }
          ).then(async (res) => {
            toast.success("Inspection Form added Successfully");
          });
        } else {
          uploadFiles(selectedfiles, values);
        }
      } catch (err) {
        console.log(err, "err");
      }
      // inspectionPrint.current = inspectionHtml(values);
      // downloadPDF(inspectionHtml(values));
    },
  });

  return (
    <>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ marginTop: 4 }}
      >
        <Paper
          style={{
            padding: 50,
            width: "80%",
            boxShadow: "0 1px 0 rgba(232, 231, 236, .5)",
            border: "1px solid #e8e7ec",
          }}
        >
          <Typography variant="h3" gutterBottom sx={{ marginBottom: 5 }}>
            Functional Inspection
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  sx={{
                    marginRight: 2,
                    fontSize: "14px",
                    color: "#2e314a",
                    fontWeight: 500,
                    letterSpacing: "0.5px",
                  }}
                >
                  Item Name:-
                </Typography>
                <TextField
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "45px",
                      padding: "0 16px",
                    },
                  }}
                  disabled={true}
                  id="productname"
                  onChange={formik.handleChange}
                  name="productname"
                  value={formik?.values?.productname}
                  placeholder="Product Name"
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  sx={{
                    marginRight: 2,
                    fontSize: "14px",
                    color: "#2e314a",
                    fontWeight: 500,
                    letterSpacing: "0.5px",
                  }}
                >
                  Package ID:-
                </Typography>
                <TextField
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "45px",
                      padding: "0 16px",
                    },
                  }}
                  id="ordernumber"
                  disabled={true}
                  onChange={formik.handleChange}
                  name="ordernumber"
                  value={formik?.values?.ordernumber}
                  placeholder="Enter package id"
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  sx={{
                    marginRight: 2,
                    fontSize: "14px",
                    color: "#2e314a",
                    fontWeight: 500,
                    letterSpacing: "0.5px",
                  }}
                >
                  Item ID:-
                </Typography>
                <TextField
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "45px",
                      padding: "0 16px",
                    },
                  }}
                  disabled={true}
                  id="productid"
                  placeholder="Enter product id"
                  onChange={formik.handleChange}
                  name="productid"
                  value={formik?.values?.productid}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  sx={{
                    marginRight: 2,
                    fontSize: "14px",
                    color: "#2e314a",
                    fontWeight: 500,
                    letterSpacing: "0.5px",
                  }}
                >
                  Store Name:-
                </Typography>
                <TextField
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "45px",
                      padding: "0 16px",
                    },
                  }}
                  id="storename"
                  placeholder="Enter store name"
                  onChange={formik.handleChange}
                  name="storename"
                  value={formik?.values?.storename}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  sx={{
                    marginRight: 2,
                    fontSize: "14px",
                    color: "#2e314a",
                    fontWeight: 500,
                    letterSpacing: "0.5px",
                  }}
                >
                  Report is prepared onbehalf of:-
                </Typography>
                <TextField
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "45px",
                      padding: "0 16px",
                    },
                  }}
                  id="userName"
                  disabled={true}
                  placeholder="App user name"
                  name="userName"
                  // onChange={formik.handleChange}
                  value={formik?.values?.userName || ""}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  sx={{
                    marginRight: 2,
                    fontSize: "14px",
                    color: "#2e314a",
                    fontWeight: 500,
                    letterSpacing: "0.5px",
                  }}
                >
                  Report is completed by:-
                </Typography>
                <TextField
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "45px",
                      padding: "0 16px",
                    },
                  }}
                  id="routePartnerName"
                  disabled={true}
                  placeholder="Route partner name"
                  name="routePartnerName"
                  onChange={formik.handleChange}
                  value={formik?.values?.routePartnerName}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ marginTop: 4 }}
      >
        <Paper
          style={{
            padding: 50,
            width: "80%",
            boxShadow: "0 1px 0 rgba(232, 231, 236, .5)",
            border: "1px solid #e8e7ec",
          }}
        >
          <Typography variant="h3" gutterBottom sx={{ marginBottom: 5 }}>
            Content Check
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <FormControl>
                  <FormLabel
                    id="inspectionPackage-label"
                    sx={{
                      marginRight: 2,
                      fontSize: "14px",
                      color: "#2e314a",
                      fontWeight: 500,
                      letterSpacing: "0.5px",
                    }}
                  >
                    In your view, is the package description the same as the
                    item inside the box?
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="inspectionPackage-label"
                    name="inspectionPackage"
                    value={formik.values.inspectionPackage}
                    onChange={(e) => {
                      formik.setFieldValue(
                        "inspectionPackage",
                        e.target.value === "true"
                          ? true
                          : e.target.value === "false"
                          ? false
                          : e.target.value
                      );
                    }}
                  >
                    <FormControlLabel
                      value={true}
                      control={<Radio />}
                      // checked={formik?.values?.inspectionPackage === true}
                      label="Yes"
                      name="inspectionPackage"
                      id="inspectionPackage"
                    />
                    <FormControlLabel
                      value={false}
                      // checked={formik?.values?.inspectionPackage === false}
                      control={<Radio />}
                      label="No"
                      name="inspectionPackage"
                      id="inspectionPackage"
                    />
                    <FormControlLabel
                      value="Not certain"
                      // checked={
                      //   formik?.values?.inspectionPackage === "Not certain"
                      // }
                      control={<Radio />}
                      label="Not certain"
                      name="inspectionPackage"
                      id="inspectionPackage"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography
                  sx={{
                    marginRight: 2,
                    marginBottom: 0.5,
                    fontSize: "14px",
                    color: "#2e314a",
                    fontWeight: 500,
                    letterSpacing: "0.5px",
                  }}
                >
                  Serial number on box:-
                </Typography>
                <TextField
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "45px",
                      padding: "0 16px",
                    },
                  }}
                  id="serialnumberBox"
                  name="serialnumberBox"
                  onChange={formik.handleChange}
                  value={formik?.values?.serialnumberBox}
                  placeholder="Enter serial number"
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography
                  sx={{
                    marginRight: 2,
                    marginBottom: 0.5,
                    fontSize: "14px",
                    color: "#2e314a",
                    fontWeight: 500,
                    letterSpacing: "0.5px",
                  }}
                >
                  Serial number from on the product:-
                </Typography>
                <TextField
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "45px",
                      padding: "0 16px",
                    },
                  }}
                  id="serialnumberProduct"
                  name="serialnumberProduct"
                  onChange={formik.handleChange}
                  value={formik?.values?.serialnumberProduct}
                  placeholder="Enter serial number"
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography
                  sx={{
                    marginRight: 2,
                    marginBottom: 0.5,
                    fontSize: "14px",
                    color: "#2e314a",
                    fontWeight: 500,
                    letterSpacing: "0.5px",
                  }}
                >
                  Serial number from on software information page:-
                </Typography>
                <TextField
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "45px",
                      padding: "0 16px",
                    },
                  }}
                  id="serialnumberInformation"
                  name="serialnumberInformation"
                  placeholder="Enter serial number"
                  onChange={formik.handleChange}
                  value={formik?.values?.serialnumberInformation}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography
                  sx={{
                    marginRight: 2,
                    marginBottom: 0.5,
                    fontSize: "14px",
                    color: "#2e314a",
                    fontWeight: 500,
                    letterSpacing: "0.5px",
                  }}
                >
                  Report is prepared onbehalf of:-
                </Typography>
                <TextField
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "45px",
                      padding: "0 16px",
                    },
                  }}
                  id="userName"
                  disabled={true}
                  placeholder="App user name"
                  name="userName"
                  // onChange={formik.handleChange}
                  value={formik?.values?.userName || ""}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography
                  sx={{
                    marginRight: 2,
                    marginBottom: 0.5,
                    fontSize: "14px",
                    color: "#2e314a",
                    fontWeight: 500,
                    letterSpacing: "0.5px",
                  }}
                >
                  Report is completed by:-
                </Typography>
                <TextField
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "45px",
                      padding: "0 16px",
                    },
                  }}
                  id="routePartnerName"
                  disabled={true}
                  placeholder="Admin name"
                  name="routePartnerName"
                  onChange={formik.handleChange}
                  value={formik?.values?.routePartnerName}
                />
              </Box>
            </Grid>
          </Grid>
          <Typography
            variant="h3"
            gutterBottom
            sx={{ marginBottom: 5, marginTop: 5 }}
          >
            Packaging Check
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <FormControl>
                  <FormLabel
                    id="packagingCheck-label"
                    sx={{
                      marginRight: 2,
                      fontSize: "14px",
                      color: "#2e314a",
                      fontWeight: 500,
                      letterSpacing: "0.5px",
                    }}
                  >
                    Any signs of damage to the outer box or packaging?
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="packagingCheck-label"
                    name="packagingCheck"
                    value={formik?.values?.packagingCheck}
                    onChange={(e) => {
                      formik.setFieldValue(
                        "packagingCheck",
                        e.target.value === "true"
                          ? true
                          : e.target.value === "false"
                          ? false
                          : e.target.value
                      );
                    }}
                  >
                    <FormControlLabel
                      value={true}
                      control={<Radio />}
                      label="Yes"
                      name="packagingCheck"
                      id="packagingCheck-yes"
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio />}
                      label="No"
                      name="packagingCheck"
                      id="packagingCheck-no"
                    />
                    <FormControlLabel
                      value="Minimal"
                      control={<Radio />}
                      label="Minimal"
                      name="packagingCheck"
                      id="packagingCheck-minimal"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <FormControl>
                  <FormLabel
                    id="packagingDamage-label"
                    sx={{
                      marginRight: 2,
                      fontSize: "14px",
                      color: "#2e314a",
                      fontWeight: 500,
                      letterSpacing: "0.5px",
                    }}
                  >
                    Any signs of damage to the item?
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="packagingDamage-label"
                    name="packageDamage"
                    value={formik?.values?.packageDamage}
                    onChange={(e) => {
                      formik.setFieldValue(
                        "packageDamage",
                        e.target.value === "true"
                          ? true
                          : e.target.value === "false"
                          ? false
                          : e.target.value
                      );
                    }}
                  >
                    <FormControlLabel
                      value={true}
                      control={<Radio />}
                      label="Yes"
                      name="packageDamage"
                      id="packageDamage-yes"
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio />}
                      label="No"
                      name="packageDamage"
                      id="packageDamage-no"
                    />
                    <FormControlLabel
                      value="Minimal"
                      control={<Radio />}
                      label="Minimal"
                      name="packageDamage"
                      id="packageDamage-minimal"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <FormControl>
                  <FormLabel
                    id="status-label"
                    sx={{
                      marginRight: 2,
                      fontSize: "14px",
                      color: "#2e314a",
                      fontWeight: 500,
                      letterSpacing: "0.5px",
                    }}
                  >
                    Would you consider this New, Used, or Refrubrished?
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="status-label"
                    name="status"
                    value={formik?.values?.status}
                    onChange={formik.handleChange}
                  >
                    <FormControlLabel
                      value="New"
                      control={<Radio />}
                      label="New"
                      name="status"
                      id="status-new"
                    />
                    <FormControlLabel
                      value="Used"
                      control={<Radio />}
                      label="Used"
                      name="status"
                      id="status-used"
                    />
                    <FormControlLabel
                      value="Refrubrished"
                      control={<Radio />}
                      label="Refrubrished"
                      name="status"
                      id="status-refurbished"
                    />
                    <FormControlLabel
                      value="I dont know"
                      control={<Radio />}
                      label="I dont know"
                      name="status"
                      id="status-idontknow"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
          <Typography
            variant="h3"
            gutterBottom
            sx={{ marginBottom: 5, marginTop: 5 }}
          >
            Power Check
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <FormControl>
                  <FormLabel
                    id="powerCheck-label"
                    sx={{
                      marginRight: 2,
                      fontSize: "14px",
                      color: "#2e314a",
                      fontWeight: 500,
                      letterSpacing: "0.5px",
                    }}
                  >
                    Does this come with charger or other AC cable and power
                    code?
                  </FormLabel>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      sx={{
                        marginRight: 2,
                        fontSize: "14px",
                        color: "#2e314a",
                        fontWeight: 500,
                        letterSpacing: "0.5px",
                      }}
                    >
                      Charger
                    </Typography>
                    <RadioGroup
                      row
                      aria-labelledby="powerCheck-label"
                      name="powerCheck.charger"
                      value={formik?.values?.powerCheck?.charger}
                      onChange={(e) => {
                        formik.setFieldValue(
                          "powerCheck.charger",
                          e.target.value === "true"
                            ? true
                            : e.target.value === "false"
                            ? false
                            : e.target.value
                        );
                      }}
                    >
                      <FormControlLabel
                        value={true}
                        name="powerCheck.charger"
                        id="chargerYes"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value={false}
                        name="powerCheck.charger"
                        id="chargerNo"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      sx={{
                        marginRight: 2,
                        fontSize: "14px",
                        color: "#2e314a",
                        fontWeight: 500,
                        letterSpacing: "0.5px",
                      }}
                    >
                      Ac Cabel
                    </Typography>
                    <RadioGroup
                      row
                      aria-labelledby="powerCheck-label"
                      name="powerCheck.acCable"
                      value={formik?.values?.powerCheck?.acCable}
                      onChange={(e) => {
                        formik.setFieldValue(
                          "powerCheck.acCable",
                          e.target.value === "true"
                            ? true
                            : e.target.value === "false"
                            ? false
                            : e.target.value
                        );
                      }}
                    >
                      <FormControlLabel
                        value={true}
                        id="acCableYes"
                        name="powerCheck.acCable"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value={false}
                        id="acCableNo"
                        name="powerCheck.acCable"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      sx={{
                        marginRight: 2,
                        fontSize: "14px",
                        color: "#2e314a",
                        fontWeight: 500,
                        letterSpacing: "0.5px",
                      }}
                    >
                      Power code
                    </Typography>
                    <RadioGroup
                      row
                      aria-labelledby="powerCheck-label"
                      name="powerCheck.powerCode"
                      value={formik?.values?.powerCheck?.powerCode}
                      onChange={(e) => {
                        formik.setFieldValue(
                          "powerCheck.powerCode",
                          e.target.value === "true"
                            ? true
                            : e.target.value === "false"
                            ? false
                            : e.target.value
                        );
                      }}
                    >
                      <FormControlLabel
                        value={true}
                        id="powerCodeYes"
                        name="powerCheck.powerCode"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value={false}
                        id="powerCodeNo"
                        name="powerCheck.powerCode"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      sx={{
                        marginRight: 2,
                        fontSize: "14px",
                        color: "#2e314a",
                        fontWeight: 500,
                        letterSpacing: "0.5px",
                      }}
                    >
                      Does the electronic power on?
                    </Typography>
                    <RadioGroup
                      row
                      aria-labelledby="powerCheck-label"
                      name="powerCheck.powerOn"
                      value={formik?.values?.powerCheck?.powerOn}
                      onChange={(e) => {
                        formik.setFieldValue(
                          "powerCheck.powerOn",
                          e.target.value === "true"
                            ? true
                            : e.target.value === "false"
                            ? false
                            : e.target.value
                        );
                      }}
                    >
                      <FormControlLabel
                        value={true}
                        id="powerOnYes"
                        name="powerCheck.powerOn"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value={false}
                        id="powerOnNo"
                        name="powerCheck.powerOn"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </Box>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
          <Typography
            variant="h3"
            gutterBottom
            sx={{ marginBottom: 5, marginTop: 5 }}
          >
            Sound Check
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <FormControl>
                  <FormLabel
                    id="soundCheck-label"
                    sx={{
                      marginRight: 2,
                      fontSize: "14px",
                      color: "#2e314a",
                      fontWeight: 500,
                      letterSpacing: "0.5px",
                    }}
                  >
                    Does this item produce sounds
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="soundCheck-label"
                    name="soundCheck"
                    value={formik?.values?.soundCheck}
                    onChange={(e) => {
                      formik.setFieldValue(
                        "soundCheck",
                        e.target.value === "true"
                          ? true
                          : e.target.value === "false"
                          ? false
                          : e.target.value
                      );
                    }}
                  >
                    <FormControlLabel
                      value={true}
                      name="soundCheck"
                      id="soundCheck-yes"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value={false}
                      name="soundCheck"
                      id="soundCheck-no"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography
                  sx={{
                    marginRight: 2,
                    marginBottom: 0.5,
                    fontSize: "14px",
                    color: "#2e314a",
                    fontWeight: 500,
                    letterSpacing: "0.5px",
                  }}
                >
                  Max Sound:-
                </Typography>
                <TextField
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "45px",
                      padding: "0 16px",
                    },
                  }}
                  id="maxSound"
                  name="maxSound"
                  onChange={formik.handleChange}
                  value={formik?.values?.maxSound}
                  placeholder="Enter Max sound"
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography
                  sx={{
                    marginRight: 2,
                    marginBottom: 0.5,
                    fontSize: "14px",
                    color: "#2e314a",
                    fontWeight: 500,
                    letterSpacing: "0.5px",
                  }}
                >
                  Minimum Sound:-
                </Typography>
                <TextField
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "45px",
                      padding: "0 16px",
                    },
                  }}
                  id="minSound"
                  name="minSound"
                  onChange={formik.handleChange}
                  value={formik?.values?.minSound}
                  placeholder="Enter Min sound"
                />
              </Box>
            </Grid>
          </Grid>
          <Typography
            variant="h3"
            gutterBottom
            sx={{ marginBottom: 5, marginTop: 5 }}
          >
            Screen Check
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <FormControl>
                  <FormLabel
                    id="screenCheck-label"
                    sx={{
                      marginRight: 2,
                      fontSize: "14px",
                      color: "#2e314a",
                      fontWeight: 500,
                      letterSpacing: "0.5px",
                    }}
                  >
                    Any visible damage to the screen?
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="screenCheck-label"
                    name="screenCheck"
                    value={formik?.values?.screenCheck}
                    onChange={(e) => {
                      formik.setFieldValue(
                        "screenCheck",
                        e.target.value === "true"
                          ? true
                          : e.target.value === "false"
                          ? false
                          : e.target.value
                      );
                    }}
                  >
                    <FormControlLabel
                      value={true}
                      name="screenCheck"
                      id="screenCheck-yes"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value={false}
                      name="screenCheck"
                      id="screenCheck-no"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <FormControl>
                  <FormLabel
                    id="screenRunning-label"
                    sx={{
                      marginRight: 2,
                      fontSize: "14px",
                      color: "#2e314a",
                      fontWeight: 500,
                      letterSpacing: "0.5px",
                    }}
                  >
                    Do you see any running lines across any part of the screen?
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="screenRunning-label"
                    name="screenRunning"
                    value={formik?.values?.screenRunning}
                    onChange={(e) => {
                      formik.setFieldValue(
                        "screenRunning",
                        e.target.value === "true"
                          ? true
                          : e.target.value === "false"
                          ? false
                          : e.target.value
                      );
                    }}
                  >
                    <FormControlLabel
                      value={true}
                      name="screenRunning"
                      id="screenRunning-yes"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio />}
                      label="No"
                      name="screenRunning"
                      id="screenRunning-no"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <FormControl>
                  <FormLabel
                    id="screenCrack-label"
                    sx={{
                      marginRight: 2,
                      fontSize: "14px",
                      color: "#2e314a",
                      fontWeight: 500,
                      letterSpacing: "0.5px",
                    }}
                  >
                    Do you see any crack or peel on the screen?
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="screenCrack-label"
                    name="screenCrack"
                    value={formik?.values?.screenCrack}
                    onChange={(e) => {
                      formik.setFieldValue(
                        "screenCrack",
                        e.target.value === "true"
                          ? true
                          : e.target.value === "false"
                          ? false
                          : e.target.value
                      );
                    }}
                  >
                    <FormControlLabel
                      value={true}
                      name="screenCrack"
                      id="screenCrack-yes"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value={false}
                      name="screenCrack"
                      id="screenCrack-no"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
          <Typography
            variant="h3"
            gutterBottom
            sx={{ marginBottom: 5, marginTop: 5 }}
          >
            Video Check
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <FormControl>
                  <FormLabel
                    id="videoCheck-label"
                    sx={{
                      marginRight: 2,
                      fontSize: "14px",
                      color: "#2e314a",
                      fontWeight: 500,
                      letterSpacing: "0.5px",
                    }}
                  >
                    Are you able to see image on the screen?
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="videoCheck-label"
                    name="videoCheck"
                    value={formik?.values?.videoCheck}
                    onChange={(e) => {
                      formik.setFieldValue(
                        "videoCheck",
                        e.target.value === "true"
                          ? true
                          : e.target.value === "false"
                          ? false
                          : e.target.value
                      );
                    }}
                  >
                    <FormControlLabel
                      value={true}
                      control={<Radio />}
                      label="Yes"
                      name="videoCheck"
                      id="videoCheck-yes"
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio />}
                      label="No"
                      name="videoCheck"
                      id="videoCheck-no"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <FormControl>
                  <FormLabel
                    id="serialnumber-label"
                    sx={{
                      marginRight: 2,
                      fontSize: "14px",
                      color: "#2e314a",
                      fontWeight: 500,
                      letterSpacing: "0.5px",
                    }}
                  >
                    Is the image or video clearly visible?
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="serialnumber-label"
                    name="serialnumber"
                    value={formik?.values?.serialnumber}
                    onChange={(e) => {
                      formik.setFieldValue(
                        "serialnumber",
                        e.target.value === "true"
                          ? true
                          : e.target.value === "false"
                          ? false
                          : e.target.value
                      );
                    }}
                  >
                    <FormControlLabel
                      value={true}
                      control={<Radio />}
                      label="Yes"
                      name="serialnumber"
                      id="serialnumber-yes"
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio />}
                      label="No"
                      name="serialnumber"
                      id="serialnumber-no"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
          <Typography
            variant="h3"
            gutterBottom
            sx={{ marginBottom: 5, marginTop: 3 }}
          >
            Add your comments and feedback
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  id="commentFeedback"
                  placeholder="Start typing"
                  onChange={formik.handleChange}
                  name="commentFeedback"
                  value={formik?.values?.commentFeedback}
                />
              </Box>
            </Grid>
          </Grid>
          <Typography
            variant="h3"
            gutterBottom
            sx={{ marginBottom: 5, marginTop: 3 }}
          >
            Upload Images
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FileUploaderMultiple
                onChange={onUploadPhoto}
                // maxFiles={4}
                value={formik?.values?.inspectionUploadImg}
              />
            </Grid>
            <Grid item xs={12}>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox />}
                  id="inspectionConfirmation"
                  name="inspectionConfirmation"
                  onChange={formik.handleChange}
                  value={formik?.values?.inspectionConfirmation}
                  label="I hereby confirm that I have completed the required functional check of the electronic equipment in accordance with company procedures. I attest that I have followed protocol and reported any discrepancies discovered during the check."
                />
              </FormGroup>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                sx={{
                  marginRight: 2,
                  fontSize: "14px",
                  color: "#2e314a",
                  fontWeight: 500,
                  letterSpacing: "0.5px",
                }}
              >
                Admin Name:-
              </Typography>
              <TextField
                sx={{
                  marginTop: 2,
                  "& .MuiOutlinedInput-root": {
                    height: "45px",
                    padding: "0 16px",
                  },
                }}
                id="adminName"
                name="adminName"
                value={formik?.values?.adminName}
                onChange={formik.handleChange}
                placeholder="Admin Name"
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                sx={{
                  marginRight: 2,
                  fontSize: "14px",
                  color: "#2e314a",
                  fontWeight: 500,
                  letterSpacing: "0.5px",
                }}
              >
                Route partner name:-
              </Typography>
              <TextField
                sx={{
                  marginTop: 2,
                  "& .MuiOutlinedInput-root": {
                    height: "45px",
                    padding: "0 16px",
                  },
                }}
                disabled={true}
                id="routePartnerName"
                value={formik?.values?.routePartnerName}
                onChange={formik.handleChange}
                name="routePartnerName"
                placeholder="Route partner name"
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                sx={{
                  marginRight: 2,
                  fontSize: "14px",
                  color: "#2e314a",
                  fontWeight: 500,
                  letterSpacing: "0.5px",
                }}
              >
                Inspection report number:-
              </Typography>
              <TextField
                sx={{
                  marginTop: 2,
                  "& .MuiOutlinedInput-root": {
                    height: "45px",
                    padding: "0 16px",
                  },
                }}
                disabled={true}
                id="inspectionReport"
                name="inspectionReport"
                placeholder="Inspection report number"
                onChange={formik.handleChange}
                value={formik?.values?.inspectionReport}
              />
            </Box>
          </Grid>
        </Paper>
      </Grid>
      <Box sx={{ marginLeft: "10%" }}>
        <Button
          sx={{ marginTop: 2, marginRight: 3 }}
          variant="contained"
          component="span"
          onClick={formik.handleSubmit}
        >
          Submit
        </Button>
        {/* <Button
          sx={{ marginTop: 2 }}
          variant="contained"
          component="span"
          onClick={formik.handleSubmit}
        >
          Save
        </Button> */}
      </Box>
    </>
  );
}
