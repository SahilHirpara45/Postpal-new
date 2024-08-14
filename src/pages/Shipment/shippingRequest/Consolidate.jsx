import { Icon } from "@iconify/react/dist/iconify.js";
import { Box, Button, Typography } from "@mui/material";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../../../firebaseConfig";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { calculateTotalValues } from "./helper";

const Consolidate = ({ selectedPackages, userActiveData }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [consolidatePackageData, setConsolidatePackageData] = useState({});
  const [newTotalValues, setNewTotalValues] = useState({});
  // console.log("Consolidate: ", selectedPackages);
  // console.log("userActiveData: ", userActiveData);

  useEffect(() => {
    getConsolidatePackageData();
  }, [userActiveData]);

  useEffect(() => {
    const fn = async () => {
      setErrorMessage("");
      const returnData = await calculateTotalValues(selectedPackages);
      console.log(returnData, "returnData");
      setNewTotalValues(returnData);
    };
    fn();
  }, [selectedPackages?.length]);

  const getConsolidatePackageData = () => {
    try {
      getDoc(doc(db, "shelfConsolidatedPackages", userActiveData.id)).then(
        async (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setConsolidatePackageData({ ...data, id: userActiveData.id });
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  console.log(newTotalValues, "newTotalValues");

  const consolidatepackageStore = async () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2); // Get the last two digits of the year
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Get the month and pad with leading zero if needed

    if (
      selectedPackages?.length === consolidatePackageData.packageIds?.length
    ) {
      getDoc(doc(db, "masterData", "packageSetting")).then(async (docSnap) => {
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
          try {
            const docRef = await updateDoc(
              doc(db, "shelfConsolidatedPackages", consolidatePackageData?.id),
              {
                serialNumber:
                  consolidatePackageData?.serialNumber ||
                  `${year}-${month}${
                    changeMonth || changeYear
                      ? "1".padStart(6, "0")
                      : docData.currentSerialId.toString().padStart(6, "0")
                  }`,
                // dimensionH: newTotalValues.height,
                // dimensionL: newTotalValues.length,
                // dimensionW: newTotalValues.width,
                totalAmount: newTotalValues.totalAmount,
                totalWeight: newTotalValues.totalWeight,
                packageItemIds: newTotalValues.packageItemIds,
                packageShipmentStatus: "PREPARED",
                preparedShipmentDate: new Date(),
                merchantCount: newTotalValues.merchantCount,
              }
            ).then(() => {
              toast.success("Consolidated Successfully");
              if (!consolidatePackageData?.serialNumber) {
                updateDoc(doc(db, "masterData", "packageSetting"), {
                  currentSerialId:
                    changeMonth || changeYear
                      ? 2
                      : docData.currentSerialId + docData.incrementBy,
                  currentYear: parseFloat(newYear),
                  currentMonth: parseFloat(newMonth),
                });
              }
              getConsolidatePackageData();
            });
          } catch (e) {
            toast.error("Failed to Consolidate");
            console.error("Error adding document: ", e);
          }
        }
      });
    } else {
      const unscannedPackages = consolidatePackageData.packageIds
        ?.filter((item) => !selectedPackages.includes(item))
        .join(", ");
      // toast.error("Packages not yet scanned: " + unscannedPackages);
      setErrorMessage(`${unscannedPackages} package(s) is yet to be scanned`);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          height: "125px",
          width: "125px",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#F1F1F1",
        }}
      >
        <Icon icon="fa-solid:boxes" width={62} />
      </Box>
      <Typography
        variant="subtitle1"
        sx={{
          textAlign: "center",
          mt: "16px",
          fontWeight: 700,
          fontSize: "16px",
        }}
      >
        {selectedPackages.length > 1
          ? `${selectedPackages.length} packages selected`
          : `${selectedPackages.length} package selected`}
      </Typography>
      <Button
        variant="contained"
        type="submit"
        onClick={consolidatepackageStore}
        disabled={selectedPackages.length < 1}
        sx={{ width: "200px", mt: "16px", height: "48px" }}
      >
        Consolidate
      </Button>
      {errorMessage && (
        <Typography
          variant="body1"
          color="error"
          sx={{
            textAlign: "center",
            mt: "8px",
            fontWeight: 700,
            fontSize: "14px",
          }}
        >
          {errorMessage}
        </Typography>
      )}
    </Box>
  );
};

export default Consolidate;
