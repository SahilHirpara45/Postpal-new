import {
  Avatar,
  Box,
  Button,
  Drawer,
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import close from "../../../assets/svg/drawer_close.svg";
import customer from "../../../assets/svg/customer.svg";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { useFormik } from "formik";
import { toast } from "react-toastify";

const initialValue = {
  issueType: "",
  orderNumber: "",
  describeIssue: "",
  customerName: "",
  profileImage: "",
};

export default function ReportDetailsDrawer({
  open,
  onClose,
  userId,
  routePartnerName,
}) {
  const [customerData, setCustomerData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState(initialValue);
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  const getForId = async () => {
    if (userId) {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCustomerData(docSnap.data());
        addReportFormik.setFieldValue("customerName", docSnap.data().name);
        addReportFormik.setFieldValue(
          "profileImage",
          docSnap.data().profileImage
        );
      } else {
        console.log("No such document!");
      }
    }
  };

  useEffect(() => {
    getForId();
  }, [open, userId]);


  const addReportFormik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,

    onSubmit: async (values, { resetForm }) => {
      console.log(values, "values in AddNewDeal");
      setLoading(true);
      try {
        const docRef = await addDoc(collection(db, "userIssues"), {
          ...values,
          createdAt: serverTimestamp(),
          routePartnerName: routePartnerName,
          userId: userId,
        }).then(async (res) => {
          // console.log(doc, "res in AddNewDeal");
          toast.success("Issue added Successfully");
          setLoading(false);
          onClose(); 
          resetForm();
        });
      } catch (error) {
        console.log(error, "error");
      }
    },
  });

  return (
    <Drawer
      variant="temporary"
      anchor="right"
      open={open}
      onClose={onClose}
      BackdropProps={{ sx: { background: "rgba(0, 0, 0, 0.1)" } }}
    >
      <Box sx={{ width: "600px" }}>
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
            Report Details
          </Typography>
          <Box
            sx={{ paddingRight: "20px", cursor: "pointer" }}
            onClick={onClose}
          >
            <img src={close} alt="close" />
          </Box>
        </Box>
        <Box sx={{ marginX: "20px" }}>
          <Stack direction={"row"} sx={{ marginTop: "20px" }}>
            <Box>
              <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                Customer Name
              </Typography>
            </Box>
          </Stack>
          <Stack sx={{ marginTop: "10px" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                src={addReportFormik?.values?.profileImage}
                alt="customer"
                width="28px"
                height="28px" 
              />
              <Typography sx={{ fontSize: "13px", marginLeft: "10px" }}>
                {addReportFormik?.values?.customerName}
              </Typography>
            </Box>
          </Stack>
          <Stack direction={"row"} sx={{ marginTop: "20px" }}>
            <Box>
              <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                Package Number
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
                id="orderNumber"
                onChange={addReportFormik.handleChange}
                name="orderNumber"
                value={addReportFormik?.values?.orderNumber}
                placeholder="Package number"
              />
            </FormControl>
          </Stack>
          <Stack sx={{ marginTop: "20px" }}>
            <Box sx={{ marginBottom: "10px" }}>
              <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                Issue Type
              </Typography>
            </Box>
            <FormControl fullWidth>
              <Select
                labelId="demo-simple-select-label"
                sx={{
                  ".MuiSelect-select": {
                    paddingY: "10px",
                  },
                }}
                name="issueType"
                id="issueType"
                onChange={addReportFormik.handleChange}
                value={addReportFormik.values.issueType}
              >
                <MenuItem value="Apparent fraud">Apparent fraud</MenuItem>
                <MenuItem value="Suspected Fraud">Suspected Fraud</MenuItem>
                <MenuItem value="Missing user information">
                  Missing user information
                </MenuItem>
                <MenuItem value="Trust report Clarification">
                  Trust report Clarification
                </MenuItem>
                <MenuItem value="Review and Rating Dispute">
                  Review and Rating Dispute
                </MenuItem>
                <MenuItem value="Payment Issues">Payment Issues</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Stack sx={{ marginTop: "20px" }}>
            <Box sx={{ marginBottom: "10px" }}>
              <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
                Describe Your Issue
              </Typography>
            </Box>
            <FormControl
              sx={{
                minHeight: "30px",
                marginLeft: "0px",
                // width: matches ? "100%" : "50%",
              }}
              size="small"
            >
              <OutlinedInput
                multiline
                rows={5}
                type="text"
                placeholder="Describe your issue"
                onChange={addReportFormik.handleChange}
                name="describeIssue"
                value={addReportFormik?.values?.describeIssue}
              />
            </FormControl>
          </Stack>
          {/* </Stack> */}
        </Box>
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
                backgroundColor: "#481AA3", // Remove border color on focus
              },
            }}
            disabled={loading}
            onClick={addReportFormik.handleSubmit}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
