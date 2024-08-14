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
import { useFormik } from "formik";
import FileUploaderMultiple from "../../components/common/FileUploaderMultiple";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const initialValue = {
  productname: "",
  ordernumber: "",
  productid: "",
  storename: "",
  userName: "",
  routePartnerName: "",
  measurementPackage: "",
  serialnumberBox: "",
  serialnumberProduct: "",
  serialnumberInformation: "",
  clothMeasurement: {
    length: "",
    height: "",
    width: "",
  },
  neckAreaMeasurement: {
    length: "",
    width: "",
  },
  handAreaMeasurement: {
    length: "",
    width: "",
  },
  waistAreaMeasurement: {
    length: "",
    width: "",
  },
  legLength: {
    length: "",
    width: "",
  },
  capCircumferenceMeasurement: {
    deameter: "",
    radius: "",
  },
  shoesAllSize: {
    boxsize: "",
    embossedsize: "",
    inside: "",
    outside: "",
    samesize: false,
  },
  allOtherProducts: {
    length: "",
    width: "",
    height: "",
  },
  weightMeasurements: "",
  commentFeedback: "",
  measurementUploadImg: "",
  measurementsConfirmation: false,
  adminName: "",
  inspectionReport: "",
};

export default function MeasurementForm() {
  const [initialValues, setInitialValues] = useState(initialValue);
  const [itemData, setItemData] = useState([]);
  const [packageData, setPackageData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
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
          //  formik.setFieldValue(
          //    "routePartnerName",
          //    docSnap.data()?.routePartnerName
          //  );
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
        formik.setFieldValue("measurementUploadImg", imgUrls);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    });
    // if (imgUrls.length > 0) {
    await Promise.all(uploadPromises);
    const docRef = setDoc(
      doc(db, "forms", itemId),
      {
        MeasurementForm: {
          ...values,
          date: serverTimestamp(),
          measurementUploadImg: imgUrls,
          isMeasurement: true,
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

  const onUploadPhoto = (file) => {
    setSelectedFiles(file);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const masterDataDocRef = doc(db, "masterData", "measurementForm");
        const docSnap = await getDoc(masterDataDocRef);

        if (docSnap.exists()) {
          const docData = docSnap.data();
          const newInspectionReport = `M-${docData.currentId
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
      // console.log("Values", values);
      try {
        if (!selectedfiles) {
          const docRef = setDoc(
            doc(db, "forms", itemId),
            {
              MeasurementForm: {
                date: serverTimestamp(),
                ...values,
                isMeasurement: true,
              },
            },
            { merge: true }
          ).then(async (res) => {
            toast.success("Measurement Form added Successfully");
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
            Measurement Inspection
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
                  placeholder="RoutePartner Name"
                  name="routePartnerName"
                  value={formik?.values?.routePartnerName}
                  onChange={formik.handleChange}
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
                    id="measurementPackage-label"
                    sx={{
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
                    aria-labelledby="measurementPackage-label"
                    name="measurementPackage"
                    value={formik?.values?.measurementPackage}
                    onChange={(e) => {
                      formik.setFieldValue(
                        "measurementPackage",
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
                      name="measurementPackage"
                      id="measurementPackage-yes"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio />}
                      label="No"
                      name="measurementPackage"
                      id="measurementPackage-no"
                    />
                    <FormControlLabel
                      value="Not certain"
                      control={<Radio />}
                      name="measurementPackage"
                      id="measurementPackage-notcertain"
                      label="Not certain"
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
          </Grid>
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              marginBottom: 5,
              marginTop: 5,
              fontSize: "14px",
              color: "#2e314a",
              fontWeight: 600,
              letterSpacing: "0.5px",
            }}
          >
            CLOTHING ONLY
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography
                  sx={{
                    marginLeft: 2.5,
                    marginBottom: 2,
                    fontSize: "14px",
                    color: "#2e314a",
                    fontWeight: 600,
                    letterSpacing: "0.8px",
                  }}
                  id="clothMeasurement"
                >
                  Cloth general measurement :-
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ marginRight: 2, textAlign: "center" }}>
                    <Typography
                      sx={{
                        marginBottom: 0.5,
                        fontSize: "14px",
                      }}
                    >
                      Length
                    </Typography>
                    <TextField
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: "45px",
                          // padding: "0 16px",
                          width: "90px",
                        },
                      }}
                      placeholder="Length"
                      name="clothMeasurement.length"
                      value={formik?.values?.clothMeasurement?.length}
                      onChange={formik.handleChange}
                    />
                  </Box>
                  <Box sx={{ marginRight: 2, textAlign: "center" }}>
                    <Typography
                      sx={{
                        marginRight: 2,
                        marginBottom: 0.5,
                        fontSize: "14px",
                      }}
                    >
                      Width
                    </Typography>
                    <TextField
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: "45px",
                          // padding: "0 16px",
                          width: "90px",
                        },
                      }}
                      placeholder="Width"
                      name="clothMeasurement.width"
                      value={formik?.values?.clothMeasurement?.width}
                      onChange={formik.handleChange}
                    />
                  </Box>
                  <Box sx={{ textAlign: "center", marginRight: 2 }}>
                    <Typography
                      sx={{
                        marginRight: 2,
                        marginBottom: 0.5,
                        fontSize: "14px",
                      }}
                    >
                      Height
                    </Typography>
                    <TextField
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: "45px",
                          // padding: "0 16px",
                          width: "90px",
                        },
                      }}
                      placeholder="Height"
                      name="clothMeasurement.height"
                      value={formik?.values?.clothMeasurement?.height}
                      onChange={formik.handleChange}
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography
                  sx={{
                    marginLeft: 2.5,
                    marginBottom: 2,
                    fontSize: "14px",
                    color: "#2e314a",
                    fontWeight: 600,
                    letterSpacing: "0.8px",
                  }}
                  id="neckAreaMeasurement"
                >
                  Neck area measurement :-
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ marginRight: 2, textAlign: "center" }}>
                    <Typography
                      sx={{
                        marginBottom: 0.5,
                        fontSize: "14px",
                      }}
                    >
                      Length
                    </Typography>
                    <TextField
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: "45px",
                          // padding: "0 16px",
                          width: "90px",
                        },
                      }}
                      placeholder="Length"
                      name="neckAreaMeasurement.length"
                      value={formik?.values?.neckAreaMeasurement?.length}
                      onChange={formik.handleChange}
                    />
                  </Box>
                  <Box sx={{ marginRight: 2, textAlign: "center" }}>
                    <Typography
                      sx={{
                        marginRight: 2,
                        marginBottom: 0.5,
                        fontSize: "14px",
                      }}
                    >
                      Width
                    </Typography>
                    <TextField
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: "45px",
                          // padding: "0 16px",
                          width: "90px",
                        },
                      }}
                      placeholder="Width"
                      name="neckAreaMeasurement.width"
                      value={formik?.values?.neckAreaMeasurement?.width}
                      onChange={formik.handleChange}
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography
                  sx={{
                    marginLeft: 2.5,
                    marginBottom: 2,
                    fontSize: "14px",
                    color: "#2e314a",
                    fontWeight: 600,
                    letterSpacing: "0.8px",
                  }}
                  id="handAreaMeasurement"
                >
                  Hand area measurement :-
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ marginRight: 2, textAlign: "center" }}>
                    <Typography
                      sx={{
                        marginBottom: 0.5,
                        fontSize: "14px",
                      }}
                    >
                      Length
                    </Typography>
                    <TextField
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: "45px",
                          // padding: "0 16px",
                          width: "90px",
                        },
                      }}
                      placeholder="Length"
                      name="handAreaMeasurement.length"
                      value={formik?.values?.handAreaMeasurement?.length}
                      onChange={formik.handleChange}
                    />
                  </Box>
                  <Box sx={{ marginRight: 2, textAlign: "center" }}>
                    <Typography
                      sx={{
                        marginRight: 2,
                        marginBottom: 0.5,
                        fontSize: "14px",
                      }}
                    >
                      Width
                    </Typography>
                    <TextField
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: "45px",
                          // padding: "0 16px",
                          width: "90px",
                        },
                      }}
                      placeholder="Width"
                      name="handAreaMeasurement.width"
                      value={formik?.values?.handAreaMeasurement?.width}
                      onChange={formik.handleChange}
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography
                  sx={{
                    marginLeft: 2.5,
                    marginBottom: 2,
                    fontSize: "14px",
                    color: "#2e314a",
                    fontWeight: 600,
                    letterSpacing: "0.8px",
                  }}
                  id="waistAreaMeasurement"
                >
                  Waist area measurement :-
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ marginRight: 2, textAlign: "center" }}>
                    <Typography
                      sx={{
                        marginBottom: 0.5,
                        fontSize: "14px",
                      }}
                    >
                      Length
                    </Typography>
                    <TextField
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: "45px",
                          // padding: "0 16px",
                          width: "90px",
                        },
                      }}
                      placeholder="Length"
                      name="waistAreaMeasurement.length"
                      value={formik?.values?.waistAreaMeasurement?.length}
                      onChange={formik.handleChange}
                    />
                  </Box>
                  <Box sx={{ marginRight: 2, textAlign: "center" }}>
                    <Typography
                      sx={{
                        marginRight: 2,
                        marginBottom: 0.5,
                        fontSize: "14px",
                      }}
                    >
                      Width
                    </Typography>
                    <TextField
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: "45px",
                          // padding: "0 16px",
                          width: "90px",
                        },
                      }}
                      placeholder="Width"
                      name="waistAreaMeasurement.width"
                      value={formik?.values?.waistAreaMeasurement?.width}
                      onChange={formik.handleChange}
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography
                  sx={{
                    marginLeft: 2.5,
                    marginBottom: 2,
                    fontSize: "14px",
                    color: "#2e314a",
                    fontWeight: 600,
                    letterSpacing: "0.8px",
                  }}
                  id="legLength"
                >
                  Leg length :-
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ marginRight: 2, textAlign: "center" }}>
                    <Typography
                      sx={{
                        marginBottom: 0.5,
                        fontSize: "14px",
                      }}
                    >
                      Length
                    </Typography>
                    <TextField
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: "45px",
                          // padding: "0 16px",
                          width: "90px",
                        },
                      }}
                      placeholder="Length"
                      name="legLength.length"
                      value={formik?.values?.legLength?.length}
                      onChange={formik.handleChange}
                    />
                  </Box>
                  <Box sx={{ marginRight: 2, textAlign: "center" }}>
                    <Typography
                      sx={{
                        marginRight: 2,
                        marginBottom: 0.5,
                        fontSize: "14px",
                      }}
                    >
                      Width
                    </Typography>
                    <TextField
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: "45px",
                          // padding: "0 16px",
                          width: "90px",
                        },
                      }}
                      placeholder="Width"
                      name="legLength.width"
                      value={formik?.values?.legLength?.width}
                      onChange={formik.handleChange}
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Typography
            variant="h3"
            gutterBottom
            sx={{ marginBottom: 5, marginTop: 5 }}
          >
            CAP OR HAT ONLY
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography
                  sx={{
                    marginRight: 2,
                    marginBottom: 2,
                    fontSize: "14px",
                    color: "#2e314a",
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                  }}
                  id="capCircumferenceMeasurement"
                >
                  Circumference measurement :-
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ marginRight: 2 }}>
                    <Typography
                      sx={{
                        marginBottom: 0.5,
                        fontSize: "14px",
                      }}
                    >
                      (1) Deameter :-
                    </Typography>
                    <TextField
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: "45px",
                          padding: "0 16px",
                        },
                      }}
                      placeholder="Deameter"
                      id="capCircumferenceMeasurement.deameter"
                      onChange={formik.handleChange}
                      name="capCircumferenceMeasurement.deameter"
                      value={
                        formik?.values?.capCircumferenceMeasurement?.deameter
                      }
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography
                  sx={{
                    marginRight: 2,
                    marginBottom: 2,
                    fontSize: "14px",
                    color: "#2e314a",
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                    visibility: "hidden",
                  }}
                >
                  Circumference measurement :-
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ marginRight: 2 }}>
                    <Typography
                      sx={{
                        marginBottom: 0.5,
                        fontSize: "14px",
                      }}
                    >
                      (2) Radius :-
                    </Typography>
                    <TextField
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: "45px",
                          padding: "0 16px",
                        },
                      }}
                      placeholder="Radius"
                      id="capCircumferenceMeasurement.radius"
                      onChange={formik.handleChange}
                      name="capCircumferenceMeasurement.radius"
                      value={
                        formik?.values?.capCircumferenceMeasurement?.radius
                      }
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Typography
            variant="h3"
            gutterBottom
            sx={{ marginBottom: 5, marginTop: 5 }}
          >
            SHOES ONLY
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography
                  sx={{
                    marginRight: 2,
                    marginBottom: 2,
                    fontSize: "14px",
                    color: "#2e314a",
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                  }}
                  id="shoesAllSize"
                >
                  (1) Box size :-
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ marginRight: 2 }}>
                    <Typography
                      sx={{
                        marginBottom: 0.5,
                        fontSize: "14px",
                      }}
                    >
                      What is the mentioned shoe size on the box?
                    </Typography>
                    <TextField
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: "45px",
                          padding: "0 16px",
                        },
                      }}
                      id="shoesAllSize.boxsize"
                      placeholder="Enter size"
                      onChange={formik.handleChange}
                      name="shoesAllSize.boxsize"
                      value={formik?.values?.shoesAllSize?.boxsize}
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography
                  sx={{
                    marginRight: 2,
                    marginBottom: 2,
                    fontSize: "14px",
                    color: "#2e314a",
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                  }}
                  id="shoesAllSize"
                >
                  (2) Embossed Size :-
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ marginRight: 2 }}>
                    <Typography
                      sx={{
                        marginBottom: 0.5,
                        fontSize: "14px",
                      }}
                    >
                      What is the mentioned shoe size inside the shoe?
                    </Typography>
                    <TextField
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: "45px",
                          padding: "0 16px",
                        },
                      }}
                      id="shoesAllSize.embossedsize"
                      placeholder="Enter size"
                      onChange={formik.handleChange}
                      name="shoesAllSize.embossedsize"
                      value={formik?.values?.shoesAllSize?.embossedsize}
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography
                  sx={{
                    marginRight: 2,
                    marginBottom: 2,
                    fontSize: "14px",
                    color: "#2e314a",
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                  }}
                  id="shoesAllSize"
                >
                  (3) Inside :-
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ marginRight: 2 }}>
                    <Typography
                      sx={{
                        marginBottom: 0.5,
                        fontSize: "14px",
                      }}
                    >
                      What is the length from front to back
                    </Typography>
                    <TextField
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: "45px",
                          padding: "0 16px",
                        },
                      }}
                      id="shoesAllSize.inside"
                      placeholder="Enter size"
                      onChange={formik.handleChange}
                      name="shoesAllSize.inside"
                      value={formik?.values?.shoesAllSize?.inside}
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography
                  sx={{
                    marginRight: 2,
                    marginBottom: 2,
                    fontSize: "14px",
                    color: "#2e314a",
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                  }}
                  id="shoesAllSize"
                >
                  (4) Outside :-
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ marginRight: 2 }}>
                    <Typography
                      sx={{
                        marginBottom: 0.5,
                        fontSize: "14px",
                      }}
                    >
                      What is the length from front to back
                    </Typography>
                    <TextField
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: "45px",
                          padding: "0 16px",
                        },
                      }}
                      id="shoesAllSize.outside"
                      placeholder="Enter size"
                      onChange={formik.handleChange}
                      name="shoesAllSize.outside"
                      value={formik?.values?.shoesAllSize?.outside}
                    />
                  </Box>
                </Box>
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
                    letterSpacing: "0.5px",
                  }}
                >
                  Are both sides the same size?
                </Typography>
                <RadioGroup
                  row
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="shoesAllSize"
                  value={formik?.values?.shoesAllSize?.samesize}
                  onChange={(e) => {
                    formik.setFieldValue(
                      "shoesAllSize.samesize",
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
                    name="shoesAllSize.samesize"
                    id="shoesAllSize.samesize"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value={false}
                    id="shoesAllSize.samesize"
                    name="shoesAllSize.samesize"
                    control={<Radio />}
                    label="No"
                  />
                </RadioGroup>
              </Box>
            </Grid>
          </Grid>
          <Typography
            variant="h3"
            gutterBottom
            sx={{ marginBottom: 5, marginTop: 5 }}
          >
            ALL OTHER PRODUCTS
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography
                  sx={{
                    marginLeft: 2.5,
                    marginBottom: 1.5,
                    fontSize: "14px",
                    color: "#2e314a",
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                  }}
                >
                  What is the measure of the product or item?
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ marginRight: 2, textAlign: "center" }}>
                    <Typography
                      sx={{
                        marginBottom: 0.5,
                        fontSize: "14px",
                      }}
                    >
                      Length
                    </Typography>
                    <TextField
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: "45px",
                          // padding: "0 16px",
                          width: "90px",
                        },
                      }}
                      placeholder="length"
                      name="allOtherProducts.length"
                      value={formik?.values?.allOtherProducts?.length}
                      onChange={formik.handleChange}
                    />
                  </Box>
                  <Box sx={{ marginRight: 2, textAlign: "center" }}>
                    <Typography
                      sx={{
                        marginRight: 2,
                        marginBottom: 0.5,
                        fontSize: "14px",
                      }}
                    >
                      Width
                    </Typography>
                    <TextField
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: "45px",
                          // padding: "0 16px",
                          width: "90px",
                        },
                      }}
                      placeholder="width"
                      name="allOtherProducts.width"
                      value={formik?.values?.allOtherProducts?.width}
                      onChange={formik.handleChange}
                    />
                  </Box>
                  <Box sx={{ textAlign: "center", marginRight: 2 }}>
                    <Typography
                      sx={{
                        marginRight: 2,
                        marginBottom: 0.5,
                        fontSize: "14px",
                      }}
                    >
                      Height
                    </Typography>
                    <TextField
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: "45px",
                          // padding: "0 16px",
                          width: "90px",
                        },
                      }}
                      placeholder="height"
                      name="allOtherProducts.height"
                      value={formik?.values?.allOtherProducts?.height}
                      onChange={formik.handleChange}
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Typography
            variant="h3"
            gutterBottom
            sx={{ marginBottom: 5, marginTop: 5 }}
          >
            Weight measurement
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6}>
              <TextField
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: "45px",
                    padding: "0 16px",
                  },
                }}
                placeholder="Enter Weight Measurement"
                id="weightMeasurements"
                name="weightMeasurements"
                value={formik?.values?.weightMeasurements}
                onChange={formik.handleChange}
              />
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
                value={formik?.values?.measurementUploadImg}
              />
            </Grid>
            <Grid item xs={12}>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox />}
                  id="measurementsConfirmation"
                  name="measurementsConfirmation"
                  onChange={formik.handleChange}
                  value={formik?.values?.measurementsConfirmation}
                  label="I hereby confirm that I have completed the required functional check of the electronic equipment in accordance with company procedures. I attest that I have followed protocol and reported any discrepancies discovered during the check."
                />
              </FormGroup>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography sx={{ marginRight: 2 }}>Admin Name:-</Typography>
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
              <Typography sx={{ marginRight: 2 }}>
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
              <Typography sx={{ marginRight: 2 }}>
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
