import {
  Box,
  Button,
  Checkbox,
  Drawer,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import close from "../../assets/svg/drawer_close.svg";
import ReactQuill from "react-quill";
// import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const modules = {
  toolbar: [
    [{ font: [] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }, { align: [] }],
    ["link", "image", "video"],
    ["clean"],
  ],
};

const formats = [
  "font",
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "script",
  "blockquote",
  "code-block",
  "list",
  "bullet",
  "indent",
  "direction",
  "align",
  "link",
  "image",
  "video",
];

const initialValue = {
  isOffer: false,
  isFeatureDeal: false,
  dealType: "",
  product: "",
  subject: "",
  coupon: "",
  summery: "",
  dealDescription: "",
  startingDate: null,
  endDate: null,
};

export default function AddDeal({
  open,
  onClose,
  selectedBrandData,
  selectedDealData,
}) {
  const [initialValues, setInitialValues] = useState(initialValue);
  const [dealTypes, setDealTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quillValue, setQuillValue] = useState("");
  const navigate = useNavigate();

  // console.log(selectedBrandData, "selectedBrandData");
  // console.log(selectedDealData, "selectedDealData");

  useEffect(() => {
    const getForId = async () => {
      if (selectedDealData?.id) {
        const docRef = doc(db, "deals", selectedDealData?.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setInitialValues({
            ...docSnap.data(),
            startingDate: data.startingDate
              ? dayjs(data.startingDate.toDate())
              : null,
            endDate: data.endDate ? dayjs(data.endDate.toDate()) : null,
          });
          setQuillValue(docSnap.data().dealDescription);
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
        }
      } else {
        setInitialValues(initialValue);
        setQuillValue("");
      }
    };
    getForId();
  }, [selectedDealData]);

  useEffect(() => {
    const getDealType = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "dealType"));
        let arr = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setDealTypes(arr);
        // console.log(arr, "arr in AddNewDeal");
      } catch (error) {
        console.log(error, "error");
      }
    };
    getDealType();
    return () => {
      addNewDealFormik.resetForm();
    };
  }, []);

  const addNewDealFormik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,

    onSubmit: async (values, { resetForm }) => {
      console.log(values, "values in AddNewDeal");
      if (selectedDealData?.id) {
        setLoading(true);
        try {
          // logic for updateDoc
          updateDoc(doc(db, "deals", selectedDealData?.id), {
            ...values,
            startingDate: values.startingDate
              ? values.startingDate.toDate()
              : null,
            endDate: values.endDate ? values.endDate.toDate() : null,
          }).then((res) => {
            toast.success("Deals Updated Successfully!");
            resetForm();
            setQuillValue("");
            // setInitialValues(initialValue);
            onClose();
            setLoading(false);
          });
        } catch (error) {
          console.log(error, "error");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(true);
        const dealTypeImage = dealTypes.find((d) => {
          return d.name === values.dealType;
        });

        try {
          const docRef = await addDoc(collection(db, "deals"), {
            ...values,
            dealDescription: quillValue,
            startingDate: values.startingDate
              ? values.startingDate.toDate()
              : null,
            endDate: values.endDate ? values.endDate.toDate() : null,
            updatedAt: serverTimestamp(),
            createdAt: serverTimestamp(),
            reviewDate: new Date(),
            dealTypeImage: dealTypeImage.image,
            isDeleted: false,
            brandId: selectedBrandData?.id,
            brandName: selectedBrandData?.brandName,
            brandLogo: selectedBrandData?.brandLogo,
          }).then(async (res) => {
            toast.success("New Deal added Successfully");
            setLoading(false);
            resetForm();
            setQuillValue("");
            onClose();
            await updateDoc(doc(db, "deals", res.id), {
              id: res.id,
            }).then((res) => {
              // console.log(res, " res in Update allDeal");
            });
            await updateDoc(doc(db, "brands", selectedBrandData?.id), {
              dealId: arrayUnion(res.id),
            }).then((res) => {
              // console.log(res, " res in Update countries");
            });
          });
        } catch (error) {
          console.log(error, "error");
        } finally {
          setLoading(false);
        }
      }
    },
  });

  return (
    <Drawer
      variant="temporary"
      anchor="right"
      open={open}
      onClose={onClose}
      BackdropProps={{ sx: { background: "rgba(0, 0, 0, 0.5)" } }}
      sx={{ width: "600px" }}
    >
      <Box sx={{ width: "600px", padding: "20px" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #E5E5E8",
            paddingBottom: "10px",
          }}
        >
          <Typography sx={{ fontWeight: 700, fontSize: "24px" }}>
            {selectedDealData?.id ? "Edit Deal" : "Add New Deal"}
          </Typography>
          <img
            src={close}
            alt="close icon"
            style={{ cursor: "pointer" }}
            onClick={onClose}
          />
        </Box>
        <Box sx={{ marginTop: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                name="isOffer"
                onChange={addNewDealFormik.handleChange}
                checked={addNewDealFormik.values.isOffer}
              />
            }
            label="Is this offer ?"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                name="isFeatureDeal"
                onChange={addNewDealFormik.handleChange}
                checked={addNewDealFormik.values.isFeatureDeal}
              />
            }
            label="Is this Feature Deal ?"
          />
        </Box>
        <Stack direction={"row"} sx={{ marginTop: "20px" }} gap={3}>
          <Stack>
            <Box sx={{ marginBottom: "15px" }}>
              <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                Deal Type
              </Typography>
            </Box>
            <FormControl sx={{ minWidth: 120 }}>
              <select
                removeItemButton
                name="dealType"
                onChange={addNewDealFormik.handleChange}
                value={addNewDealFormik.values.dealType}
                defaultValue={addNewDealFormik.values.dealType}
                className="w-100"
                style={{
                  height: "44px",
                  border: "1px solid #d2d4e4",
                  borderRadius: "0.45rem",
                  padding: "0.5625rem 0.9rem",
                  fontSize: "0.875rem",
                  color: "#43476b",
                  outline: "0",
                  width: "270px",
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
                <option value={"0"}>Select Deal Type</option>
                {dealTypes.map((dealType, i) => (
                  <option key={i} value={dealType.name}>
                    {dealType.name}
                  </option>
                ))}
              </select>
            </FormControl>
          </Stack>
          <Stack>
            <Box sx={{ marginBottom: "10px" }}>
              <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                Product
              </Typography>
            </Box>
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
                id="product"
                placeholder="Product"
                name="product"
                onChange={addNewDealFormik.handleChange}
                value={addNewDealFormik.values.product}
              />
            </FormControl>
          </Stack>
        </Stack>
        <Stack direction={"row"} sx={{ marginTop: "20px" }} gap={3}>
          <Stack>
            <Box sx={{ marginBottom: "15px" }}>
              <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                Subject
              </Typography>
            </Box>
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
                id="subject"
                placeholder="Subject"
                name="subject"
                onChange={addNewDealFormik.handleChange}
                value={addNewDealFormik.values.subject}
              />
            </FormControl>
          </Stack>
          <Stack>
            <Box sx={{ marginBottom: "10px" }}>
              <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                Coupan
              </Typography>
            </Box>
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
                id="coupon"
                placeholder="Coupon"
                name="coupon"
                onChange={addNewDealFormik.handleChange}
                value={addNewDealFormik.values.coupon}
              />
            </FormControl>
          </Stack>
        </Stack>
        <Stack direction={"row"} sx={{ marginTop: "20px" }} gap={3}>
          <Stack>
            <Box sx={{ marginBottom: "15px" }}>
              <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                Summary
              </Typography>
            </Box>
            <FormControl
              fullWidth
              sx={{
                m: 1,
                minWidth: 270,
                minHeight: "35px",
                marginLeft: "0px",
              }}
              size="small"
            >
              <OutlinedInput
                fullWidth
                id="summery"
                name="summery"
                placeholder="Summery"
                onChange={addNewDealFormik.handleChange}
                value={addNewDealFormik.values.summery}
              />
            </FormControl>
          </Stack>
        </Stack>
        <Stack>
          <Box sx={{ marginTop: "15px" }}>
            <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
              Deal Description
            </Typography>
          </Box>
        </Stack>
        <Box sx={{ marginTop: 2 }}>
          <ReactQuill
            theme="snow"
            modules={modules}
            formats={formats}
            value={quillValue}
            onChange={(value) => {
              addNewDealFormik.setFieldValue("dealDescription", value);
              setQuillValue(value);
            }}
            style={{ minHeight: "150px" }}
          />
        </Box>
        <Stack direction={"row"} sx={{ marginTop: "20px" }} gap={3}>
          <Stack>
            <Box sx={{ marginBottom: "10px" }}>
              <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                Starting Date
              </Typography>
            </Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={addNewDealFormik.values.startingDate}
                onChange={(newValue) =>
                  addNewDealFormik.setFieldValue("startingDate", newValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="startingDate"
                    // sx={{
                    //   border: "1px solid #e5e5e8",
                    //   borderRadius: "0.45rem",
                    //   "& .MuiOutlinedInput-root": {
                    //     "& fieldset": {
                    //       borderColor: "transparent",
                    //     },
                    //     "&:hover fieldset": {
                    //       borderColor: "transparent",
                    //     },
                    //     "&.Mui-focused fieldset": {
                    //       borderColor: "transparent",
                    //     },
                    //   },
                    // }}
                  />
                )}
              />
            </LocalizationProvider>
          </Stack>
          <Stack>
            <Box sx={{ marginBottom: "10px" }}>
              <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                Ending Date
              </Typography>
            </Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={addNewDealFormik.values.endDate}
                onChange={(newValue) =>
                  addNewDealFormik.setFieldValue("endDate", newValue)
                }
                renderInput={(params) => (
                  <TextField {...params} name="endDate" />
                )}
              />
            </LocalizationProvider>
          </Stack>
        </Stack>
        <Box
          sx={{
            position: "absolute",
            bottom: 10,
            right: 20,
          }}
        >
          <Button
            variant="contained"
            onClick={addNewDealFormik.handleSubmit}
            disabled={loading}
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
                backgroundColor: "#481AA3", // Remove border color on focus
              },
            }}
          >
            {selectedDealData?.id ? "Edit Deal" : "Add Deal"}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
