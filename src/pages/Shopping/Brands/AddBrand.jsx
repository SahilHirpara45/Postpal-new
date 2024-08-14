import React, { useContext, useEffect, useRef, useState } from "react";
import SidebarContext from "../../../context/SidebarContext";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import Header from "./Header";
import { useLocation, useNavigate } from "react-router-dom";
import SimpleBar from "simplebar-react";
import camera from "../../../assets/svg/camera.svg";
import * as Yup from "yup";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, storage } from "../../../firebaseConfig";
import { FieldArray, FormikProvider, useFormik } from "formik";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Countries from "../../../Contries.json";
import FileUploaderMultiple from "../../../components/common/FileUploaderMultiple";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";

const initialValue = {
  brandLink: "",
  brandAffiliateLink: "",
  brandName: "",
  aboutBrand: "",
  brandCurrency: "",
  isRestricted: false,
  notAffiliateLink: false,
  restriction: {
    heading: [""],
    // statement: "",
    waysToBypass: [""],
  },
  isPopular: false,
  brandLogo: "",
  bannerLogo: "",
  brandCategory: "",
  brandLocation: "",
  integratedPartner: "",
  brandStatus: "",
};

const validationSchema = Yup.object().shape({
  brandLink: Yup.string().required("Brand Link is required!"),
  brandAffiliateLink: Yup.string().when("notAffiliateLink", {
    is: false,
    then: () => Yup.string().required("Brand AffiliateLink is required"),
    // otherwise: () => Yup.string()
  }),
  // brandAffiliateLink: Yup.string().test(
  //   'is-affiliate-link-required',
  //   'Brand AffiliateLink is required',
  //   function (value) {
  //     const { notAffiliateLink } = this.parent;
  //     console.log(value,"value in schema");

  //     if (!notAffiliateLink) {
  //       return value !== undefined && value.trim() !== '';
  //     }

  //     return true; // No validation if notAffiliateLink is true
  //   }
  // ),
  brandName: Yup.string().required("Brand name is required!"),
  aboutBrand: Yup.string().required("About Brand is required!"),
  brandLogo: Yup.string().required("Brand logo is required!"),
  // bannerLogo: Yup.string().required("Banner logo is required!"),
  brandCategory: Yup.string().required("Brand category is required!"),
  brandLocation: Yup.string().required("Brand location is required!"),
});

