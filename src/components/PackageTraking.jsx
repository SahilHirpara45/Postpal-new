import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import EditPackageDrawer from "./EditPackageDrawer";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import edit from "../assets/svg/edit.svg";
import slip from "../assets/svg/slip.svg";
import arrow from "../assets/svg/arrow-down-circle.svg";
import AccordionViaTableRowName from "./AccordionViaTableRowName";
import PackageStatus from "./PackageStatus";
import SerialNumber from "./SerialNumber";
import PackageDetails from "./PackageDetails";
import CustomTable from "./CustomTable";
import { addMilliseconds, format, fromUnixTime } from "date-fns";
import { arrayRemove, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import SelectionTag from "./SelectionTag";
import SimpleBar from "simplebar-react";
import { toast } from "react-toastify";
import { calculateTotalValues } from "../pages/Shipment/shippingRequest/helper";
import Slip from "../pages/Shipment/Packages/Slip";
import IncidentReport from "../pages/Shipment/Packages/IncidentReport";

function PackageTraking({
  packageActiveData = {},
  collection,
  shipmentCollection,
  steps = [],
  activeStep,
  pageName,
  userActiveData,
  userName,
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeDataName, setActiveDataName] = useState(false);
  const [activeDataImage, setActiveDataImage] = useState("");
  const [drawerForAddons, setDrawerOpenForAddOns] = useState(false);
  const [drawerForCustomIQ, setDrawerOpenForCustomIQ] = useState(false);
  const [labelForAddOnDrawer, setLabelForAddOnDrawer] = useState("");
  const [labelForCustomIQDrawer, setLabelForCustomIQDrawer] = useState("");
  const [packageItems, setPackageItems] = useState([]);
  const [editPackageData, setEditPackageData] = useState({});
  const [barcodeValue, setBarcodeValue] = useState("");
  const [slipValue, setSlipValue] = useState("");
  const [dateForSlip, setDateForSlip] = useState();
  const slipRef = useRef();

  console.log("packageActiveData : ", packageActiveData, collection);
  console.log(userActiveData, "userActiveData");
  // console.log("pageName", pageName);

  const generateRandomBarcodeValue = () => {
    return Math.floor(100000000 + Math.random() * 900000000).toString();
  };

  const generateSlipNumber = () => {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    return randomNumber;
  };

  useEffect(() => {
    setBarcodeValue(generateRandomBarcodeValue());
    setSlipValue(generateSlipNumber());
  }, []);

  useEffect(() => {
    if (
      packageActiveData?.arrivedAt !== null &&
      packageActiveData?.arrivedAt?.seconds
    ) {
      let date;
      if (packageActiveData?.arrivedAt?.seconds) {
        date = fromUnixTime(packageActiveData?.arrivedAt?.seconds);
      }

      setDateForSlip(format(new Date(date), "MM.dd.yyyy"));
    }
  }, [packageActiveData?.arrivedAt]);

  useEffect(() => {
    const fetchItemData = async () => {
      if (
        (packageActiveData && Object.keys(packageActiveData).length === 0) ||
        (packageActiveData?.packageItemIds &&
          packageActiveData?.packageItemIds?.length === 0)
      )
        return;
      const itemIdArray = packageActiveData?.packageItemIds;
      console.log(itemIdArray, "itemIdArray");
      const itemPromises =
        itemIdArray?.length > 0 &&
        itemIdArray?.map(async (itemId) => {
          if (!itemId) return null;
          const itemDocRef = doc(db, "items", itemId);
          const itemDocSnap = await getDoc(itemDocRef);

          if (itemDocSnap.exists()) {
            return itemDocSnap.data();
          }
        });

      const arr = itemPromises && (await Promise.all(itemPromises));
      // console.log(arr, "arr");
      setPackageItems(arr);
    };

    fetchItemData();
  }, [packageActiveData, packageActiveData?.packageItemIds]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const headCells = [
    { id: "no", label: "No" },
    { id: "name", label: "Item Name" },
    {
      id: "qty",
      label: "Qty",
      align: "right",
    },
    {
      id: "addons",
      label: "Add-ons",
      align: "right",
    },
    {
      id: "customsIQ",
      label: "CustomsIQ",
      align: "right",
    },
  ];

  function createData(
    no,
    item_img,
    itemId,
    name,
    fullName,
    subCategory,
    category,
    qty,
    addons,
    customsIQ,
    path
  ) {
    return {
      no,
      item_img,
      itemId,
      name,
      fullName,
      subCategory,
      category,
      qty,
      addons,
      customsIQ,
      path,
    };
  }

  const rows =
    packageItems.length > 0 &&
    packageItems?.map((item, index) => {
      return createData(
        index + 1,
        item?.itemImageURL,
        item?.id,
        item?.shortenedName,
        item?.name,
        item?.subcategory,
        item?.category,
        item?.quantity,
        item?.addonsList,
        item?.customiqRestrictions,
        arrow
      );
    });
  console.log(packageItems, "packageItems");
  const toggleDrawer = (packageActiveData) => {
    if (drawerOpen) {
      // Clear the drawer data when closing
      setEditPackageData({});
    } else {
      setEditPackageData(packageActiveData);
    }
    setDrawerOpen(!drawerOpen);
  };
  console.log(editPackageData, "editPackageData");

  const toggleDrawerAddOns = (data) => {
    if (drawerForAddons) {
      setLabelForAddOnDrawer("");
      setDrawerOpenForAddOns(!drawerForAddons);
    } else {
      setLabelForAddOnDrawer(data);
      setDrawerOpenForAddOns(!drawerForAddons);
    }
  };

  const toggleDrawerCustomIQ = (data) => {
    if (drawerForCustomIQ) {
      setLabelForCustomIQDrawer("");
      setDrawerOpenForCustomIQ(!drawerForCustomIQ);
    } else {
      setLabelForCustomIQDrawer(data);
      setDrawerOpenForCustomIQ(!drawerForCustomIQ);
    }
  };

  const handleBackButton = () => {
    setActiveDataName(false);
  };

  const handlePreparedShipment = async (packageId) => {
    console.log(packageId, "packageId");

    if (pageName === "consolidateRequest" && !packageId) {
      const docRef = doc(db, "shelfConsolidatedPackages", userActiveData?.id);
      const removePackageIds = userActiveData.removePackageIds || [];
      // console.log(removePackageIds, "removePackageIds");

      try {
        const docData = userActiveData;
        removePackageIds?.map(async (id) => {
          const docRef = doc(db, "shelfPackages", id);
          await updateDoc(docRef, {
            isPackageConsolidated: false,
          });
        });
        // Remove packageIds and removePackageIds
        const updatedPackageIds = docData.packageIds.filter(
          (id) => !removePackageIds.includes(id)
        );
        const updatedRemovePackageIds = docData.removePackageIds.filter(
          (id) => !removePackageIds.includes(id)
        );

        const updatedConsolidation = await calculateTotalValues(
          updatedPackageIds
        );

        // Update the document with the new arrays
        await updateDoc(docRef, {
          packageShipmentStatus: "PREPARED",
          preparedShipmentDate: new Date(),
          packageIds: updatedPackageIds,
          removePackageIds: [],
          packageItemIds: updatedConsolidation?.packageItemIds,
          totalAmount: updatedConsolidation?.totalAmount,
          totalWeight: updatedConsolidation?.totalWeight,
          merchantCount: updatedConsolidation?.merchantCount,
        });

        toast.success("Consolidated request prepared successfully");
        // Fetch updated data
        const updatedDoc = await getDoc(docRef);
        const updatedData = updatedDoc.data();
        console.log("Updated Data:", updatedData);
      } catch (err) {
        console.log(err);
        toast.error("Something went wrong");
      }
    } else {
      if (!packageId) return;
      updateDoc(doc(db, "shelfPackages", packageId), {
        packageShipmentStatus: "PREPARED",
        preparedShipmentDate: new Date(),
      })
        .then((res) => {
          toast.success("Shipment prepared successfully");
        })
        .catch((err) => {
          console.log(err);
          toast.error("Something went wrong");
        });
    }
  };

  // const handleDownload = async () => {
  //   const element = slipRef.current;

  //   // Increase the scale for higher resolution
  //   const scale = 3;
  //   const canvas = await html2canvas(element, { scale });
  //   const data = canvas.toDataURL("image/png");

  //   const pdf = new jsPDF({
  //     orientation: "portrait",
  //     unit: "mm",
  //     format: [80, 80],
  //   });

  //   const imgProperties = pdf.getImageProperties(data);
  //   const pdfWidth = 80;
  //   const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

  //   pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
  //   pdf.save("slip.pdf");
  // };

  const handleDownload = async () => {
    try {
      const element = slipRef.current;

      // Capture the element as a canvas
      const scale = 3; // Higher scale for better quality
      const canvas = await html2canvas(element, {
        scale,
        backgroundColor: "#fff", // Ensure background color
      });

      // Log the original canvas size
      const originalWidth = 945;
      const originalHeight = 591;
      console.log(
        `Original Width: ${originalWidth}, Original Height: ${originalHeight}`
      );

      // Create a new canvas with the same size
      const scaledCanvas = document.createElement("canvas");
      scaledCanvas.width = originalWidth;
      scaledCanvas.height = originalHeight;
      const context = scaledCanvas.getContext("2d");

      // Draw the original canvas onto the new canvas
      context.drawImage(canvas, 0, 0, originalWidth, originalHeight);

      // Convert the scaled canvas to a data URL
      const dataURL = scaledCanvas.toDataURL("image/png");

      // Create a link element and set it to download the image
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "slip.png";

      // Append the link to the body to ensure it works across browsers
      document.body.appendChild(link);

      // Trigger the download by simulating a click
      link.click();

      // Remove the link after the download
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  // const handleDownload = async () => {
  //   try {
  //     const element = slipRef.current;

  //     // Increase the scale for higher resolution
  //     const scale = 3;
  //     const canvas = await html2canvas(element, { scale });
  //     const data = canvas.toDataURL("image/png");

  //     // Define custom paper size in millimeters
  //     const paperWidth = 80; // Width in mm
  //     const paperHeight = 50; // Height in mm

  //     const pdf = new jsPDF({
  //       orientation: "landscape", // or "landscape/portrait"
  //       unit: "mm",
  //       format: [paperWidth, paperHeight], // Set the paper size
  //     });

  //     const imgProperties = pdf.getImageProperties(data);
  //     const pdfWidth = paperWidth;
  //     const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
  //     console.log(paperWidth,paperHeight);
  //     console.log(pdfWidth,pdfHeight);

  //     pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
  //     pdf.save("slip.pdf");
  //   } catch (error) {
  //     console.error("Error generating PDF:", error);
  //   }
  // };

  return (
    <>
      {!activeDataName && (
        <Box sx={{ paddingTop: "16px", paddingRight: "20px" }}>
          <Box sx={{ marginLeft: "20px", mb: "16px" }}>
            <Typography variant="h5">
              Tracking: {packageActiveData?.trackingNumber}
            </Typography>
          </Box>
          <PackageStatus steps={steps} activeStep={activeStep} />
          <SerialNumber
            SerialNumber={packageActiveData?.serialNumber || "-"}
            packageTotalAmount={packageActiveData?.packageTotalAmount}
          />
          <PackageDetails packageActiveData={packageActiveData} />
          <Box
            sx={{
              marginTop: "40px",
              display: "flex",
              justifyContent: "center",
              borderBottom: "1px solid #E5E5E8",
              paddingBottom: "30px",
              flexWrap: "wrap",
            }}
          >
            {pageName !== "shippingComplete" && (
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "white",
                  color: "#481AA3",
                  marginLeft: "10px",
                  border: "1px solid #E5E5E8",
                  borderRadius: "4px",
                  boxShadow: "none",
                  whiteSpace: "nowrap",
                  marginTop: "20px",
                  "&:hover": {
                    outline: "none",
                    color: "#481AA3",
                    backgroundColor: "white", // Remove border color on focus
                  },
                }}
                onClick={() => toggleDrawer(packageActiveData)}
              >
                <img src={edit} alt="star" style={{ marginRight: "10px" }} />
                Edit Package Details
              </Button>
            )}
            <EditPackageDrawer
              editPackage={editPackageData}
              open={drawerOpen}
              onClose={toggleDrawer}
              collectionName={collection}
              shipmentCollectionName={shipmentCollection}
              shipmentData={userActiveData}
            />
            <Box sx={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
              <Slip
                ref={slipRef}
                name={packageActiveData?.suiteNumber ? userName : "No Name"}
                date={dateForSlip}
                suiteNumber={
                  packageActiveData?.suiteNumber
                    ? packageActiveData?.suiteNumber
                    : "No Suite"
                }
                packageId={
                  packageActiveData?.packageId && packageActiveData?.packageId
                }
                barcodeValue={
                  packageActiveData?.serialNumber
                    ? packageActiveData?.serialNumber
                    : barcodeValue
                }
              />
            </Box>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "white",
                color: "#481AA3",
                marginLeft: "10px",
                border: "1px solid #E5E5E8",
                boxShadow: "none",
                borderRadius: "4px",
                whiteSpace: "nowrap",
                marginTop: "20px",
                "&:hover": {
                  outline: "none",
                  color: "#481AA3",
                  backgroundColor: "white", // Remove border color on focus
                },
              }}
              onClick={handleDownload}
            >
              <img src={slip} alt="slip" style={{ marginRight: "10px" }} />
              Receiving Slip
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                userActiveData?.labelUrl &&
                  window.open(userActiveData?.labelUrl, "_blank");
              }}
              disabled={
                pageName === "packages" ||
                pageName === "shippingRequest" ||
                pageName === "consolidateRequest" ||
                pageName === "shopping request" ||
                pageName === "expressRequest" ||
                pageName === "NoSuites" ||
                pageName === "Abandoned"
              }
              sx={{
                backgroundColor: "white",
                color: "#481AA3",
                marginLeft: "10px",
                border: "1px solid #E5E5E8",
                boxShadow: "none",
                borderRadius: "4px",
                whiteSpace: "nowrap",
                marginTop: "20px",
                "&:hover": {
                  outline: "none",
                  color: "#481AA3",
                  backgroundColor: "white", // Remove border color on focus
                },
              }}
            >
              <img src={slip} alt="slip" di style={{ marginRight: "10px" }} />
              Shipping Label
            </Button>
            {(pageName === "shippingRequest" ||
              pageName === "expressRequest" ||
              pageName === "consolidateRequest") && (
              <Button
                variant="contained"
                onClick={() => handlePreparedShipment(packageActiveData?.id)}
                disabled={
                  packageActiveData?.packageShipmentStatus === "PREPARED" ||
                  (pageName === "consolidateRequest" &&
                    (!packageActiveData?.dimensionH ||
                      !packageActiveData?.dimensionW ||
                      !packageActiveData?.dimensionL))
                }
                sx={{
                  backgroundColor: "white",
                  color: "#481AA3",
                  marginLeft: "10px",
                  border: "1px solid #E5E5E8",
                  boxShadow: "none",
                  borderRadius: "4px",
                  whiteSpace: "nowrap",
                  marginTop: "20px",
                  "&:hover": {
                    outline: "none",
                    color: "#481AA3",
                    backgroundColor: "white", // Remove border color on focus
                  },
                }}
              >
                Prepared Shipment
              </Button>
            )}
          </Box>
          {/* <IncidentReport /> */}
          {packageActiveData?.serialNumber && (
            <SelectionTag packageActiveData={packageActiveData} />
          )}
          <Box
            sx={{
              borderBottom: "1px solid #E5E5E8",
              paddingBottom: "30px",
            }}
          >
            <Box sx={{ marginLeft: "20px", marginTop: "20px" }}>
              <h1
                style={{
                  textAlign: "left",
                  fontSize: " 26px",
                  fontWeight: "bold",
                }}
              >
                Package images
              </h1>
            </Box>
            <SimpleBar
              forceVisible="x"
              autoHide={true}
              style={{
                overflowX: "auto",
              }}
              className="custom-scrollbar"
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "20px",
                  marginTop: "20px",
                }}
              >
                {packageActiveData?.packageImages?.map((url, index) => (
                  <Box sx={{ marginRight: "20px" }}>
                    {url ? (
                      <img
                        src={url}
                        alt="package"
                        key={index}
                        style={{
                          height: "120px",
                          width: "120px",
                          minWidth: "120px",
                          minHeight: "120px",
                          maxWidth: "120px",
                          maxHeight: "120px",
                        }}
                      />
                    ) : (
                      "-"
                    )}
                  </Box>
                ))}
              </Box>
            </SimpleBar>
          </Box>
          <Box sx={{ paddingBottom: "30px" }}>
            <Box sx={{ marginLeft: "20px", marginTop: "20px" }}>
              <h1
                style={{
                  textAlign: "left",
                  fontSize: " 26px",
                  fontWeight: "bold",
                }}
              >
                Item List
              </h1>
            </Box>
            {rows && (
              <CustomTable
                rows={rows}
                headCells={headCells}
                setActiveDataName={setActiveDataName}
                setActiveDataImage={setActiveDataImage}
                packageActiveData={packageActiveData}
                userActiveData={userActiveData}
                packageCollection={collection}
                shipmentCollection={shipmentCollection}
              />
            )}
          </Box>
        </Box>
      )}
      {activeDataName && (
        <AccordionViaTableRowName
          handleBack={handleBackButton}
          id={activeDataName}
          packageActiveData={packageActiveData}
          pageName={pageName}
          packageCollection={collection}
          shipmentCollection={shipmentCollection}
        />
      )}
    </>
  );
}

export default PackageTraking;
