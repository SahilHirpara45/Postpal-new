import React, { useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { toast } from "react-toastify";
import { verificationHistory } from "./common/History/helper";
import { useSelector } from "react-redux";

function Verification({ packageActiveData, pageName, packageCollectionName }) {
  const user = useSelector((state) => state.auth.value);

  const formik = useFormik({
    initialValues: {
      verification: "",
    },
    validationSchema: Yup.object({
      verification: Yup.string().required("Please select an option"),
    }),
    onSubmit: (values) => {
      // alert(`You selected: ${values.verification}`);
      try {
        updateDoc(doc(db, "users", packageActiveData?.userId), {
          verificationStatus: values.verification,
        }).then(async () => {
          // setOrderActiveData((prev) => ({ ...prev, securityCheckFee: 4.99 }));
          toast.success("Verification Status Updated Successfully");
          // getUserData(packageActiveData?.userId);
          verificationHistory(
            values.verification,
            packageActiveData,
            user?.name,
            packageCollectionName
          );
          // const docRef = doc(db, "order", orderactive);
          // await updateDoc(docRef, {
          //   status: "SECURITY REVIEW",
          // }).then((res) => {
          //   // console.log(res, "res");
          // });
        });
      } catch (error) {
        console.log(error);
      }
    },
  });

  useEffect(() => {
    if (packageActiveData?.userId) {
      getUserData(packageActiveData?.userId);
    }
  }, []);

  const getUserData = async (uid) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        formik.setFieldValue(
          "verification",
          docSnap.data()?.verificationStatus
        );
        if (
          !docSnap.data()?.verificationlink &&
          docSnap.data()?.verificationStatus
        ) {
          // setOrderActiveData((prev) => ({ ...prev, securityCheckFee: 4.99 }));
        }
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  return (
    <Box sx={{ marginLeft: "10px" }}>
      <label style={{ fontSize: "15px" }}>
        This user is not verified, we use several data points to automatically
        request user verification, but you can initiate customer verification if
        you find a need to do so.
      </label>
      <Box>
        <Box sx={{ display: "grid", marginTop: "20px" }}>
          <label style={{ fontWeight: "bold", fontSize: "14px" }}>Select</label>
          <form onSubmit={formik.handleSubmit}>
            <Box>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-labelledby="verification-radio-group-label"
                  name="verification"
                  // disabled={
                  //   orderactiveData?.status === "SHIP READY" ||
                  //   orderactiveData?.status === "ENROUTE" ||
                  //   orderactiveData?.status === "CLOSED" ||
                  //   orderactiveData?.status === "CANCELED"
                  // }
                  onChange={formik.handleChange}
                  value={formik.values.verification}
                >
                  <FormControlLabel
                    value="Payment related"
                    control={<Radio />}
                    disabled={pageName === "shippingComplete"}
                    label="Payment related"
                  />
                  <FormControlLabel
                    value="Customer order from a high risk zone"
                    control={<Radio />}
                    disabled={pageName === "shippingComplete"}
                    label="Customer order from a high risk zone"
                  />
                  <FormControlLabel
                    value="Other known external source"
                    control={<Radio />}
                    disabled={pageName === "shippingComplete"}
                    label="Other known external source"
                  />
                  <FormControlLabel
                    value="Too many separate orders within a short period"
                    control={<Radio />}
                    disabled={pageName === "shippingComplete"}
                    label="Too many separate orders within a short period"
                  />
                </RadioGroup>
                {formik.touched.verification && formik.errors.verification ? (
                  <div style={{ color: "red", marginTop: "8px" }}>
                    {formik.errors.verification}
                  </div>
                ) : null}
              </FormControl>
            </Box>
            <Button
              type="submit"
              variant="contained"
              // disabled={!formik.values.verification}
              sx={{
                width: "200px",
                marginTop: "20px",
                borderRadius: "4px",
              }}
              disabled={pageName === "shippingComplete"}
              // disabled={
              //   orderactiveData?.status === "SHIP READY" ||
              //   orderactiveData?.status === "ENROUTE" ||
              //   orderactiveData?.status === "CLOSED" ||
              //   orderactiveData?.status === "CANCELED"
              // }
              // onClick={() => verificationHandler(formik.values.verification)}
            >
              Request verification
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
}

export default Verification;