export default function AddBrand() {
  const { open } = useContext(SidebarContext);
  const [link, setLink] = useState("");
  const [category, setCategory] = useState("");
  const [brandname, setBrandName] = useState("");
  const [currency, setCurrency] = useState("");
  const [locationstate, setLocation] = useState("");
  const [brand, setBrand] = useState("");
  const [checked, setChecked] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);

  const [brandCtgry, setBrandCtgry] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(initialValue);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const location = useLocation();
  const formikArrayHelpers = useRef(null);

  console.log(location?.state?.id,"<---id");
  // console.log(initialValues,"<-----initialValues");

  useEffect(() => {
    const getForId = async () => {
      if (location?.state?.id) {
        const docRef = doc(db, "brands", location?.state?.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setInitialValues({
            ...docSnap.data(),
            notAffiliateLink: docSnap.data().notAffiliateLink
              ? docSnap.data().notAffiliateLink
              : false,
          });
          // setInitialValues(docSnap.data());
        } else {
          console.log("No such document!");
        }
      }
    };
    getForId();
  }, [location?.state?.id]);

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    // validationSchema,

    onSubmit: async (values) => {
      console.log(values, values.bannerLogo, "details in update");
      setLoading(true);
      const q = query(
        collection(db, "brands"),
        where("isDeleted", "==", false),
        where("brandLogo", "==", values.brandLogo.trim())
      );
      const querySnapshot = await getDocs(q);
      let arr = [];
      querySnapshot.forEach((doc) => {
        arr.push({ ...doc.data(), id: doc.id });
      });

      console.log(arr, "checkDuplicateBrand");
      if (arr.length <= 0 || arr[0]?.id === location?.state?.id) {
        try {
          if (location?.state?.id) {
            //  logic for update
            if (typeof values.bannerLogo === "object") {
              const render = new FileReader();
              render.onload = (event) => {
                const img = new Image();
                img.onload = async () => {
                  const width = img.width;
                  const height = img.height;
                  // console.log(width,height,"details acv");
                  if (width - height < 200) {
                    toast.error("Please select other image");
                    setLoading(false);
                    return;
                  } else {
                    const storageRef = ref(
                      storage,
                      `/brandBannerImages/${values.bannerLogo?.name}`
                    );
                    await uploadBytesResumable(storageRef, values.bannerLogo);
                    const url = await getDownloadURL(storageRef);
                    values.bannerLogo = url;
                    // console.log(url,"url");
                    updateDoc(
                      doc(db, "brands", location.state.id),
                      values
                    ).then((res) => {
                      toast.success("Brand updated Successfully");
                      navigate("/shopping/brand");
                      setLoading(false);
                    });
                  }
                };
                img.src = event.target.result;
              };
              render.readAsDataURL(values.bannerLogo);
            } else {
              updateDoc(doc(db, "brands", location.state.id), values).then(
                (res) => {
                  toast.success("Brand updated Successfully");
                  navigate("/shopping/brand");
                  setLoading(false);
                }
              );
            }
          } else {
            // console.log(values.bannerLogo,typeof(values.brandLogo),"bannerLogo");
            if (typeof values.bannerLogo === "object") {
              const render = new FileReader();
              render.onload = (event) => {
                const img = new Image();
                img.onload = async () => {
                  const width = img.width;
                  const height = img.height;
                  // console.log(width,height,"details acv");
                  if (width - height < 200) {
                    toast.error("Please select other image");
                  } else {
                    const storageRef = ref(
                      storage,
                      `/brandBannerImages/${values.bannerLogo?.name}`
                    );
                    await uploadBytesResumable(storageRef, values.bannerLogo);
                    const url = await getDownloadURL(storageRef);
                    values.bannerLogo = url;
                    const docRef = await addDoc(collection(db, "brands"), {
                      ...values,
                      dealId: [],
                      createdAt: serverTimestamp(),
                      updatedAt: serverTimestamp(),
                      followers: 0,
                      isDeleted: false,
                    }).then(async (res) => {
                      toast.success("Brand added Successfully");
                      navigate("/shopping/brand");
                      setLoading(false);
                      await updateDoc(doc(db, "brands", res.id), {
                        id: res.id,
                      });
                    });
                  }
                };
                img.src = event.target.result;
              };
              render.readAsDataURL(values.bannerLogo);
            } else {
              const docRef = await addDoc(collection(db, "brands"), {
                ...values,
                dealId: [],
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                followers: 0,
                isDeleted: false,
              }).then(async (res) => {
                toast.success("Brand added Successfully");
                navigate("/shopping/brand");
                setLoading(false);
                await updateDoc(doc(db, "brands", res.id), {
                  id: res.id,
                });
              });
            }
          }
        } catch (error) {
          console.log(error, "error");
          setLoading(false);
        }
      } else {
        toast.error("This Brand name is already exists");
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    // handler();
    handlerTwo();
  }, []);

  async function handlerTwo() {
    try {
      const querySnapshot = await getDocs(collection(db, "brandCategory"));
      let array = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBrandCtgry(array);
      //   setRoutePartnerDoc(arr);
    } catch (error) {
      console.log(error, "error");
    }
  }

  const countryChangeHandler = (event) => {
    formik.handleChange(event);

    const country = Countries.find((item) => item.name == event.target.value);

    formik.setFieldValue(
      "brandCurrency",
      `${country.currency} (${country?.currencySymbol})`
    );
  };

  const onUploadChange = (file) => {
    console.log(file, "file");
    setSelectedFiles(file);
    formik.setFieldValue("bannerLogo", file[0]);
  };

  const handleCancle = () => {
    navigate("/shopping/brand");
  };

  // console.log(formik.values, "values in formik");

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
        <Header
          pageTitle={`${location?.state?.id ? "Edit" : "Add"} Brand`}
          currentRoute={`${location?.state?.id ? "Edit" : "Add"} Brand`}
          buttonName="Save"
          handleCancle={() => handleCancle()}
          loading={loading}
          handleSave={formik.handleSubmit}
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
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box>
              <Stack direction={"row"} sx={{ marginTop: "20px" }}>
                <Stack>
                  <Box sx={{ marginBottom: "10px" }}>
                    <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                      Brand Link
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <FormControl
                      fullWidth
                      sx={{
                        m: 1,
                        minWidth: "30vw",
                        minHeight: "35px",
                        marginLeft: "0px",
                      }}
                      size="small"
                    >
                      <OutlinedInput
                        fullWidth
                        type="text"
                        id="brandLink"
                        placeholder="Brand Link"
                        onChange={formik.handleChange}
                        name="brandLink"
                        value={formik.values.brandLink}
                      />
                    </FormControl>
                    <Button
                      onClick={() =>
                        formik.setFieldValue(
                          "brandLogo",
                          `https://logo.clearbit.com/${formik.values.brandLink}`
                        )
                      }
                      disabled={formik.values.brandLink == "" ? true : false}
                      sx={{
                        width: "160px",
                        border: "1px solid #E5E5E8",
                        color: "black",
                      }}
                    >
                      Get Logo
                    </Button>
                  </Box>
                  {formik.touched.brandLink && formik.errors.brandLink && (
                    <span className="small text-danger">
                      {formik.errors.brandLink}
                    </span>
                  )}

                  <Typography
                    sx={{ fontSize: "13px", fontWeight: "600", mt: 2 }}
                  >
                    Brand Affiliate Link
                  </Typography>
                  <FormControl
                    fullWidth
                    sx={{
                      m: 1,
                      minWidth: "30vw",
                      minHeight: "35px",
                      marginLeft: "0px",
                    }}
                    size="small"
                  >
                    <OutlinedInput
                      fullWidth
                      type="text"
                      id="brandAffiliateLink"
                      placeholder="Brand Affiliate Link"
                      onChange={formik.handleChange}
                      name="brandAffiliateLink"
                      value={formik.values.brandAffiliateLink}
                      disabled={formik.values.notAffiliateLink}
                    />
                  </FormControl>
                </Stack>
              </Stack>
              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={formik.handleChange}
                      name="notAffiliateLink"
                      checked={formik.values.notAffiliateLink}
                    />
                  }
                  label="Not Affiliate link"
                />
              </Box>
              <Grid item xs={12} md={6}>
                <Typography sx={{ fontSize: "13px", fontWeight: "600", my: 2 }}>
                  Banner
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <FileUploaderMultiple
                    name={"images"}
                    value={formik.values.bannerLogo}
                    onChange={onUploadChange}
                  />
                </Box>
                {formik.touched.bannerLogo && formik.errors.bannerLogo && (
                  <span className="small text-danger">
                    {formik.errors.bannerLogo}
                  </span>
                )}
              </Grid>
              <Stack direction={"row"} sx={{ marginTop: "20px" }} gap={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ marginBottom: "15px" }}>
                    <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                      Category
                    </Typography>
                  </Box>
                  <FormControl sx={{ minWidth: 120 }} fullWidth>
                    <select
                      removeItemButton
                      name="brandCategory"
                      onChange={formik.handleChange}
                      value={formik.values.brandCategory}
                      // defaultValue={formik.values.country}
                      className="w-full"
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
                      <option value="">Select an category</option>
                      {brandCtgry?.map((ctgry, i) => (
                        <option key={i} value={ctgry.name}>
                          {ctgry.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  {formik.touched.brandCategory &&
                    formik.errors.brandCategory && (
                      <span className="small text-danger">
                        {formik.errors.brandCategory}
                      </span>
                    )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ marginBottom: "10px" }}>
                    <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                      Brand Name
                    </Typography>
                  </Box>
                  <FormControl
                    fullWidth
                    sx={{
                      mt: 1,
                      minWidth: "20vw",
                      minHeight: "35px",
                      marginLeft: "0px",
                    }}
                    size="small"
                  >
                    <OutlinedInput
                      type="text"
                      id="brandName"
                      placeholder="Brand Name"
                      onChange={formik.handleChange}
                      name="brandName"
                      value={formik.values.brandName}
                    />
                  </FormControl>
                  {formik.touched.brandName && formik.errors.brandName && (
                    <span className="small text-danger">
                      {formik.errors.brandName}
                    </span>
                  )}
                </Grid>
              </Stack>
              <Stack direction={"row"} sx={{ marginTop: "20px" }} gap={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ marginBottom: "15px" }}>
                    <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                      Location
                    </Typography>
                  </Box>
                  <FormControl sx={{ minWidth: 120 }} fullWidth>
                    <select
                      removeItemButton
                      name="brandLocation"
                      onChange={countryChangeHandler}
                      value={formik.values.brandLocation}
                      // defaultValue={formik.values.country}
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
                      <option value={""}>Select Country</option>
                      {Countries.map((country, i) => (
                        <option key={i} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  {formik.touched.brandLocation &&
                    formik.errors.brandLocation && (
                      <span className="small text-danger">
                        {formik.errors.brandLocation}
                      </span>
                    )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ marginBottom: "10px" }}>
                    <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                      Currency
                    </Typography>
                  </Box>
                  <FormControl
                    fullWidth
                    sx={{
                      m: 1,
                      minWidth: "20vw",
                      minHeight: "35px",
                      marginLeft: "0px",
                    }}
                    size="small"
                  >
                    <OutlinedInput
                      placeholder="Brand Currency"
                      name="brandCurrency"
                      value={formik.values.brandCurrency}
                      disabled={true}
                    />
                  </FormControl>
                </Grid>
              </Stack>
              <Stack direction={"row"} sx={{ marginTop: "20px" }} gap={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ marginBottom: "10px" }}>
                    <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                      Is Integrated Partner
                    </Typography>
                  </Box>
                  <FormControl sx={{ minWidth: 120 }} fullWidth>
                    <select
                      removeItemButton
                      name="integratedPartner"
                      onChange={formik.handleChange}
                      value={formik.values.integratedPartner}
                      // defaultValue={formik.values.country}
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
                      <option value="">Select an option</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ marginBottom: "15px" }}>
                    <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                      Status
                    </Typography>
                  </Box>
                  <FormControl sx={{ minWidth: 120 }} fullWidth>
                    <select
                      removeItemButton
                      name="brandStatus"
                      onChange={formik.handleChange}
                      value={formik.values.brandStatus}
                      // defaultValue={formik.values.country}
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
                      <option value="">Select an option</option>
                      <option value="Active">Active</option>
                      <option value="InActive">InActive</option>
                    </select>
                  </FormControl>
                </Grid>
              </Stack>
              <Stack direction={"row"} sx={{ marginTop: "20px" }} gap={3}>
                <Grid item xs={12}>
                  <Box sx={{ marginBottom: "10px" }}>
                    <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                      About brand
                    </Typography>
                  </Box>
                  <FormControl
                    fullWidth
                    sx={{
                      m: 1,
                      minWidth: "42vw",
                      minHeight: "35px",
                      marginLeft: "0px",
                    }}
                    size="small"
                  >
                    <OutlinedInput
                      multiline
                      minRows={5}
                      name="aboutBrand"
                      onChange={formik.handleChange}
                      value={formik.values.aboutBrand}
                    />
                  </FormControl>
                  {formik.touched.aboutBrand && formik.errors.aboutBrand && (
                    <span className="small text-danger">
                      {formik.errors.aboutBrand}
                    </span>
                  )}
                </Grid>
              </Stack>
              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={formik.handleChange}
                      name="isPopular"
                      // value={formik.values.isPopular}
                      checked={formik.values.isPopular}
                    />
                  }
                  label="Is this store popular ?"
                />
              </Box>
              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={formik.handleChange}
                      name="isRestricted"
                      // value={formik.values.isRestricted}
                      checked={formik.values.isRestricted}
                    />
                  }
                  label="Add Restriction"
                />
              </Box>

              <FormikProvider value={formik}>
                {formik.values.isRestricted && (
                  <FieldArray name="restriction.heading">
                    {(arrayHelpers) => {
                      return (
                        <>
                          <Box
                            sx={{
                              marginY: "10px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              sx={{ fontSize: "13px", fontWeight: "600" }}
                            >
                              Restriction Heading
                            </Typography>
                            <IconButton
                              aria-label="plus"
                              onClick={() => arrayHelpers.push("")}
                              sx={{
                                height: "20px",
                                width: "20px",
                                backgroundColor: "#481AA3",
                                color: "#fff",
                                ":hover": {
                                  backgroundColor: "#400ca7",
                                },
                              }}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Box>
                          <Stack gap={1}>
                            {formik.values.restriction.heading?.map(
                              (rest, index) => {
                                return (
                                  <>
                                    <FormControl
                                      fullWidth
                                      sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                      }}
                                      size="small"
                                    >
                                      <OutlinedInput
                                        fullWidth
                                        type="text"
                                        placeholder="Restriction Heading"
                                        onChange={formik.handleChange}
                                        name={`restriction.heading[${index}]`}
                                        value={rest}
                                      />
                                      {formik.values.restriction.heading
                                        ?.length > 1 && (
                                        <IconButton
                                          aria-label="delete"
                                          onClick={() => arrayHelpers.pop("")}
                                          sx={{
                                            height: "20px",
                                            width: "20px",
                                            marginLeft: "10px",
                                            backgroundColor: "#EB5757",
                                            color: "#fff",
                                            ":hover": {
                                              backgroundColor: "#EB5757",
                                            },
                                          }}
                                        >
                                          <RemoveIcon fontSize="small" />
                                        </IconButton>
                                      )}
                                    </FormControl>
                                  </>
                                );
                              }
                            )}
                          </Stack>
                        </>
                      );
                    }}
                  </FieldArray>
                )}
              </FormikProvider>

              <FormikProvider value={formik}>
                {formik.values.isRestricted && (
                  <FieldArray name="restriction.waysToBypass">
                    {(arrayHelpers) => {
                      return (
                        <>
                          <Box
                            sx={{
                              mt: "25px",
                              mb: "10px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              sx={{ fontSize: "13px", fontWeight: "600" }}
                            >
                              Ways to bypass
                            </Typography>
                            <IconButton
                              aria-label="plus"
                              onClick={() => arrayHelpers.push("")}
                              sx={{
                                height: "20px",
                                width: "20px",
                                backgroundColor: "#481AA3",
                                color: "#fff",
                                ":hover": {
                                  backgroundColor: "#400ca7",
                                },
                              }}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Box>
                          <Stack gap={1}>
                            {formik.values.restriction.waysToBypass.map(
                              (rest, index) => {
                                return (
                                  <>
                                    <FormControl
                                      fullWidth
                                      sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                      }}
                                      size="small"
                                    >
                                      <OutlinedInput
                                        fullWidth
                                        type="text"
                                        placeholder="Ways to bypass"
                                        onChange={formik.handleChange}
                                        name={`restriction.waysToBypass[${index}]`}
                                        value={rest}
                                      />
                                      {formik.values.restriction.waysToBypass
                                        ?.length > 1 && (
                                        <IconButton
                                          aria-label="delete"
                                          onClick={() => arrayHelpers.pop("")}
                                          sx={{
                                            height: "20px",
                                            width: "20px",
                                            marginLeft: "10px",
                                            backgroundColor: "#EB5757",
                                            color: "#fff",
                                            ":hover": {
                                              backgroundColor: "#EB5757",
                                            },
                                          }}
                                        >
                                          <RemoveIcon fontSize="small" />
                                        </IconButton>
                                      )}
                                    </FormControl>
                                  </>
                                );
                              }
                            )}
                          </Stack>
                        </>
                      );
                    }}
                  </FieldArray>
                )}
              </FormikProvider>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
              <Box sx={{ marginY: "14px" }}>
                <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                  Logo
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  height: "128px",
                  width: "128px",
                  border: "1px solid #481AA3",
                  borderRadius: "8px",
                }}
              >
                {!formik.values.brandLogo && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <CircularProgress size={25} />
                  </Box>
                )}
                {formik.values.brandLogo && (
                  <img src={formik.values.brandLogo} alt="logo" height="36px" />
                )}
              </Box>
              {formik.touched.brandLogo && formik.errors.brandLogo && (
                <span className="small text-danger">
                  {formik.errors.brandLogo}
                </span>
              )}
            </Box>
          </Grid>
        </Grid>
      </SimpleBar>
    </Box>
  );
}
