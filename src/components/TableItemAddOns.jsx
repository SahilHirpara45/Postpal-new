import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Drawer,
  FormControlLabel,
  FormGroup,
  InputBase,
  Paper,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import close from "../assets/svg/drawer_close.svg";
import arrow from "../assets/svg/backspace.svg";
import speaker from "../assets/svg/speaker.svg";
import volumn_on from "../assets/svg/volume_on.svg";
import volumn_off from "../assets/svg/volume_off.svg";
import send from "../assets/svg/send.svg";
import postpalLogo from "../assets/svg/logo_blue.svg";
import SimpleBar from "simplebar-react";
import { useEffect } from "react";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { toast } from "react-toastify";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

function TableItemAddOns({
  data,
  open,
  onClose,
  packageActiveData,
  userActiveData,
  packageCollection,
  shipmentCollection,
}) {
  const [expanded, setExpanded] = useState("");
  const [expandedTwo, setExpandedTwo] = useState("");
  const [itmAddOnsData, setItmAddOnsData] = useState([]);
  const [packageAddOnsData, setPackageAddOnsData] = useState([]);
  const [shipmentAddOnsData, setShipmentAddOnsData] = useState([]);

  const [acceptedItemAddons, setAcceptedItemAddons] = useState([]);
  const [acceptedPackageAddons, setAcceptedPackageAddons] = useState([]);
  const [acceptedShipmentAddons, setAcceptedShipmentAddons] = useState([]);
  const [formsId, setFormsId] = useState([]);

  // console.log(data, "data in add-ons");
  // console.log(packageActiveData, "packageActiveData in add-ons");
  // console.log(userActiveData, "userActiveData in add-ons");
  // console.log(packageCollection, shipmentCollection, "at final stage");

  useEffect(() => {
    const fetchAddOnsData = async () => {
      if (data?.addons?.length > 0) {
        const addOns = await Promise.all(
          data.addons.map(async (id) => {
            const docRef = doc(db, "mySuiteAddOns", id);
            const docSnap = await getDoc(docRef);
            return docSnap.exists()
              ? { id: docSnap.id, ...docSnap.data() }
              : null;
          })
        );
        const filteredAddOns = addOns.filter((addon) => addon !== null);
        setItmAddOnsData(filteredAddOns);

        // Fetch and set existing accepted add-ons
        const itemRef = doc(db, "items", data.itemId);
        const itemSnap = await getDoc(itemRef);
        if (itemSnap.exists()) {
          const itemData = itemSnap.data();
          const acceptedAddons = itemData.acceptedAddons || [];

          setAcceptedItemAddons(
            filteredAddOns.filter((addOn) => acceptedAddons.includes(addOn.id))
          );
        } else {
          setAcceptedItemAddons([]);
        }
      } else {
        setItmAddOnsData([]);
        setAcceptedItemAddons([]);
      }
    };

    fetchAddOnsData();
  }, [data?.itemId]);

  useEffect(() => {
    const fetchAddOnsDataPackage = async () => {
      if (packageActiveData?.addonsList?.length > 0) {
        const addOns = await Promise.all(
          packageActiveData.addonsList.map(async (id) => {
            const docRef = doc(db, "mySuiteAddOns", id);
            const docSnap = await getDoc(docRef);
            return docSnap.exists()
              ? { id: docSnap.id, ...docSnap.data() }
              : null;
          })
        );
        const filteredAddOns = addOns.filter((addon) => addon !== null);
        setPackageAddOnsData(filteredAddOns);

        // Fetch and set existing accepted add-ons
        if (packageCollection) {
          const packageRef = doc(
            db,
            packageCollection,
            packageActiveData.packageTrackingId
          );
          const packageSnap = await getDoc(packageRef);
          if (packageSnap.exists()) {
            const packageData = packageSnap.data();
            const acceptedAddons = packageData.acceptedAddons || [];

            setAcceptedPackageAddons(
              filteredAddOns.filter((addOn) =>
                acceptedAddons.includes(addOn.id)
              )
            );
          } else {
            setAcceptedPackageAddons([]);
          }
        }
      } else {
        setPackageAddOnsData([]);
        setAcceptedPackageAddons([]);
      }
    };

    fetchAddOnsDataPackage();
  }, [packageActiveData?.packageTrackingId, packageCollection]);

  useEffect(() => {
    const fetchAddOnsMySuite = async () => {
      if (userActiveData?.addonsList?.length > 0) {
        const addOns = await Promise.all(
          userActiveData.addonsList.map(async (id) => {
            const docRef = doc(db, "mySuiteAddOns", id);
            const docSnap = await getDoc(docRef);
            return docSnap.exists()
              ? { id: docSnap.id, ...docSnap.data() }
              : null;
          })
        );
        const filteredAddOns = addOns.filter((addon) => addon !== null);
        setShipmentAddOnsData(filteredAddOns);

        // Fetch and set existing accepted add-ons
        if (!shipmentCollection) return;
        const shipmentRef = doc(db, shipmentCollection, userActiveData.id);
        const shipmentSnap = await getDoc(shipmentRef);
        if (shipmentSnap.exists()) {
          const shipmentData = shipmentSnap.data();
          const acceptedAddons = shipmentData.acceptedAddons || [];

          setAcceptedShipmentAddons(
            filteredAddOns.filter((addOn) => acceptedAddons.includes(addOn.id))
          );
        } else {
          setAcceptedShipmentAddons([]);
        }
      } else {
        setShipmentAddOnsData([]);
        setAcceptedShipmentAddons([]);
      }
    };

    fetchAddOnsMySuite();
  }, [userActiveData?.id, shipmentCollection]);

  // console.log(itmAddOnsData, "itmAddOnsData");
  // console.log(packageAddOnsData, "packageAddOnsData");
  // console.log(shipmentAddOnsData, "shipmentAddOnsData");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleChangeTwo = (panel) => (event, newExpanded) => {
    setExpandedTwo(newExpanded ? panel : false);
  };

  const handleCloseDrawer = () => {
    setExpanded("");
    onClose();
  };

  const handleCheckboxChange = (event, addOn, category) => {
    const { checked } = event.target;

    if (category === "item") {
      if (checked) {
        setAcceptedItemAddons((prev) => [...prev, addOn]);
      } else {
        setAcceptedItemAddons((prev) =>
          prev.filter((item) => item.id !== addOn.id)
        );
      }
    } else if (category === "package") {
      if (checked) {
        setAcceptedPackageAddons((prev) => [...prev, addOn]);
      } else {
        setAcceptedPackageAddons((prev) =>
          prev.filter((item) => item.id !== addOn.id)
        );
      }
    } else if (category === "shipment") {
      if (checked) {
        setAcceptedShipmentAddons((prev) => [...prev, addOn]);
      } else {
        setAcceptedShipmentAddons((prev) =>
          prev.filter((item) => item.id !== addOn.id)
        );
      }
    }
  };

  const handleSubmitItemAddons = async () => {
    const itemRef = doc(db, "items", data.itemId);
    await updateDoc(itemRef, {
      acceptedAddons: acceptedItemAddons.map((addOn) => addOn.id),
    }).then(() => {
      toast.success("Accepted Add-ons successfully");
      setExpanded("");
    });

    console.log("Accepted Item Add-ons:", acceptedItemAddons);
  };

  const handleSubmitPackageAddons = async () => {
    const packageRef = doc(
      db,
      packageCollection,
      packageActiveData.packageTrackingId
    );
    await updateDoc(packageRef, {
      acceptedAddons: acceptedPackageAddons.map((addOn) => addOn.id),
    }).then(() => {
      toast.success("Accepted Add-ons successfully");
      setExpanded("");
    });

    console.log("Accepted Package Add-ons:", acceptedPackageAddons);
  };

  const handleSubmitShipmentAddons = async () => {
    const shipmentRef = doc(db, shipmentCollection, userActiveData.id);
    await updateDoc(shipmentRef, {
      acceptedAddons: acceptedShipmentAddons.map((addOn) => addOn.id),
    }).then(() => {
      toast.success("Accepted Add-ons successfully");
      setExpanded("");
    });

    console.log("Accepted Shipment Add-ons:", acceptedShipmentAddons);
  };
  // setExpanded("");
  // onClose();

  const handleAllForm = (formType, packageActiveData, data) => {
    window.open(
      `/${formType}?id=${packageActiveData?.id}&itemId=${data?.itemId}`,
      "_blank"
    );
  };

  useEffect(() => {
    const fetchFormIds = async () => {
      try {
        const querySnapshot = collection(db, "forms");
        onSnapshot(querySnapshot, (snapshot) => {
          const arr = [];
          snapshot.forEach((doc) => {
            arr.push({ ...doc.data(), id: doc.id });
          });
          setFormsId(arr);
        });
      } catch (err) {
        console.log(err, "err");
      }
    };
    fetchFormIds();
  }, []);

  return (
    <Drawer
      variant="temporary"
      anchor="right"
      open={open}
      onClose={onClose}
      BackdropProps={{ sx: { background: "rgba(0, 0, 0, 0.5)" } }}
    >
      <Box sx={{ width: "1040px", display: "flex" }}>
        <Box>
          <Box
            sx={{
              borderBottom: "1px solid #E5E5E8",
              paddingLeft: "20px",
              paddingTop: "20px",
              paddingBottom: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "572px",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{ cursor: "pointer", marginRight: "20px" }}
                onClick={handleCloseDrawer}
              >
                <img
                  src={arrow}
                  alt="back_arrow"
                  style={{ minHeight: "24px", minWidth: "24px" }}
                />
              </Box>
              <Box sx={{ cursor: "pointer", marginRight: "20px" }}>
                {data?.item_img ? (
                  <img
                    src={data?.item_img}
                    alt="item_image"
                    width="40px"
                    height="40px"
                  />
                ) : (
                  <img
                    src={postpalLogo}
                    alt="postpalLogo"
                    width="40px"
                    height="40px"
                  />
                )}
              </Box>
              <Typography variant="h5" component="h5">
                {data?.name}'s Add-ons
              </Typography>
            </Box>
            <Box
              sx={{ paddingRight: "20px", cursor: "pointer" }}
              onClick={handleCloseDrawer}
            >
              <img src={close} alt="close" />
            </Box>
          </Box>
          <SimpleBar
            forceVisible="y"
            autoHide={true}
            style={{ maxHeight: "90vh" }}
            className="custom-scrollbar"
          >
            <Box>
              <Accordion
                expanded={expanded === "panel1"}
                onChange={handleChange("panel1")}
                sx={{ width: 572 }}
              >
                <AccordionSummary
                  aria-controls="panel1d-content"
                  id="panel1d-header"
                >
                  <label
                    style={{
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    Items Add-ons ({itmAddOnsData.length})
                  </label>
                </AccordionSummary>
                <AccordionDetails>
                  <Box>
                    <Typography
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <Stack direction="column" spacing={"10px"} sx={{ mb: 2 }}>
                        Inspection Form
                      </Stack>
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={formsId?.some(
                          (form) =>
                            form?.id === data?.itemId && form?.InspectionForm
                        )}
                        onClick={() =>
                          handleAllForm(
                            "inspectionForm",
                            packageActiveData,
                            data
                          )
                        }
                      >
                        Start report
                      </Button>
                    </Typography>
                    <Typography
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <Stack direction="column" spacing={"10px"} sx={{ mb: 2 }}>
                        Condition Form
                      </Stack>
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={formsId?.some(
                          (form) =>
                            form?.id === data?.itemId && form?.ConditionForm
                        )}
                        onClick={() =>
                          handleAllForm(
                            "conditionForm",
                            packageActiveData,
                            data
                          )
                        }
                      >
                        Start report
                      </Button>
                    </Typography>
                    <Typography
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <Stack direction="column" spacing={"10px"} sx={{ mb: 2 }}>
                        Measurement Form
                      </Stack>
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={formsId?.some(
                          (form) =>
                            form?.id === data?.itemId && form?.MeasurementForm
                        )}
                        onClick={() =>
                          handleAllForm(
                            "measurementForm",
                            packageActiveData,
                            data
                          )
                        }
                      >
                        Start report
                      </Button>
                    </Typography>
                  </Box>
                  <Box>
                    <Stack direction="column" spacing={"10px"}>
                      {itmAddOnsData?.length > 0 &&
                        itmAddOnsData?.map((addOn) => (
                          <Box
                            key={addOn?.id}
                            sx={{
                              backgroundColor: "#FAFAFA",
                              paddingX: "10px",
                              border: "1px solid #E5E5E8",
                              borderRadius: "4px",
                            }}
                          >
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={acceptedItemAddons?.some(
                                      (item) => item.id === addOn.id
                                    )}
                                    onChange={(event) =>
                                      handleCheckboxChange(event, addOn, "item")
                                    }
                                  />
                                }
                                label={addOn?.title}
                              />
                            </FormGroup>
                          </Box>
                        ))}
                      {itmAddOnsData?.length > 0 && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmitItemAddons}
                          >
                            Submit
                          </Button>
                        </Box>
                      )}
                    </Stack>
                    {/* <Box
                      sx={{
                        backgroundColor: "#FAFAFA",
                        paddingX: "10px",
                        border: "1px solid #E5E5E8",
                        marginTop: "10px",
                        borderRadius: "4px",
                        }}
                        >
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox />}
                          label="Remove shoe box"
                        />
                      </FormGroup>
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
                        borderRadius: "4px",
                      }}
                    >
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox />}
                          label="check functionality"
                        />
                      </FormGroup>
                      <label
                        style={{
                          color: "#481AA3",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                      Start report
                      </label>
                      </Box> */}
                  </Box>
                </AccordionDetails>
              </Accordion>
              <Accordion
                expanded={expanded === "panel2"}
                onChange={handleChange("panel2")}
                sx={{ width: 572 }}
              >
                <AccordionSummary
                  aria-controls="panel1d-content"
                  id="panel1d-header"
                >
                  <label
                    style={{
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    Package Add-ons ({packageAddOnsData?.length})
                  </label>
                </AccordionSummary>
                <AccordionDetails>
                  <Box>
                    <Stack direction="column" spacing={"10px"}>
                      {packageAddOnsData?.length > 0 &&
                        packageAddOnsData?.map((addOn) => (
                          <Box
                            key={addOn?.id}
                            sx={{
                              backgroundColor: "#FAFAFA",
                              paddingX: "10px",
                              border: "1px solid #E5E5E8",
                              borderRadius: "4px",
                            }}
                          >
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={acceptedPackageAddons?.some(
                                      (item) => item.id === addOn.id
                                    )}
                                    onChange={(event) =>
                                      handleCheckboxChange(
                                        event,
                                        addOn,
                                        "package"
                                      )
                                    }
                                  />
                                }
                                label={addOn?.title}
                              />
                            </FormGroup>
                          </Box>
                        ))}
                      {packageAddOnsData?.length > 0 && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmitPackageAddons}
                          >
                            Submit
                          </Button>
                        </Box>
                      )}
                    </Stack>
                  </Box>
                </AccordionDetails>
              </Accordion>
              <Accordion
                expanded={expanded === "panel3"}
                onChange={handleChange("panel3")}
                sx={{ width: 572 }}
              >
                <AccordionSummary
                  aria-controls="panel1d-content"
                  id="panel1d-header"
                >
                  <label
                    style={{
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    Shipment Add-ons ({shipmentAddOnsData?.length})
                  </label>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack direction="column" spacing={"10px"}>
                    {shipmentAddOnsData?.length > 0 &&
                      shipmentAddOnsData?.map((addOn) => (
                        <Box
                          key={addOn?.id}
                          sx={{
                            backgroundColor: "#FAFAFA",
                            paddingX: "10px",
                            border: "1px solid #E5E5E8",
                            borderRadius: "4px",
                          }}
                        >
                          <FormGroup>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={acceptedShipmentAddons?.some(
                                    (item) => item.id === addOn.id
                                  )}
                                  onChange={(event) =>
                                    handleCheckboxChange(
                                      event,
                                      addOn,
                                      "shipment"
                                    )
                                  }
                                />
                              }
                              label={addOn?.title}
                            />
                          </FormGroup>
                        </Box>
                      ))}
                    {shipmentAddOnsData?.length > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleSubmitShipmentAddons}
                        >
                          Submit
                        </Button>
                      </Box>
                    )}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </Box>
          </SimpleBar>
        </Box>
        <Box sx={{ backgroundColor: "#FAFAFA" }}>
          <Box
            sx={{
              borderBottom: "1px solid #E5E5E8",
              paddingLeft: "20px",
              paddingTop: "20px",
              paddingBottom: "13px",
              display: "flex",
              justifyContent: "space-between",
              width: "462px",
              backgroundColor: "#FAFAFA",
            }}
          >
            <Typography variant="h5" component="h5">
              Shipping Guider
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
          <Box sx={{ height: "84vh" }}>
            <Accordion
              expanded={expandedTwo === "panel1"}
              onChange={handleChangeTwo("panel1")}
              sx={{ width: 462 }}
            >
              <AccordionSummary
                aria-controls="panel1d-content"
                id="panel1d-header"
              >
                <label
                  style={{
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  Packaging Guider
                </label>
              </AccordionSummary>
              <AccordionDetails>
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "#FAFAFA",
                      paddingX: "10px",
                      border: "1px solid #E5E5E8",
                      marginTop: "10px",
                      borderRadius: "4px",
                    }}
                  >
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox />}
                        label="Lorem ipsum dolor sit amet"
                      />
                    </FormGroup>
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
                      borderRadius: "4px",
                    }}
                  >
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox />}
                        label="Lorem ipsum dolor sit amet"
                      />
                    </FormGroup>
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
                      borderRadius: "4px",
                      paddingBottom: "20px",
                    }}
                  >
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox />}
                        label="Lorem ipsum dolor sit amet"
                      />
                    </FormGroup>
                    <img src={volumn_off} alt="volumn_on" />
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expandedTwo === "panel2"}
              onChange={handleChangeTwo("panel2")}
              sx={{ width: 462 }}
            >
              <AccordionSummary
                aria-controls="panel1d-content"
                id="panel1d-header"
              >
                <label
                  style={{
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  General Shipping Procedure
                </label>
              </AccordionSummary>
              <AccordionDetails>
                <Box></Box>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expandedTwo === "panel3"}
              onChange={handleChangeTwo("panel3")}
              sx={{ width: 462 }}
            >
              <AccordionSummary
                aria-controls="panel1d-content"
                id="panel1d-header"
              >
                <label
                  style={{
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  Warning and Directives
                </label>
              </AccordionSummary>
              <AccordionDetails>
                <Box></Box>
              </AccordionDetails>
            </Accordion>
          </Box>
          <Box
            sx={{
              paddingLeft: "24px",
              marginTop: "20px",
              marginRight: "40px",
            }}
          >
            <Box>
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
                  placeholder="Search... "
                  inputProps={{ "aria-label": "Ask me a question" }}
                  size="small"
                />
                <img src={send} alt="send" />
              </Paper>
            </Box>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}

export default TableItemAddOns;
