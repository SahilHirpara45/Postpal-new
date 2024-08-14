import * as Yup from "yup";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  OutlinedInput,
  Radio,
  RadioGroup,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import RoutePartnerHeader from "./RoutePartnerHeader";
import SidebarContext from "../../../context/SidebarContext";
import camera from "../../../assets/svg/camera.svg";
import { useLocation, useNavigate } from "react-router-dom";
import SimpleBar from "simplebar-react";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, storage } from "../../../firebaseConfig";
import { useFormik } from "formik";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { toast } from "react-toastify";
import FileUploaderMultiple from "../../../components/common/FileUploaderMultiple";
import { useSelector } from "react-redux";

const initialValue = {
  contactPersonName: "",
  emailId: "",
  contactNumber: "",
  city: "",
  state: "",
  country: "",
  about: "",
  logoUrl: "",
  isCarrierPartner: false,
  isRoutePartner: false,
  name: "",
  manualSortFee: 0,
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required!"),
  contactPersonName: Yup.string().required("Contact person name is required!"),
  emailId: Yup.string().required("Email ID is required."),
  contactNumber: Yup.string().required("Contact Number is required."),
  city: Yup.string().required("City is required!"),
  // state: Yup.string().required("State is required!"),
  // country: Yup.string().required("Country is required!"),
  about: Yup.string().required("About is required!"),
  manualSortFee: Yup.number().required("Manual Sort Fee is required!"),
  // iconName: Yup.string().required("Required!"),
  // academicYearId: Yup.string().required("Academic Year required."),
  // curriculumId: Yup.string().required("Curriculum required."),
  // parentName: Yup.string().required('Parent Name required.'),
  // studentName: Yup.string().required('Student Name required.'),
  // genderId: Yup.string().required('Gender required.'),
  // dob: Yup.string().required('DOB required.'),
  // classId: Yup.string().required('Admission For required.'),
  // source: Yup.string().required('Source required.'),
  // reasonForAdmission: Yup.string().required('Reason For Admission required.'),
});

