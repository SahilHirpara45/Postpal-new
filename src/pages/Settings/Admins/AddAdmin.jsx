import {
  Box,
  Button,
  Drawer,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputBase,
  OutlinedInput,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import close from "../../../assets/svg/drawer_close.svg";
import { useFormik } from "formik";
import {
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  setPersistence,
  updateEmail,
  updatePassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useSelector } from "react-redux";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { toast } from "react-toastify";

const initialValue = {
  name: "",
  email: "",
  password: "",
  phoneNumber: "",
  role: "",
};

export default function AddAdmin({ open, onClose, selectedAdminData }) {
  const [initialValues, setInitialValues] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth.value);
  const auth = getAuth();

  // console.log(selectedAdminData, "selectedAdminData");

  useEffect(() => {
    const getForId = async () => {
      if (selectedAdminData?.id) {
        const docRef = doc(db, "admins", selectedAdminData?.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setInitialValues({ ...docSnap.data() });
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
        }
      } else {
        setInitialValues(initialValue);
      }
    };
    getForId();
  }, [selectedAdminData]);

  const addAdminForm = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    // validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);

      if (selectedAdminData?.id) {
        try {
          // Update admin data in Firestore
          await updateDoc(doc(db, "admins", selectedAdminData?.id), {
            ...values,
          });

          // Update email and password in Firebase Authentication
          const userRef = await signInWithEmailAndPassword(
            auth,
            selectedAdminData.email,
            selectedAdminData.password
          );
          if (userRef) {
            if (values.email !== selectedAdminData.email) {
              await updateEmail(userRef.user, values.email);
            }
            if (values.password) {
              await updatePassword(userRef.user, values.password);
            }
          }

          toast.success("Admin Updated Successfully!");
          resetForm();
          onClose();
        } catch (error) {
          if (error.code === "auth/weak-password") {
            toast.error(
              "Password is too weak. Please use a stronger password."
            );
          } else if (error.code === "auth/email-already-in-use") {
            toast.error(
              "Email is already in use. Please use a different email."
            );
          } else if (error.code === "auth/invalid-email") {
            toast.error("Invalid email format. Please enter a valid email.");
          } else {
            toast.error("Error adding new admin: " + error.message);
          }

          console.error("Error updating admin:", error);
        } finally {
          setLoading(false);
        }
      } else {
        try {
          const docRef = await addDoc(collection(db, "admins"), {
            ...values,
            isDeleted: false,
          })
          await createUserWithEmailAndPassword(
            auth,
            values.email,
            values.password
          ).then(async (userCredential) => {
            localStorage.setItem("token", userCredential.user.accessToken);
          });
          toast.success("New Admin Added Successfully!");
          resetForm();
          onClose();
        } catch (error) {
          if (error.code === "auth/weak-password") {
            toast.error(
              "Password is too weak. Please use a stronger password."
            );
          } else if (error.code === "auth/email-already-in-use") {
            toast.error(
              "Email is already in use. Please use a different email."
            );
          } else if (error.code === "auth/invalid-email") {
            toast.error("Invalid email format. Please enter a valid email.");
          } else {
            toast.error("Error adding new admin: " + error.message);
          }

          console.log("Error adding new admin:", error);
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
            {selectedAdminData?.id ? "Edit New Admin" : "Add New Admin"}
          </Typography>
          <img
            src={close}
            alt="close icon"
            style={{ cursor: "pointer" }}
            onClick={onClose}
          />
        </Box>
      </Box>
      <Box sx={{ paddingX: "20px" }}>
        <Stack>
          <Box sx={{ marginBottom: "10px" }}>
            <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
              Full Name
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
              id="name"
              placeholder="Full Name"
              name="name"
              value={addAdminForm?.values?.name}
              onChange={addAdminForm.handleChange}
            />
          </FormControl>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{ marginTop: 2 }}
        >
          <FormControl>
            <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
              Role
            </Typography>
            <RadioGroup
              row
              name="role"
              value={addAdminForm.values.role}
              onChange={addAdminForm.handleChange}
              sx={{ my: 1 }}
            >
              <FormControlLabel
                value="Super Admin"
                control={<Radio />}
                label="Super Admin"
              />
              <FormControlLabel
                value="Admin"
                control={<Radio />}
                label="Admin"
              />
              <FormControlLabel value="User" control={<Radio />} label="User" />
            </RadioGroup>
          </FormControl>
        </Stack>
        <Stack sx={{ marginTop: 2 }}>
          <Box sx={{ marginBottom: "10px" }}>
            <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
              Email
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
              id="email"
              placeholder="Email ID"
              name="email"
              value={addAdminForm.values.email}
              onChange={addAdminForm.handleChange}
            />
          </FormControl>
        </Stack>
        <Stack sx={{ marginTop: 2 }}>
          <Box sx={{ marginBottom: "10px" }}>
            <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
              Phone Number
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
              id="phoneNumber"
              placeholder="Phone Number"
              name="phoneNumber"
              value={addAdminForm.values.phoneNumber}
              onChange={addAdminForm.handleChange}
            />
          </FormControl>
        </Stack>
        <Stack sx={{ marginTop: 2 }}>
          <Box>
            <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
              Password
            </Typography>
            <Paper
              component="form"
              fullWidth
              sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                border: "1px solid #E5E5E8",
                // width: 350,
                height: 40,
                marginTop: "10px",
              }}
            >
              <InputBase
                fullWidth
                sx={{ ml: 1, flex: 1 }}
                placeholder="Password"
                inputProps={{ "aria-label": "search" }}
                size="small"
                name="password"
                value={addAdminForm.values.password}
                onChange={addAdminForm.handleChange}
              />
              <IconButton
                color="primary"
                sx={{ p: "10px" }}
                aria-label="directions"
              >
                <Typography variant="body1" fontWeight="bold">
                  Generate
                </Typography>
              </IconButton>
            </Paper>
          </Box>
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
            onClick={addAdminForm.handleSubmit}
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
            {selectedAdminData?.id ? "Edit New Admin" : "Add New Admin"}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
