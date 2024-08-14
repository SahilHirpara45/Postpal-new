import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { toast } from "react-toastify";
import { preShoppingHistory } from "./common/History/helper";
import { useSelector } from "react-redux";

const initialValue = {
  preShopping: {
    price: 0,
    quantity: 0,
    weight: 0,
    tax: 0,
    totalWeight: 0,
    pricePerPound: 0,
    preShoppingStatus: "",
    replacedWith: "",
    subTotalPriceByQty: 0,
    subTotalPriceByWgt: 0,
    merchantShippingCost: 0,
    customizeRequestCost: 0,
    promoCode: "",
    promoValue: 0,
    totalPrice: 0,
    // isManualSort: false,
    // manualSortFee: 0,
    length: 0,
    width: 0,
    height: 0,
    total: 0,
    // dimTotal: 0,
  },
};

function PreShopping({
  itemsData,
  pageName,
  packageActiveData,
  packageCollectionName,
}) {
  const [initialValues, setInitialValues] = useState(initialValue);
  const user = useSelector((state) => state.auth.value);

  // console.log(itemsData, "itemsData");

  useEffect(() => {
    if (itemsData) {
      setInitialValues({
        preShopping: {
          price: itemsData.price || 0,
          quantity: itemsData.quantity || 0,
          weight: itemsData.weight || 0,
          tax: itemsData.tax || 0,
          totalWeight: (itemsData.weight || 0) * (itemsData.quantity || 0) || 0,
          pricePerPound: itemsData.pricePerPound || 0,
          preShoppingStatus: itemsData.preShoppingStatus || "",
          replacedWith: itemsData.replacedWith || "",
          subTotalPriceByQty: itemsData.subTotalPriceByQty || 0,
          merchantShippingCost: itemsData.merchantShippingCost || 0,
          customizeRequestCost: itemsData.customizeRequestCost || 0,
          promoCode: itemsData.promoCode || "",
          promoValue: itemsData.promoValue || 0,
          totalPrice:
            itemsData.price * itemsData.quantity +
              (itemsData.tax || 0) +
              (itemsData.merchantShippingCost || 0) -
              (itemsData.promoValue || 0) || 0,
          length: itemsData.length || 0,
          width: itemsData.width || 0,
          height: itemsData.height || 0,
          total: itemsData.total || 0,
          // dimTotal: itemsData.dimTotal || 0,
        },
      });
      // totalPriceCal(
      //   itemsData.price,
      //   itemsData.quantity,
      //   itemsData.tax || 0,
      //   // itemsData.dimTotal,
      //   itemsData.merchantShippingCost || 0,
      //   // itemsData.customizeRequestCost,
      //   itemsData.promoValue || 0
      // );
    }
  }, [itemsData]);

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: (values) => {
      // console.log(values, "values in pre-shopping");
      try {
        const updatedObj = {
          preShoppingStatus: values.preShopping.preShoppingStatus,
          price: values.preShopping.price,
          quantity: values.preShopping.quantity,
          totalPrice: values.preShopping.totalPrice,
          totalWeight: values.preShopping.totalWeight,
          weight: values.preShopping.weight,
          // isManualSort: values?.preShopping?.isManualSort,
          // manualSortFee: values?.preShopping?.manualSortFee,
          merchantShippingCost: values?.preShopping?.merchantShippingCost || 0,
          customizeRequestCost: values?.preShopping?.customizeRequestCost,
          promoCode: values.preShopping.promoCode || "",
          promoValue: values.preShopping.promoValue || 0,
          tax: values.preShopping.tax,
          length: values.preShopping.length,
          width: values.preShopping.width,
          height: values.preShopping.height,
          total: values.preShopping.total,
          // dimTotal: values.preShopping.dimTotal,
          replacedWith:
            values.preShopping.preShoppingStatus === "Replaced"
              ? values.preShopping.replacedWith
              : "",
        };
        updateDoc(doc(db, "items", itemsData?.id), updatedObj).then(
          async (res) => {
            toast.success("Data Updated Successfully!");
            // const orderItems = items
            //   .map((item) => {
            //     if (orderactiveData?.itemId?.includes(item.id)) {
            //       if (item.id === selectedItem[0]?.id) {
            //         return { ...item, ...updatedObj };
            //       } else {
            //         return item;
            //       }
            //     }
            //   })
            //   .filter((item) => item);
            // updateOrderDetails(orderItems);
            // console.log(
            //   selectedItem[0].weight * selectedItem[0].quantity -
            //     formik.values.preShopping.totalWeight,
            //   "v3"
            // );
            // // handler();
            // OrderHandler(orderactive, ordersData[0]);
            // searchHandler(search);
            preShoppingHistory(
              itemsData,
              values,
              user?.name,
              packageActiveData,
              packageCollectionName
              // notSelectedItem,
              // routerPartnerLogo?.manualSortFee
            );

            // const chatRef = realtimeRef(
            //   dbRealtime,
            //   `orderChats/${orderactive}`
            // );

            // update(chatRef, { isOrderChatActive: true })
            //   .then(() => {
            //     // toast.success("OrderChatActive updated successfully.");
            //   })
            //   .catch((error) => {
            //     console.error("Error updating data:", error);
            //   });
          }
        );
      } catch (error) {
        console.log(error, "error");
      }
    },
  });

  // const checkForThesoldRateRange = (val) => {
  //   return shippingSevicedata?.thresholdRate?.find(
  //     (r) => val >= r.min_val && val <= r.max_val && r.min_val < r.max_val
  //   );
  // };

  // const pricePerPoundCal = (
  //   value,
  //   price,
  //   quantity,
  //   tax,
  //   merchantShippingCost,
  //   promoValue,
  //   dimTotal
  // ) => {
  //   if (shippingSevicedata?.crowdShipperService === "crowdShipping") {
  //     let subTotal = 0,
  //       totalPrice = 0;
  //     const rangeobj = checkForThesoldRateRange(value);
  //     const rangeobjPrice = rangeobj ? rangeobj?.price : 0;
  //     console.log(rangeobjPrice, "value 1");
  //     formik.setFieldValue("preShopping.pricePerPound", rangeobjPrice);
  //     subTotal = value * quantity * rangeobjPrice;
  //     totalPrice =
  //       subTotal +
  //       (price * quantity + tax) +
  //       merchantShippingCost +
  //       dimTotal -
  //       promoValue;
  //     formik.setFieldValue("preShopping.subTotalPriceByWgt", subTotal);
  //     formik.setFieldValue("preShopping.totalPrice", totalPrice);
  //     formik.setFieldValue("preShopping.totalWeight", value * quantity);
  //   } else {
  //     let subTotal = 0,
  //       totalPrice = 0;
  //     if (value >= 0 && value <= 5) {
  //       formik.setFieldValue(
  //         "preShopping.pricePerPound",
  //         shippingSevicedata.weightPrice.w_0_5
  //       );
  //       subTotal = value * quantity * shippingSevicedata.weightPrice.w_0_5;
  //       totalPrice =
  //         subTotal +
  //         (price * quantity + tax) +
  //         merchantShippingCost +
  //         dimTotal -
  //         promoValue;
  //     } else if (value > 5 && value <= 10) {
  //       formik.setFieldValue(
  //         "preShopping.pricePerPound",
  //         shippingSevicedata.weightPrice.w_6_10
  //       );
  //       subTotal = value * quantity * shippingSevicedata.weightPrice.w_6_10;
  //       totalPrice =
  //         subTotal +
  //         (price * quantity + tax) +
  //         merchantShippingCost +
  //         dimTotal -
  //         promoValue;
  //     } else if (value > 11 && value <= 25) {
  //       formik.setFieldValue(
  //         "preShopping.pricePerPound",
  //         shippingSevicedata.weightPrice.w_11_25
  //       );
  //       subTotal = value * quantity * shippingSevicedata.weightPrice.w_11_25;
  //       totalPrice =
  //         subTotal +
  //         (price * quantity + tax) +
  //         merchantShippingCost +
  //         dimTotal -
  //         promoValue;
  //     } else if (value > 25) {
  //       formik.setFieldValue(
  //         "preShopping.pricePerPound",
  //         shippingSevicedata.weightPrice.w_26
  //       );
  //       subTotal = value * quantity * shippingSevicedata.weightPrice.w_26;
  //       totalPrice =
  //         subTotal +
  //         (price * quantity + tax) +
  //         merchantShippingCost +
  //         dimTotal -
  //         promoValue;
  //     }
  //     formik.setFieldValue("preShopping.subTotalPriceByWgt", subTotal);
  //     formik.setFieldValue("preShopping.totalPrice", totalPrice);
  //     formik.setFieldValue("preShopping.totalWeight", value * quantity);
  //   }
  // };

  const totalPriceCal = (
    price,
    quantity,
    tax,
    // dimTotal,
    merchantShippingCost,
    // manualSortFee,
    promoValue
  ) => {
    // console.log(
    //   price,
    //   quantity,
    //   tax,
    //   // dimTotal,
    //   merchantShippingCost,
    //   // manualSortFee,
    //   promoValue,
    //   "all val in totalPriceCal"
    // );
    const totalPrice =
      price * quantity +
      tax +
      merchantShippingCost -
      // dimTotal +
      // manualSortFee -
      promoValue;
    // console.log(totalPrice, "totalPrice>>>");
    formik.setFieldValue("preShopping.totalPrice", totalPrice);
  };

  const changeWeightHandler = (e) => {
    formik.handleChange(e);
    const { value } = e.target;
    // console.log(value, "value");
    formik.setFieldValue(
      "preShopping.totalWeight",
      value * formik.values.preShopping.quantity
    );

    // formik.setFieldValue(
    //   "preShopping.subTotalPriceByWgt",
    //   value * formik.values.preShopping.pricePerPound
    // );
  };

  const taxChangeHandler = (e) => {
    formik.setFieldValue("preShopping.tax", +e.target.value);
    const { value } = e.target;
    formik.setFieldValue(
      "preShopping.subTotalPriceByQty",
      formik.values.preShopping.price * formik.values.preShopping.quantity +
        +value
    );

    totalPriceCal(
      formik.values.preShopping.price,
      formik.values.preShopping.quantity,
      +value,
      // formik.values.preShopping.dimTotal,
      formik.values.preShopping.merchantShippingCost,
      // formik.values.preShopping.manualSortFee,
      formik.values.preShopping.promoValue
    );
  };

  const changeDimHandler = (e) => {
    const { name, value } = e.target;
    const { length, width, height } = formik.values.preShopping;
    formik.setFieldValue(name, +value || 0);
    let nameOfDim = name.split(".")[1];
    const values = {
      length: length || 0,
      width: width || 0,
      height: height || 0,
      [nameOfDim]: +value || 0,
    };
    // console.log(values, "values in dim handler");
    const total = parseFloat(
      ((values.length * values.width * values.height) / 139).toFixed(2)
    );
    formik.setFieldValue("preShopping.total", total);
  };

  // const manualFeeCheckboxHandler = (event) => {
  //   // console.log(event.target.checked, "event.target.checked");
  //   console.log("manualFeeCheckboxHandler");
  //   formik.setFieldValue("preShopping.isManualSort", event.target.checked);
  //   if (event.target.checked) {
  //     formik.setFieldValue(
  //       "preShopping.manualSortFee",
  //       itemsData?.manualSortFee || 0
  //     );
  //     totalPriceCal(
  //       formik.values.preShopping.price,
  //       formik.values.preShopping.quantity,
  //       formik.values.preShopping.tax,
  //       // formik.values.preShopping.dimTotal,
  //       formik.values.preShopping.merchantShippingCost,
  //       itemsData?.manualSortFee,
  //       formik.values.preShopping.promoValue
  //     );
  //   } else {
  //     formik.setFieldValue("preShopping.manualSortFee", 0);
  //     totalPriceCal(
  //       formik.values.preShopping.price,
  //       formik.values.preShopping.quantity,
  //       formik.values.preShopping.tax,
  //       // formik.values.preShopping.dimTotal,
  //       formik.values.preShopping.merchantShippingCost,
  //       0,
  //       formik.values.preShopping.promoValue
  //     );
  //   }
  // };

  const PriceQtyHandler = (e) => {
    formik.handleChange(e);
    const { name, value } = e.target;
    let subTotalPriceByQty = 0;
    // console.log(value, "value");

    if (name === "preShopping.price") {
      subTotalPriceByQty =
        subTotalPriceByQty +
        +value * formik.values.preShopping.quantity +
        formik.values.preShopping.tax;
      formik.setFieldValue(
        "preShopping.subTotalPriceByQty",
        +value * formik.values.preShopping.quantity +
          formik.values.preShopping.tax
      );
      totalPriceCal(
        +value,
        formik.values.preShopping.quantity,
        formik.values.preShopping.tax,
        // formik.values.preShopping.dimTotal,
        formik.values.preShopping.merchantShippingCost,
        // formik.values.preShopping.manualSortFee,
        formik.values.preShopping.promoValue
      );
    } else if (name === "preShopping.quantity") {
      subTotalPriceByQty =
        subTotalPriceByQty +
        +value * formik.values.preShopping.price +
        formik.values.preShopping.tax;
      formik.setFieldValue(
        "preShopping.subTotalPriceByQty",
        +value * formik.values.preShopping.price + formik.values.preShopping.tax
      );
      formik.setFieldValue(
        "preShopping.totalWeight",
        +value * formik.values.preShopping.weight
      );

      totalPriceCal(
        formik.values.preShopping.price,
        +value,
        formik.values.preShopping.tax,
        // formik.values.preShopping.dimTotal,
        formik.values.preShopping.merchantShippingCost,
        // formik.values.preShopping.manualSortFee,
        formik.values.preShopping.promoValue
      );
    }
    // formik.setFieldValue(
    //   "preShopping.totalPrice",
    //   subTotalPriceByQty + formik.values.preShopping.subTotalPriceByWgt
    // );
  };

  const merchantShippingCostChangeHandler = (e) => {
    formik.handleChange(e);
    const { value } = e.target;
    totalPriceCal(
      formik.values.preShopping.price,
      formik.values.preShopping.quantity,
      formik.values.preShopping.tax,
      // formik.values.preShopping.dimTotal,
      +value,
      // formik.values.preShopping.manualSortFee,
      formik.values.preShopping.promoValue
    );
  };

  const promoValueChangeHandler = (e) => {
    formik.handleChange(e);
    const { value } = e.target;
    totalPriceCal(
      formik.values.preShopping.price,
      formik.values.preShopping.quantity,
      formik.values.preShopping.tax,
      // formik.values.preShopping.dimTotal,
      formik.values.preShopping.merchantShippingCost,
      // formik.values.preShopping.manualSortFee,
      +value
    );
  };

  // console.log(formik.values, "formik.values");

  return (
    <Box sx={{ marginLeft: "10px" }}>
      <label style={{ fontSize: "15px" }}>
        Please update weight, amount and quantity where necessory and submit
        back to the shipper for review
      </label>
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "0px",
          }}
        >
          <label
            style={{
              fontSize: "16px",
              fontWeight: "normal",
            }}
          >
            Price
          </label>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography>$</Typography>
            <FormControl
              sx={{ m: 1, width: "92px", minHeight: "35px" }}
              size="small"
            >
              <OutlinedInput
                type="number"
                placeholder="$65"
                name="preShopping.price"
                disabled={pageName === "shippingComplete"}
                // disabled={
                //   selectedItem[0].preShoppingStatus !== "" ||
                //   orderactiveData?.status === "SHIP READY" ||
                //   orderactiveData?.status === "ENROUTE" ||
                //   orderactiveData?.status === "CLOSED" ||
                //   orderactiveData?.status === "CANCELED"
                // }
                onChange={PriceQtyHandler}
                value={formik.values.preShopping.price}
              />
            </FormControl>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "0px",
          }}
        >
          <label
            style={{
              fontSize: "16px",
              fontWeight: "normal",
            }}
          >
            Quantity
          </label>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FormControl
              sx={{ m: 1, width: "92px", minHeight: "35px" }}
              size="small"
            >
              <OutlinedInput
                type="number"
                id="addressLine2"
                placeholder="5"
                name="preShopping.quantity"
                disabled={pageName === "shippingComplete"}
                // disabled={
                //   selectedItem[0].preShoppingStatus !== "" ||
                //   orderactiveData?.status === "SHIP READY" ||
                //   orderactiveData?.status === "ENROUTE" ||
                //   orderactiveData?.status === "CLOSED" ||
                //   orderactiveData?.status === "CANCELED"
                // }
                onChange={PriceQtyHandler}
                value={formik.values.preShopping.quantity}
              />
            </FormControl>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "0px",
          }}
        >
          <label
            style={{
              fontSize: "16px",
              fontWeight: "normal",
            }}
          >
            Tax
          </label>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography>$</Typography>
            <FormControl
              sx={{ m: 1, width: "92px", minHeight: "35px" }}
              size="small"
            >
              <OutlinedInput
                type="number"
                id="tax"
                placeholder="0"
                name="preShopping.tax"
                disabled={pageName === "shippingComplete"}
                // disabled={
                //   selectedItem[0].preShoppingStatus !== "" ||
                //   orderactiveData?.status === "SHIP READY" ||
                //   orderactiveData?.status === "ENROUTE" ||
                //   orderactiveData?.status === "CLOSED" ||
                //   orderactiveData?.status === "CANCELED"
                // }
                onChange={taxChangeHandler}
                value={formik.values.preShopping.tax}
              />
            </FormControl>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "0px",
          }}
        >
          <label
            style={{
              fontSize: "16px",
              fontWeight: "normal",
            }}
          >
            Weight/Quantity
          </label>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FormControl
              sx={{ m: 1, width: "92px", minHeight: "35px" }}
              size="small"
            >
              <OutlinedInput
                type="number"
                id="addressLine2"
                placeholder="10lb"
                name="preShopping.weight"
                disabled={pageName === "shippingComplete"}
                // disabled={
                //   selectedItem[0].preShoppingStatus !== "" ||
                //   orderactiveData?.status === "SHIP READY" ||
                //   orderactiveData?.status === "ENROUTE" ||
                //   orderactiveData?.status === "CLOSED" ||
                //   orderactiveData?.status === "CANCELED"
                // }
                onChange={changeWeightHandler}
                value={formik.values.preShopping.weight}
              />
            </FormControl>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "0px",
          }}
        >
          <label
            style={{
              fontSize: "16px",
              fontWeight: "normal",
            }}
          >
            Total Weight
          </label>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FormControl
              sx={{ m: 1, width: "92px", minHeight: "35px" }}
              size="small"
            >
              <OutlinedInput
                type="text"
                id="addressLine2"
                placeholder="20lb"
                name="preShopping.totalWeight"
                onChange={formik.handleChange}
                value={formik.values.preShopping.totalWeight}
                disabled
              />
            </FormControl>
          </Box>
        </Box>
        {/* <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "0px",
          }}
        >
          <label
            style={{
              fontSize: "16px",
              fontWeight: "normal",
            }}
          >
            Price/pound
          </label>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FormControl
              sx={{ m: 1, width: "92px", minHeight: "35px" }}
              size="small"
            >
              <OutlinedInput
                type="text"
                id="addressLine2"
                placeholder="$11"
                name="preShopping.pricePerPound"
                onChange={formik.handleChange}
                value={formik.values.preShopping.pricePerPound}
                disabled
              />
            </FormControl>
          </Box>
        </Box> */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography>Dimentions</Typography>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography>L</Typography>
              <Box>
                <FormControl
                  sx={{
                    m: 1,
                    width: "60px",
                    minHeight: "35px",
                  }}
                  size="small"
                >
                  <OutlinedInput
                    type="number"
                    id="preShopping.length"
                    placeholder="5"
                    name="preShopping.length"
                    disabled={pageName === "shippingComplete"}
                    // disabled={
                    //   selectedItem[0].preShoppingStatus !== "" ||
                    //   orderactiveData?.status === "SHIP READY" ||
                    //   orderactiveData?.status === "ENROUTE" ||
                    //   orderactiveData?.status === "CLOSED" ||
                    //   orderactiveData?.status === "CANCELED"
                    // }
                    onChange={changeDimHandler}
                    value={formik.values.preShopping.length}
                  />
                </FormControl>
              </Box>
              <Typography>W</Typography>
              <Box>
                <FormControl
                  sx={{
                    m: 1,
                    width: "60px",
                    minHeight: "35px",
                  }}
                  size="small"
                >
                  <OutlinedInput
                    type="number"
                    id="preShopping.width"
                    placeholder="5"
                    name="preShopping.width"
                    disabled={pageName === "shippingComplete"}
                    // disabled={
                    //   selectedItem[0].preShoppingStatus !== "" ||
                    //   orderactiveData?.status === "SHIP READY" ||
                    //   orderactiveData?.status === "ENROUTE" ||
                    //   orderactiveData?.status === "CLOSED" ||
                    //   orderactiveData?.status === "CANCELED"
                    // }
                    onChange={changeDimHandler}
                    value={formik.values.preShopping.width}
                  />
                </FormControl>
              </Box>
              <Typography>H</Typography>
              <Box>
                <FormControl
                  sx={{
                    m: 1,
                    width: "60px",
                    minHeight: "35px",
                  }}
                  size="small"
                >
                  <OutlinedInput
                    type="number"
                    id="preShopping.height"
                    placeholder="10"
                    name="preShopping.height"
                    disabled={pageName === "shippingComplete"}
                    // disabled={
                    //   selectedItem[0].preShoppingStatus !== "" ||
                    //   orderactiveData?.status === "SHIP READY" ||
                    //   orderactiveData?.status === "ENROUTE" ||
                    //   orderactiveData?.status === "CLOSED" ||
                    //   orderactiveData?.status === "CANCELED"
                    // }
                    onChange={changeDimHandler}
                    value={formik.values.preShopping.height}
                  />
                </FormControl>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "0px",
          }}
        >
          <label
            style={{
              fontSize: "16px",
              fontWeight: "normal",
            }}
          >
            Customize Request Cost
          </label>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FormControl
              sx={{ m: 1, width: "92px", minHeight: "35px" }}
              size="small"
            >
              <OutlinedInput
                type="number"
                aria-label="Amount (to the nearest dollar)"
                name="preShopping.customizeRequestCost"
                onChange={formik.handleChange}
                value={formik.values.preShopping.customizeRequestCost}
                disabled={pageName === "shippingComplete"}
              />
            </FormControl>
          </Box>
        </Box>
        {itemsData.itemType === "SHOPPING" && (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "0px",
              }}
            >
              <label
                style={{
                  fontSize: "16px",
                  fontWeight: "normal",
                }}
              >
                Merchant Shipping Cost
              </label>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <FormControl
                  sx={{ m: 1, width: "92px", minHeight: "35px" }}
                  size="small"
                >
                  <OutlinedInput
                    type="number"
                    aria-label="Amount (to the nearest dollar)"
                    name="preShopping.merchantShippingCost"
                    onChange={merchantShippingCostChangeHandler}
                    value={formik.values.preShopping.merchantShippingCost}
                  />
                </FormControl>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "0px",
              }}
            >
              <label
                style={{
                  fontSize: "16px",
                  fontWeight: "normal",
                }}
              >
                Promo code
              </label>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <FormControl
                  sx={{ m: 1, width: "92px", minHeight: "35px" }}
                  size="small"
                >
                  <OutlinedInput
                    type="text"
                    aria-label=""
                    name="preShopping.promoCode"
                    onChange={formik.handleChange}
                    value={formik.values.preShopping.promoCode}
                  />
                </FormControl>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "0px",
              }}
            >
              <label
                style={{
                  fontSize: "16px",
                  fontWeight: "normal",
                }}
              >
                Promo Value
              </label>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <FormControl
                  sx={{ m: 1, width: "92px", minHeight: "35px" }}
                  size="small"
                >
                  <OutlinedInput
                    type="number"
                    aria-label="Amount (to the nearest dollar)"
                    name="preShopping.promoValue"
                    onChange={promoValueChangeHandler}
                    value={formik.values.preShopping.promoValue}
                  />
                </FormControl>
              </Box>
            </Box>
          </>
        )}
        {/* <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginRight: "12px",
            marginTop: "30px",
          }}
        >
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  type="checkbox"
                  name="preShopping.isManualSort"
                  id="isManualSort"
                  label={<span className="fw-bold fs-5">Manual Sort Fee</span>}
                  onChange={(event) => {
                    manualFeeCheckboxHandler(event);
                  }}
                  checked={formik.values.preShopping.isManualSort}
                  // disabled={
                  //   selectedItem[0].preShoppingStatus !== "" ||
                  //   orderactiveData?.status === "SHIP READY" ||
                  //   orderactiveData?.status === "ENROUTE" ||
                  //   orderactiveData?.status === "CLOSED" ||
                  //   orderactiveData?.status === "CANCELED"
                  // }
                />
              }
              label="Manual Sort free"
            />
          </FormGroup>
          <label style={{ fontWeight: "bold", fontSize: "16px" }}>
            ${formik.values.preShopping.manualSortFee}
          </label>
        </Box> */}
        {/* <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginRight: "12px",
          }}
        >
          <label
            style={{
              fontSize: "16px",
              fontWeight: "normal",
            }}
          >
            Weight fee
          </label>
          <label style={{ fontWeight: "bold", fontSize: "16px" }}>$0.00</label>
        </Box> */}
        {/* <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginRight: "12px",
            marginTop: "10px",
          }}
        >
          <label
            style={{
              fontSize: "16px",
              fontWeight: "normal",
            }}
          >
            Packaging fee
          </label>
          <label style={{ fontWeight: "bold", fontSize: "16px" }}>$0.00</label>
        </Box> */}
        {/* <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginRight: "12px",
            marginTop: "10px",
          }}
        >
          <label
            style={{
              fontSize: "16px",
              fontWeight: "normal",
            }}
          >
            Sub Total
          </label>
          <label style={{ fontWeight: "bold", fontSize: "16px" }}>
            $216.00
          </label>
        </Box> */}
        <Box
          sx={{
            marginRight: "12px",
            borderBottom: "1px solid #E5E5E8",
            marginTop: "15px",
          }}
        ></Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginRight: "12px",
            marginTop: "10px",
          }}
        >
          <label
            style={{
              fontSize: "18px",
              fontWeight: "normal",
            }}
          >
            Total
          </label>
          <label style={{ fontWeight: "bold", fontSize: "16px" }}>
            ${`${formik.values?.preShopping?.totalPrice}`}
          </label>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "10px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <label style={{ fontSize: "18px" }}>Status</label>
            <FormControl
              sx={{
                m: 1,
                minWidth: 117,
                minHeight: "35px",
                marginLeft: "20px",
              }}
              size="small"
            >
              <select
                removeItemButton
                // disabled={
                //   orderactiveData?.status === "SHIP READY" ||
                //   orderactiveData?.status === "ENROUTE" ||
                //   orderactiveData?.status === "CLOSED" ||
                //   orderactiveData?.status === "CANCELED"
                // }
                name="preShopping.preShoppingStatus"
                onChange={formik.handleChange}
                value={formik.values.preShopping.preShoppingStatus}
                disabled={pageName === "shippingComplete"}
                className="w-100"
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
                  e.target.style.borderColor = "rgba(95, 56, 249, 0.65)";
                  e.target.style.boxShadow =
                    "0 0 5px 0px rgba(95, 56, 249, 0.2)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#d2d4e4";
                  e.target.style.boxShadow = "none";
                }}
              >
                <option value={""}>Select</option>
                <option value={"Cancel Item"}>Cancel Item</option>
                <option value={"Out of Stock"}>Out of Stock</option>
                <option value={"Replaced"}>Replaced</option>
                <option value={"Exporting Contraband"}>
                  Exporting Contraband
                </option>
                <option value={"Importing Contraband"}>
                  Importing Contraband
                </option>
              </select>
            </FormControl>
          </Box>
          {/* {formik.values.preShopping.preShoppingStatus === "Replaced" && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <label style={{ fontSize: "18px" }}>Replaced With</label>
              <FormControl
                sx={{
                  m: 1,
                  minWidth: 117,
                  minHeight: "35px",
                  marginLeft: "20px",
                }}
                size="small"
              >
                <select
                  removeItemButton
                  name="preShopping.replacedWith"
                  onChange={formik.handleChange}
                  value={formik.values.preShopping.replacedWith}
                  className="w-100"
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
                    e.target.style.borderColor = "rgba(95, 56, 249, 0.65)";
                    e.target.style.boxShadow =
                      "0 0 5px 0px rgba(95, 56, 249, 0.2)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#d2d4e4";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  <option value={"0"}>Select Item</option>
                  {notSelectedItem.map((itm, i) => (
                  <option key={i} value={itm.id}>
                    {itm.name}
                  </option>
                ))}
                </select>
              </FormControl>
            </Box>
          )} */}
          <Box>
            <Button
              variant="contained"
              type={"submit"}
              sx={{ width: "200px", borderRadius: "4px" }}
              onClick={formik.handleSubmit}
              disabled={pageName === "shippingComplete"}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default PreShopping;