export default function AddRoutePartner() {
  const { open } = useContext(SidebarContext);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [initialValues, setInitialValues] = useState(initialValue);
  const [loading, setLoading] = useState(false);

  // const user = useSelector((state) => state.auth.value);
  const auth = getAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const getForId = async () => {
      if (location?.state?.id) {
        const docRef = doc(db, "routePartners", location?.state?.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setInitialValues(docSnap.data());
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
        }
      }
    };
    getForId();
  }, [location?.state?.id]);

  useEffect(() => {
    // Load the Google Maps JavaScript API
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAe4odbj-xrkloGe6iS6VVTRusLLckQFUo&libraries=places`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      // The Google Maps API is now loaded and can be used
      // Initialize the Autocomplete service here
      const autocomplete = new window.google.maps.places.Autocomplete(
        document.getElementById("autocomplete-input"),
        {
          // componentRestrictions: { country: ["us", "ca"] },
          fields: ["address_components", "geometry"],
          types: [],
        }
      );

      // Add event listeners or other functionality as needed
      autocomplete.addListener("place_changed", fillInAddress);

      function fillInAddress() {
        // Get the place details from the autocomplete object.
        const place = autocomplete.getPlace();
        console.log(place, "place");

        let address1 = "";
        let postcode = "";

        // Get each component of the address from the place details,
        // and then fill-in the corresponding field on the form.
        // place.address_components are google.maps.GeocoderAddressComponent objects
        // which are documented at http://goo.gle/3l5i5Mr
        for (const component of place.address_components) {
          console.log(component, "component");
          // @ts-ignore remove once typings fixed
          const componentType = component.types[0];

          switch (componentType) {
            case "street_number": {
              address1 = `${component.long_name} ${address1}`;
              break;
            }
            case "route": {
              address1 += component.short_name;
              break;
            }
            case "postal_code": {
              postcode = `${component.long_name}${postcode}`;
              break;
            }
            case "postal_code_suffix": {
              postcode = `${postcode}-${component.long_name}`;
              break;
            }
            case "locality":
              addRoutePartnerForm.setFieldValue("city", component.long_name);
              break;
            case "administrative_area_level_1": {
              addRoutePartnerForm.setFieldValue("state", component.long_name);
              break;
            }
            case "country":
              addRoutePartnerForm.setFieldValue("country", component.long_name);
              break;
            default:
              break;
          }
        }
        console.log(postcode, "postcode");
        console.log(address1, "address1");
      }
    };
  }, []);

  const addRoutePartnerForm = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      console.log(values, "values>>>");
      setLoading(true);
      try {
        if (location?.state?.id) {
          // // const docRef = doc(db,"routePartners", location.state.id)
          // // updateDoc(docRef,{...values})
          if (selectedFiles) {
            if (values.logoUrl) {
              const fileRef = ref(storage, values.logoUrl);
              await deleteObject(fileRef);
            }
            const storageRef = ref(
              storage,
              `/routePartnerImages/${selectedFiles[0].name}`
            );
            await uploadBytesResumable(storageRef, selectedFiles[0]);
            const url = await getDownloadURL(storageRef);
            updateDoc(doc(db, "routePartners", location.state.id), {
              ...values,
              logoUrl: url,
            }).then((res) => {
              toast.success("Route Partner Updated Successfully!");
              navigate("/shipping/route-partner");
              setLoading(false);
            });
          } else {
            updateDoc(doc(db, "routePartners", location.state.id), {
              ...values,
            }).then((res) => {
              navigate("/shipping/route-partner");
              toast.success("Route Partner Updated Successfully!");
              setLoading(false);
            });
          }
        } else {
          const couriersCollectionRef = collection(db, "admins");

          const querySnapshot = await getDocs(
            query(couriersCollectionRef, where("email", "==", values.emailId))
          );

          if (querySnapshot.empty) {
            if (!selectedFiles) {
              getDoc(doc(db, "masterData", "routePartnerInfo")).then(
                (docSnap) => {
                  if (docSnap.exists()) {
                    const docData = docSnap.data();
                    setDoc(
                      doc(db, "routePartners", `${docData.currentDisplayId}`),
                      {
                        ...values,
                        id: `${docData.currentDisplayId}`,
                        isDeleted: false,
                        createdAt: serverTimestamp(),
                        totalBays: "",
                        packageHandledInLbs: 0.0,
                        packagesHandledInUsd: 0.0,
                        countries: [],
                        lastShipment: null,
                        nextUniqueAddressCode: "01-A1-**-02",
                        rating: 0,
                        reviewCount: 0,
                        uniqueAddressCodeSettings: {
                          countryCodeHolder: "**",
                          maxBayNoCode: 9,
                          maxDoor: 99,
                          maxRow: 9,
                        },
                      }
                    ).then(async (res) => {
                      // console.log(res, "res in AddRoutePartner1");
                      toast.success("New Route Partner Added Successfully!");
                      navigate("/shipping/route-partner");
                      setLoading(false);
                      updateDoc(doc(db, "masterData", "routePartnerInfo"), {
                        currentDisplayId:
                          docData.currentDisplayId + docData.incrementBy,
                      });
                      addDoc(collection(db, "admins"), {
                        name: values.contactPersonName,
                        email: values.emailId,
                        phoneNumber: values.contactNumber,
                        role: "Route Partner Admin",
                        routePartnerName: values.name,
                        password: "admin@1234",
                      }).then((res) => {
                        toast.success("New Admin Added Successfully!");
                        navigate("/shipping/route-partner");
                        // setLoading(false);
                      });
                      await createUserWithEmailAndPassword(
                        auth,
                        values.emailId,
                        "admin@1234"
                      ).then(async (userCredential) => {
                        // localStorage.setItem("token", user.accessToken);
                        // navigate("/systems/route-partner");
                      });

                      // setPersistence(auth, browserSessionPersistence)
                      //   .then(() => {
                      //     return createUserWithEmailAndPassword(
                      //       auth,
                      //       values.emailId,
                      //       "admin@1234"
                      //     );
                      //   })
                      //   .then(async (userCredential) => {
                      //     // localStorage.setItem("token", user.accessToken);
                      //     navigate("/systems/route-partner");
                      //   });
                    });
                  }
                }
              );
            } else if (selectedFiles) {
              const storageRef = ref(
                storage,
                `/routePartnerImages/${selectedFiles[0].name}`
              );
              const uploadTask = uploadBytesResumable(
                storageRef,
                selectedFiles[0]
              ).then(async () => {
                const url = await getDownloadURL(storageRef);
                // setIsUrl(url)

                if (url) {
                  getDoc(doc(db, "masterData", "routePartnerInfo")).then(
                    (docSnap) => {
                      if (docSnap.exists()) {
                        const docData = docSnap.data();
                        setDoc(
                          doc(
                            db,
                            "routePartners",
                            `${docData.currentDisplayId}`
                          ),
                          {
                            ...values,
                            id: `${docData.currentDisplayId}`,
                            logoUrl: url,
                            isDeleted: false,
                            createdAt: serverTimestamp(),
                            totalBays: "",
                            packageHandledInLbs: 0.0,
                            packagesHandledInUsd: 0.0,
                            countries: [],
                            lastShipment: null,
                            nextUniqueAddressCode: "01-A1-**-02",
                            rating: 0,
                            reviewCount: 0,
                            uniqueAddressCodeSettings: {
                              countryCodeHolder: "**",
                              maxBayNoCode: 9,
                              maxDoor: 99,
                              maxRow: 9,
                            },
                          }
                        ).then(async (res) => {
                          // console.log(res, "res in AddRoutePartner2");
                          toast.success(
                            "New Route Partner Added Successfully!"
                          );
                          navigate("/shipping/route-partner");
                          setLoading(false);
                          updateDoc(doc(db, "masterData", "routePartnerInfo"), {
                            currentDisplayId:
                              docData.currentDisplayId + docData.incrementBy,
                          });
                          addDoc(collection(db, "admins"), {
                            name: values.contactPersonName,
                            email: values.emailId,
                            phoneNumber: values.contactNumber,
                            role: "Route Partner Admin",
                            logoUrl: url,
                            routePartnerName: values.name,
                            password: "admin@1234",
                          }).then((res) => {
                            toast.success("New Admin Added Successfully!");
                            navigate("/shipping/route-partner");
                            // setLoading(false);
                          });
                          await createUserWithEmailAndPassword(
                            auth,
                            values.emailId,
                            "admin@1234"
                          ).then(async (userCredential) => {
                            // localStorage.setItem("token", user.accessToken);
                            // navigate("/systems/route-partner");
                          });
                        });
                      }
                    }
                  );

                  // docRef.id && setShowModal(false);
                }
              });
            }
          } else {
            setLoading(false);
            toast.error("User already exists with this email");
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
  });
  const onUploadChange = (file) => {
    // console.log(file,"file")
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
          pageTitle={`${location?.state?.id ? "Edit" : "Add"} Route Partner`}
          currentRoute={`${location?.state?.id ? "Edit" : "Add"} Route Partner`}
          buttonName="Save"
          handleCancle={() => handleCancle()}
          handleSave={addRoutePartnerForm.handleSubmit}
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
          <Box>
            <FormControl size="small">
              {/* <label
                  style={{
                    fontSize: "16px",
                    fontWeight: "normal",
                    marginBottom: "5px",
                    marginTop: "10px",
                  }}
                >
                  Uploads picture
                </label> */}
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
                  value={addRoutePartnerForm.values.logoUrl}
                  onChange={onUploadChange}
                  // errors={formik.errors.postShopping.orderReceivedImage}
                  // maxFileNum={5}
                />
              </Box>
              {addRoutePartnerForm.touched.logoUrl &&
                addRoutePartnerForm.errors.logoUrl && (
                  <span className="small text-danger">
                    {addRoutePartnerForm.errors.logoUrl}
                  </span>
                )}
            </FormControl>
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
                {/* {user?.role === "Superadmin" && ( */}
                <FormControlLabel
                  control={
                    <Checkbox
                      id="isCarrierPartner"
                      label="Carrier Partner"
                      name="isCarrierPartner"
                      checked={addRoutePartnerForm.values.isCarrierPartner}
                      onChange={addRoutePartnerForm.handleChange}
                    />
                  }
                  label="Carrier Partner"
                />
                {/* )} */}
                <FormControlLabel
                  control={
                    <Checkbox
                      name="isRoutePartner"
                      type="checkbox"
                      id="isRoutePartner"
                      label="Route Partner"
                      onChange={addRoutePartnerForm.handleChange}
                      checked={addRoutePartnerForm.values.isRoutePartner}
                    />
                  }
                  label="Forwarder"
                />
                {/* <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                >
                  <FormControlLabel
                    value="Carrier Partner"
                    control={
                      <Radio
                        size="small"
                        onChange={(e) => setPartnerType(e.target.value)}
                      />
                    }
                    label="Carrier Partner"
                  />
                  <FormControlLabel
                    value="Forwarder"
                    control={
                      <Radio
                        size="small"
                        onChange={(e) => setPartnerType(e.target.value)}
                      />
                    }
                    label="Forwarder"
                  />
                </RadioGroup> */}
              </Box>
            </Box>
          </Box>
          <Box sx={{ marginTop: "20px" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ marginRight: "2vw" }}>
                <Typography
                  sx={{ fontWeight: 600, fontSize: "14px", color: "#1C2630" }}
                >
                  Route Partne Name
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
                    type="text"
                    id="name"
                    placeholder="Route Partner Name"
                    name="name"
                    value={addRoutePartnerForm.values.name}
                    onChange={addRoutePartnerForm.handleChange}
                    sx={{
                      marginX: "0px",
                      ".MuiOutlinedInput-notchedOutline": {
                        width: "23vw",
                      },
                    }}
                  />
                </FormControl>
                {addRoutePartnerForm.touched.name &&
                  addRoutePartnerForm.errors.name && (
                    <span className="small text-danger">
                      {addRoutePartnerForm.errors.name}
                    </span>
                  )}
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
                    id="autocomplete-input"
                    name="city"
                    placeholder="City"
                    value={addRoutePartnerForm.values.city}
                    onChange={addRoutePartnerForm.handleChange}
                    sx={{
                      marginX: "0px",
                      ".MuiOutlinedInput-notchedOutline": {
                        width: "23vw",
                      },
                    }}
                  />
                </FormControl>
                {addRoutePartnerForm.touched.city &&
                  addRoutePartnerForm.errors.city && (
                    <span className="small text-danger">
                      {addRoutePartnerForm.errors.city}
                    </span>
                  )}
              </Box>
            </Box>
            <Box
              sx={{ display: "flex", alignItems: "center", marginTop: "10px" }}
            >
              <Box sx={{ marginRight: "2vw" }}>
                <Typography
                  sx={{ fontWeight: 600, fontSize: "14px", color: "#1C2630" }}
                >
                  Email Id
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
                    name="emailId"
                    placeholder="Email Id"
                    value={addRoutePartnerForm.values.emailId}
                    onChange={addRoutePartnerForm.handleChange}
                    sx={{
                      marginX: "0px",
                      ".MuiOutlinedInput-notchedOutline": {
                        width: "23vw",
                      },
                    }}
                  />
                </FormControl>
                {addRoutePartnerForm.touched.emailId &&
                  addRoutePartnerForm.errors.emailId && (
                    <span className="small text-danger">
                      {addRoutePartnerForm.errors.emailId}
                    </span>
                  )}
              </Box>
              <Box sx={{ marginLeft: "2vw" }}>
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
                    name="state"
                    placeholder="State"
                    disabled
                    value={addRoutePartnerForm.values.state}
                    onChange={addRoutePartnerForm.handleChange}
                    sx={{
                      marginX: "0px",
                      ".MuiOutlinedInput-notchedOutline": {
                        width: "23vw",
                      },
                    }}
                  />
                </FormControl>
                {addRoutePartnerForm.touched.state &&
                  addRoutePartnerForm.errors.state && (
                    <span className="small text-danger">
                      {addRoutePartnerForm.errors.state}
                    </span>
                  )}
              </Box>
            </Box>
            <Box
              sx={{ display: "flex", alignItems: "center", marginTop: "10px" }}
            >
              <Box sx={{ marginRight: "2vw" }}>
                <Typography
                  sx={{ fontWeight: 600, fontSize: "14px", color: "#1C2630" }}
                >
                  Contact Person Name
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
                    name="contactPersonName"
                    placeholder="Contact Person Name"
                    value={addRoutePartnerForm.values.contactPersonName}
                    onChange={addRoutePartnerForm.handleChange}
                    sx={{
                      marginX: "0px",
                      ".MuiOutlinedInput-notchedOutline": {
                        width: "23vw",
                      },
                    }}
                  />
                </FormControl>
                {addRoutePartnerForm.touched.contactPersonName &&
                  addRoutePartnerForm.errors.contactPersonName && (
                    <span className="small text-danger">
                      {addRoutePartnerForm.errors.contactPersonName}
                    </span>
                  )}
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
                  <OutlinedInput
                    name="country"
                    disabled
                    placeholder="Country"
                    value={addRoutePartnerForm.values.country}
                    onChange={addRoutePartnerForm.handleChange}
                    sx={{
                      marginX: "0px",
                      ".MuiOutlinedInput-notchedOutline": {
                        width: "23vw",
                      },
                    }}
                  />
                </FormControl>
                {addRoutePartnerForm.touched.country &&
                  addRoutePartnerForm.errors.country && (
                    <span className="small text-danger">
                      {addRoutePartnerForm.errors.country}
                    </span>
                  )}
              </Box>
            </Box>
            <Box
              sx={{ display: "flex", alignItems: "center", marginTop: "10px" }}
            >
              <Box sx={{ marginRight: "2vw" }}>
                <Typography
                  sx={{ fontWeight: 600, fontSize: "14px", color: "#1C2630" }}
                >
                  Contact Number
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
                    name="contactNumber"
                    placeholder="Contact Number"
                    value={addRoutePartnerForm.values.contactNumber}
                    onChange={addRoutePartnerForm.handleChange}
                    sx={{
                      marginX: "0px",
                      ".MuiOutlinedInput-notchedOutline": {
                        width: "23vw",
                      },
                    }}
                  />
                </FormControl>
                {addRoutePartnerForm.touched.contactNumber &&
                  addRoutePartnerForm.errors.contactNumber && (
                    <span className="small text-danger">
                      {addRoutePartnerForm.errors.contactNumber}
                    </span>
                  )}
              </Box>
              <Box sx={{ marginLeft: "2vw" }}>
                <Typography
                  sx={{ fontWeight: 600, fontSize: "14px", color: "#1C2630" }}
                >
                  manual Sort Fee
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
                    type="number"
                    name="manualSortFee"
                    onChange={addRoutePartnerForm.handleChange}
                    value={addRoutePartnerForm.values.manualSortFee}
                    sx={{
                      marginX: "0px",
                      ".MuiOutlinedInput-notchedOutline": {
                        width: "23vw",
                      },
                    }}
                    startAdornment={
                      <InputAdornment position="start">$</InputAdornment>
                    }
                  />
                </FormControl>
                {addRoutePartnerForm.touched.manualSortFee &&
                  addRoutePartnerForm.errors.manualSortFee && (
                    <span className="small text-danger">
                      {addRoutePartnerForm.errors.manualSortFee}
                    </span>
                  )}
              </Box>
            </Box>
            <Box
              sx={{ display: "flex", alignItems: "center", marginTop: "10px" }}
            >
              <Box>
                <Typography
                  sx={{ fontWeight: 600, fontSize: "14px", color: "#1C2630" }}
                >
                  About
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
                  <TextareaAutosize
                    name="about"
                    placeholder="About"
                    value={addRoutePartnerForm.values.about}
                    onChange={addRoutePartnerForm.handleChange}
                    aria-label="textarea"
                    minRows={4}
                    style={{
                      width: "50vw",
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
                {addRoutePartnerForm.touched.about &&
                  addRoutePartnerForm.errors.about && (
                    <span className="small text-danger">
                      {addRoutePartnerForm.errors.about}
                    </span>
                  )}
              </Box>
            </Box>
          </Box>
        </Box>
      </SimpleBar>
    </Box>
  );
}
