import React, { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputBase,
  OutlinedInput,
  Paper,
  Typography,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import close from "../assets/svg/drawer_close.svg";
import * as Yup from "yup";
import { useFormik } from "formik";
import { db } from "../firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { packageHistory } from "./common/History/helper";
import { useSelector } from "react-redux";

const initialValue = {
  brand: {
    brandName: "",
    brandLogo: "",
  },
  merchantIndicator: "",
  suiteNumber: "",
  isNoSuite: false,
  packageName: "",
  packageTotalWeight: 0,
  shelfId: "",
  dimensionL: 0,
  dimensionW: 0,
  dimensionH: 0,
};

const validationSchema = Yup.object().shape({
  // brand: Yup.object({
  //   brandName: Yup.string().required("Required"),
  //   brandLogo: Yup.string().required("Required"),
  // }),
  // merchantIndicator: Yup.string().required("Required"),
  suiteNumber: Yup.string().when("isNoSuite", {
    is: false,
    then: () => Yup.string().required("Suite number is required"),
    otherwise: () => Yup.string().nullable(),
  }),
  isNoSuite: Yup.boolean(),
  packageName: Yup.string().when("isNoSuite", {
    is: true,
    then: () => Yup.string().required("Package name is required"),
    // otherwise: () => Yup.string().nullable(),
  }),
  // packageTotalWeight: Yup.number().required("Required"),
  // shelfId: Yup.string().required("Required"),
  // dimensionL: Yup.number().required("Required"),
  // dimensionW: Yup.number().required("Required"),
  // dimensionH: Yup.number().required("Required"),
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

const EditPackageDrawer = ({
  editPackage,
  open,
  onClose,
  collectionName,
  shipmentCollectionName,
  shipmentData,
}) => {
  const [initialValues, setInitialValues] = useState(initialValue);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth.value);

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
      },
      (error) => {
        console.error("Error fetching brand data: ", error);
      }
    );

    return () => unsubscribe();
  }, []);
  console.log(editPackage, collectionName, "editPackage");
  // console.log(initialValues,"initialValues");

  useEffect(() => {
    const fetchPackageData = async () => {
      if (editPackage?.packageTrackingId) {
        const docRef = doc(db, collectionName, editPackage?.packageTrackingId);
        const querySnapshot = await getDoc(docRef);

        if (querySnapshot.exists()) {
          const data = querySnapshot.data();
          console.log(data, "data in EditPackageDrawer");
          setInitialValues({
            ...data,
            brand: {
              brandName: data?.brand?.brandName || "",
              brandLogo: data?.brand?.brandLogo || "",
            },
            merchantIndicator: data.merchantIndicator || "",
            packageTotalWeight:
              data.packageTotalWeight || data.totalWeight || 0,
            shelfId: data.shelfId || "",
            dimensionL: data.dimensionL || 0,
            dimensionW: data.dimensionW || 0,
            dimensionH: data.dimensionH || 0,
          });
        } else {
          setInitialValues(initialValue);
          console.log("No such document!");
        }
      } else {
        setInitialValues(initialValue);
      }
    };
    fetchPackageData();
  }, [editPackage?.packageTrackingId, editPackage, collectionName]);

  const editPackageFormik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      console.log("Form values:", values);
      setLoading(true);
      let mapUserData;
      try {
        if (values.suiteNumber) {
          const q1 = query(
            collection(db, "mapUserRoutePartners"),
            where(
              "routePartnerId",
              "==",
              values.warehouseRoutePartnerId || "611118"
            ),
            where("uniqueAddressCode", "==", values.suiteNumber)
          );
          const querySnapshot1 = await getDocs(q1);
          if (!querySnapshot1.empty) {
            mapUserData = querySnapshot1.docs[0].data();
            // console.log("mapUserData", mapUserData);
            const docRef = doc(
              db,
              collectionName,
              editPackage?.packageTrackingId
            );

            let updateData = {
              ...values,
              userId: mapUserData?.userId || "",
            };

            if (
              collectionName === "shelfPackages" ||
              collectionName === "shelfShoppingPackages"
            ) {
              updateData.packageTotalWeight = values.packageTotalWeight;
            } else {
              const { packageTotalWeight, ...restValues } = values;
              updateData = {
                ...restValues,
                totalWeight: values.packageTotalWeight,
              };
            }

            await updateDoc(docRef, updateData);
            toast.success("Packaging updated successfully!");
            onClose();
            (collectionName === "shelfPackages" ||
              collectionName === "shelfShoppingPackages") &&
              packageHistory(editPackage, values, user?.name, collectionName);
          } else {
            toast.error("Suite number not Valid");
            console.log("Suite number not Valid");
          }
        } else {
          const docRef = doc(
            db,
            collectionName,
            editPackage?.packageTrackingId
          );
          console.log(docRef, "docRef >>>>");
          let updateData = {
            ...values,
          };

          if (
            collectionName === "shelfPackages" ||
            collectionName === "shelfShoppingPackages"
          ) {
            updateData.packageTotalWeight = values.packageTotalWeight;
          } else {
            const { packageTotalWeight, ...restValues } = values;
            updateData = {
              ...restValues,
              totalWeight: values.packageTotalWeight,
            };
          }
          await updateDoc(docRef, updateData);
          toast.success("Packaging updated successfully!");
          onClose();
          (collectionName === "shelfPackages" ||
            collectionName === "shelfShoppingPackages") &&
            packageHistory(editPackage, values, user?.name, collectionName);
        }
      } catch (error) {
        console.error("Error updating document: ", error);
      } finally {
        setLoading(false);
      }
    },
  });

  // console.log(editPackageFormik.values, "editPackageFormik");
  // console.log(editPackageFormik.errors, "editPackageFormik.errors");
  // console.log(editPackageFormik.touched, "editPackageFormik.touched");

  return (
    <Drawer
      variant="temporary"
      anchor="right"
      open={open}
      onClose={onClose}
      BackdropProps={{ sx: { background: "rgba(0, 0, 0, 0.5)" } }}
    >
      <Box sx={{ width: "500px" }}>
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
            Edit Package Details
          </Typography>
          <Box
            sx={{ paddingRight: "20px", cursor: "pointer" }}
            onClick={onClose}
          >
            <img src={close} alt="close" />
          </Box>
        </Box>
        <Box sx={{ minHeight: "84vh", borderBottom: "1px solid #E5E5E8" }}>
          <Box
            sx={{
              paddingLeft: "20px",
              paddingTop: "20px",
            }}
          >
            <Typography variant="body1" fontWeight="bold">
              Merchant
            </Typography>
            <Box>
              <FormControl
                sx={{
                  m: 1,
                  minWidth: 270,
                  minHeight: "35px",
                  marginLeft: "0px",
                }}
                size="small"
              >
                <Select
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  value={editPackageFormik.values.brand.brandName}
                  name="brand.brandName"
                  onChange={(e) => {
                    const selectedBrand = brands.find(
                      (brand) => brand.brandName === e.target.value
                    );
                    editPackageFormik.setFieldValue(
                      "brand.brandName",
                      selectedBrand?.brandName || ""
                    );
                    editPackageFormik.setFieldValue(
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
                      <Box sx={{ display: "flex", alignItems: "center" }}>
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
                      <Box sx={{ display: "flex", alignItems: "center" }}>
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
          <Box
            sx={{
              paddingLeft: "20px",
              paddingTop: "10px",
            }}
          >
            <Typography variant="body1" fontWeight="bold">
              Merchant Indicator
            </Typography>
            <Box>
              <FormControl
                sx={{
                  m: 1,
                  minWidth: 270,
                  minHeight: "35px",
                  marginLeft: "0px",
                }}
                size="small"
              >
                <OutlinedInput
                  value={editPackageFormik.values.merchantIndicator}
                  name="merchantIndicator"
                  onChange={editPackageFormik.handleChange}
                />
              </FormControl>
            </Box>
          </Box>
          {initialValues.isNoSuite && (
            <>
              <Box sx={{ paddingLeft: "20px" }}>
                <Typography variant="body1" fontWeight="bold">
                  Suite number
                </Typography>
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
                    value={editPackageFormik.values.suiteNumber}
                    onChange={editPackageFormik.handleChange}
                    disabled={!!editPackageFormik.values.isNoSuite}
                  />
                </Paper>
                {editPackageFormik.errors.suiteNumber &&
                  editPackageFormik.touched.suiteNumber && (
                    <div style={{ color: "red", fontSize: "14px" }}>
                      {editPackageFormik.errors.suiteNumber}
                    </div>
                  )}
              </Box>
              <FormGroup
                sx={{
                  paddingLeft: "20px",
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      name="isNoSuite"
                      checked={editPackageFormik.values.isNoSuite}
                      onChange={editPackageFormik.handleChange}
                      // onChange={(e) => {
                      //   editPackageFormik.setFieldValue(
                      //     "isNoSuite",
                      //     e.target.checked
                      //   );
                      //   // editPackageFormik.setFieldValue("packageName", "");
                      //   // editPackageFormik.setFieldValue("suiteNumber", "");
                      // }}
                      disabled={!!editPackageFormik.values.suiteNumber}
                    />
                  }
                  label="No Suite"
                />
              </FormGroup>
            </>
          )}
          {initialValues.isNoSuite && editPackageFormik.values.isNoSuite && (
            <Box
              sx={{
                paddingLeft: "20px",
              }}
            >
              <Typography variant="body1" fontWeight="bold">
                Name on package
              </Typography>
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
                  value={editPackageFormik.values.packageName}
                  onChange={editPackageFormik.handleChange}
                />
              </Paper>
              {editPackageFormik.errors.packageName &&
                editPackageFormik.touched.packageName && (
                  <div style={{ color: "red", fontSize: "14px" }}>
                    {editPackageFormik.errors.packageName}
                  </div>
                )}
            </Box>
          )}
          <Box
            sx={{
              paddingLeft: "20px",
              paddingTop: "10px",
            }}
          >
            <Typography variant="body1" fontWeight="bold">
              Weight (lb)
            </Typography>
            <Box>
              <FormControl
                sx={{
                  m: 1,
                  minWidth: 270,
                  minHeight: "35px",
                  marginLeft: "0px",
                }}
                size="small"
              >
                <OutlinedInput
                  type="number"
                  name="packageTotalWeight"
                  value={editPackageFormik.values.packageTotalWeight}
                  onChange={editPackageFormik.handleChange}
                />
              </FormControl>
            </Box>
          </Box>
          <Box
            sx={{
              paddingLeft: "20px",
              paddingTop: "10px",
            }}
          >
            <Typography variant="body1" fontWeight="bold">
              Shelf ID
            </Typography>
            <Box>
              <FormControl
                sx={{
                  m: 1,
                  minWidth: 270,
                  minHeight: "35px",
                  marginLeft: "0px",
                }}
                size="small"
              >
                <OutlinedInput
                  name="shelfId"
                  value={editPackageFormik.values.shelfId}
                  onChange={editPackageFormik.handleChange}
                />
              </FormControl>
            </Box>
          </Box>
          <Box
            sx={{
              paddingLeft: "20px",
              paddingTop: "10px",
            }}
          >
            <Box>
              <Typography variant="body1" fontWeight="bold">
                Dimensions (cm)
              </Typography>
            </Box>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <FormLabel>L</FormLabel>
                <Box>
                  <FormControl
                    sx={{ m: 1, maxWidth: 50, minHeight: "35px" }}
                    size="small"
                  >
                    <OutlinedInput
                      type="number"
                      name="dimensionL"
                      value={editPackageFormik.values.dimensionL}
                      onChange={editPackageFormik.handleChange}
                    />
                  </FormControl>
                </Box>
                <FormLabel>W</FormLabel>
                <Box>
                  <FormControl
                    sx={{ m: 1, maxWidth: 50, minHeight: "35px" }}
                    size="small"
                  >
                    <OutlinedInput
                      type="number"
                      name="dimensionW"
                      value={editPackageFormik.values.dimensionW}
                      onChange={editPackageFormik.handleChange}
                    />
                  </FormControl>
                </Box>
                <FormLabel>H</FormLabel>
                <Box>
                  <FormControl
                    sx={{ m: 1, maxWidth: 50, minHeight: "35px" }}
                    size="small"
                  >
                    <OutlinedInput
                      type="number"
                      name="dimensionH"
                      value={editPackageFormik.values.dimensionH}
                      onChange={editPackageFormik.handleChange}
                    />
                  </FormControl>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Button
          type="submit"
          variant="contained"
          onClick={editPackageFormik.handleSubmit}
          sx={{
            minWidth: "189px",
            position: "absolute",
            bottom: 20,
            right: 20,
            borderRadius: "4px",
          }}
          disabled={loading}
        >
          Save
        </Button>
      </Box>
    </Drawer>
  );
};

export default EditPackageDrawer;
