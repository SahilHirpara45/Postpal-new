import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  OutlinedInput,
  Radio,
  RadioGroup,
} from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import FileUploaderMultiple from "./common/FileUploaderMultiple";
import ReactQuill from "react-quill";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../firebaseConfig";
import { toast } from "react-toastify";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { postShoppingHistory } from "./common/History/helper";
import { useSelector } from "react-redux";

const initialValues = {
  postShopping: {
    // postShoppingStatus: "",
    // orderNumber: "",
    // tracingNumber: "",
    // orderReceivedImage: "",
    // wrongItemNotes: "",
    // wrongAddressNotes: "",
    postShoppingStatus: "",
    time: "",
    orderNumber: "",
    tracking: "",
  },
};

export default function PostShopping({
  itemsData,
  packageActiveData,
  pageName,
  packageCollection = "shelfPackages",
}) {
  const [initialValue, setInitialValue] = useState(initialValues);
  const [orderReceivedImage, setOrderReceivedImage] = useState(null);
  const [wrongItemNotes, setWrongItemNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth.value);
  // console.log(user, "user in post shopping");
  // console.log(itemsData, "itemsData");
  // console.log(packageActiveData, "packageActiveData in post shopping");

  useEffect(() => {
    if (packageActiveData) {
      setInitialValue({
        postShopping: {
          postShoppingStatus: packageActiveData.postShoppingStatus || "",
          orderNumber: packageActiveData?.orderNumber || "",
          trackingNumber: packageActiveData?.trackingNumber || "",
        },
      });
      // setWrongItemNotes(itemsData.postShopping?.wrongItemNotes || "");
      // setOrderReceivedImage(itemsData.postShopping?.orderReceivedImage || "");
    }
  }, [packageActiveData]);

  const formik = useFormik({
    initialValues: initialValue,
    enableReinitialize: true,
    onSubmit: async (value) => {
      console.log(value, "value");
      setLoading(true);
      try {
        let photoUrl1;
        // if (orderReceivedImage) {
        //   const storageRef1 = ref(
        //     storage,
        //     `/receivedOrderImages/${orderReceivedImage[0].name}`
        //   );
        //   const uploadTask1 = uploadBytesResumable(
        //     storageRef1,
        //     orderReceivedImage[0]
        //   );
        //   const [snapshot1] = await Promise.all([uploadTask1]);

        //   photoUrl1 = await getDownloadURL(snapshot1.ref);
        //   // setOrderReceivedImage("");
        // }

        // if (photoUrl1) {
        const packageStatus =
          value.postShopping.postShoppingStatus === "Placed order"
            ? "Ordered"
            : value.postShopping.postShoppingStatus === "Update tracking number"
            ? "Received"
            : "";
        await updateDoc(doc(db, packageCollection, packageActiveData?.id), {
          packageTrackingStatus: packageStatus,
          postShoppingStatus: value.postShopping.postShoppingStatus
            ? value.postShopping.postShoppingStatus
            : "",
          orderNumber: value.postShopping.orderNumber
            ? value.postShopping.orderNumber
            : "",
          orderedAt:
            value.postShopping.postShoppingStatus === "Placed order"
              ? serverTimestamp()
              : packageActiveData?.orderedAt || "",
          trackingNumber: value.postShopping.trackingNumber
            ? value.postShopping.trackingNumber
            : "",
          receivedAt:
            value.postShopping.postShoppingStatus === "Update tracking number"
              ? serverTimestamp()
              : packageActiveData?.receivedAt || "",
        })
          .then(async () => {
            setLoading(false);
            toast.success("Package Status updated successfully!");
            postShoppingHistory(
              itemsData,
              value.postShopping,
              user?.name,
              packageActiveData,
              packageCollection
            );

            // Add or update package in shelfPackages collection
            if (
              value.postShopping.postShoppingStatus === "Update tracking number"
            ) {
              const date = new Date();
              const year = date.getFullYear().toString().slice(-2); // Get the last two digits of the year
              const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Get the month and pad with leading zero if needed

              getDoc(doc(db, "masterData", "packageSetting")).then(
                async (docSnap) => {
                  if (docSnap.exists()) {
                    const docData = docSnap.data();
                    // Compare date with current date
                    let newYear;
                    let newMonth;
                    let changeMonth = false;
                    let changeYear = false;

                    if (docData.currentYear === parseInt(year)) {
                      if (docData.currentMonth === parseInt(month)) {
                        newYear = year;
                        newMonth = month;
                      } else {
                        newYear = year;
                        newMonth = month;
                        changeMonth = true;
                      }
                    } else {
                      newYear = year;
                      newMonth = month;
                      changeYear = true;
                    }

                    const shelfPackageDocRef = doc(
                      db,
                      "shelfPackages",
                      `PACK-${docData.currentId.toString()}`
                    );
                    // console.log(shelfPackageDocRef, "shelfPackageDocRef");

                    await setDoc(shelfPackageDocRef, {
                      // All remaining data of the package
                      ...packageActiveData,
                      createdAt: serverTimestamp(),
                      id: shelfPackageDocRef.id,
                      packageTrackingId: shelfPackageDocRef.id,

                      packageTrackingStatus: packageStatus,
                      postShoppingStatus: value.postShopping.postShoppingStatus,
                      trackingNumber: value.postShopping.trackingNumber,
                      receivedAt: serverTimestamp(),
                    })
                      .then(() => {
                        // toast.success(
                        //   "Package added to shelfPackages collection!"
                        // );
                        updateDoc(doc(db, "masterData", "packageSetting"), {
                          currentId: docData.currentId + docData.incrementBy,
                          currentSerialId:
                            changeMonth || changeYear
                              ? 2
                              : docData.currentSerialId + docData.incrementBy,
                          currentYear: parseFloat(newYear),
                          currentMonth: parseFloat(newMonth),
                        });
                      })
                      .catch((error) => {
                        console.error(
                          "Error adding package to shelfPackages: ",
                          error
                        );
                        // toast.error("Failed to add package to shelfPackages!");
                      });
                  }
                }
              );
            }
          })
          .catch((error) => {
            setLoading(false);
            console.error("Error updating document: ", error);
            toast.error("Failed to update document!");
          });

        await updateDoc(doc(db, "items", itemsData?.id), {
          postShopping: {
            postShoppingStatus: value.postShopping.postShoppingStatus
              ? value.postShopping.postShoppingStatus
              : "",
            date:
              value.postShopping.postShoppingStatus ===
                "Update tracking number" ||
              value.postShopping.postShoppingStatus ===
                "Order delivered damaged"
                ? serverTimestamp()
                : "",
            orderNumber: value.postShopping.orderNumber
              ? value.postShopping.orderNumber
              : "",
            trackingNumber: value.postShopping.trackingNumber
              ? value.postShopping.trackingNumber
              : "",
            wrongItemNotes: wrongItemNotes ? wrongItemNotes : "",
            // orderReceivedImage: photoUrl1 ? photoUrl1 : "",
          },
          preShoppingStatus:
            value.postShopping.postShoppingStatus === "Return by Admin" ||
            value.postShopping.postShoppingStatus ===
              "Customer requested return"
              ? "Cancel Item"
              : "",
        }).then(async (res) => {
          // toast.success("Items status updated successfully!");
          setLoading(false);
          // handler();
          // const docRef = doc(db, "order", orderactive);
          // if (
          //   value.postShopping.postShoppingStatus === "Update tracking number" ||
          //   value.postShopping.postShoppingStatus === "Order delivered damaged"
          // ) {
          //   getDoc(docRef).then((docSnapshot) => {
          //     if (docSnapshot.exists()) {
          //       const data = docSnapshot.data();
          //       if (!data.deliveryDate) {
          //         data.deliveryDate = serverTimestamp();
          //       }

          //       updateDoc(docRef, data)
          //         .then((res) => console.log())
          //         .catch((error) =>
          //           console.error("Error updating document: ", error)
          //         );
          //     }
          //   });
          // }
          // if (value.postShopping.postShoppingStatus === "Update tracking number") {
          //   await updateDoc(docRef, {
          //     status: "PACKING",
          //   }).then((res) => {
          //     // console.log(res, "res");
          //   });
          // }
          // OrderHandler(orderactive, ordersData[0]);
          // formik.resetForm();
          // setWrongItemNotes("");
        });
        // }
      } catch (error) {
        console.log(error);
      }
    },
  });

  const onUploadChange = (file) => {
    setOrderReceivedImage(file);
  };

  // console.log(formik.values, "formik.values");

  return (
    <Box sx={{ marginLeft: "10px" }}>
      <Box sx={{ display: "grid", marginTop: "10px" }}>
        <label style={{ fontWeight: "bold", fontSize: "14px" }}>Select</label>
        <form onSubmit={formik.handleSubmit}>
          <Box>
            <FormControl>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="postShopping.postShoppingStatus"
                // disabled={
                //   orderactiveData?.status === "SHIP READY" ||
                //   orderactiveData?.status === "ENROUTE" ||
                //   orderactiveData?.status === "CLOSED" ||
                //   orderactiveData?.status === "CANCELED"
                // }
                onChange={formik.handleChange}
                value={formik.values.postShopping.postShoppingStatus}
              >
                <FormControlLabel
                  value="Placed order"
                  control={<Radio />}
                  disabled={pageName === "shippingComplete"}
                  label="Placed order"
                />
                <FormControlLabel
                  value="Update tracking number"
                  control={<Radio />}
                  disabled={pageName === "shippingComplete"}
                  label="Update tracking number"
                />
                <FormControlLabel
                  value="Wrong item delivered"
                  control={<Radio />}
                  disabled={pageName === "shippingComplete"}
                  label="Wrong item delivered"
                />
                <FormControlLabel
                  value="Order delivered in wrong address"
                  control={<Radio />}
                  disabled={pageName === "shippingComplete"}
                  label="Order delivered in wrong address"
                />
                <FormControlLabel
                  value="Return by Admin"
                  control={<Radio />}
                  disabled={pageName === "shippingComplete"}
                  label="Return by Admin"
                />
                <FormControlLabel
                  value="Customer requested return"
                  control={<Radio />}
                  disabled={pageName === "shippingComplete"}
                  label="Customer requested return"
                />
              </RadioGroup>
            </FormControl>
          </Box>

          {formik.values.postShopping.postShoppingStatus === "Placed order" && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                mt: 2,
              }}
            >
              <label
                style={{
                  fontSize: "16px",
                  fontWeight: "normal",
                  marginBottom: "5px",
                }}
              >
                Enter order number
              </label>
              <FormControl sx={{}} size="small">
                <OutlinedInput
                  type="text"
                  id="placeOrder"
                  placeholder="Enter last 5 digit of order no."
                  name="postShopping.orderNumber"
                  value={formik.values.postShopping.orderNumber}
                  onChange={formik.handleChange}
                  disabled={pageName === "shippingComplete"}
                />
              </FormControl>
            </Box>
          )}

          {formik.values.postShopping.postShoppingStatus ===
            "Update tracking number" && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                mt: 2,
              }}
            >
              <label
                style={{
                  fontSize: "16px",
                  fontWeight: "normal",
                  marginBottom: "5px",
                }}
              >
                Enter tracking number
              </label>
              <FormControl size="small">
                <OutlinedInput
                  type="text"
                  id="orderReceived"
                  placeholder="Enter tracking number"
                  name="postShopping.trackingNumber"
                  value={formik.values.postShopping.trackingNumber}
                  onChange={formik.handleChange}
                  disabled={pageName === "shippingComplete"}
                />
                {/* <label
                  style={{
                    fontSize: "16px",
                    fontWeight: "normal",
                    marginBottom: "5px",
                    marginTop: "10px",
                  }}
                >
                  Uploads picture
                </label>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <FileUploaderMultiple
                    name={"images"}
                    value={orderReceivedImage}
                    onChange={onUploadChange}
                    // errors={formik.errors.postShopping.orderReceivedImage}
                    // maxFileNum={5}
                  />
                </Box> */}
              </FormControl>
            </Box>
          )}

          {(formik.values.postShopping.postShoppingStatus ===
            "Wrong item delivered" ||
            formik.values.postShopping.postShoppingStatus ===
              "Order delivered in wrong address") && (
            <Box>
              <label
                style={{
                  fontSize: "16px",
                  fontWeight: "normal",
                  marginBottom: "5px",
                  marginTop: "10px",
                  display: "block",
                }}
              >
                Notes
              </label>
              <Box>
                <ReactQuill
                  theme="snow"
                  value={wrongItemNotes}
                  onChange={setWrongItemNotes}
                  disabled={pageName === "shippingComplete"}
                />
              </Box>
            </Box>
          )}

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
  );
}
