import {
  Box,
  Button,
  CircularProgress,
  OutlinedInput,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import integration_logo from "../../../assets/svg/shipping_integration.svg";
import integration_logo_v2 from "../../../assets/svg/integration_v2.svg";
import shipping from "../../../assets/svg/shipping_truck.svg";
import IntegrationTable from "./IntegrationTable";
import AddNewServices from "./AddNewServices";
import { getEasyshipAccount } from "./APIService";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { useSelector } from "react-redux";

const initialValue = {
  apikey: "",
  connected: false,
  courierName: "",
  couriers: [],
  country: "",
  // selectedServices: []
};

export default function ConnectAPI() {
  const [initialValues, setInitialValues] = useState(initialValue);
  const [loadingConnect, setLoadingConnect] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const userData = useSelector((state) => state.auth.value);

  useEffect(() => {
    if (userData && userData.easyShipApikey) {
      formik.setFieldValue("apikey", userData.easyShipApikey);
      formik.setFieldValue("connected", userData.connected);
      // renderAPIKey(userData.easyShipApikey);
    }
  }, [userData?.easyShipApikey]);

  useEffect(() => {
    if (userData) {
      setLoadingConnect(true);
      try {
        const q = query(
          collection(db, "couriers"),
          where("adminId", "==", userData?.id)
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          console.log(querySnapshot, "querySnapshot");
          if (!querySnapshot.empty) {
            let couriers = [];
            let selected = {};

            // formik.setFieldValue("couriers", []);
            // setSelectedServices([]);
            // setAllCourierData([]);

            querySnapshot.forEach((doc) => {
              const existingServiceData = doc.data();
              couriers.push({
                ...existingServiceData,
                id: doc.id,
              });
            });

            const uniqueCourierNames = {};
            console.log(couriers, "couriers");

            const uniqueCouriers = couriers.map((courier) => {
              return (uniqueCourierNames[courier.service_name] = courier);
            });

            // formik.setFieldValue("couriers", couriers);
            formik.setFieldValue("couriers", Object.values(uniqueCourierNames));
            // setSelectedServices(
            //   Object.keys(uniqueCourierNames).map((courier) => courier)
            // );
            setLoadingConnect(false);
          } else {
            formik.setFieldValue("couriers", []);
            setLoadingConnect(false);
            // setSelectedServices([]);
            // setAllCourierData([]);
          }
        });

        return () => unsubscribe();
      } catch (error) {
        setLoadingConnect(false);
        console.error("Error fetching data:", error);
      }
    }
  }, [userData?.id]);

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    // validate,
    onSubmit: (values) => {},
  });
  const [showTable, setShowTable] = useState(false);

  console.log(formik.values.couriers, "formik values couriers");

  const headCells = [
    { id: "no", label: "No" },
    { id: "courier", label: "Courier" },
    {
      id: "serviceName",
      label: "Service Name",
      align: "right",
    },
    {
      id: "quote_markup_rate",
      label: "Quote Markup Rate",
      align: "right",
    },
    {
      id: "label_markup_rate",
      label: "Label Markup Rate",
      align: "right",
    },
    {
      id: "insurance_markup_rate",
      label: "Insurance Markup Rate",
      align: "right",
    },
  ];

  function createData(
    id,
    courier,
    serviceName,
    quote_markup_rate,
    label_markup_rate,
    insurance_markup_rate
  ) {
    return {
      id,
      courier,
      serviceName,
      quote_markup_rate,
      label_markup_rate,
      insurance_markup_rate,
    };
  }

  const rows =
    formik.values.couriers.length > 0 &&
    formik.values.couriers?.map((item, index) => {
      return createData(
        item?.id,
        item?.umbrella_name,
        item?.service_name,
        item?.quote_markup_rate,
        item?.label_markup_rate,
        item?.insurance_markup_rate
      );
    });

  const handleAddNewService = () => {
    setDrawerOpen(!drawerOpen);
    // setShowTable(true);
  };

  const handleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleEasyshipConnect = async () => {
    setLoadingConnect(true);
    const data = await getEasyshipAccount(
      formik.values.apikey
      // "prod_2LdXzhGmybugbcGqzZfY0yhDZya6RLHYIVn45zRyvDk="
    );
    if (data?.account) {
      formik.setFieldValue("connected", true);
      toast.success("Connected Successfully");
      updateDoc(doc(db, "admins", userData.id), {
        easyShipApikey: formik.values.apikey,
        connected: true,
      });
      setLoadingConnect(false);
    } else {
      console.log(data.error.message);
      toast.error(data.error.message);
      setLoadingConnect(false);
    }
  };

  const handleEasyshipDisconnect = async () => {
    setLoadingConnect(true);
    try {
      updateDoc(doc(db, "admins", userData.id), {
        easyShipApikey: "",
        connected: false,
      }).then((res) => {
        formik.setFieldValue("connected", false);
        formik.setFieldValue("apikey", "");
        toast.success("Disconnected Successfully");
        setLoadingConnect(false);
      });
    } catch (error) {
      console.log(error);
      setLoadingConnect(false);
    }
  };

  const renderAPIKey = (apiKey) => {
    if (apiKey.length >= 4) {
      const lastFourDigits = apiKey.slice(-4);
      // formik.setFieldValue("apikey", "*******************" + lastFourDigits);
      return "*********" + lastFourDigits;
    } else {
      return apiKey;
    }
  };

  return (
    <>
      {!userData || loadingConnect ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            mt: "16px",
          }}
        >
          <CircularProgress size={30} />
        </Box>
      ) : (
        <Box>
          {!formik.values.connected && (
            <Box
              sx={{
                flex: 1,
                backgroundColor: "white",
                borderTop: "1px solid #E5E5E8",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "13%",
                }}
              >
                <img src={integration_logo} alt="Service_integraion" />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "1%",
                }}
              >
                <Typography
                  sx={{ fontSize: "14px", color: "#1C2630", fontWeight: 500 }}
                >
                  Enter your API key to connect to Easyship and start adding
                  shipping services
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "1%",
                }}
              >
                <OutlinedInput
                  type="text"
                  placeholder="Enter API Key"
                  id="apikey"
                  name="apikey"
                  value={
                    formik.values.connected
                      ? renderAPIKey(formik.values.apikey)
                      : formik.values.apikey
                  }
                  onChange={formik.handleChange}
                  disabled={formik.values.connected}
                  autoComplete="off"
                  sx={{
                    minWidth: "335px",
                    ".MuiOutlinedInput-input": {
                      padding: "9px",
                    },
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "1%",
                }}
              >
                {!formik.values.connected ? (
                  <Button
                    variant="contained"
                    onClick={() => handleEasyshipConnect()}
                    disabled={loadingConnect}
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
                    Connect
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => handleEasyshipDisconnect()}
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
                    disabled={loadingConnect}
                  >
                    Disconnect
                  </Button>
                )}
              </Box>
            </Box>
          )}
          {formik.values.connected && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #E5E5E8",
                justifyContent: "space-between",
                borderRadius: "8px",
                padding: "20px",
                // mt: 2,
              }}
            >
              <img src={integration_logo_v2} alt="Service_integraion" />
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  sx={{ fontSize: "16px", color: "#1C2630", fontWeight: 400 }}
                >
                  {formik.values.connected
                    ? renderAPIKey(formik.values.apikey)
                    : formik.values.apikey}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => handleEasyshipDisconnect()}
                  sx={{
                    backgroundColor: "white",
                    color: "#481AA3",
                    border: "1px solid #E5E5E8",
                    boxShadow: "none",
                    borderRadius: "4px",
                    whiteSpace: "nowrap",
                    marginLeft: "20px",
                    minWidth: "106px",
                    "&:hover": {
                      outline: "none",
                      color: "#481AA3",
                      backgroundColor: "white",
                    },
                  }}
                  disabled={loadingConnect}
                >
                  Disconnect
                </Button>
              </Box>
            </Box>
          )}
          {formik.values.connected &&
            formik.values.couriers?.length <= 0 && (
              <Box
                sx={{
                  backgroundColor: "white",
                  borderTop: "1px solid #E5E5E8",
                  paddingTop: "20px",
                }}
              >
                <Box
                  sx={{
                    display: !showTable ? "flex" : "none",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "10%",
                  }}
                >
                  <img src={shipping} alt="Service_integraion" />
                </Box>
                <Box
                  sx={{
                    display: !showTable ? "flex" : "none",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "1%",
                  }}
                >
                  <Typography
                    sx={{ fontSize: "16px", color: "#1C2630", fontWeight: 700 }}
                  >
                    You have no services
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: !showTable ? "flex" : "none",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "1%",
                  }}
                >
                  <Typography
                    sx={{ fontSize: "14px", color: "#1C2630", fontWeight: 500 }}
                  >
                    Click Add New Service button to start adding shipping
                    service
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: !showTable ? "flex" : "none",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "1%",
                  }}
                >
                  <Button
                    variant="contained"
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
                    onClick={() => handleAddNewService()}
                  >
                    Add New Service
                  </Button>
                </Box>
              </Box>
            )}
          {formik.values.connected && formik.values.couriers.length > 0 && (
            <>
              <IntegrationTable
                headCells={headCells}
                rows={rows}
                apiKey={formik.values.apikey}
              />
            </>
          )}
          <AddNewServices
            open={drawerOpen}
            onClose={handleDrawer}
            apiKey={formik.values.apikey}
          />
        </Box>
      )}
    </>
  );
}
