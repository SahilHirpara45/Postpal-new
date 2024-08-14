import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import Drawer from "@mui/material/Drawer";
import {
  Box,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputBase,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import close from "../assets/svg/drawer_close.svg";
import copy from "../assets/svg/copy.svg";
import like from "../assets/svg/like.svg";
import unlike from "../assets/svg/unlike.svg";
import refresh from "../assets/svg/refresh.svg";
import camera from "../assets/svg/camera.svg";
import speaker from "../assets/svg/speaker.svg";
import send from "../assets/svg/send.svg";
import chat_sender from "../assets/svg/chat_sender.svg";
import chat_receiver from "../assets/svg/chat_receiver.svg";
import volumn from "../assets/svg/volume.svg";
import volumn_on from "../assets/svg/volume_on.svg";
import volumn_off from "../assets/svg/volume_off.svg";
import SimpleBar from "simplebar-react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, storage } from "../firebaseConfig";
import { toast } from "react-toastify";
import Webcam from "react-webcam";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import CameraModal from "./CameraModal";
import { getNextPackageId } from "./common/helper";

const initialValue = {
  trackingNumber: "",
  isNoTracking: false,
  suiteNumber: "",
  isNoSuite: false,
  brand: {
    brandName: "",
    brandLogo: "",
  },
  isUnknown: false,
  merchantIndicator: "",
  packageTotalWeight: 0,
  shelfId: "",
  dimensionL: 0,
  dimensionW: 0,
  dimensionH: 0,
  packageName: "",
  packagePhotos: [],
};

const validationSchema = Yup.object({
  trackingNumber: Yup.string().when("isNoTracking", {
    is: false,
    then: () => Yup.string().required("Tracking number is required!"),
  }),
  // suiteNumber: Yup.string().required("Required"),
  // brand: Yup.object().shape({
  //   brandName: Yup.string().required("Required"),
  //   brandLogo: Yup.string().required("Required"),
  // }),
  // merchantIndicator: Yup.string().required("Required"),
  // packageTotalWeight: Yup.number().required("Required"),
  // shelfId: Yup.string().required("Required"),
  // dimensionL: Yup.number().required("Required"),
  // dimensionW: Yup.number().required("Required"),
  // dimensionH: Yup.number().required("Required"),
  // packageName: Yup.string().required("Required"),
  // packagePhotos: Yup.array().required("Required"),
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      "& .MuiMenuItem-root": {
        "&:hover": {
          backgroundColor: "lightgray !important",
        },
      },
    },
  },
};

