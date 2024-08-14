import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { toast } from "react-toastify";
import { preShippingHistory } from "./common/History/helper";
import { useSelector } from "react-redux";

const initialValues = {
  preShippingStatus: "",
};

const PreShipping = ({
  itemsData,
  pageName,
  packageActiveData,
  packageCollection,
}) => {
  const [initialValue, setInitialValue] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth.value);

  useEffect(() => {
    if (packageActiveData) {
      setInitialValue({
        preShippingStatus: packageActiveData.preShippingStatus || "",
      });
    }
  }, [packageActiveData]);

  const formik = useFormik({
    initialValues: initialValue,
    enableReinitialize: true,
    onSubmit: async (value) => {
      console.log(value, "value");
      setLoading(true);
      await updateDoc(doc(db, packageCollection, packageActiveData?.id), {
        preShippingStatus: value.preShippingStatus
          ? value.preShippingStatus
          : "",
      }).then(async () => {
        setLoading(false);
        toast.success("Package Status updated successfully!");
        preShippingHistory(
          itemsData,
          value,
          user?.name,
          packageActiveData,
          packageCollection
        );
      });
    },
  });

  return (
    <div>
      <Box sx={{ marginLeft: "10px" }}>
        <Box sx={{ display: "grid", marginTop: "10px" }}>
          <label style={{ fontWeight: "bold", fontSize: "14px" }}>Select</label>
          <form onSubmit={formik.handleSubmit}>
            <Box>
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="preShippingStatus"
                  // disabled={
                  //   orderactiveData?.status === "SHIP READY" ||
                  //   orderactiveData?.status === "ENROUTE" ||
                  //   orderactiveData?.status === "CLOSED" ||
                  //   orderactiveData?.status === "CANCELED"
                  // }
                  onChange={formik.handleChange}
                  value={formik.values.preShippingStatus}
                >
                  <FormControlLabel
                    value="Purchase Receipt missing"
                    control={<Radio />}
                    disabled={pageName === "shippingComplete"}
                    label="Purchase Receipt missing"
                  />
                  <FormControlLabel
                    value="Fraud concern"
                    control={<Radio />}
                    disabled={pageName === "shippingComplete"}
                    label="Fraud concern"
                  />
                  <FormControlLabel
                    value="Verification not complete"
                    control={<Radio />}
                    disabled={pageName === "shippingComplete"}
                    label="Verification not complete"
                  />
                  <FormControlLabel
                    value="Dispatched Shipment"
                    control={<Radio />}
                    disabled={pageName === "shippingComplete"}
                    label="Dispatched Shipment"
                  />
                  <FormControlLabel
                    value="Minimum weight not met"
                    control={<Radio />}
                    disabled={pageName === "shippingComplete"}
                    label="Minimum weight not met"
                  />
                </RadioGroup>
              </FormControl>
            </Box>

            <Box>
              <Button
                variant="contained"
                type="submit"
                // onClick={statusChangeHandler}
                // disabled={
                //   loading
                //   // orderactiveData?.status === "SHIP READY" ||
                //   // orderactiveData?.status === "ENROUTE" ||
                //   // orderactiveData?.status === "CLOSED" ||
                //   // orderactiveData?.status === "CANCELED"
                // }
                disabled={pageName === "shippingComplete" || loading}
                sx={{
                  width: "200px",
                  marginTop: "20px",
                  borderRadius: "4px",
                }}
              >
                Update Status
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </div>
  );
};

export default PreShipping;
