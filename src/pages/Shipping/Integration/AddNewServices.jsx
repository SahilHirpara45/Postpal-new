import {
  Box,
  Button,
  Checkbox,
  Drawer,
  FormControl,
  FormControlLabel,
  FormGroup,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import close from "../../../assets/svg/drawer_close.svg";
import SimpleBar from "simplebar-react";
import { useFormik } from "formik";
import { getAllCourier } from "./APIService";
import {
  addDoc,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { STATIC_VARIABLES } from "../../../components/common/StaticVariables";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const initialValue = {
  courierName: "",
  couriers: [],
  country: "",
  selectedService: "",
  insurance_markup_rate: 0,
  label_markup_rate: 0,
  quote_markup_rate: 0,
  piggyback_allowed: false,
};

export default function AddNewServices({
  open,
  onClose,
  apiKey,
}) {
  const [initialValues, setInitialValues] = useState(initialValue);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [allCourierData, setAllCourierData] = useState([]);
  const [courierData, setCourierData] = useState([]);
  const userData = useSelector((state) => state.auth.value);
  // console.log(userData, "userData in useselector");

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    // validate,
    onSubmit: async (value) => {
      console.log(value, "values in AddNewServices");
      const toAdd =
        (value.quote_markup_rate !== 0 ||
          value.label_markup_rate !== 0 ||
          value.insurance_markup_rate !== 0) &&
        value;

      try {
        const couriersCollectionRef = collection(db, "couriers");

        const querySnapshot = await getDocs(
          query(
            couriersCollectionRef,
            where("service_name", "==", value.selectedService),
            where("umbrella_name", "==", formik.values.courierName),
            where("adminId", "==", userData.id)
          )
        );

        if (!querySnapshot.empty) {
          querySnapshot.forEach(async (docSnapshot) => {
            const courierDocRef = docSnapshot.ref;

            await updateDoc(courierDocRef, {
              quote_markup_rate: toAdd ? toAdd.quote_markup_rate : 0,
              label_markup_rate: toAdd ? toAdd.label_markup_rate : 0,
              insurance_markup_rate: toAdd ? toAdd.insurance_markup_rate : 0,
              piggyback_allowed: toAdd ? toAdd.piggyback_allowed : false,
            });
          });
          toast.success("Service updated successfully.");
          formik.resetForm();
          setCourierData([])
          // onClose();
        } else {
          if (toAdd) {
            const sameSevicename = allCourierData.filter(
              (courier) => courier.service_name === value.selectedService
            );
            // console.log(sameSevicename, allCourierData, "sameService");
            sameSevicename.map(async (courier) => {
              await addDoc(couriersCollectionRef, {
                adminId: STATIC_VARIABLES.ADMINID,
                routePartnerId: STATIC_VARIABLES.ROUTEPARTNERID,
                service_name: courier.service_name,
                quote_markup_rate: value.quote_markup_rate,
                label_markup_rate: value.label_markup_rate,
                insurance_markup_rate: value.insurance_markup_rate,
                piggyback_allowed: value.piggyback_allowed,
                id: courier?.id,
                active: courier?.active,
                country_alpha2: courier?.country_alpha2,
                domestic_returns: courier?.domestic_returns,
                logo_url: courier?.logo_url,
                name: courier?.name,
                umbrella_name: courier?.umbrella_name,
              });
            });
            toast.success("New service added successfully.");
            formik.resetForm();
            setCourierData([])
          } else {
            console.log(
              "No services found with quote_markup_rate or label_markup_rate not equal to 0."
            );
            toast.error(
              "No services found with Quote Markup rate or Label Markup rate"
            );
          }
        }
      } catch (error) {
        console.error("Error updating/adding document:", error);
        toast.error("Error updating/adding service.");
      }
    },
  });

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, "couriers"),
          where("umbrella_name", "==", formik.values.courierName),
          where("adminId", "==", STATIC_VARIABLES.ADMINID)
        )
      );
      if (!querySnapshot.empty) {
        let couriers = [];
        let selected = {};

        // formik.setFieldValue("couriers", []);
        // setSelectedServices([]);
        // setAllCourierData([]);

        querySnapshot.forEach((doc) => {
          // Extract data for each existing service
          const existingServiceData = doc.data();

          // Push the existing service data to the couriers array
          couriers.push({
            service_name: existingServiceData.service_name,
            quote_markup_rate: existingServiceData.quote_markup_rate,
            label_markup_rate: existingServiceData.label_markup_rate,
            insurance_markup_rate: existingServiceData.insurance_markup_rate,
            piggyback_allowed: existingServiceData.piggyback_allowed,
            id: existingServiceData.id,
            adminId: STATIC_VARIABLES.ADMINID,
            routePartnerId: STATIC_VARIABLES.ROUTEPARTNERID,
            // routePartnerId: userData.routePartnerId,
            active: existingServiceData.active,
            country_alpha2: existingServiceData.country_alpha2,
            domestic_returns: existingServiceData.domestic_returns,
            logo_url: existingServiceData.logo_url,
            name: existingServiceData.name,
            umbrella_name: existingServiceData.umbrella_name,
          });
        });
        const uniqueCourierNames = {};

        const uniqueCouriers = couriers.map((courier) => {
          return (uniqueCourierNames[courier.service_name] = courier);
        });

        formik.setFieldValue("couriers", Object.values(uniqueCourierNames));
        // setSelectedServices(
        //   Object.keys(uniqueCourierNames).map((courier) => courier)
        // );
      } else {
        // formik.setFieldValue("couriers", []);
        // setSelectedServices([]);
        // setAllCourierData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // if (userData) {
    fetchData();
    // }
  }, [courierData]);

  const handleSearchCourier = async () => {
    setLoadingSearch(true);
    const data = await getAllCourier(
      apiKey,
      formik.values.courierName,
      formik.values.country
    );
    // console.log(data, "data");
    if (data?.couriers?.length > 0) {
      const uniqueCourierNames = {};
      data.couriers.forEach((courier) => {
        uniqueCourierNames[courier.service_name] = courier;
      });

      const uniqueCourierArray = Object.values(uniqueCourierNames);
      // console.log(uniqueCourierArray, "uniqueCourierArray");

      const addIntialVal = uniqueCourierArray?.map((courier) => {
        return {
          ...courier,
          quote_markup_rate: 0,
          label_markup_rate: 0,
          insurance_markup_rate: 0,
          piggyback_allowed: false,
        };
      });
      // console.log(addIntialVal, "addIntialVal");
      formik.setFieldValue("couriers", []);
      // setSelectedServices([]);
      setAllCourierData(data?.couriers);
      setCourierData(uniqueCourierArray);
      // fetchData();
      setLoadingSearch(false);
    } else {
      // formik.setFieldValue("couriers", []);
      // setSelectedServices([]);
      // setAllCourierData([]);
      setLoadingSearch(false);
      toast.warn("No courier service found");
      console.log(data.error.message);
      toast.error(data.error.message);
    }
  };
  // console.log(courierData, "courierData");

  const handleCheckboxChange = (event, item) => {
    if (event.target.checked) {
      formik.setFieldValue("selectedService", item);
    } else {
      formik.setFieldValue("selectedService", "");
    }
  };

  // const handleSave = () => {
  //   if (courier && selectedServices.length > 0) {
  //     const newData = selectedServices.map((service, index) => ({
  //       courier,
  //       serviceName: service,
  //       quote_markup_rate: quoteMarkupRate ? quoteMarkupRate : 0,
  //       label_markup_rate: labelMarkupRate ? labelMarkupRate : 0,
  //       insurance_markup_rate: insuranceMarkupRate ? insuranceMarkupRate : 0,
  //     }));
  //     setTableData((prevData) => [...prevData, ...newData]);
  //     setCourier("");
  //     setSelectedServices([]);
  //     onClose();
  //   } else {
  //     alert("Please enter a courier name and select at least one service.");
  //   }
  // };

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
            Add New Services
          </Typography>
          <Box
            sx={{ paddingRight: "20px", cursor: "pointer" }}
            onClick={onClose}
          >
            <img src={close} alt="close" />
          </Box>
        </Box>
        <SimpleBar
          forceVisible="y"
          autoHide={true}
          style={{ maxHeight: "86vh" }}
          className="custom-scrollbar"
        >
          <Box sx={{ marginX: "20px" }}>
            <Stack direction={"row"} sx={{ marginTop: "20px" }}>
              <Box>
                <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                  Search Courier
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
                  placeholder="Enter Courier Service"
                  name="courierName"
                  value={formik.values.courierName}
                  onChange={formik.handleChange}
                />
              </FormControl>
              <Button
                variant="contained"
                disabled={loadingSearch}
                onClick={handleSearchCourier}
                sx={{
                  backgroundColor: "#5E17EB",
                  color: "white",
                  border: "1px solid #E5E5E8",
                  boxShadow: "none",
                  borderRadius: "4px",
                  whiteSpace: "nowrap",
                  minWidth: "106px",
                  "&:hover": {
                    outline: "none",
                    color: "white",
                    backgroundColor: "#5E17EB",
                  },
                }}
              >
                Search
              </Button>
            </Stack>
            <Stack direction={"row"} sx={{ marginTop: "20px" }}>
              <Box>
                {/* <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                  {selectedServices.length}/{serviceName_list.length} Services
                  selected
                </Typography> */}
              </Box>
            </Stack>
            {courierData?.map((courier, index) => (
              <Stack
                direction={"row"}
                sx={{
                  marginTop: "20px",
                  border: "1px solid #E5E5E8",
                  borderRadius: "4px",
                  paddingX: "12px",
                }}
              >
                <FormGroup key={index}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={
                          formik.values.selectedService === courier.service_name
                        }
                        onChange={(event) =>
                          handleCheckboxChange(event, courier.service_name)
                        }
                      />
                    }
                    label={courier.service_name}
                    sx={{
                      ".MuiFormControlLabel-label": {
                        fontSize: "14px",
                        fontWeight: 600,
                      },
                    }}
                  />
                </FormGroup>
              </Stack>
            ))}
            {courierData?.length > 0 && (
              <>
                <Stack direction={"row"} sx={{ marginTop: "20px" }}>
                  <Box>
                    <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                      Quote Markup Rate
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
                      type="number"
                      name="quote_markup_rate"
                      value={formik.values.quote_markup_rate}
                      onChange={formik.handleChange}
                    />
                  </FormControl>
                </Stack>
                <Stack direction={"row"} sx={{ marginTop: "20px" }}>
                  <Box>
                    <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                      Label Markup Rate
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
                      type="number"
                      name="label_markup_rate"
                      value={formik.values.label_markup_rate}
                      onChange={formik.handleChange}
                    />
                  </FormControl>
                </Stack>
                <Stack direction={"row"} sx={{ marginTop: "20px" }}>
                  <Box>
                    <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                      Insurance Markup Rate
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
                      type="number"
                      name="insurance_markup_rate"
                      value={formik.values.insurance_markup_rate}
                      onChange={formik.handleChange}
                    />
                  </FormControl>
                </Stack>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      name="piggyback_allowed"
                      checked={formik.values.piggyback_allowed}
                      onChange={formik.handleChange}
                    />
                  }
                  label="Piggyback allowed"
                  sx={{
                    ".MuiFormControlLabel-label": {
                      fontSize: "14px",
                      fontWeight: 600,
                    },
                  }}
                />
              </>
            )}
          </Box>
        </SimpleBar>
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
            onClick={formik.handleSubmit}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