const ReceivingWorkStationDrawer = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [loadingPackage, setLoadingPackage] = useState(false);
  const [initialValues, setInitialValues] = useState(initialValue);
  const [brands, setBrands] = useState([]);
  const [packageData, setPackageData] = useState({});
  const [isFocused, setIsFocused] = useState(false);
  const [openCameraModal, setOpenCameraModal] = useState(false);
  const [photos, setPhotos] = useState([]);
  const webcamRef = useRef(null);
  const [hasCamera, setHasCamera] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "brands"));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const brandsArray = [];
        querySnapshot.forEach((doc) => {
          brandsArray.push({ id: doc.id, ...doc.data() });
        });
        setBrands(brandsArray);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching brand data: ", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // useEffect(() => {
  const checkCamera = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      // console.log(devices, "devices");
      const hasVideoInput = devices.some(
        (device) => device.kind === "videoinput"
      );
      // setHasCamera(hasVideoInput);
      return hasVideoInput;
    } catch (error) {
      console.error("Error checking for camera:", error);
      // setHasCamera(false);
      return false;
    }
  };

  // checkCamera();
  // }, []);

  const handleOpen = async () => {
    const checkForCamera = await checkCamera();
    // console.log(checkForCamera, "checkForCamera");
    if (checkForCamera) {
      setOpenCameraModal(true);
    } else {
      toast.error("No camera found");
    }
  };
  const handleClose = () => setOpenCameraModal(false);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log("Form values:", values);
      setLoading(true);
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2); // Get the last two digits of the year
      const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Get the month and pad with leading zero if needed

      const currentDate = `${year}-${month}`;
      // console.log(currentDate, "currentDate");

      const freeStorageDate = new Date(date);
      freeStorageDate.setDate(freeStorageDate.getDate() + 30);

      const paidStorageDate = new Date(date);
      paidStorageDate.setDate(paidStorageDate.getDate() + 60);

      const abandonedDate = new Date(date);
      abandonedDate.setDate(abandonedDate.getDate() + 90);

      getDoc(doc(db, "masterData", "packageSetting")).then(async (docSnap) => {
        if (docSnap.exists()) {
          const docData = docSnap.data();
          // Compare date with current date
          let newYear;
          let newMonth;
          let changeMonth = false;
          let changeYear = false;

          if (docData.currentYear === parseInt(year)) {
            if (docData.currentMonth === parseInt(month)) {
              newYear = year;
              newMonth = month;
            } else {
              newYear = year;
              newMonth = month;
              changeMonth = true;
            }
          } else {
            newYear = year;
            newMonth = month;
            changeYear = true;
          }

          let nextPackageId = null;
          let mapUserData;
          try {
            if (!values.isNoSuite && packageData.userId) {
              // Fetch the latest package based on the arrivedAt timestamp for the specific user
              const latestPackageQuery = query(
                collection(db, "shelfPackages"),
                where("userId", "==", packageData.userId),
                orderBy("arrivedAt", "desc"),
                limit(1)
              );
              const latestPackageSnapshot = await getDocs(latestPackageQuery);

              if (!latestPackageSnapshot.empty) {
                const latestPackage = latestPackageSnapshot.docs[0].data();
                const latestPackageId = latestPackage.packageId;
                // console.log(latestPackage, "latestPackage");
                // console.log(latestPackageId, "latestPackageId");
                // console.log(latestPackage.packageId, "latestPackage.packageId");
                nextPackageId = latestPackage.packageId
                  ? getNextPackageId(latestPackageId)
                  : "A";
                // console.log(nextPackageId, "nextPackageId");
              } else {
                nextPackageId = "A";
              }
            }

            if (values.suiteNumber) {
              const q1 = query(
                collection(db, "mapUserRoutePartners"),
                where("routePartnerId", "==", "611118"),
                where("uniqueAddressCode", "==", values.suiteNumber)
              );
              const querySnapshot1 = await getDocs(q1);
              console.log("Here");
              if (!querySnapshot1.empty) {
                mapUserData = querySnapshot1.docs[0].data();
                console.log("mapUserData", mapUserData);
              } else {
                console.log("Suite number not Valid");
              }
            }

            const q = query(
              collection(db, "shelfPackages"),
              where("trackingNumber", "==", formik.values.trackingNumber)
            );
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
              const docRef = doc(db, "shelfPackages", packageData.id);
              const docSnap = await getDoc(docRef);
              const data = docSnap.data();

              if (!data.serialNumber) {
                console.log("serial number not found");
                await updateDoc(docRef, {
                  ...values,
                  arrivedAt: serverTimestamp(),
                  ...(nextPackageId && { packageId: nextPackageId }),
                  serialNumber: `${year}-${month}${
                    changeMonth || changeYear
                      ? "1".padStart(6, "0")
                      : docData.currentSerialId.toString().padStart(6, "0")
                  }`,
                  packagePhotos: formik.values.packagePhotos || [],
                  freeStorage: freeStorageDate,
                  paidStorage: paidStorageDate,
                  abandoned: abandonedDate,
                }).then(() => {
                  updateDoc(doc(db, "masterData", "packageSetting"), {
                    currentSerialId:
                      changeMonth || changeYear
                        ? 2
                        : docData.currentSerialId + docData.incrementBy,
                    currentYear: parseFloat(newYear),
                    currentMonth: parseFloat(newMonth),
                  });
                });
              } else {
                console.log("serial number found");
                await updateDoc(docRef, values);
              }
              setInitialValues(initialValue);
              toast.success("Package updated successfully");
            } else {
              await setDoc(
                doc(
                  db,
                  "shelfPackages",
                  `PACK-${docData.currentId.toString()}`
                ),
                {
                  ...values,
                  arrivedAt: serverTimestamp(),
                  ...(nextPackageId && { packageId: nextPackageId }),
                  serialNumber: `${year}-${month}${
                    changeMonth || changeYear
                      ? "1".padStart(6, "0")
                      : docData.currentSerialId.toString().padStart(6, "0")
                  }`,
                  packagePhotos: formik.values.packagePhotos || [],
                  userId: mapUserData?.userId,
                  freeStorage: freeStorageDate,
                  paidStorage: paidStorageDate,
                  abandoned: abandonedDate,
                }
              ).then(() => {
                setInitialValues(initialValue);
                toast.success("Package added successfully");
                // console.log(
                //   changeMonth || changeYear,
                //   "changeMonth || changeYear"
                // );
                updateDoc(doc(db, "masterData", "packageSetting"), {
                  currentId: docData.currentId + docData.incrementBy,
                  currentSerialId:
                    changeMonth || changeYear
                      ? 2
                      : docData.currentSerialId + docData.incrementBy,
                  currentYear: parseFloat(newYear),
                  currentMonth: parseFloat(newMonth),
                });
              });
            }
          } catch (error) {
            console.error("Failed to save package details:", error);
            // await setDoc(
            //   doc(db, "shelfPackages", `PACK-${docData.currentId.toString()}`),
            //   {
            //     ...values,
            //     arrivedAt: serverTimestamp(),
            //     ...(nextPackageId && { packageId: nextPackageId }),
            //     serialNumber: `${year}-${month}${
            //       changeMonth || changeYear
            //         ? "1".padStart(6, "0")
            //         : docData.currentSerialId.toString().padStart(6, "0")
            //     }`,
            //     packagePhotos: formik.values.packagePhotos || [],
            //     userId: mapUserData?.userId,
            //     freeStorage: freeStorageDate,
            //     paidStorage: paidStorageDate,
            //     abandoned: abandonedDate,
            //   }
            // ).then(() => {
            //   toast.success("Package added successfully");
            //   // console.log(
            //   //   changeMonth || changeYear,
            //   //   "changeMonth || changeYear"
            //   // );
            //   updateDoc(doc(db, "masterData", "packageSetting"), {
            //     currentId: docData.currentId + docData.incrementBy,
            //     currentSerialId:
            //       changeMonth || changeYear
            //         ? 2
            //         : docData.currentSerialId + docData.incrementBy,
            //     currentYear: parseFloat(newYear),
            //     currentMonth: parseFloat(newMonth),
            //   });
            // });
          } finally {
            setLoading(false);
          }
        }
      });
    },
  });

  // Helper function to calculate the next package ID

  const onClickOnValidate = async () => {
    try {
      const q = query(
        collection(db, "shelfPackages"),
        where("trackingNumber", "==", formik.values.trackingNumber)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = { ...doc.data(), id: doc.id };
        console.log("Package details:", data);
        setInitialValues({
          trackingNumber: data.trackingNumber,
          isNoTracking: data.isNoTracking || false,
          suiteNumber: data.suiteNumber || "",
          isNoSuite: data.isNoSuite || false,
          brand: {
            brandName: data.brand.brandName || "",
            brandLogo: data.brand.brandLogo || "",
          },
          isUnknown: data.isUnknown || false,
          merchantIndicator: data.merchantIndicator || "",
          packageTotalWeight: data.packageTotalWeight || 0,
          packagePhotos: data.packagePhotos || [],
          shelfId: data.shelfId || "",
          dimensionL: data.dimensionL || 0,
          dimensionW: data.dimensionW || 0,
          dimensionH: data.dimensionH || 0,
          packageName: data.packageName || "",
        });
        setPackageData(data);
        // console.log("Package details:", data);
      } else {
        toast.error("Package not found");
        console.error("Package not found");
        setInitialValues((pre) => {
          return {
            ...pre,
            trackingNumber: formik.values.trackingNumber,
            isNoTracking: false,
            suiteNumber: "",
            isNoSuite: false,
            brand: {
              brandName: "",
              brandLogo: "",
            },
            isUnknown: false,
            merchantIndicator: "",
            packageTotalWeight: 0,
            packagePhotos: formik.values.packagePhotos || [],
            shelfId: "",
            dimensionL: 0,
            dimensionW: 0,
            dimensionH: 0,
          };
        });
      }
    } catch (error) {
      console.error("Failed to fetch package details:", error);
    }
  };

  const handleCapture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const storageRef = ref(storage, `packages/${new Date().getTime()}.jpg`);
    try {
      setOpenCameraModal(false);
      setLoadingPackage(true);
      const snapshot = await uploadString(storageRef, imageSrc, "data_url");
      const downloadURL = await getDownloadURL(snapshot.ref);
      const updatedPhotos = [...photos, downloadURL];
      setPhotos(updatedPhotos);
      formik.setFieldValue("packagePhotos", updatedPhotos);
    } catch (error) {
      console.error("Error uploading image: ", error);
    } finally {
      setLoadingPackage(false);
    }
  };

  const handlePhotoDelete = (index) => {
    const updatedPhotos = photos.filter((_, i) => i !== index);
    setPhotos(updatedPhotos);
    formik.setFieldValue("packagePhotos", updatedPhotos);
  };

  // console.log(formik.values, "formik.values");

  return (
    // <Drawer
    //   variant="temporary"
    //   anchor="right"
    //   open={open}
    //   onClose={onClose}
    //   BackdropProps={{ sx: { background: "rgba(0, 0, 0, 0.5)" } }}
    // >
    <Grid
      container
      spacing={2}
      sx={{ borderBottom: "1px solid #E5E5E8", paddingBottom: "10px" }}
    >
      <Grid item md={12} lg={7}>
        {" "}
        <Box
          sx={{
            paddingBottom: "10px",
            // width: "719px",
            overflowY: "auto",
          }}
        >
          <Box
            sx={{
              borderBottom: "1px solid #E5E5E8",
              paddingLeft: "20px",
              paddingTop: "15px",
              paddingBottom: "15px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              sx={{ paddingRight: "20px", cursor: "pointer" }}
              onClick={() => navigate("/shipment/packages")}
            >
              <img src={close} alt="close" />
            </Box>
            <Typography variant="h5" component="h5">
              Receiving Workstation
            </Typography>
          </Box>
          <Box sx={{ marginTop: "16px" }}>
            <SimpleBar
              forceVisible="y"
              autoHide={true}
              style={{
                maxHeight: "81vh",
                // ".simplebar-scrollbar": {
                //   background: "red",
                // },
              }}
              className="custom-scrollbar"
            >
              <Grid
                container
                spacing={2}
                sx={{
                  // borderBottom: "1px solid #E5E5E8",
                  paddingBottom: "10px",
                  maxHeight: "79vh",
                  marginBottom: "20px",
                  // overflowY: "auto",
                }}
              >
                <Grid item md={7}>
                  {/* <Box sx={{ paddingLeft: "24px", marginTop: "10px" }}>
                    <label style={{ fontWeight: "bold", fontSize: "14px" }}>
                      Take a Picture
                    </label>
                    <Webcam
                      ref={webcamRef}
                      // audio={true}
                      screenshotFormat="image/jpeg"
                      videoConstraints={videoConstraints}
                      // onUserMedia={onUserMedia}
                    />
                    <Button
                      variant="contained"
                      onClick={capturePhoto}
                      sx={{ marginTop: "10px" }}
                    >
                      Take a picture
                    </Button>
                  </Box> */}
                  {/* {hasCamera && ( */}
                  <CameraModal
                    open={openCameraModal}
                    handleClose={handleClose}
                    webcamRef={webcamRef}
                    handleCapture={handleCapture}
                  />
                  {/* )} */}
                  {/* <Box display="flex" alignItems="center" mt={1} mb={2}>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleCapture}
                        disabled={formik.values.photos.length >= 4}
                      >
                        Capture photo
                      </Button>
                    </Box> */}

                  <Box mb={3} ml={3}>
                    <label
                      style={{
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      Package images
                    </label>
                    <Box
                      display="flex"
                      flexWrap="wrap"
                      sx={{
                        gap: "16px",
                        background: "white",
                        // minHeight: "100px",
                        // minWidth: "100px",
                        width: "fit-content",
                        padding: "16px",
                        borderRadius: "4px",
                        mt: 1,
                      }}
                    >
                      {formik.values.packagePhotos?.map((photo, index) => (
                        <Box key={index} position="relative">
                          <img
                            src={photo}
                            alt={`Package ${index}`}
                            style={{
                              height: "auto",
                              width: "75px",
                              // objectFit: "cover",
                            }}
                          />
                          <IconButton
                            size="small"
                            color="error"
                            sx={{ position: "absolute", top: 0, right: 0 }}
                            onClick={() => handlePhotoDelete(index)}
                          >
                            <IoMdCloseCircleOutline fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                      {loadingPackage && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <CircularProgress size={20} />
                        </Box>
                      )}
                      {formik.values.packagePhotos.length < 4 &&
                        Array.from(
                          { length: 4 - formik.values.packagePhotos.length },
                          (_, index) => (
                            <Grid item key={index}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Box
                                  onClick={handleOpen}
                                  sx={{
                                    backgroundColor: "#FAFAFA",
                                    width: "66px",
                                    height: "66px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    cursor: "pointer",
                                  }}
                                >
                                  <img src={camera} alt="camera" />
                                </Box>
                              </Box>
                            </Grid>
                          )
                        )}
                    </Box>
                  </Box>
                  {/* <Box
                    sx={{
                      paddingLeft: "24px",
                      marginTop: "10px",
                      marginRight: "40px",
                    }}
                  >
                    <Box>
                      <label style={{ fontWeight: "bold", fontSize: "14px" }}>
                        Package image
                      </label>
                      <Box
                        sx={{
                          padding: "15px",
                          border: "1px solid #E5E5E8",
                          marginTop: "10px",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box>
                          <img
                            src={urls}
                            alt="img"
                            style={{
                              height: "100px",
                              width: "100px",
                              objectFit: "contain",
                            }}
                          />
                        </Box>
                        <Box
                          sx={{
                            backgroundColor: "#FAFAFA",
                            width: "60px",
                            height: "60px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {urls &&
                            urls.length > 0 &&
                            urls?.map((url, index) => (
                              <Box key={index}>
                                <img src={url} alt="img" />
                              </Box>
                            ))}
                        </Box>
                      </Box>
                    </Box>
                  </Box> */}
                  <Box
                    sx={{
                      paddingLeft: "24px",
                      marginTop: "12px",
                      marginRight: "40px",
                    }}
                  >
                    <Box>
                      <label style={{ fontWeight: "bold", fontSize: "14px" }}>
                        Traking number
                      </label>
                      <Paper
                        component="form"
                        sx={{
                          p: "2px 4px",
                          display: "flex",
                          alignItems: "center",
                          border: "1px solid #E5E5E8",
                          width: 350,
                          height: 40,
                          marginTop: "10px",
                        }}
                      >
                        <SearchIcon />
                        <InputBase
                          sx={{ ml: 1, flex: 1 }}
                          placeholder="Search... "
                          inputProps={{ "aria-label": "search" }}
                          size="small"
                          name="trackingNumber"
                          value={formik.values.trackingNumber}
                          onChange={formik.handleChange}
                          disabled={formik.values.isNoTracking}
                        />
                        <IconButton
                          color="primary"
                          sx={{ p: "10px" }}
                          aria-label="directions"
                          onClick={onClickOnValidate}
                          disabled={formik.values.isNoTracking}
                        >
                          <Typography variant="body1" fontWeight="bold">
                            validate
                          </Typography>
                        </IconButton>
                      </Paper>
                      {formik.errors.trackingNumber &&
                        formik.touched.trackingNumber && (
                          <Typography variant="body2" sx={{ color: "red" }}>
                            {formik.errors.trackingNumber}
                          </Typography>
                        )}
                    </Box>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="isNoTracking"
                            checked={formik.values.isNoTracking}
                            onChange={formik.handleChange}
                            disabled={!!formik.values.trackingNumber}
                          />
                        }
                        label="No Tracking"
                      />
                    </FormGroup>
                    <Box>
                      <label style={{ fontWeight: "bold", fontSize: "14px" }}>
                        Suite number
                      </label>
                      <Paper
                        component="form"
                        sx={{
                          p: "2px 4px",
                          display: "flex",
                          alignItems: "center",
                          border: "1px solid #E5E5E8",
                          width: 350,
                          height: 40,
                          marginTop: "10px",
                        }}
                      >
                        <InputBase
                          sx={{ ml: 1, flex: 1 }}
                          placeholder="Suit Number... "
                          inputProps={{ "aria-label": "search" }}
                          size="small"
                          name="suiteNumber"
                          value={formik.values.suiteNumber}
                          onChange={formik.handleChange}
                          disabled={formik.values.isNoSuite}
                        />
                      </Paper>
                    </Box>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="isNoSuite"
                            checked={formik.values.isNoSuite}
                            onChange={(e) => {
                              formik.setFieldValue(
                                "isNoSuite",
                                e.target.checked
                              );
                              // formik.setFieldValue("packageName", "");
                              // formik.setFieldValue("suiteNumber", "");
                            }}
                            disabled={formik.values.suiteNumber}
                          />
                        }
                        label="No Suite"
                      />
                    </FormGroup>
                    {formik.values.isNoSuite && (
                      <Box>
                        <label style={{ fontWeight: "bold", fontSize: "14px" }}>
                          Name on package
                        </label>
                        <Paper
                          component="form"
                          sx={{
                            p: "2px 4px",
                            display: "flex",
                            alignItems: "center",
                            border: "1px solid #E5E5E8",
                            width: 350,
                            height: 40,
                            marginTop: "10px",
                          }}
                        >
                          <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Name on package... "
                            inputProps={{ "aria-label": "search" }}
                            size="small"
                            name="packageName"
                            value={formik.values.packageName}
                            onChange={formik.handleChange}
                          />
                        </Paper>
                      </Box>
                    )}
                    <Box>
                      <label style={{ fontWeight: "bold", fontSize: "14px" }}>
                        Select merchant
                      </label>
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
                          <Select
                            displayEmpty
                            name="brand.brandName"
                            inputProps={{ "aria-label": "Without label" }}
                            value={formik.values.brand.brandName}
                            disabled={formik.values.isUnknown}
                            onChange={(e) => {
                              const selectedBrand = brands.find(
                                (brand) => brand.brandName === e.target.value
                              );
                              formik.setFieldValue(
                                "brand.brandName",
                                selectedBrand?.brandName || ""
                              );
                              formik.setFieldValue(
                                "brand.brandLogo",
                                selectedBrand?.brandLogo || ""
                              );
                            }}
                            renderValue={(selected) => {
                              if (!selected) {
                                return <em>Select Merchant</em>;
                              }
                              const selectedBrand = brands.find(
                                (brand) => brand.brandName === selected
                              );
                              return (
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <img
                                    src={selectedBrand?.brandLogo}
                                    alt="brandLogo"
                                    width="20px"
                                    style={{ marginRight: "10px" }}
                                  />
                                  {selectedBrand?.brandName}
                                </Box>
                              );
                            }}
                            MenuProps={MenuProps}
                          >
                            {/* <MenuItem value="">Select</MenuItem> */}
                            {brands.map((item, index) => (
                              <MenuItem
                                value={item.brandName}
                                key={index}
                                sx={{
                                  "& .MuiMenuItem-root:hover": {
                                    backgroundColor: "lightgray",
                                  },
                                }}
                              >
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <img
                                    src={item.brandLogo}
                                    alt="brandLogo"
                                    width="20px"
                                    style={{ marginRight: "10px" }}
                                  />
                                  {item.brandName}
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="isUnknown"
                            checked={formik.values.isUnknown}
                            onChange={(e) => {
                              formik.setFieldValue(
                                "isUnknown",
                                e.target.checked
                              );
                              formik.setFieldValue("brand.brandName", "");
                              formik.setFieldValue("brand.brandLogo", "");
                            }}
                            // disabled={formik.values.brand.brandName}
                          />
                        }
                        label="Unknown"
                      />
                    </FormGroup>
                    <Box>
                      <label style={{ fontWeight: "bold", fontSize: "14px" }}>
                        Merchant indicator
                      </label>
                      <Paper
                        component="form"
                        sx={{
                          p: "2px 4px",
                          display: "flex",
                          alignItems: "center",
                          border: "1px solid #E5E5E8",
                          width: 350,
                          height: 40,
                          marginTop: "10px",
                        }}
                      >
                        {/* <SearchIcon /> */}
                        <InputBase
                          sx={{ ml: 1, flex: 1 }}
                          placeholder="Search... "
                          inputProps={{ "aria-label": "search" }}
                          size="small"
                          name="merchantIndicator"
                          value={formik.values.merchantIndicator}
                          onChange={formik.handleChange}
                        />
                      </Paper>
                    </Box>
                    <Box sx={{ marginTop: "10px" }}>
                      <Box>
                        <label style={{ fontWeight: "bold", fontSize: "14px" }}>
                          Dimentions (cm)
                        </label>
                      </Box>
                      <Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <FormLabel>L</FormLabel>
                          <Box>
                            <FormControl
                              sx={{ m: 1, minWidth: 90, minHeight: "35px" }}
                              size="small"
                            >
                              <OutlinedInput
                                type="number"
                                name="dimensionL"
                                value={formik.values.dimensionL}
                                onChange={formik.handleChange}
                                sx={{ height: "35px" }}
                              />
                            </FormControl>
                          </Box>
                          <FormLabel>W</FormLabel>
                          <Box>
                            <FormControl
                              sx={{ m: 1, minWidth: 90, minHeight: "35px" }}
                              size="small"
                            >
                              <OutlinedInput
                                type="number"
                                name="dimensionW"
                                value={formik.values.dimensionW}
                                onChange={formik.handleChange}
                                sx={{ height: "35px" }}
                              />
                            </FormControl>
                          </Box>
                          <FormLabel>H</FormLabel>
                          <Box>
                            <FormControl
                              sx={{ m: 1, minWidth: 90, minHeight: "35px" }}
                              size="small"
                            >
                              <OutlinedInput
                                type="number"
                                name="dimensionH"
                                value={formik.values.dimensionH}
                                onChange={formik.handleChange}
                                sx={{ height: "35px" }}
                              />
                            </FormControl>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                    <Box>
                      <label style={{ fontWeight: "bold", fontSize: "14px" }}>
                        Weight (lb)
                      </label>
                      <Box>
                        <FormControl
                          sx={{
                            m: 1,
                            minWidth: 270,
                            minHeight: "35px",
                            marginLeft: "0px",
                            width: "350px",
                          }}
                          size="small"
                        >
                          <OutlinedInput
                            type="number"
                            name="packageTotalWeight"
                            value={formik.values.packageTotalWeight}
                            onChange={formik.handleChange}
                          />
                        </FormControl>
                      </Box>
                    </Box>
                    <Box>
                      <label style={{ fontWeight: "bold", fontSize: "14px" }}>
                        shelf ID
                      </label>
                      <Box>
                        <FormControl
                          sx={{
                            m: 1,
                            minWidth: 270,
                            minHeight: "35px",
                            marginLeft: "0px",
                            width: "350px",
                          }}
                          size="small"
                        >
                          <OutlinedInput
                            name="shelfId"
                            value={formik.values.shelfId}
                            onChange={formik.handleChange}
                            sx={{ height: "35px" }}
                            placeholder="Use Scanner to get shelf ID"
                            readOnly
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            style={{
                              cursor: isFocused ? "text" : "default",
                              // pointerEvents: isFocused ? "auto" : "none",
                            }}
                          />
                          {/* <FormHelperText>
                            This field is filled automatically by the scanner
                          </FormHelperText> */}
                        </FormControl>
                      </Box>
                    </Box>
                  </Box>
                </Grid>

                <Grid item md={5} sx={{ marginTop: "10px" }}>
                  <Typography variant="body1" fontWeight="bold">
                    Package label placeholder
                  </Typography>
                  <Box
                    sx={{
                      backgroundColor: "#FAFAFA",
                      padding: "24px",
                      paddingRight: "0px",
                      marginRight: "20px",
                      marginTop: "10px",
                      borderRadius: "8px",
                      border: "1px solid #E5E5E8",
                    }}
                  >
                    <Typography
                      fontWeight="bold"
                      component="p"
                      sx={{
                        fontSize: "14px",
                        marginBottom: "10px",
                        display: "flex",
                      }} // Set font size
                    >
                      Suite number: A-44553322
                      <img
                        src={copy}
                        style={{ marginLeft: "5px" }}
                        alt="close"
                      />
                    </Typography>
                    <Typography
                      fontWeight="bold"
                      component="p"
                      sx={{
                        fontSize: "14px",
                        marginBottom: "10px",
                        display: "flex",
                      }} // Set font size
                    >
                      Traking number: ZSW334...
                      <img
                        src={copy}
                        style={{ marginLeft: "5px" }}
                        alt="close"
                      />
                    </Typography>
                    <Typography
                      fontWeight="bold"
                      component="p"
                      sx={{
                        fontSize: "14px",
                        marginBottom: "10px",
                        display: "flex",
                      }} // Set font size
                    >
                      Merchant: Walmark
                      <img
                        src={copy}
                        style={{ marginLeft: "5px" }}
                        alt="close"
                      />
                    </Typography>
                    <Typography
                      fontWeight="bold"
                      component="p"
                      sx={{
                        fontSize: "14px",
                        marginBottom: "10px",
                        display: "flex",
                      }} // Set font size
                    >
                      Merchant Indicator: Unknown
                      <img src={copy} alt="close" />
                    </Typography>
                    <Typography
                      fontWeight="bold"
                      component="p"
                      sx={{
                        fontSize: "14px",
                        marginBottom: "10px",
                        display: "flex",
                      }} // Set font size
                    >
                      Dimention: 17x13x7
                      <img
                        src={copy}
                        style={{ marginLeft: "5px" }}
                        alt="close"
                      />
                    </Typography>
                    <Typography
                      fontWeight="bold"
                      component="p"
                      sx={{
                        fontSize: "14px",
                        marginBottom: "10px",
                        display: "flex",
                      }} // Set font size
                    >
                      Weight: 6lb
                      <img
                        src={copy}
                        style={{ marginLeft: "5px" }}
                        alt="close"
                      />
                    </Typography>
                    <Typography
                      fontWeight="bold"
                      component="p"
                      sx={{
                        fontSize: "14px",
                        marginBottom: "10px",
                        display: "flex",
                      }} // Set font size
                    >
                      Suggested Shelf ID: A1-4
                      <img
                        src={copy}
                        style={{ marginLeft: "5px" }}
                        alt="close"
                      />
                    </Typography>
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
                  </Box>
                </Grid>
              </Grid>
            </SimpleBar>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginRight: "25px",
                position: "relative",
                borderTop: "1px solid #E5E5E8",
                paddingTop: "20px",
                bottom: 0,
              }}
            >
              <Button
                variant="contained"
                sx={{
                  minWidth: "189px",
                  borderRadius: "4px",
                  boxShadow: "none",
                }}
                onClick={() => {
                  formik.handleSubmit();
                }}
                // disabled={loading}
              >
                {loading ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    disabled={loading}
                  >
                    <CircularProgress
                      size={20}
                      sx={{ color: "white", m: "2px" }}
                    />
                  </Box>
                ) : (
                  "Add Package"
                )}
              </Button>
            </Box>
          </Box>
        </Box>
      </Grid>
      <Grid item md={12} lg={5} sx={{ padding: "20px", paddingBottom: "0px" }}>
        <Box sx={{ backgroundColor: "#FAFAFA" }}>
          <Box
            sx={{
              borderBottom: "1px solid #E5E5E8",
              paddingLeft: "20px",
              paddingTop: "15px",
              paddingBottom: "9px",
              display: "flex",
              justifyContent: "space-between",
              // width: "462px",
              backgroundColor: "white",
            }}
          >
            <Typography variant="h5" component="h5">
              Receiving Guider
            </Typography>
            <Box
              sx={{
                paddingX: "10px",
                paddingY: "3px",
                cursor: "pointer",
                display: "flex",
                border: "1px solid #5E17EB",
                borderRadius: "8px",
                backgroundColor: "#F3EDFF",
              }}
            >
              <img src={speaker} alt="speaker_icon" />
              <label style={{ marginLeft: "10px" }}>speaker mode</label>
            </Box>
          </Box>
          <Box
            sx={{
              paddingLeft: "24px",
              marginTop: "20px",
              marginRight: "40px",
            }}
          >
            <Box sx={{ height: "83vh", overflowY: "auto" }}>
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#FAFAFA",
                    paddingX: "10px",
                    paddingY: "10px",
                    border: "1px solid #E5E5E8",
                    marginTop: "10px",
                    borderRadius: "4px",
                  }}
                >
                  <label>How to receive oversize package?</label>
                  <img src={volumn_on} alt="volumn_on" />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#FAFAFA",
                    paddingX: "10px",
                    border: "1px solid #E5E5E8",
                    marginTop: "10px",
                    paddingY: "10px",
                    borderRadius: "4px",
                  }}
                >
                  <label>How to generate receiving slip?</label>
                  <img src={volumn_off} alt="volumn_on" />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#FAFAFA",
                    paddingX: "10px",
                    border: "1px solid #E5E5E8",
                    marginTop: "10px",
                    paddingY: "10px",
                    borderRadius: "4px",
                  }}
                >
                  <label>How to process no suite package?</label>
                  <img src={volumn_off} alt="volumn_on" />
                </Box>
              </Box>
              {/* <Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <img src={chat_sender} alt="send" />
                  <label style={{ marginLeft: "10px", fontWeight: "bold" }}>
                    You
                  </label>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#FAFAFA",
                    height: "36px",
                  }}
                >
                  <label style={{ marginLeft: "37px", fontSize: "14px" }}>
                    How you receive oversize package?
                  </label>
                </Box>
              </Box>
              <Box sx={{ marginTop: "20px" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <img src={chat_receiver} alt="send" />
                  <label style={{ marginLeft: "10px", fontWeight: "bold" }}>
                    CustomsID
                  </label>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#481AA3",
                    // height: "36px",
                    color: "white",
                    marginLeft: "37px",
                    borderRadius: "8px",
                    marginTop: "5px",
                  }}
                >
                  <ol
                    style={{
                      marginLeft: "37px",
                      fontSize: "14px",
                      listStyleType: "decimal",
                      marginRight: "20px",
                      marginBottom: "10px",
                      width: "340px",
                    }}
                  >
                    <li style={{ marginTop: "10px" }}>
                      Prepare the Receiving Area: Make sure the receiving area
                      is clear and spacious enough to accommodate the oversize
                      package.
                    </li>
                    <li style={{ marginTop: "10px" }}>
                      Verify Documentation: Check that you have all the
                      necessary documentation for the package, including
                      shipping labels, invoices, and any special handling
                      instructions.{" "}
                    </li>
                    <li style={{ marginTop: "10px" }}>
                      Inspect the Package: Before accepting the package, inspect
                      it for any signs of damage or tampering. Note any
                      discrepancies on the delivery receipt.
                    </li>
                    <li style={{ marginTop: "10px" }}>
                      {" "}
                      Use Proper Equipment: If necessary, use equipment such as
                      forklifts, pallet jacks, or dollies to safely handle and
                      transport the oversize package.
                    </li>
                    <li style={{ marginTop: "10px" }}>
                      {" "}
                      Coordinate with Team Members: If the package is too large
                      to handle alone, coordinate with other staff members to
                      ensure it is safely received and moved to the appropriate
                      storage area.
                    </li>
                    <li style={{ marginTop: "10px" }}>
                      {" "}
                      Record Receipt: Once the package is received, make sure to
                      record the receipt in your inventory management system and
                      update any relevant records.
                    </li>
                    <li style={{ marginTop: "10px" }}>
                      {" "}
                      Notify Recipient: If the package is not for internal use
                      but for a specific recipient, notify them promptly of its
                      arrival and coordinate delivery or pickup arrangements.
                    </li>
                    <li style={{ marginTop: "10px" }}>
                      {" "}
                      Secure Storage: Store the oversize package in a designated
                      area that is secure and easily accessible, taking care to
                      avoid blocking walkways or creating safety hazards.
                    </li>
                  </ol>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "35px",
                    marginTop: "10px",
                  }}
                >
                  <img src={volumn} alt="send" />
                </Box>
              </Box> */}
            </Box>
            <Box sx={{ marginLeft: "30px" }}>
              <Paper
                component="form"
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #E5E5E8",
                  width: 400,
                  height: 40,
                  marginTop: "10px",
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Ask me a question"
                  inputProps={{ "aria-label": "Ask me a question" }}
                  size="small"
                />
                <img src={send} alt="send" />
              </Paper>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
    // </Drawer>
  );
};

export default ReceivingWorkStationDrawer;
