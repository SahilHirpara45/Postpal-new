import logo from "../../assets/svg/postpal_logo.svg";
import * as Yup from "yup";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import {
  browserSessionPersistence,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { toast } from "react-toastify";
import { setUser } from "../../store/authSlice";

const validationSchema = Yup.object().shape({
  email: Yup.string().required("Email is required."),
  password: Yup.string().required("Password is required!"),
});

const initialValue = {
  email: "",
  password: "",
};

export default function Login() {
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
      setLoading(true);
      setPersistence(auth, browserSessionPersistence)
        .then(() => {
          return signInWithEmailAndPassword(
            auth,
            values.email,
            values.password
          );
        })
        .then(async (userCredential) => {
          const user = userCredential.user;
          console.log("User logged in:", user);

          const querySnapshot = await getDocs(collection(db, "admins"));
          let arr = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          // console.log(arr, "data of admins after login");

          const userWithRole = arr.find((admin) => admin.email === user.email);
          // console.log(userWithRole, "userWithRole");
          if (userWithRole) {
            if (userWithRole?.role === "Route Partner Admin") {
              try {
                const querySnapshot = collection(db, "routePartners");
                const q = query(
                  querySnapshot,
                  where("isDeleted", "==", false),
                  where("isRoutePartner", "==", true),
                  where("emailId", "==", user?.email)
                );
                onSnapshot(q, (snapshot) => {
                  let arr1 = [];
                  snapshot.forEach((doc) => {
                    arr1.push({ ...doc.data(), id: doc.id });
                  });
                  // console.log(arr1, "obj for routepartner role");
                  // setRoutePartnerDataForRole(arr);
                  dispatch(
                    setUser({
                      ...user,
                      ...userWithRole,
                      routePartnerId: arr1[0]?.id,
                    })
                  );
                });
              } catch (error) {
                console.log(error, "error");
              }
            } else {
              dispatch(
                setUser({ ...user, ...userWithRole, routePartnerId: "" })
              );
            }
            localStorage.setItem("token", user.accessToken);
            navigate("/shipment/packages");
            setLoading(false);
          } else {
            toast.error("Admin User not found.");
            setLoading(false);
          }
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          if (error.code === "auth/wrong-password") {
            // Display a toast message for "Wrong Password" error
            toast.error("Wrong Password. Please try again.");
          } else if (error.code === "auth/invalid-email") {
            toast.error("Invalid Email. Please try again.");
          } else if (error.code === "auth/missing-password") {
            toast.error("Missing Password. Please try again.");
          } else if (error.code === "auth/user-not-found") {
            toast.error("User not found. Please try again.");
          } else {
            // Handle other authentication errors here
            console.error("Authentication Error:", error);
          }
          setLoading(false);
        });
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#ffffff",
        width: "100vw",
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          border: "1px solid #E5E5E8",
          borderRadius: "12px",
          width: "30vw",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#FBFBFB",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "1px solid #E5E5E8",
            borderTop: "1px solid #E5E5E8",
            borderRadius: "12px",
            paddingY: "3%",
          }}
        >
          <img src={logo} alt="Postpal_logo" width={"32px"} height={"32px"} />
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "18px",
              color: "#481AA3",
              marginLeft: "2%",
            }}
          >
            POSTPAL
          </Typography>
        </Box>
        <Box sx={{ paddingX: "10%", width: "100%", marginY: "10%" }}>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: "24px" }}>
              Login to Account
            </Typography>
            <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
              Please sign-in to your account and start the adventure.
            </Typography>
          </Box>
          <Box sx={{ marginTop: "5%" }}>
            <Stack direction={"row"} sx={{ marginTop: "10px" }}>
              <Box sx={{ marginBottom: "2%", display: "flex" }}>
                <Typography sx={{ fontSize: "14px", fontWeight: "600" }}>
                  Email
                </Typography>
                <Typography
                  sx={{
                    fontSize: "17px",
                    fontWeight: "600",
                    color: "red",
                    marginLeft: "1%",
                  }}
                >
                  *
                </Typography>
              </Box>
            </Stack>
            <Box sx={{ marginBottom: "5%" }}>
              <Stack>
                <OutlinedInput
                  type="text"
                  id="email"
                  placeholder="Enter email"
                  required
                  name="email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  sx={{ flex: 1, fontSize: "13px" }}
                />
              </Stack>
              {formik.touched.email && formik.errors.email && (
                <span className="small text-danger">{formik.errors.email}</span>
              )}
            </Box>
            <Stack direction={"row"} sx={{ marginTop: "10px" }}>
              <Box sx={{ marginBottom: "2%", display: "flex" }}>
                <Typography sx={{ fontSize: "14px", fontWeight: "600" }}>
                  Password
                </Typography>
                <Typography
                  sx={{
                    fontSize: "17px",
                    fontWeight: "600",
                    color: "red",
                    marginLeft: "1%",
                  }}
                >
                  *
                </Typography>
              </Box>
            </Stack>
            <Box>
              <Stack>
                <OutlinedInput
                  type="password"
                  id="password"
                  placeholder="Enter password"
                  required
                  name="password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  sx={{ flex: 1, fontSize: "13px" }}
                />
              </Stack>
              {formik.touched.password && formik.errors.password && (
                <span className="small text-danger">
                  {formik.errors.password}
                </span>
              )}
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "3%",
              }}
            >
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox size="small" name="Rememberme" />}
                  label="Remember me"
                  sx={{ ".MuiFormControlLabel-label": { fontSize: "13px" } }}
                />
              </FormGroup>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "#481AA3",
                  cursor: "pointer",
                }}
              >
                Forgot Password
              </Typography>
            </Box>
            <Box sx={{ marginBottom: "5%", marginTop: "5%" }}>
              <Stack>
                <Button
                  variant="contained"
                  type="submit"
                  onClick={formik.handleSubmit}
                  disabled={loading}
                  sx={{
                    flex: 1,
                    backgroundColor: "#481AA3",
                    color: "#fff",
                    border: "1px solid #5E17EB",
                    boxShadow: "none",
                    marginBottom: "10px",
                    width: "100%",
                    borderRadius: "4px",
                    whiteSpace: "nowrap",
                    "&:hover": {
                      outline: "none",
                      color: "#fff",
                      backgroundColor: "#481AA3",
                    },
                  }}
                >
                  Login to account
                </Button>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
