import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import { useFormik } from "formik";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { db } from "../firebaseConfig";
import { postShippingHistory } from "./common/History/helper";
import { useSelector } from "react-redux";

const initialValue = {
  postShipping: {
    shippingStatusUpdates: "",
  },
};

function PostShipping({ itemsData, packageActiveData, packageCollectionName }) {
  const [initialValues, setInitialValues] = useState(initialValue);
  const user = useSelector((state) => state.auth.value);
  console.log(
    packageActiveData,
    packageCollectionName,
    "packageActiveData in PostShipping"
  );

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: async (value, { resetForm }) => {
      console.log(value, "values in pre-shopping");
      try {
        await updateDoc(doc(db, packageCollectionName, packageActiveData?.id), {
          postShippingStatus: value.postShipping.shippingStatusUpdates,
        }).then(() => {
          toast.success("Item status updated successfully!");
          postShippingHistory(
            itemsData,
            value.postShipping.shippingStatusUpdates,
            user?.name,
            packageActiveData,
            packageCollectionName
          );
        });
      } catch (error) {
        console.log(error);
      }
      if (
        value.postShipping.shippingStatusUpdates ===
        "Shipment canceled by admin"
      ) {
        // await updateDoc(docRef, {
        //   status: "CANCELED",
        // }).then((res) => {
        //   // console.log(res, "res");
        // });
      } else {
        // await updateDoc(doc(db, "order", orderactive), {
        //   [key]: value,
        // })
        //   .then(async (res) => {
        //     toast.success("Items updated successfully!");
        //     // console.log(value, "value in postShippingStatus");
        //     // const docRef = doc(db, "order", orderactive);
        //     // if (value === "Shipment handed to carrier") {
        //     //   await updateDoc(docRef, {
        //     //     status: "ENROUTE",
        //     //   }).then((res) => {
        //     //     // console.log(res, "res");
        //     //   });
        //     // }
        //     // if (value === "Shipment delivered to customer") {
        //     //   await updateDoc(docRef, {
        //     //     status: "CLOSED",
        //     //   }).then((res) => {
        //     //     // console.log(res, "res");
        //     //   });
        //     // }
        //     // formik.resetForm();
        //     // postShippingHistory(
        //     //   selectedItem,
        //     //   value,
        //     //   user.displayName,
        //     //   orderactive
        //     // );
        //   })
        //   .catch((err) => toast.error(err));
      }
    },
  });

  return (
    <Box sx={{ marginLeft: "10px" }}>
      <Box sx={{ display: "grid", marginTop: "10px" }}>
        <label style={{ fontWeight: "bold", fontSize: "14px" }}>Select</label>
        <form onSubmit={formik.handleSubmit}>
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="postShipping.shippingStatusUpdates"
              // disabled={
              //   orderactiveData?.status === "SHIP READY" ||
              //   orderactiveData?.status === "ENROUTE" ||
              //   orderactiveData?.status === "CLOSED" ||
              //   orderactiveData?.status === "CANCELED"
              // }
              onChange={formik.handleChange}
              value={formik.values.postShipping.shippingStatusUpdates}
            >
              <FormControlLabel
                value="Dispatch delayed"
                control={<Radio />}
                label="Dispatch delayed"
              />
              <FormControlLabel
                value="Shipment handed to carrier"
                control={<Radio />}
                label="Shipment handed to carrier"
              />
              <FormControlLabel
                value="Shipment cancled by admin"
                control={<Radio />}
                label="Shipment cancled by admin"
              />
              <FormControlLabel
                value="Package arrived damaged"
                control={<Radio />}
                label="Package arrived damaged"
              />
              <FormControlLabel
                value="Purchase receipt needed"
                control={<Radio />}
                label="Purchase receipt needed"
              />
              <FormControlLabel
                value="Shipment delivered to customer"
                control={<Radio />}
                label="Shipment delivered to customer"
              />
              <FormControlLabel
                value="Package reported missing"
                control={<Radio />}
                label="Package reported missing"
              />
              <FormControlLabel
                value="Item reported missing"
                control={<Radio />}
                label="Item reported missing"
              />
            </RadioGroup>
          </FormControl>

          <Box>
            <Button
              variant="contained"
              type="submit"
              // disabled={
              //   orderactiveData?.status === "SHIP READY" ||
              //   orderactiveData?.status === "ENROUTE" ||
              //   orderactiveData?.status === "CLOSED" ||
              //   orderactiveData?.status === "CANCELED"
              // }
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
  );
}

export default PostShipping;
