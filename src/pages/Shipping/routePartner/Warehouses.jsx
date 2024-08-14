import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputAdornment,
  InputBase,
  OutlinedInput,
  TextareaAutosize,
  Tooltip,
  Typography,
  alpha,
  styled,
  tooltipClasses,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import LocationNotFound from "../../../assets/svg/LocationNotFound.svg";
import edit from "../../../assets/svg/action_edit.svg";
import delete_icon from "../../../assets/svg/delete.svg";
import SimpleBar from "simplebar-react";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate, useParams } from "react-router-dom";
import EditMainAdressDrawer from "./EditMainAdressDrawer";
import EditAlternativeAdressDrawer from "./EditAlternativeAddressDrawer";
import Swal from "sweetalert2";
import { renderToStaticMarkup } from "react-dom/server";
import { BsExclamationCircleFill } from "react-icons/bs";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, storage } from "../../../firebaseConfig";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { IoAlertCircle } from "react-icons/io5";
import RoutePartnerHeader from "./RoutePartnerHeader";
import Countries from "../../../Contries.json";
import FileUploaderMultiple from "../../../components/common/FileUploaderMultiple";

const ServiceTooltip = styled(({ className, ...props }) => (
  <Tooltip
    {...props}
    arrow
    classes={{ popper: className }}
    placement="right-start"
  />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
    paddingLeft: "30px",
    paddingRight: "30px",
    paddingTop: "10px",
    paddingBottom: "10px",
    fontSize: "14px",
    fontWeight: "normal",
  },
}));

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "12px",
  backgroundColor: "#FAFAFA",
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  // width: "230px",
  height: "40px",
  [theme.breakpoints.up("sm")]: {
    // marginLeft: theme.spacing(1),
    // width: "auto",
  },
  border: "1px solid #EEEEEE",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "230px",
    // [theme.breakpoints.up("sm")]: {
    //   width: "12ch",
    //   "&:focus": {
    //     width: "20ch",
    //   },
    // },
  },
}));

const initialValue = {
  auxiliaryServices: {
    exportForwarder: false,
    importForwarding: false,
    importForwardingPrice: 0,
    lastMileDelivery: false,
    lastMilePrice: 0,
    pickupPrice: 0,
    pickupService: false,
  },
  specialServices: {
    fastLane: false,
    greenerShipping: false,
    guaranteedDelivery: false,
    internationalReturn: false,
    nationalReturn: false,
    ownershipCertificate: false,
    packageInspection: false,
    personalShopping: false,
    scanMail: false,
    storeMediationService: false,
    taxFreeAddress: false,
    taxExemptItems: false,
  },
  specializedServices: {
    hazmat: false,
    medical: false,
    traveller: false,
    pickup: false,
  },
};

//Addmuse formikvalue
const initialValue1 = {
  addressLine1: "",
  addressLine2: "",
  contactPersonName: "",
  emailId: "",
  contactNumber: "",
  city: "",
  state: "",
  country: "",
  about: "",
  logoUrl: "",
  isCrowdShipper: false,
  isTraveller: false,
  isStoreAgent: false,
  isNonProfit: false,
  name: "",
};

