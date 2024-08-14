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
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { db, storage } from "../../firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useFormik } from "formik";
import FileUploaderMultiple from "../../components/common/FileUploaderMultiple";
import { toast } from "react-toastify";

const initialValue = {
  productname: "",
  ordernumber: "",
  productid: "",
  storename: "",
  userName: "",
  routePartnerName: "",
  conditionPackage: "",
  serialnumberBox: "",
  serialnumberProduct: "",
  serialnumberInformation: "",
  packingColor: "",
  packingTool: "",
  packagingCheck: false,
  packageDamage: false,
  status: "",
  strainItems: "",
  commentFeedback: "",
  conditionUploadImg: "",
  conditionConfirmation: false,
  adminName: "",
  inspectionReport: "",
};

export default function ConditionForm() {
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
          formik.setFieldValue(
            "ordernumber",
            docSnap?.data()?.packageTrackingId
          );
          // formik.setFieldValue(
          //   "routePartnerName",
          //   docSnap?.data()?.routePartnerName
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const masterDataDocRef = doc(db, "masterData", "conditionForm");
        const docSnap = await getDoc(masterDataDocRef);

        if (docSnap.exists()) {
          const docData = docSnap.data();
          const newInspectionReport = `C-${docData.currentId
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

  const uploadFiles = async (files, values) => {
    const imgUrls = [];
    const uploadPromises = files.map(async (file) => {
      const storageRef = ref(storage, `/forms/${file.name}`);
      try {
        const uploadTask = uploadBytesResumable(storageRef, file);
        const logoUrl = await getDownloadURL(storageRef);
        imgUrls.push(logoUrl);
        formik.setFieldValue("conditionUploadImg", imgUrls);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    });
    // if (imgUrls.length > 0) {
    await Promise.all(uploadPromises);
    const docRef = setDoc(
      doc(db, "forms", itemId),
      {
        ConditionForm: {
          ...values,
          date: serverTimestamp(),
          isCondition: true,
          conditionUploadImg: imgUrls,
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

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (!selectedfiles) {
          const docRef = setDoc(
            doc(db, "forms", itemId),
            {
              ConditionForm: {
                date: serverTimestamp(),
                ...values,
                isCondition: true,
              },
            },
            { merge: true }
          ).then(async (res) => {
            toast.success("Condition Form added Successfully");
          });
        } else {
          uploadFiles(selectedfiles, values);
        }
      } catch (err) {
        console.log(err, "err");
      }
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
            Condition Inspection (Look & Feel)
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
                  placeholder="Order number"
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
                  id="productid"
                  disabled={true}
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
                  disabled={true}
                  placeholder="Admin name"
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
                    id="conditionPackage-label"
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
                    aria-labelledby="conditionPackage-label"
                    name="conditionPackage"
                    value={formik?.values?.conditionPackage}
                    onChange={(e) => {
                      formik.setFieldValue(
                        "conditionPackage",
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
                      name="conditionPackage"
                      id="conditionPackage-yes"
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio />}
                      label="No"
                      name="conditionPackage"
                      id="conditionPackage-no"
                    />
                    <FormControlLabel
                      value="Not certain"
                      control={<Radio />}
                      label="Not certain"
                      name="conditionPackage"
                      id="conditionPackage-not-certain"
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
                  onChange={formik.handleChange}
                  value={formik?.values?.serialnumberInformation}
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
                  What is the color of the item as specified in the packaging?
                </Typography>
                <TextField
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "45px",
                      padding: "0 16px",
                    },
                  }}
                  id="packingColor"
                  name="packingColor"
                  placeholder="Enter color name"
                  onChange={formik.handleChange}
                  value={formik?.values?.packingColor}
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
                  What is the color of the item in your view or as detected by
                  your tool?
                </Typography>
                <TextField
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "45px",
                      padding: "0 16px",
                    },
                  }}
                  id="packingTool"
                  name="packingTool"
                  placeholder="Enter color name"
                  onChange={formik.handleChange}
                  value={formik?.values?.packingTool}
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
                    id="packageDamage-label"
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
                    aria-labelledby="packageDamage-label"
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
                    onChange={(e) => {
                      formik.setFieldValue(
                        "status",
                        e.target.value === "true"
                          ? true
                          : e.target.value === "false"
                          ? false
                          : e.target.value
                      );
                    }}
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
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <FormControl>
                  <FormLabel
                    id="strainItems-label"
                    sx={{
                      marginRight: 2,
                      fontSize: "14px",
                      color: "#2e314a",
                      fontWeight: 500,
                      letterSpacing: "0.5px",
                    }}
                  >
                    Any stains to the items?
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="strainItems-label"
                    name="strainItems"
                    value={formik?.values?.strainItems}
                    onChange={(e) => {
                      formik.setFieldValue(
                        "strainItems",
                        e.target.value === "true"
                          ? true
                          : e.target.value === "false"
                          ? false
                          : e.target.value
                      );
                    }}
                  >
                    <FormControlLabel
                      value="New"
                      control={<Radio />}
                      label="New"
                      name="strainItems"
                      id="strainItems-new"
                    />
                    <FormControlLabel
                      value="Used"
                      control={<Radio />}
                      label="Used"
                      name="strainItems"
                      id="strainItems-used"
                    />
                    <FormControlLabel
                      value="Refrubrished"
                      control={<Radio />}
                      label="Refrubrished"
                      name="strainItems"
                      id="strainItems-refurbished"
                    />
                    <FormControlLabel
                      value="I dont know"
                      control={<Radio />}
                      label="I dont know"
                      name="strainItems"
                      id="strainItems-idontknow"
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
                value={formik?.values?.conditionUploadImg}
              />
            </Grid>
            <Grid item xs={12}>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox />}
                  label="I hereby confirm that I have completed the required functional check of the electronic equipment in accordance with company procedures. I attest that I have followed protocol and reported any discrepancies discovered during the check."
                  id="conditionConfirmation"
                  name="conditionConfirmation"
                  onChange={formik.handleChange}
                  value={formik?.values?.conditionConfirmation}
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
                defaultValue="nyka5"
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
        {/* <Button sx={{ marginTop: 2 }} variant="contained" component="span">
          Save
        </Button> */}
      </Box>
    </>
  );
}
