import {
  Box,
  Button,
  FormControl,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { useFormik } from "formik";

const initialValue = {
  finalPrice: {
    packagingWeight: 0,
    length: 0,
    width: 0,
    height: 0,
    price: 0,
    total: 0,
    amountReceived: 0,
    remainingBalance: 0,
    storageDays: 0,
    // dayPerPrice: 0,
    storageFeeTotal: 0,
  },
};

export default function FinalPrice({ packageActiveData, pageName }) {
  const [initialValues, setInitialValues] = useState(initialValue);
  const [packageItems, setPackageItems] = useState([]);

  console.log(packageActiveData, "packageActiveData");

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: (values) => {
      console.log(values, "values in pre-shopping");
    },
  });

  useEffect(() => {
    const fetchItemData = async () => {
      if (
        Object.keys(packageActiveData).length === 0 ||
        packageActiveData?.packageItemIds?.length === 0
      )
        return;
      const itemIdArray = packageActiveData?.packageItemIds;
      const itemPromises =
        itemIdArray?.length > 0 &&
        itemIdArray?.map(async (itemId) => {
          const itemDocRef = doc(db, "items", itemId);
          const itemDocSnap = await getDoc(itemDocRef);

          if (itemDocSnap.exists()) {
            return {
              ...itemDocSnap.data(),
              // isManualSort: false,
              // manualSortFee: 0,
              // tax: 0,
              // merchantShippingCost: 0,
              // promoValue: 0,
              // customizeRequestCost: 0,
              // length: 0,
              // width: 0,
              // height: 0,
              // total: 0,
            };
          }
        });

      const arr = await Promise.all(itemPromises);
      console.log(arr, "arr");
      setPackageItems(arr);
      // const filteredData = arr?.filter((item) =>
      //   itemdata?.itemId?.includes(item?.id)
      // );
      // console.log(filteredData, "filteredData >>");
      // setFilteredItems(filteredData);

      orderPriceCal(packageActiveData, arr);
    };

    fetchItemData();
  }, [packageActiveData, packageActiveData?.packageItemIds]);

  const TotalFinalItems = packageItems.filter(
    (item) => item?.preShoppingStatus === ""
  );

  const TotalItemsQuantity = TotalFinalItems?.reduce((total, items) => {
    return total + items?.quantity;
  }, 0);

  const TotalItemWeight = (items) => {
    return items?.reduce((total, items) => {
      return total + items?.weight * items?.quantity;
    }, 0);
  };

  const shoppingFinalPrice = (allItems) => {
    return allItems?.reduce((total, item) => {
      if (item?.itemType === "SHOPPING") {
        const price =
          parseFloat(item?.price) * item.quantity +
          (item?.merchantShippingCost || 0) -
          (item?.promoValue || 0);
        if (!isNaN(price)) {
          return total + price;
        }
      }
      return total;
    }, 0);
  };
  // console.log(shoppingFinalPrice(TotalFinalItems),"shoppingFinalPrice");

  const personalShippingPercentageCounter = (repackagingForCondition) => {
    if (repackagingForCondition >= 0 && repackagingForCondition <= 500) {
      return 8;
    } else if (
      repackagingForCondition > 500 &&
      repackagingForCondition <= 1500
    ) {
      return 6;
    } else if (repackagingForCondition > 1500) {
      return 4;
    } else {
      return 0;
    }
  };

  // repackingvalue in final price:
  const repackingFinal = (allItems) => {
    return allItems?.reduce((total, item) => {
      if (item?.needRepackaging) {
        const quantity = parseFloat(item?.quantity);
        if (!isNaN(quantity)) {
          return total + quantity * 2;
        }
      }
      return total;
    }, 0);
  };

  const personalShoppingTotal = (percentage, items) => {
    return (percentage / 100) * shoppingFinalPrice(items);
  };
  // console.log(personalShoppingTotal(),"personalShoppingTotal");

  const countOfTotalTax = (allItems) => {
    return allItems?.reduce((total, items) => {
      return total + (items?.tax ? items?.tax : 0);
    }, 0);
  };
  // console.log(countOfTotalTax(TotalFinalItems), "countOfTotalTax");

  // const funForRange = (weight) => {
  //   if (shippingSevicedata?.crowdShipperService === "crowdShipping") {
  //     const rangeobj = checkForThesoldRateRange(weight);
  //     const rangeobjPrice = rangeobj ? rangeobj?.price : 0;
  //     return rangeobjPrice;
  //   } else {
  //     let priceRangeShipping = newshippingdata?.weightPrice;
  //     if (weight >= 0 && weight <= 5) {
  //       return priceRangeShipping?.w_0_5;
  //     } else if (weight >= 6 && weight <= 10) {
  //       return priceRangeShipping?.w_6_10;
  //     } else if (weight >= 11 && weight <= 25) {
  //       return priceRangeShipping?.w_11_25;
  //     } else if (weight > 25) {
  //       return priceRangeShipping?.w_26;
  //     } else {
  //       return 0;
  //     }
  //   }
  // };

  const countOfTotalCustomizeRequestCost = (allItems) => {
    return allItems?.reduce(
      (total, items) => total + (items?.customizeRequestCost || 0),
      0
    );
  };

  // const countOfManualSortFee = (allItems) => {
  //   return (
  //     routerPartnerLogo?.manualSortFee &&
  //     allItems.filter((item) => item.isManualSort).length *
  //       routerPartnerLogo?.manualSortFee
  //   );
  // };
  // console.log(countOfManualSortFee(filteredItems), "countOfManualSortFee");

  // inspectionValue in final price:
  const inspectionsConditionFinal = (allItems) => {
    return allItems?.reduce(
      (totals, item) => {
        let totalCondition = totals.totalCondition || 0;
        let totalMeasurements = totals.totalMeasurements || 0;
        let totalStandard = totals.totalStandard || 0;

        if (item?.needInspection || item?.needRepackaging) {
          if (
            item?.inspectionCheckCondition === true ||
            item?.inspectionCheckCondition === "true"
          ) {
            const checkConditionquantity = parseFloat(item?.quantity);
            if (!isNaN(checkConditionquantity)) {
              totalCondition += checkConditionquantity * 5;
            }
          }
          if (
            item?.inspectionCheckMeasurements === true ||
            item?.inspectionCheckMeasurements === "true"
          ) {
            const checkMeasurementsquantity = parseFloat(item?.quantity);
            if (!isNaN(checkMeasurementsquantity)) {
              totalMeasurements += checkMeasurementsquantity * 5;
            }
          }
          if (
            item?.inspectionCheckStandardFunctionality === true ||
            item?.inspectionCheckStandardFunctionality === "true"
          ) {
            const checkStandardquantity = parseFloat(item?.quantity);
            if (!isNaN(checkStandardquantity)) {
              totalStandard += checkStandardquantity * 15;
            }
          }
        }
        return { totalCondition, totalMeasurements, totalStandard };
      },
      { totalCondition: 0, totalMeasurements: 0, totalStandard: 0 }
    );
  };
  const inspections = inspectionsConditionFinal(TotalFinalItems);
  const inspectionGrandTotal =
    inspections?.totalCondition +
      inspections?.totalMeasurements +
      inspections?.totalStandard || 0;

  const priceCounter = (totalDays) => {
    let days = totalDays - 30;
    let price = 0;
    let maxPrice = 5;
    while (days > 0) {
      days = days - 30;
      const tempPrice =
        0.5 *
        (TotalItemWeight(TotalFinalItems) +
          formik?.values?.finalPrice?.packagingWeight);
      console.log(maxPrice, "maxPrice");
      console.log(tempPrice, "tempPrice");
      price += tempPrice <= maxPrice ? tempPrice : maxPrice;
      console.log(price, "price");
    }
    return price;
  };

  const orderPriceCal = (itemdata, filteredData) => {
    // console.log(itemdata,"itemdata >>");
    if (itemdata?.arrivedAt) {
      const startdate = itemdata?.arrivedAt.toDate();
      const today = new Date();

      const timeDifferenceMs = today - startdate;

      const daysDifference = Math.floor(
        timeDifferenceMs / (24 * 60 * 60 * 1000)
      );

      // const daysDifference = 65;

      console.log(daysDifference, "daysDifference >>");

      const lengthTotal = filteredData.reduce(
        (total, item) => total + (item.length || 0),
        0
      );
      const widthTotal = filteredData.reduce(
        (total, item) => total + (item.width || 0),
        0
      );
      const heightTotal = filteredData.reduce(
        (total, item) => total + (item.height || 0),
        0
      );
      const dimTotal = filteredData.reduce(
        (total, item) => total + (item.dimTotal || 0),
        0
      );
      const total = parseFloat(
        ((lengthTotal * widthTotal * heightTotal) / 139).toFixed(2)
      );
      // console.log(lengthTotal, widthTotal, heightTotal, dimTotal, "call");

      setInitialValues((prev) => ({
        ...prev,
        finalPrice: {
          ...prev.finalPrice,
          // ...itemdata?.dimensionalWeightPrice,
          packagingWeight: itemdata?.packagingWeight || 0,
          storageDays: daysDifference,
          storageFeeTotal: priceCounter(daysDifference),
          // price: itemdata?.dimensionalWeightPrice?.price || 0,
          length: lengthTotal,
          width: widthTotal,
          height: heightTotal,
          total: total,
          price: dimTotal,
        },
      }));
    } else {
      setInitialValues((prev) => ({
        ...prev,
        finalPrice: {
          ...prev.finalPrice,
          // ...itemdata?.dimensionalWeightPrice,
          packagingWeight: itemdata?.packagingWeight || 0,
          storageDays: 0,
          storageFeeTotal: 0,
          // price: itemdata?.dimensionalWeightPrice?.price || 0,
          // length: 0,
          // width: 0,
          // height: 0,
          // total: 0,
          // price: 0,
        },
      }));
    }
  };

  const weightPriceCal = (event) => {
    // formik.handleChange(event);
    const { name, value } = event.target;
    formik.setFieldValue(name, +value || 0);
    // setOrderActiveData((prev) => ({
    //   ...prev,
    //   dimensionalWeightPrice: {
    //     ...prev?.dimensionalWeightPrice,
    //     [name.split(".")[1]]: +value || 0,
    //   },
    // }));

    const { length, width, height } = formik.values.finalPrice;
    const dimobj = {
      length: length || 0,
      width: width || 0,
      height: height || 0,
      [name.split(".")[1]]: +value || 0,
    };
    const totalInFinal = parseFloat(
      ((dimobj.length * dimobj.width * dimobj.height) / 139).toFixed(2)
    );
    formik.setFieldValue("finalPrice.total", totalInFinal);
  };

  const repackagingForCondition = repackingFinal(TotalFinalItems);

  const Finalbalance =
    shoppingFinalPrice(TotalFinalItems) +
    // (shippingSevicedata?.crowdShipperService === "crowdShipping"
    //   ? funForRange(shippingSevicedata?.bookedWeightPounds) *
    //     (TotalItemWeight(TotalFinalItems) +
    //       (formik?.values?.finalPrice?.packagingWeight || 0))
    //   : funForRange(
    //       TotalItemWeight(TotalFinalItems) +
    //         (formik?.values?.finalPrice?.packagingWeight || 0)
    //     ) *
    //     (TotalItemWeight(TotalFinalItems) +
    //       (formik?.values?.finalPrice?.packagingWeight || 0))) +
    inspectionGrandTotal +
    repackingFinal(TotalFinalItems) +
    personalShoppingTotal(
      personalShippingPercentageCounter(repackagingForCondition),
      TotalFinalItems
    ) +
    formik?.values?.finalPrice?.storageFeeTotal +
    // countOfManualSortFee(TotalFinalItems) +
    countOfTotalCustomizeRequestCost(TotalFinalItems) +
    countOfTotalTax(TotalFinalItems) +
    formik?.values?.finalPrice?.price;
  // (orderactiveData?.deliveryFees ? orderactiveData?.deliveryFees : 0) +
  // (shippingSevicedata?.crowdShipperService === "crowdShipping"
  //   ? shippingSevicedata?.buyInRate || 0
  //   : 0) +
  // (orderactiveData?.securityCheckFee
  //   ? orderactiveData?.securityCheckFee
  //   : 0) +
  // (orderactiveData?.tip ? orderactiveData?.tip : 0) +
  // (orderactiveData?.serviceFee ? orderactiveData?.serviceFee : 0) -
  // (orderactiveData?.amountReceived ? orderactiveData?.amountReceived : 0);

  return (
    <Box sx={{ marginLeft: "10px" }}>
      <label style={{ fontSize: "15px" }}>
        Computed final price for items, additional services, storage and fees
      </label>
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginRight: "12px",
            marginTop: "20px",
          }}
        >
          <label
            style={{
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Total items
          </label>
          <label style={{ fontWeight: "bold", fontSize: "16px" }}>
            {TotalItemsQuantity} items
          </label>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginRight: "12px",
            marginTop: "20px",
          }}
        >
          <label
            style={{
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Total shopping price
          </label>
          <label style={{ fontWeight: "bold", fontSize: "16px" }}>
            ${shoppingFinalPrice(TotalFinalItems)}
          </label>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginRight: "12px",
            marginTop: "20px",
          }}
        >
          <label
            style={{
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Personal shopping fee (
            {personalShippingPercentageCounter(repackingFinal(TotalFinalItems))}
            % of ${shoppingFinalPrice(TotalFinalItems)})
          </label>
          <label style={{ fontWeight: "bold", fontSize: "16px" }}>
            $
            {personalShoppingTotal(
              personalShippingPercentageCounter(
                repackingFinal(TotalFinalItems)
              ),
              TotalFinalItems
            ).toFixed(2)}
          </label>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginRight: "12px",
            marginTop: "20px",
          }}
        >
          <label
            style={{
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Total item tax
          </label>
          <label style={{ fontWeight: "bold", fontSize: "16px" }}>
            ${countOfTotalTax(TotalFinalItems)}
          </label>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginRight: "12px",
            marginTop: "20px",
          }}
        >
          <label
            style={{
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Total item weight
          </label>
          <label style={{ fontWeight: "bold", fontSize: "16px" }}>
            {TotalItemWeight(TotalFinalItems)} lb
          </label>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "5px",
          }}
        >
          <label
            style={{
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Packaging weight
          </label>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography>lb</Typography>
            <FormControl
              sx={{ m: 1, width: "92px", minHeight: "35px" }}
              size="small"
            >
              <OutlinedInput
                type="number"
                placeholder="Enter package weight"
                name="finalPrice.packagingWeight"
                disabled={pageName === "shippingComplete"}
                // disabled={
                //   orderactiveData?.status === "SHIP READY" ||
                //   orderactiveData?.status === "ENROUTE" ||
                //   orderactiveData?.status === "CLOSED" ||
                //   orderactiveData?.status === "CANCELED"
                // }
                value={formik.values.finalPrice.packagingWeight}
                onChange={(e) => {
                  formik.handleChange(e);
                  // setOrderActiveData((prev) => ({
                  //   ...prev,
                  //   packagingWeight: e.target.value,
                  // }));
                }}
              />
            </FormControl>
          </Box>
        </Box>
        {/* <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginRight: "12px",
            marginTop: "20px",
          }}
        >
          <label
            style={{
              fontSize: "16px",
            }}
          >
            Packaging weight price
          </label>
          <label style={{ fontWeight: "bold", fontSize: "16px" }}>
            $52
          </label>
        </Box> */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginRight: "12px",
            marginTop: "20px",
          }}
        >
          <label
            style={{
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Total shipping weight
          </label>
          <label style={{ fontWeight: "bold", fontSize: "16px" }}>
            {TotalItemWeight(TotalFinalItems) +
              formik?.values?.finalPrice?.packagingWeight}{" "}
            lb
          </label>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginRight: "12px",
            marginTop: "20px",
          }}
        >
          <Box>
            <label style={{ fontSize: "16px" }}>Price range met</label>
            <label style={{ fontWeight: "bold", fontSize: "16px" }}>
              (400 lb - 699 lb ~ $2)
            </label>
          </Box>
          <label style={{ fontWeight: "bold", fontSize: "16px" }}>$288</label>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginRight: "12px",
            marginTop: "20px",
          }}
        >
          <label
            style={{
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Additional services
          </label>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginRight: "12px",
            marginTop: "20px",
          }}
        >
          <label
            style={{
              fontSize: "16px",
            }}
          >
            Customize Request Fee
          </label>
          <label style={{ fontWeight: "bold", fontSize: "16px" }}>
            ${countOfTotalCustomizeRequestCost(TotalFinalItems) || 0}
          </label>
        </Box>
        {/* <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginRight: "12px",
            marginTop: "20px",
          }}
        >
          <label
            style={{
              fontSize: "16px",
            }}
          >
            Manual sort fee
          </label>
          <label style={{ fontWeight: "bold", fontSize: "16px" }}>${countOfManualSortFee(TotalFinalItems) || 0}</label>
        </Box> */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginRight: "12px",
            marginTop: "20px",
          }}
        >
          <Box>
            <label style={{ fontSize: "16px" }}>Inspection</label>
            <label style={{ fontWeight: "bold", fontSize: "16px" }}>
              (${inspectionGrandTotal})
            </label>
            <label style={{ fontSize: "16px" }}>Repackaging</label>
            <label style={{ fontWeight: "bold", fontSize: "16px" }}>
              (${repackingFinal(TotalFinalItems)})
            </label>
          </Box>
          <label style={{ fontWeight: "bold", fontSize: "16px" }}>
            ${inspectionGrandTotal + repackingFinal(TotalFinalItems)}
          </label>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginRight: "12px",
            marginTop: "20px",
          }}
        >
          <label
            style={{
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Delivery method
          </label>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginRight: "12px",
            marginTop: "20px",
          }}
        >
          <label
            style={{
              fontSize: "16px",
            }}
          >
            Door to Door
          </label>
          <label style={{ fontWeight: "bold", fontSize: "16px" }}>$0</label>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginRight: "12px",
            marginTop: "20px",
          }}
        >
          <label
            style={{
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Total Storage fee
          </label>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginRight: "12px",
            marginTop: "20px",
          }}
        >
          <Box>
            <label style={{ fontSize: "16px" }}>
              This order was in storage for
            </label>
            <label style={{ fontWeight: "bold", fontSize: "16px" }}>
              {formik.values.finalPrice.storageDays} days
            </label>
          </Box>
          <label style={{ fontWeight: "bold", fontSize: "16px" }}>
            ${formik.values.finalPrice.storageFeeTotal}
          </label>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginRight: "12px",
            marginTop: "20px",
          }}
        >
          <label
            style={{
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Dimention weight price
          </label>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
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
                    placeholder="Length"
                    name="finalPrice.length"
                    disabled={pageName === "shippingComplete"}
                    // disabled={
                    //   orderactiveData?.status === "SHIP READY" ||
                    //   orderactiveData?.status === "ENROUTE" ||
                    //   orderactiveData?.status === "CLOSED" ||
                    //   orderactiveData?.status === "CANCELED"
                    // }
                    value={formik.values.finalPrice.length}
                    onChange={weightPriceCal}
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
                    placeholder="Width"
                    name="finalPrice.width"
                    disabled={pageName === "shippingComplete"}
                    // disabled={
                    //   orderactiveData?.status === "SHIP READY" ||
                    //   orderactiveData?.status === "ENROUTE" ||
                    //   orderactiveData?.status === "CLOSED" ||
                    //   orderactiveData?.status === "CANCELED"
                    // }
                    value={formik.values.finalPrice.width}
                    onChange={weightPriceCal}
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
                    placeholder="Height"
                    name="finalPrice.height"
                    disabled={pageName === "shippingComplete"}
                    // disabled={
                    //   orderactiveData?.status === "SHIP READY" ||
                    //   orderactiveData?.status === "ENROUTE" ||
                    //   orderactiveData?.status === "CLOSED" ||
                    //   orderactiveData?.status === "CANCELED"
                    // }
                    value={formik.values.finalPrice.height}
                    onChange={weightPriceCal}
                  />
                </FormControl>
              </Box>
              <Typography>=</Typography>
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
                    type="text"
                    id="finalPrice.total"
                    placeholder="11"
                    name="finalPrice.total"
                    onChange={formik.handleChange}
                    value={formik.values.finalPrice.total}
                    disabled
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
            marginTop: "5px",
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
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography>$</Typography>
            <FormControl
              sx={{ m: 1, width: "92px", minHeight: "35px" }}
              size="small"
            >
              <OutlinedInput
                type="number"
                placeholder="Enter price"
                name="finalPrice.price"
                value={formik.values.finalPrice.price}
                onChange={weightPriceCal}
                defaultValue={0}
                disabled={pageName === "shippingComplete"}
                // disabled={
                //   orderactiveData?.status === "SHIP READY" ||
                //   orderactiveData?.status === "ENROUTE" ||
                //   orderactiveData?.status === "CLOSED" ||
                //   orderactiveData?.status === "CANCELED"
                // }
              />
            </FormControl>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginRight: "12px",
            marginTop: "20px",
          }}
        >
          <label
            style={{
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Onetime security check fee
          </label>
          <label style={{ fontWeight: "bold", fontSize: "16px" }}>$4.99</label>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginRight: "12px",
            marginTop: "20px",
          }}
        >
          <label
            style={{
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Tip
          </label>
          <label style={{ fontWeight: "bold", fontSize: "16px" }}>$8.00</label>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginRight: "12px",
            marginTop: "20px",
          }}
        >
          <label
            style={{
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Service fee
          </label>
          <label style={{ fontWeight: "bold", fontSize: "16px" }}>$7.99</label>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginRight: "12px",
            marginTop: "20px",
          }}
        >
          <label
            style={{
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Buy-in-rate
          </label>
          <label style={{ fontWeight: "bold", fontSize: "16px" }}>$5.00</label>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginRight: "12px",
            marginTop: "20px",
          }}
        >
          <label
            style={{
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Amount Received
          </label>
          <label style={{ fontWeight: "bold", fontSize: "16px" }}>
            $569.11
          </label>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginRight: "12px",
            marginTop: "20px",
          }}
        >
          <label
            style={{
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Remeining Balance
          </label>
          <label style={{ fontWeight: "bold", fontSize: "16px" }}>
            ${Finalbalance.toFixed(2)}
          </label>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "10px",
          }}
        >
          <Button
            variant="contained"
            // disabled={
            //   orderactiveData?.status === "SHIP READY" ||
            //   orderactiveData?.status === "ENROUTE" ||
            //   orderactiveData?.status === "CLOSED" ||
            //   orderactiveData?.status === "CANCELED"
            // }
            // onClick={() => finalPriceSectionSubmit()}
            sx={{
              width: "200px",
              marginTop: "20px",
              borderRadius: "4px",
            }}
            disabled={pageName === "shippingComplete"}
          >
            Submit for payment
          </Button>
          {/* <Button
            disabled={
              orderactiveData?.status === "SHIP READY" ||
              orderactiveData?.status === "ENROUTE" ||
              orderactiveData?.status === "CLOSED" ||
              orderactiveData?.status === "CANCELED"
            }
            onClick={() => finalPriceSectionSubmit()}
          >
            Issue Refund
          </Button> */}
        </Box>
      </Box>
    </Box>
  );
}