export default function Warehouses() {
  const [searchValue, setSearchValue] = useState("");
  const [searchValueAlternateAddress, setSearchValueAlternateAddress] =
    useState("");
  const [forwardFee, setForwardFee] = useState("");
  const [deliveryFee, setDelveryFee] = useState("");
  const [pickupFee, setPickupFee] = useState("");
  const navigation = useNavigate();
  const [editMainAddressDrawer, setEditMainAddressDrawer] = useState(false);
  const [alternativeDrawerOpen, setAlternativeDrawerOpen] = useState(false);

  const [active, setActive] = useState(null);
  const [mainAddressDrawerState, setMainAddressDrawerState] = useState({
    showDrawer: false,
    addressId: "",
  });
  const [museState, setMuseState] = useState({ showModal: false, museId: "" });
  const [alternativeAddressDrawerState, setAlternativeAddressDrawerState] =
    useState({ showDrawer: false, addressId: "", alternativeAddressId: "" });
  const [alternativeAddresses, setAlternativeAddresses] = useState([]);
  const [alternativeAddressLoader, setAlternativeAddressLoader] =
    useState(false);
  const [initialWarehouseOptions, setInitialWarehouseOptions] =
    useState(initialValue);
  const [initialAddmuseValue, setInitialAddmuseValue] = useState(initialValue1);
  const [isMusePartner, setIsMusePartner] = useState(false);
  const [routePartnerMainAddress, setRoutePartnerMainAddress] = useState([]);
  const [activeBoxId, setActiveBoxId] = useState(
    routePartnerMainAddress[0]?.id
  );
  const [mushPartner, setMushPartner] = useState([]);
  const [searchMainAddress, setSearchMainAddress] = useState("");
  const [searchAlternativeAddress, setSearchAlternativeAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMuseForm, setShowMuseForm] = useState(false);
  // const [edithowId, setEditId] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState(null);

  const params = useParams();

  const fetchAlternativeAddress = async (id) => {
    try {
      const querySnapshot = await getDocs(
        collection(db, "routePartnerMainAddress", id, "alternativeAddress")
      );
      let arr = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setAlternativeAddresses(arr);
      setAlternativeAddressLoader(false);
    } catch (error) {
      console.log(error, "error");
    }
  };

  const deleteAlternativeAddress = (itemId) => {
    setLoading(true);
    try {
      const docRef = doc(
        db,
        "routePartnerMainAddress",
        alternativeAddressDrawerState.addressId,
        "alternativeAddress",
        itemId
      );
      deleteDoc(docRef).then(() => {
        toast.success("Alternative Address deleted Successfully!");
        fetchAlternativeAddress(alternativeAddressDrawerState.addressId);
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: initialWarehouseOptions,
    enableReinitialize: true,
    onSubmit: (values) => {
      setLoading(true);
      try {
        // logic for updateDoc
        updateDoc(
          doc(
            db,
            "routePartnerMainAddress",
            alternativeAddressDrawerState?.addressId
          ),
          values
        ).then((res) => {
          toast.success("Route Partner Services Updated Successfully!");
          setLoading(false);
        });
      } catch (error) {
        console.log(error, "error");
      }
    },
  });

  const onUploadChange = (file) => {
    setSelectedFiles(file);
  };

  //Addmuse Formik
  const addMuseFormik = useFormik({
    initialValues: initialAddmuseValue,
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log(values, "values ??");
      console.log(museState.museId, "museState.museId ??");
      console.log(selectedFiles, "selectedFiles ??");
      setLoading(true);
      try {
        if (museState.museId) {
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
            updateDoc(doc(db, "musePartners", museState.museId), {
              ...values,
              logoUrl: url,
            }).then((res) => {
              toast.success("Muse Partner Updated Successfully!");
              setLoading(false);
            });
          } else {
            updateDoc(doc(db, "musePartners", museState.museId), {
              ...values,
            }).then((res) => {
              toast.success("Muse Partner Updated Successfully!");
              setLoading(false);
              setIsEditable(false);
              // navigate(`/systems/shopping/brand/view/${applicationId}`);
            });
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
        setIsEditable(false);
      }
    },
  });

  useEffect(() => {
    const getForId = async () => {
      if (museState.museId) {
        const docRef = doc(db, "musePartners", museState.museId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setInitialAddmuseValue(docSnap.data());
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
        }
      }
    };
    getForId();
  }, [museState.museId]);

  useEffect(() => {
    handler();
  }, []);

  // console.log(formik.values, "formik.values");

  async function handler() {
    try {
      const querySnapshot = collection(db, "routePartnerMainAddress");

      const q = query(querySnapshot, where("routePartnerId", "==", params.id));
      onSnapshot(q, async (snapshot) => {
        const arr = [];
        snapshot.forEach((doc) => {
          arr.push({ ...doc.data(), id: doc.id });
        });
        setActive(arr[0].id);
        setAlternativeAddressDrawerState((prev) => ({
          ...prev,
          addressId: arr[0].id,
        }));
        fetchAlternativeAddress(arr[0].id);
        const docRef = doc(db, "routePartnerMainAddress", arr[0].id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setInitialWarehouseOptions(docSnap.data());
        } else {
          // docSnap.data() will be undefined in this case
        }
        setRoutePartnerMainAddress(arr);
      });
    } catch (error) {
      console.log(error, "error");
    }

    try {
      const querySnapshot = collection(db, "musePartners");
      const q = query(querySnapshot, where("routePartnerId", "==", params.id));
      onSnapshot(q, (snapshot) => {
        const arr = [];
        snapshot.forEach((doc) => {
          // allData.push({ ...doc.data(), id: doc.id });
          arr.push({ ...doc.data(), id: doc.id });
        });
        // setRoutePartner(prev=>([...prev,...arr]));
        // setRoutePartnerFilter(prev=>([...prev,...arr]));
        setMushPartner(arr, "mush partner");
        // setMushPartnerFilter(arr);
      });
    } catch (err) {
      console.log(err, "err");
    }
  }

  const WareHouseHandler = async (id) => {
    setActive(id);
    if (id) {
      setIsMusePartner(false);
      setAlternativeAddressLoader(true);
      setAlternativeAddressDrawerState((prev) => ({ ...prev, addressId: id }));
      const docRef = doc(db, "routePartnerMainAddress", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setInitialWarehouseOptions(docSnap.data());
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
      fetchAlternativeAddress(id);
    }
  };

  const MuseHandler = (id) => {
    setShowMuseForm(true);
    setActive(id);
    if (active !== id) {
      setIsEditable(false);
    }
    // const updatedData=mushPartner.
    setMuseState(() => ({
      // showModal: !prev.showModal,
      museId: id,
    }));
    if (id) {
      setInitialWarehouseOptions(initialValue);
      setIsMusePartner(true);
    }
  };

  const MainAddressDrawer = (id, e, apiCall) => {
    e.stopPropagation();
    setMainAddressDrawerState((prev) => ({
      showDrawer: !prev.showDrawer,
      addressId: id,
    }));
    if (typeof apiCall === "boolean" && apiCall) {
      handler();
    }
  };

  const AlternativeAddressDrawer = async (apiCall) => {
    setAlternativeAddressDrawerState((prev) => ({
      ...prev,
      showDrawer: !prev.showDrawer,
      alternativeAddressId: "",
    }));
    if (typeof apiCall === "boolean" && apiCall) {
      fetchAlternativeAddress(alternativeAddressDrawerState.addressId);
    }
  };

  const closeMainAddressDrawer = () => {
    setMainAddressDrawerState((prev) => ({ showDrawer: false, addressId: "" }));
  };

  const handleNewAddress = () => {
    navigation("/shipping/route-partner/addNewMainAddress");
  };

  const handleDeleteClick = (id, e) => {
    e.stopPropagation();
    const titleHtml = renderToStaticMarkup(
      <Typography
        style={{
          fontSize: "18px",
          fontWeight: 700,
          color: "#1C2630",
          lineHeight: "20px",
          marginTop: "20px",
          marginBottom: "15px",
        }}
      >
        Are you sure to delete this Route Partner?
      </Typography>
    );

    Swal.fire({
      title: titleHtml,
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonColor: "#EB5757",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      didRender: () => {
        const cancelButton = Swal.getCancelButton();
        const confirmButton = Swal.getConfirmButton();
        if (cancelButton) {
          cancelButton.style.backgroundColor = "#fff";
          cancelButton.style.color = "#1C2630";
          cancelButton.style.border = "1px solid #E5E5E8";
          cancelButton.style.fontWeight = 600;
          cancelButton.style.width = "120px";
        }
        if (confirmButton) {
          confirmButton.style.width = "120px";
          confirmButton.style.fontWeight = 600;
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAlternativeAddress(id);
        console.log("Route Partner deleted.");
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        console.log("Cancelled.");
      }
    });
  };

  return (
    <>
      {(routePartnerMainAddress?.length > 0 || mushPartner?.length > 0) && (
        <Box sx={{ flex: 1, backgroundColor: "white" }}>
          <Grid container spacing={0} sx={{ maxHeight: "78vh" }}>
            <Grid
              item
              xs={12}
              sm={12}
              md={3}
              lg={3}
              sx={{ border: "1px solid #E5E5E8", borderBottom: "0px" }}
            >
              <Box
                sx={{
                  paddingX: "5%",
                  paddingY: "3%",
                  backgroundColor: "#FAFAFA",
                  borderBottom: "1px solid #E5E5E8",
                }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: "16px" }}>
                  Main Address
                </Typography>
              </Box>
              <Box sx={{ p: "24px 16px", paddingTop: "20px" }}>
                <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ "aria-label": "search" }}
                    value={searchMainAddress}
                    onChange={(e) => setSearchMainAddress(e.target.value)}
                  />
                </Search>
              </Box>
              <SimpleBar
                forceVisible="y"
                autoHide={true}
                style={{
                  maxHeight: "61vh",
                }}
                className="custom-scrollbar"
              >
                {routePartnerMainAddress
                  ?.filter((add) =>
                    add.warehouseName
                      .toLowerCase()
                      .includes(searchMainAddress.toLowerCase())
                  )
                  ?.map((item, index) => {
                    return (
                      <Box
                        sx={{
                          paddingX: "18px",
                          paddingY: "10px",
                          backgroundColor:
                            active === item.id ? "#EBE4FA" : "#fff",
                          cursor: "pointer",
                        }}
                        key={item.id}
                        onClick={() => WareHouseHandler(item.id)}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            sx={{ fontWeight: 700, fontSize: "16px" }}
                          >
                            {item.warehouseName}
                          </Typography>
                          <Box onClick={(e) => MainAddressDrawer(item.id, e)}>
                            <img src={edit} alt="edit" />
                          </Box>
                        </Box>
                        <Box>
                          <Typography sx={{ fontSize: "14px" }}>
                            {item.addressLine1}
                          </Typography>
                          <Typography sx={{ fontSize: "14px" }}>
                            {item.addressLine2}
                          </Typography>
                          <Typography sx={{ fontSize: "14px" }}>
                            {`${item.city} , ${item.state}, ${item.country}`}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            paddingX: "8px",
                            paddingY: "4px",
                            width: "fit-content",
                            borderRadius: "2px",
                            color: "#fff",
                            backgroundColor: "#2DC58C",
                          }}
                        >
                          <Typography
                            sx={{ fontWeight: 700, fontSize: "14px" }}
                          >
                            Route Partner Address
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                {mushPartner
                  ?.filter((partner) =>
                    partner.name
                      .toLowerCase()
                      .includes(searchMainAddress.toLowerCase())
                  )
                  ?.map((item, index) => {
                    return (
                      <Box
                        sx={{
                          paddingX: "18px",
                          paddingY: "10px",
                          backgroundColor:
                            active === item.id ? "#EBE4FA" : "#fff",
                          cursor: "pointer",
                        }}
                        key={item.id}
                        onClick={() => MuseHandler(item.id)}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            sx={{ fontWeight: 700, fontSize: "16px" }}
                          >
                            {item.name}
                          </Typography>
                          <Box
                            onClick={(e) => {
                              setIsEditable(true);
                              e.stopPropagation();
                            }}
                          >
                            <img src={edit} alt="edit" />
                          </Box>
                        </Box>
                        <Box>
                          <Typography sx={{ fontSize: "14px" }}>
                            {item.addressLine1}
                          </Typography>
                          <Typography sx={{ fontSize: "14px" }}>
                            {item.addressLine2}
                          </Typography>
                          <Typography sx={{ fontSize: "14px" }}>
                            {`${item.city} , ${item.state}, ${item.country}`}
                          </Typography>
                        </Box>
                        {item.isCrowdShipper && (
                          <Box
                            sx={{
                              paddingX: "8px",
                              paddingY: "4px",
                              width: "fit-content",
                              borderRadius: "2px",
                              color: "#fff",
                              backgroundColor: "#F2994A",
                            }}
                          >
                            <Typography
                              sx={{ fontWeight: 700, fontSize: "14px" }}
                            >
                              CrowdShipper
                            </Typography>
                          </Box>
                        )}
                        {item.isTraveller && (
                          <Box
                            sx={{
                              paddingX: "8px",
                              paddingY: "4px",
                              width: "fit-content",
                              borderRadius: "2px",
                              color: "#fff",
                              backgroundColor: "#2D9CDB",
                            }}
                          >
                            <Typography
                              sx={{ fontWeight: 700, fontSize: "14px" }}
                            >
                              Traveler
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    );
                  })}
              </SimpleBar>
            </Grid>

            {!isMusePartner && (
              <>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={3}
                  lg={3}
                  sx={{
                    borderRight: "1px solid #E5E5E8",
                    borderTop: "1px solid #E5E5E8",
                  }}
                >
                  <Box
                    sx={{
                      paddingX: "5%",
                      paddingY: "3%",
                      backgroundColor: "#FAFAFA",
                      borderBottom: "1px solid #E5E5E8",
                    }}
                  >
                    <Typography sx={{ fontWeight: 700, fontSize: "16px" }}>
                      Altenative Address
                    </Typography>
                  </Box>
                  <Box sx={{ p: "24px 16px", paddingTop: "20px" }}>
                    <Search>
                      <SearchIconWrapper>
                        <SearchIcon />
                      </SearchIconWrapper>
                      <StyledInputBase
                        placeholder="Search…"
                        inputProps={{ "aria-label": "search" }}
                        value={searchAlternativeAddress}
                        onChange={(e) =>
                          setSearchAlternativeAddress(e.target.value)
                        }
                      />
                    </Search>
                  </Box>
                  {alternativeAddresses?.length <= 0 &&
                  alternativeAddressLoader ? (
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
                    <SimpleBar
                      forceVisible="y"
                      autoHide={true}
                      style={{
                        maxHeight: "78vh",
                      }}
                      className="custom-scrollbar"
                    >
                      {alternativeAddresses
                        ?.filter((add) =>
                          add.alternativeAddressName
                            .toLowerCase()
                            .includes(searchAlternativeAddress.toLowerCase())
                        )
                        .map((item) => (
                          <Box
                            sx={{
                              paddingX: "18px",
                              paddingY: "10px",
                              backgroundColor:
                                activeBoxId === item.id ? "#EBE4FA" : "#fff",
                              cursor: "pointer",
                            }}
                            key={item.id}
                            onClick={() => setActiveBoxId(item.id)}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Typography
                                sx={{ fontWeight: 700, fontSize: "16px" }}
                              >
                                {item.alternativeAddressName}
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <img
                                  src={edit}
                                  alt="edit"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setAlternativeAddressDrawerState(
                                      (prev) => ({
                                        ...prev,
                                        showDrawer: !prev.showDrawer,
                                        alternativeAddressId: item.id,
                                      })
                                    );
                                  }}
                                />
                                <img
                                  src={delete_icon}
                                  alt="delete"
                                  style={{ marginLeft: "10px" }}
                                  onClick={(e) =>
                                    handleDeleteClick(item?.id, e)
                                  }
                                />
                              </Box>
                            </Box>
                            <Box>
                              <Typography sx={{ fontSize: "14px" }}>
                                {item.address}
                              </Typography>
                              <Typography sx={{ fontSize: "14px" }}>
                                {`${item.city} , ${item.state}, ${item.country}`}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      {alternativeAddresses?.length > 0 && (
                        <Button
                          variant="contained"
                          onClick={AlternativeAddressDrawer}
                          sx={{
                            backgroundColor: "#5E17EB",
                            color: "#fff",
                            width: "-webkit-fill-available",
                            paddingX: "14px",
                            paddingY: "11px",
                            border: "1px solid #E5E5E8",
                            borderRadius: "4px",
                            boxShadow: "none",
                            whiteSpace: "nowrap",
                            marginTop: "2%",
                            marginX: "5%",
                            "&:hover": {
                              outline: "none",
                              color: "#fff",
                              backgroundColor: "#5E17EB",
                            },
                          }}
                        >
                          Add Alternative Address
                        </Button>
                      )}
                    </SimpleBar>
                  )}
                  {alternativeAddresses?.length <= 0 &&
                    !alternativeAddressLoader && (
                      <Box sx={{ marginTop: "20px" }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            marginBottom: "5%",
                            marginTop: "30%",
                          }}
                        >
                          <img src={LocationNotFound} alt="location" />
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <Typography
                            sx={{ fontSize: "16px", fontWeight: 600 }}
                          >
                            No records found
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <Typography
                            sx={{ fontSize: "14px", fontWeight: 500 }}
                          >
                            Add alternative address to this forwarder
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <Button
                            variant="contained"
                            sx={{
                              backgroundColor: "#5E17EB",
                              color: "#fff",
                              width: "160px",
                              border: "1px solid #E5E5E8",
                              borderRadius: "4px",
                              boxShadow: "none",
                              whiteSpace: "nowrap",
                              marginTop: "2%",
                              "&:hover": {
                                outline: "none",
                                color: "#fff",
                                backgroundColor: "#5E17EB", // Remove border color on focus
                              },
                            }}
                            onClick={AlternativeAddressDrawer}
                          >
                            Add New Address
                          </Button>
                        </Box>
                      </Box>
                    )}
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={6}
                  sx={{
                    borderRight: "1px solid #E5E5E8",
                    borderTop: "1px solid #E5E5E8",
                  }}
                >
                  <Box
                    sx={{
                      paddingX: "3%",
                      paddingY: "1.5%",
                      backgroundColor: "#FAFAFA",
                      borderBottom: "1px solid #E5E5E8",
                    }}
                  >
                    <Typography sx={{ fontWeight: 700, fontSize: "16px" }}>
                      Services
                    </Typography>
                  </Box>
                  <SimpleBar
                    forceVisible="y"
                    autoHide={true}
                    style={{
                      maxHeight: "72vh",
                    }}
                    className="custom-scrollbar"
                  >
                    <Box
                      sx={{
                        paddingX: "3%",
                        paddingY: "1.5%",
                      }}
                    >
                      <Typography sx={{ fontWeight: 700, fontSize: "14px" }}>
                        Special Services
                      </Typography>
                      <Typography sx={{ fontSize: "14px", color: "#959BA1" }}>
                        (Please select the service which you offer for this
                        warehouse, we share revenue with route partner who offer
                        such service(s) )
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        border: "1px solid #E5E5E8",
                        marginX: "3%",
                        borderRadius: "4px",
                        padding: "3%",
                        paddingY: "1%",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "2%",
                        }}
                      >
                        <Box
                          sx={{
                            width: "48%",
                            display: "flex",
                          }}
                        >
                          <FormGroup>
                            <FormControlLabel
                              label={"Fast Lane"}
                              control={
                                <Checkbox
                                  size="small"
                                  name={"specialServices.fastLane"}
                                  onChange={formik.handleChange}
                                  checked={
                                    formik.values.specialServices.fastLane
                                  }
                                />
                              }
                              sx={{
                                ".MuiFormControlLabel-label": {
                                  fontSize: "14px",
                                  fontWeight: 600,
                                },
                                mr: 0,
                              }}
                            />
                          </FormGroup>
                          <Tooltip
                            title="Included in Premium plan"
                            placement="right-start"
                          >
                            <IconButton>
                              <IoAlertCircle size={16} color="#000000" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        <Box
                          sx={{
                            width: "48%",
                            display: "flex",
                          }}
                        >
                          <FormGroup>
                            <FormControlLabel
                              label="Greener Shipping"
                              control={
                                <Checkbox
                                  size="small"
                                  name={"specialServices.greenerShipping"}
                                  onChange={formik.handleChange}
                                  checked={
                                    formik.values.specialServices
                                      .greenerShipping
                                  }
                                  // value={formik.values.auxiliaryServices.importForwarding}
                                />
                              }
                              sx={{
                                ".MuiFormControlLabel-label": {
                                  fontSize: "14px",
                                  fontWeight: 600,
                                },
                                mr: 0,
                              }}
                            />
                          </FormGroup>
                          <Tooltip
                            title="Select if you offer service"
                            placement="right-start"
                          >
                            <IconButton>
                              <IoAlertCircle size={16} color="#000000" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        <Box
                          sx={{
                            width: "48%",
                            display: "flex",
                          }}
                        >
                          <FormGroup>
                            <FormControlLabel
                              label="Guaranteed Delivery"
                              control={
                                <Checkbox
                                  size="small"
                                  name={"specialServices.guaranteedDelivery"}
                                  onChange={formik.handleChange}
                                  checked={
                                    formik.values.specialServices
                                      .guaranteedDelivery
                                  }
                                />
                              }
                              sx={{
                                ".MuiFormControlLabel-label": {
                                  fontSize: "14px",
                                  fontWeight: 600,
                                },
                                mr: 0,
                              }}
                            />
                          </FormGroup>
                          <Tooltip
                            title="Available in Free plan"
                            placement="right-start"
                          >
                            <IconButton>
                              <IoAlertCircle size={16} color="#000000" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        <Box
                          sx={{
                            width: "48%",
                            display: "flex",
                          }}
                        >
                          <FormGroup>
                            <FormControlLabel
                              label="International Return"
                              control={
                                <Checkbox
                                  size="small"
                                  name={"specialServices.internationalReturn"}
                                  onChange={formik.handleChange}
                                  checked={
                                    formik.values.specialServices
                                      .internationalReturn
                                  }
                                />
                              }
                              sx={{
                                ".MuiFormControlLabel-label": {
                                  fontSize: "14px",
                                  fontWeight: 600,
                                },
                                mr: 0,
                              }}
                            />
                          </FormGroup>
                          <Tooltip
                            title=" $2 per item + shipping cost."
                            placement="right-start"
                          >
                            <IconButton>
                              <IoAlertCircle size={16} color="#000000" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        <Box
                          sx={{
                            width: "48%",
                            display: "flex",
                          }}
                        >
                          <FormGroup>
                            <FormControlLabel
                              label="National Return"
                              control={
                                <Checkbox
                                  size="small"
                                  name={"specialServices.nationalReturn"}
                                  onChange={formik.handleChange}
                                  checked={
                                    formik.values.specialServices.nationalReturn
                                  }
                                />
                              }
                              sx={{
                                ".MuiFormControlLabel-label": {
                                  fontSize: "14px",
                                  fontWeight: 600,
                                },
                                mr: 0,
                              }}
                            />
                          </FormGroup>
                          <Tooltip
                            title="$2 per return + shipping cost"
                            placement="right-start"
                          >
                            <IconButton>
                              <IoAlertCircle size={16} color="#000000" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        <Box
                          sx={{
                            width: "48%",
                            display: "flex",
                          }}
                        >
                          <FormGroup>
                            <FormControlLabel
                              label="Ownership Certificate"
                              control={
                                <Checkbox
                                  size="small"
                                  name={"specialServices.ownershipCertificate"}
                                  onChange={formik.handleChange}
                                  checked={
                                    formik.values.specialServices
                                      .ownershipCertificate
                                  }
                                />
                              }
                              sx={{
                                ".MuiFormControlLabel-label": {
                                  fontSize: "14px",
                                  fontWeight: 600,
                                },
                                mr: 0,
                              }}
                            />
                          </FormGroup>
                          <Tooltip
                            title="$3 per certificate registration"
                            placement="right-start"
                          >
                            <IconButton>
                              <IoAlertCircle size={16} color="#000000" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        <Box
                          sx={{
                            width: "48%",
                            display: "flex",
                          }}
                        >
                          <FormGroup>
                            <FormControlLabel
                              label="Package Inspection"
                              control={
                                <Checkbox
                                  size="small"
                                  name={"specialServices.packageInspection"}
                                  onChange={formik.handleChange}
                                  checked={
                                    formik.values.specialServices
                                      .packageInspection
                                  }
                                />
                              }
                              sx={{
                                ".MuiFormControlLabel-label": {
                                  fontSize: "14px",
                                  fontWeight: 600,
                                },
                                mr: 0,
                              }}
                            />
                          </FormGroup>
                          <Tooltip
                            title="$3 per measurement insp, $5 per functional insp"
                            placement="right-start"
                          >
                            <IconButton>
                              <IoAlertCircle size={16} color="#000000" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        <Box
                          sx={{
                            width: "48%",
                            display: "flex",
                          }}
                        >
                          <FormGroup>
                            <FormControlLabel
                              label="Personal Shopping"
                              control={
                                <Checkbox
                                  size="small"
                                  name={"specialServices.personalShopping"}
                                  onChange={formik.handleChange}
                                  checked={
                                    formik.values.specialServices
                                      .personalShopping
                                  }
                                />
                              }
                              sx={{
                                ".MuiFormControlLabel-label": {
                                  fontSize: "14px",
                                  fontWeight: 600,
                                },
                                mr: 0,
                              }}
                            />
                          </FormGroup>
                          <Tooltip
                            title="Select if you offer service"
                            placement="right-start"
                          >
                            <IconButton>
                              <IoAlertCircle size={16} color="#000000" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        <Box
                          sx={{
                            width: "48%",
                            display: "flex",
                          }}
                        >
                          <FormGroup>
                            <FormControlLabel
                              label="Scan Mail"
                              control={
                                <Checkbox
                                  size="small"
                                  name={"specialServices.scanMail"}
                                  onChange={formik.handleChange}
                                  checked={
                                    formik.values.specialServices.scanMail
                                  }
                                />
                              }
                              sx={{
                                ".MuiFormControlLabel-label": {
                                  fontSize: "14px",
                                  fontWeight: 600,
                                },
                                mr: 0,
                              }}
                            />
                          </FormGroup>
                          <Tooltip title="$1/page" placement="right-start">
                            <IconButton>
                              <IoAlertCircle size={16} color="#000000" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        <Box
                          sx={{
                            width: "48%",
                            display: "flex",
                          }}
                        >
                          <FormGroup>
                            <FormControlLabel
                              label="Store Mediation Service"
                              control={
                                <Checkbox
                                  size="small"
                                  name={"specialServices.storeMediationService"}
                                  onChange={formik.handleChange}
                                  checked={
                                    formik.values.specialServices
                                      .storeMediationService
                                  }
                                />
                              }
                              sx={{
                                ".MuiFormControlLabel-label": {
                                  fontSize: "14px",
                                  fontWeight: 600,
                                },
                                mr: 0,
                              }}
                            />
                          </FormGroup>
                          <Tooltip
                            title="$5 per mediation"
                            placement="right-start"
                          >
                            <IconButton>
                              <IoAlertCircle size={16} color="#000000" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        <Box
                          sx={{
                            width: "48%",
                            display: "flex",
                          }}
                        >
                          <FormGroup>
                            <FormControlLabel
                              label="Tax-free address"
                              control={
                                <Checkbox
                                  size="small"
                                  name={"specialServices.taxFreeAddress"}
                                  onChange={formik.handleChange}
                                  checked={
                                    formik.values.specialServices.taxFreeAddress
                                  }
                                />
                              }
                              sx={{
                                ".MuiFormControlLabel-label": {
                                  fontSize: "14px",
                                  fontWeight: 600,
                                },
                                mr: 0,
                              }}
                            />
                          </FormGroup>
                          <Tooltip
                            title="This state does not charge sales tax when you buy a product."
                            placement="right-start"
                          >
                            <IconButton>
                              <IoAlertCircle size={16} color="#000000" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        <Box
                          sx={{
                            width: "48%",
                            display: "flex",
                          }}
                        >
                          <FormGroup>
                            <FormControlLabel
                              label="Tax-exempt items"
                              control={
                                <Checkbox
                                  size="small"
                                  name={"specialServices.taxExemptItems"}
                                  onChange={formik.handleChange}
                                  checked={
                                    formik.values.specialServices.taxExemptItems
                                  }
                                />
                              }
                              sx={{
                                ".MuiFormControlLabel-label": {
                                  fontSize: "14px",
                                  fontWeight: 600,
                                },
                                mr: 0,
                              }}
                            />
                          </FormGroup>
                          <Tooltip
                            title="Many items like clothing, shoes,over-the-counter medicine, food and ingredients maybe exempt."
                            placement="right-start"
                          >
                            <IconButton>
                              <IoAlertCircle size={16} color="#000000" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </Box>

                    <Box>
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: 600,
                          paddingX: "3%",
                          paddingY: "1.5%",
                        }}
                      >
                        Specialized Services
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        border: "1px solid #E5E5E8",
                        marginX: "3%",
                        borderRadius: "4px",
                        padding: "3%",
                        paddingY: "1%",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "2%",
                        }}
                      >
                        <Box
                          sx={{
                            width: "48%",
                          }}
                        >
                          <FormGroup>
                            <FormControlLabel
                              label="Hazmat"
                              control={
                                <Checkbox
                                  size="small"
                                  name={"specializedServices.hazmat"}
                                  onChange={formik.handleChange}
                                  checked={
                                    formik.values.specializedServices.hazmat
                                  }
                                />
                              }
                              sx={{
                                ".MuiFormControlLabel-label": {
                                  fontSize: "14px",
                                  fontWeight: 600,
                                },
                              }}
                            />
                          </FormGroup>
                        </Box>
                        <Box
                          sx={{
                            width: "48%",
                          }}
                        >
                          <FormGroup>
                            <FormControlLabel
                              label="medical"
                              control={
                                <Checkbox
                                  size="small"
                                  name={"specializedServices.medical"}
                                  onChange={formik.handleChange}
                                  checked={
                                    formik.values.specializedServices.medical
                                  }
                                />
                              }
                              sx={{
                                ".MuiFormControlLabel-label": {
                                  fontSize: "14px",
                                  fontWeight: 600,
                                },
                              }}
                            />
                          </FormGroup>
                        </Box>
                        <Box
                          sx={{
                            width: "48%",
                          }}
                        >
                          <FormGroup>
                            <FormControlLabel
                              label="traveler"
                              control={
                                <Checkbox
                                  size="small"
                                  name={"specializedServices.traveller"}
                                  onChange={formik.handleChange}
                                  checked={
                                    formik.values.specializedServices.traveller
                                  }
                                />
                              }
                              sx={{
                                ".MuiFormControlLabel-label": {
                                  fontSize: "14px",
                                  fontWeight: 600,
                                },
                              }}
                            />
                          </FormGroup>
                        </Box>
                        <Box
                          sx={{
                            width: "48%",
                          }}
                        >
                          <FormGroup>
                            <FormControlLabel
                              label="Pick up"
                              control={
                                <Checkbox
                                  size="small"
                                  name={"specializedServices.pickup"}
                                  onChange={formik.handleChange}
                                  checked={
                                    formik.values.specializedServices.pickup
                                  }
                                />
                              }
                              sx={{
                                ".MuiFormControlLabel-label": {
                                  fontSize: "14px",
                                  fontWeight: 600,
                                },
                              }}
                            />
                          </FormGroup>
                        </Box>
                      </Box>
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: 600,
                          paddingX: "3%",
                          paddingY: "1.5%",
                        }}
                      >
                        Auxiliary Services
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        border: "1px solid #E5E5E8",
                        marginX: "3%",
                        borderRadius: "4px",
                        padding: "3%",
                        paddingY: "1%",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "2%",
                        }}
                      >
                        <Box
                          sx={{
                            width: "48%",
                            display: "flex",
                          }}
                        >
                          <FormGroup>
                            <FormControlLabel
                              label="Export Forwarder"
                              control={
                                <Checkbox
                                  size="small"
                                  name={"auxiliaryServices.exportForwarder"}
                                  onChange={formik.handleChange}
                                  checked={
                                    formik.values.auxiliaryServices
                                      .exportForwarder
                                  }
                                />
                              }
                              sx={{
                                ".MuiFormControlLabel-label": {
                                  fontSize: "14px",
                                  fontWeight: 600,
                                },
                                mr: 0,
                              }}
                            />
                          </FormGroup>
                          <Tooltip
                            title="Do you export /ship abroad?"
                            placement="right-start"
                          >
                            <IconButton>
                              <IoAlertCircle size={16} color="#000000" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        <Box
                          sx={{
                            width: "48%",
                            display: "flex",
                          }}
                        >
                          <FormGroup>
                            <FormControlLabel
                              label="Import Forwarding"
                              control={
                                <Checkbox
                                  size="small"
                                  name={"auxiliaryServices.importForwarding"}
                                  onChange={formik.handleChange}
                                  checked={
                                    formik.values.auxiliaryServices
                                      .importForwarding
                                  }
                                />
                              }
                              sx={{
                                ".MuiFormControlLabel-label": {
                                  fontSize: "14px",
                                  fontWeight: 600,
                                },
                                mr: 0,
                              }}
                            />
                          </FormGroup>
                          <Tooltip
                            title="Do you accept shipment from other route/forwarding partners?"
                            placement="right-start"
                          >
                            <IconButton>
                              <IoAlertCircle size={16} color="#000000" />
                            </IconButton>
                          </Tooltip>
                        </Box>

                        <Box sx={{ marginTop: "20px" }}>
                          {formik.values.auxiliaryServices.importForwarding && (
                            <Box>
                              <Typography
                                sx={{ fontSize: "14px", fontWeight: 600 }}
                              >
                                Import Forwarding Fee
                              </Typography>
                              <FormControl
                                sx={{
                                  m: 1,
                                  minHeight: "35px",
                                  width: "48vw",
                                  marginX: "0px",
                                }}
                                size="small"
                              >
                                <OutlinedInput
                                  type="number"
                                  name="auxiliaryServices.importForwardingPrice"
                                  placeholder="Import Forwarding Free"
                                  onChange={formik.handleChange}
                                  value={
                                    formik.values.auxiliaryServices
                                      .importForwardingPrice
                                  }
                                  sx={{
                                    marginX: "0px",
                                    ".MuiOutlinedInput-notchedOutline": {
                                      width: "48vw",
                                    },
                                  }}
                                  startAdornment={
                                    <InputAdornment position="start">
                                      $
                                    </InputAdornment>
                                  }
                                />
                              </FormControl>
                            </Box>
                          )}
                          {formik.values.auxiliaryServices.importForwarding && (
                            <Box>
                              <Typography
                                sx={{ fontSize: "14px", fontWeight: 600 }}
                              >
                                List-Mile (Door to Door) Delivery Fee
                              </Typography>
                              <FormControl
                                sx={{
                                  m: 1,
                                  minHeight: "35px",
                                  width: "48vw",
                                  marginX: "0px",
                                }}
                                size="small"
                              >
                                <OutlinedInput
                                  type="number"
                                  name="auxiliaryServices.lastMilePrice"
                                  placeholder="Last-Mile Delivery Price"
                                  onChange={formik.handleChange}
                                  value={
                                    formik.values.auxiliaryServices
                                      .lastMilePrice
                                  }
                                  sx={{
                                    marginX: "0px",
                                    ".MuiOutlinedInput-notchedOutline": {
                                      width: "48vw",
                                    },
                                  }}
                                  startAdornment={
                                    <InputAdornment position="start">
                                      $
                                    </InputAdornment>
                                  }
                                />
                              </FormControl>
                            </Box>
                          )}
                          {formik.values.auxiliaryServices.importForwarding && (
                            <Box>
                              <Typography
                                sx={{ fontSize: "14px", fontWeight: 600 }}
                              >
                                Pickup Service Fee
                              </Typography>
                              <FormControl
                                sx={{
                                  m: 1,
                                  minHeight: "35px",
                                  width: "48vw",
                                  marginX: "0px",
                                }}
                                size="small"
                              >
                                <OutlinedInput
                                  type="number"
                                  name="auxiliaryServices.pickupPrice"
                                  placeholder="Pickup Service Price"
                                  onChange={formik.handleChange}
                                  value={
                                    formik.values.auxiliaryServices.pickupPrice
                                  }
                                  sx={{
                                    marginX: "0px",
                                    ".MuiOutlinedInput-notchedOutline": {
                                      width: "48vw",
                                    },
                                  }}
                                  startAdornment={
                                    <InputAdornment position="start">
                                      $
                                    </InputAdornment>
                                  }
                                />
                              </FormControl>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </SimpleBar>
                </Grid>
              </>
            )}

            {/* ------- Add muse form start---------- */}
            {isMusePartner && showMuseForm && (
              <Grid
                item
                xs={12}
                sm={12}
                md={9}
                lg={9}
                sx={{
                  borderRight: "1px solid #E5E5E8",
                  borderTop: "1px solid #E5E5E8",
                }}
              >
                <Box sx={{ px: 3, py: 2 }}>
                  {isEditable && (
                    <Box sx={{ borderBottom: "1px solid #E5E5E8" }}>
                      <RoutePartnerHeader
                        pageTitle={"Edit A Muse"}
                        handleCancle={() => setIsEditable(false)}
                        currentRoute="Edit Muse"
                        buttonName="Save"
                        handleSave={addMuseFormik.handleSubmit}
                        loading={loading}
                      />
                    </Box>
                  )}
                  <Box>
                    <SimpleBar
                      forceVisible="y"
                      autoHide={true}
                      style={{
                        maxHeight: isEditable ? "68vh" : "75vh",
                        ".simplebar-scrollbar": {
                          background: "red",
                        },
                      }}
                      className="custom-scrollbar"
                    >
                      <Box>
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
                            value={addMuseFormik.values.logoUrl}
                            onChange={onUploadChange}
                            disabled={!isEditable}
                          />
                        </Box>
                        {addMuseFormik.touched.logoUrl &&
                          addMuseFormik.errors.logoUrl && (
                            <span className="small text-danger">
                              {addMuseFormik.errors.logoUrl}
                            </span>
                          )}
                      </Box>
                      <Box>
                        <Box
                          sx={{
                            marginTop: "20px",
                          }}
                        >
                          <Box>
                            <Typography>
                              What type of partner are you adding ?
                            </Typography>
                          </Box>
                          <Box>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  id="isCrowdShipper"
                                  name="isCrowdShipper"
                                  checked={addMuseFormik.values.isCrowdShipper}
                                  onChange={addMuseFormik.handleChange}
                                  disabled={!isEditable}
                                />
                              }
                              label="CrowdShipper"
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  onChange={addMuseFormik.handleChange}
                                  checked={addMuseFormik.values.isTraveller}
                                  name="isTraveller"
                                  id="isTraveller"
                                  disabled={!isEditable}
                                />
                              }
                              label="Traveler"
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  onChange={addMuseFormik.handleChange}
                                  disabled
                                  name="isStoreAgent"
                                  type="checkbox"
                                  id="isStoreAgent"
                                />
                              }
                              label="Store Agent"
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  onChange={addMuseFormik.handleChange}
                                  // checked={}
                                  disabled
                                  name="isNonProfit"
                                  type="checkbox"
                                  id="isNonProfit"
                                />
                              }
                              label="Non-Profit"
                            />
                          </Box>
                        </Box>
                      </Box>
                      <Box sx={{ marginTop: "20px" }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box sx={{ marginRight: "40px" }}>
                            <Typography
                              sx={{
                                fontWeight: 600,
                                fontSize: "14px",
                                color: "#1C2630",
                              }}
                            >
                              Muse Name
                            </Typography>
                            <FormControl
                              sx={{
                                m: 1,
                                minHeight: "35px",
                                width: "330px",
                                marginX: "0px",
                              }}
                              size="small"
                            >
                              <OutlinedInput
                                placeholder="Muse Name"
                                name="name"
                                value={addMuseFormik.values.name}
                                onChange={addMuseFormik.handleChange}
                                sx={{
                                  marginX: "0px",
                                  ".MuiOutlinedInput-notchedOutline": {
                                    width: "330px",
                                  },
                                }}
                                disabled={!isEditable}
                              />
                              {addMuseFormik.touched.name &&
                                addMuseFormik.errors.name && (
                                  <span className="small text-danger">
                                    {addMuseFormik.errors.name}
                                  </span>
                                )}
                            </FormControl>
                          </Box>
                          <Box>
                            <Typography
                              sx={{
                                fontWeight: 600,
                                fontSize: "14px",
                                color: "#1C2630",
                              }}
                            >
                              Contact Person Name
                            </Typography>
                            <FormControl
                              sx={{
                                m: 1,
                                minHeight: "35px",
                                width: "330px",
                                marginX: "0px",
                              }}
                              size="small"
                            >
                              <OutlinedInput
                                name="contactPersonName"
                                placeholder="Contact Person Name"
                                value={addMuseFormik.values.contactPersonName}
                                onChange={addMuseFormik.handleChange}
                                sx={{
                                  marginX: "0px",
                                  ".MuiOutlinedInput-notchedOutline": {
                                    width: "330px",
                                  },
                                }}
                                disabled={!isEditable}
                              />
                              {addMuseFormik.touched.contactPersonName &&
                                addMuseFormik.errors.contactPersonName && (
                                  <span className="small text-danger">
                                    {addMuseFormik.errors.contactPersonName}
                                  </span>
                                )}
                            </FormControl>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: "10px",
                          }}
                        >
                          <Box sx={{ marginRight: "40px" }}>
                            <Typography
                              sx={{
                                fontWeight: 600,
                                fontSize: "14px",
                                color: "#1C2630",
                              }}
                            >
                              Email Id
                            </Typography>
                            <FormControl
                              sx={{
                                m: 1,
                                minHeight: "35px",
                                width: "330px",
                                marginX: "0px",
                              }}
                              size="small"
                            >
                              <OutlinedInput
                                placeholder="Email Id"
                                name="emailId"
                                value={addMuseFormik.values.emailId}
                                onChange={addMuseFormik.handleChange}
                                sx={{
                                  marginX: "0px",
                                  ".MuiOutlinedInput-notchedOutline": {
                                    width: "330px",
                                  },
                                }}
                                disabled={!isEditable}
                              />
                            </FormControl>
                            {addMuseFormik.touched.emailId &&
                              addMuseFormik.errors.emailId && (
                                <span className="small text-danger">
                                  {addMuseFormik.errors.emailId}
                                </span>
                              )}
                          </Box>
                          <Box>
                            <Typography
                              sx={{
                                fontWeight: 600,
                                fontSize: "14px",
                                color: "#1C2630",
                              }}
                            >
                              Contact Number
                            </Typography>
                            <FormControl
                              sx={{
                                m: 1,
                                minHeight: "35px",
                                width: "330px",
                                marginX: "0px",
                              }}
                              size="small"
                            >
                              <OutlinedInput
                                name="contactNumber"
                                placeholder="Contact Number"
                                value={addMuseFormik.values.contactNumber}
                                onChange={addMuseFormik.handleChange}
                                sx={{
                                  marginX: "0px",
                                  ".MuiOutlinedInput-notchedOutline": {
                                    width: "330px",
                                  },
                                }}
                                disabled={!isEditable}
                              />
                            </FormControl>
                            {addMuseFormik.touched.contactNumber &&
                              addMuseFormik.errors.contactNumber && (
                                <span className="small text-danger">
                                  {addMuseFormik.errors.contactNumber}
                                </span>
                              )}
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: "10px",
                          }}
                        >
                          <Box>
                            <Typography
                              sx={{
                                fontWeight: 600,
                                fontSize: "14px",
                                color: "#1C2630",
                              }}
                            >
                              Address Line 1
                            </Typography>
                            <FormControl
                              sx={{
                                m: 1,
                                minHeight: "35px",
                                width: "700px",
                                marginX: "0px",
                              }}
                              size="small"
                            >
                              <OutlinedInput
                                placeholder="Address Line 1"
                                name="addressLine1"
                                value={addMuseFormik.values.addressLine1}
                                onChange={addMuseFormik.handleChange}
                                sx={{
                                  marginX: "0px",
                                  ".MuiOutlinedInput-notchedOutline": {
                                    width: "700px",
                                  },
                                }}
                                disabled={!isEditable}
                              />
                            </FormControl>
                            {addMuseFormik.touched.addressLine1 &&
                              addMuseFormik.errors.addressLine1 && (
                                <span className="small text-danger">
                                  {addMuseFormik.errors.addressLine1}
                                </span>
                              )}
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: "10px",
                          }}
                        >
                          <Box>
                            <Typography
                              sx={{
                                fontWeight: 600,
                                fontSize: "14px",
                                color: "#1C2630",
                              }}
                            >
                              Address Line 2
                            </Typography>
                            <FormControl
                              sx={{
                                m: 1,
                                minHeight: "35px",
                                width: "700px",
                                marginX: "0px",
                              }}
                              size="small"
                            >
                              <OutlinedInput
                                placeholder="Address Line 2"
                                name="addressLine2"
                                value={addMuseFormik.values.addressLine2}
                                onChange={addMuseFormik.handleChange}
                                sx={{
                                  marginX: "0px",
                                  ".MuiOutlinedInput-notchedOutline": {
                                    width: "700px",
                                  },
                                }}
                                disabled={!isEditable}
                              />
                            </FormControl>
                            {addMuseFormik.touched.addressLine2 &&
                              addMuseFormik.errors.addressLine2 && (
                                <span className="small text-danger">
                                  {addMuseFormik.errors.addressLine2}
                                </span>
                              )}
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: "10px",
                          }}
                        >
                          <Box sx={{ marginRight: "40px" }}>
                            <Typography
                              sx={{
                                fontWeight: 600,
                                fontSize: "14px",
                                color: "#1C2630",
                              }}
                            >
                              City
                            </Typography>
                            <FormControl
                              sx={{
                                m: 1,
                                minHeight: "35px",
                                width: "330px",
                                marginX: "0px",
                              }}
                              size="small"
                            >
                              <OutlinedInput
                                name="city"
                                placeholder="City"
                                value={addMuseFormik.values.city}
                                onChange={addMuseFormik.handleChange}
                                sx={{
                                  marginX: "0px",
                                  ".MuiOutlinedInput-notchedOutline": {
                                    width: "330px",
                                  },
                                }}
                                disabled={!isEditable}
                              />
                            </FormControl>
                            {addMuseFormik.touched.city &&
                              addMuseFormik.errors.city && (
                                <span className="small text-danger">
                                  {addMuseFormik.errors.city}
                                </span>
                              )}
                          </Box>
                          <Box>
                            <Typography
                              sx={{
                                fontWeight: 600,
                                fontSize: "14px",
                                color: "#1C2630",
                              }}
                            >
                              State
                            </Typography>
                            <FormControl
                              sx={{
                                m: 1,
                                minHeight: "35px",
                                width: "330px",
                                marginX: "0px",
                              }}
                              size="small"
                            >
                              <OutlinedInput
                                name="state"
                                placeholder="State"
                                value={addMuseFormik.values.state}
                                onChange={addMuseFormik.handleChange}
                                sx={{
                                  marginX: "0px",
                                  ".MuiOutlinedInput-notchedOutline": {
                                    width: "330px",
                                  },
                                }}
                                disabled={!isEditable}
                              />
                            </FormControl>
                            {addMuseFormik.touched.state &&
                              addMuseFormik.errors.state && (
                                <span className="small text-danger">
                                  {addMuseFormik.errors.state}
                                </span>
                              )}
                          </Box>
                        </Box>
                        <Box>
                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontSize: "14px",
                              color: "#1C2630",
                            }}
                          >
                            Country
                          </Typography>
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
                              <select
                                removeItemButton
                                name="country"
                                onChange={addMuseFormik.handleChange}
                                value={addMuseFormik.values.country}
                                defaultValue={addMuseFormik.values.country}
                                className="w-100"
                                disabled={!isEditable}
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
                                  e.target.style.borderColor =
                                    "rgba(95, 56, 249, 0.65)";
                                  e.target.style.boxShadow =
                                    "0 0 5px 0px rgba(95, 56, 249, 0.2)";
                                }}
                                onBlur={(e) => {
                                  e.target.style.borderColor = "#d2d4e4";
                                  e.target.style.boxShadow = "none";
                                }}
                              >
                                <option value={"0"}>Select Country</option>
                                {Countries.map((country, i) => (
                                  <option key={i} value={country.name}>
                                    {country.name}
                                  </option>
                                ))}
                              </select>
                            </FormControl>
                            {addMuseFormik.touched.country &&
                              addMuseFormik.errors.country && (
                                <span className="small text-danger">
                                  {addMuseFormik.errors.country}
                                </span>
                              )}
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: "10px",
                          }}
                        >
                          <Box sx={{ marginRight: "40px" }}>
                            <Typography
                              sx={{
                                fontWeight: 600,
                                fontSize: "14px",
                                color: "#1C2630",
                              }}
                            >
                              About
                            </Typography>
                            <FormControl
                              sx={{
                                m: 1,
                                minHeight: "35px",
                                width: "330px",
                                marginX: "0px",
                              }}
                              size="small"
                            >
                              <TextareaAutosize
                                name="about"
                                placeholder="About"
                                value={addMuseFormik.values.about}
                                onChange={addMuseFormik.handleChange}
                                aria-label="textarea"
                                minRows={4}
                                disabled={!isEditable}
                                style={{
                                  width: "700px",
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
                            {addMuseFormik.touched.about &&
                              addMuseFormik.errors.about && (
                                <span className="small text-danger">
                                  {addMuseFormik.errors.about}
                                </span>
                              )}
                          </Box>
                        </Box>
                      </Box>
                    </SimpleBar>
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      )}

      {(routePartnerMainAddress?.length <= 0 || mushPartner?.length <= 0) && (
        <Box sx={{ paddingTop: "10%" }}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <img src={LocationNotFound} alt="issue_not_found" />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: "16px" }}>
              No records found
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography>Add main address to this Route Partner</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#5E17EB",
                color: "#fff",
                width: "160px",
                border: "1px solid #E5E5E8",
                borderRadius: "4px",
                boxShadow: "none",
                whiteSpace: "nowrap",
                marginTop: "1%",
                "&:hover": {
                  outline: "none",
                  color: "#fff",
                  backgroundColor: "#5E17EB", // Remove border color on focus
                },
              }}
              onClick={handleNewAddress}
            >
              Add New Address
            </Button>
          </Box>
        </Box>
      )}

      <EditMainAdressDrawer
        open={mainAddressDrawerState.showDrawer}
        onClose={closeMainAddressDrawer}
        addressId={mainAddressDrawerState.addressId}
      />
      <EditAlternativeAdressDrawer
        open={alternativeAddressDrawerState.showDrawer}
        onClose={AlternativeAddressDrawer}
        data={alternativeAddressDrawerState}
      />
    </>
  );
}
