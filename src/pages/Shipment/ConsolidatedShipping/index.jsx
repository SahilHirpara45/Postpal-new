import React, { useContext, useState } from "react";
import { Box, Grid } from "@mui/material";
import Button from "@mui/material/Button";
import ReceivingWorkStationDrawer from "../../../components/ReceivingWorkStationDrawer";
import PageHeader from "../../../components/PageHeader";
import PackageTraking from "../../../components/PackageTraking";
import PackageSplit from "../../../components/PackageSplit";
import SidebarContext from "../../../context/SidebarContext";
import SimpleBar from "simplebar-react";
import SelectConsolidatedPackage from "./SelectConsolidatedPackage";
import AllCondidatedOrders from "./AllCondidatedOrders";
import Consolidate from "../shippingRequest/Consolidate";
import OrderHistory from "../../../components/common/History/OrderHistory";
import OrderChats from "../../../components/common/orderChat/OrderChats";

const ConsolidatedShipping = () => {
  const { open } = useContext(SidebarContext);

  const [userActiveData, setUserActiveData] = useState({});
  const [packageActiveData, setPackageActiveData] = useState({});
  const [selectedPackages, setSelectedPackages] = useState([]);

  const [activeContent, setActiveContent] = useState({
    component: "Actions",
    data: undefined,
  });

  const chatClickHandler = async (e, id, item) => {
    e.stopPropagation();
    setActiveContent({ component: "Chats", data: id });
    setPackageActiveData(item);
  };

  const historyClickHandler = async (id, item, e) => {
    e.stopPropagation();
    setActiveContent({ component: "History", data: id });
    setPackageActiveData(item);
  };

  const userClickHandler = async (id, item) => {
    // console.log("user click handler", item);
    setActiveContent({ component: "", data: item });
    setUserActiveData(item);
    setSelectedPackages([]); // Deselect all packages
    // setPackageActiveData({}); // Reset packageActiveData to an empty object
    setPackageActiveData({
      trackingNumber: "",
      serialNumber: item?.serialNumber,
      packageTotalAmount: item?.totalAmount,
      packageTotalWeight: item?.totalWeight,
      packageTrackingId: item?.id,
      merchantCount: item?.merchantCount,
      merchantIndicator: item?.merchantIndicator,
      nickName: item?.consolidatedPackageName,
      dimensionL: item?.dimensionL,
      dimensionW: item?.dimensionW,
      dimensionH: item?.dimensionH,
      packageItemIds: item?.packageItemIds,
      shelfId: item?.shelfId,
      expectedDate: item?.expectedDate,
      shipOn: item?.shipOn,
      shipMethod: item?.shipMethod,
    });
  };

  const packageClickHandler = async (id, item) => {
    setActiveContent({ component: "Actions", data: id });
    setPackageActiveData(item);
  };

  const closeHistoryHandler = () => {
    setActiveContent({ component: "Actions", data: undefined });
  };

  const steps = [
    {
      label: "Requested",
      date: packageActiveData?.packageShipmentCreationDate
        ? new Date(
            packageActiveData?.packageShipmentCreationDate?.seconds * 1000
          ).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
        : "-",
    },
    {
      label: "Packing",
      date: packageActiveData?.preparedShipmentDate
        ? new Date(
            packageActiveData?.preparedShipmentDate?.seconds * 1000
          ).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
        : "-",
    },
    {
      label: "Send",
      date: "-",
    },
    { label: "Done", date: "-" },
  ];
  const activeStep = packageActiveData?.isPackageAddedToShipment ? 2 : 1;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "96vh",
        margin: "20px",
        marginRight: "0px",
        width: open === true ? "calc(98vw - 240px)" : "calc(98vw - 80px)",
        // width: {
        //   xl: open === true ? "calc(98vw - 240px)" : "96vw",
        // },
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "12px",
      }}
    >
      <Box sx={{ borderBottom: "1px solid #E5E5E8" }}>
        <PageHeader pageTitle={"Consolidated Shipping"} />
      </Box>
      <Box sx={{ flex: 1, backgroundColor: "white" }}>
        <Grid
          container
          spacing={0}
          sx={{
            width: open === false ? "calc(97vw - 80px)" : "calc(97vw - 240px)",
          }}
        >
          <Grid item xs={12} sm={12} md={3} lg={3}>
            <AllCondidatedOrders
              userClickHandler={userClickHandler}
              userActiveData={userActiveData}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={3}
            lg={3}
            sx={{
              borderLeft: "1px solid #E5E5E8",
              borderRight: "1px solid #E5E5E8",
            }}
          >
            <SelectConsolidatedPackage
              userActiveData={userActiveData}
              packageClickHandler={packageClickHandler}
              packageActiveData={packageActiveData}
              setSelectedPackages={setSelectedPackages}
              selectedPackages={selectedPackages}
              historyClickHandler={historyClickHandler}
              chatClickHandler={chatClickHandler}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            sx={{
              borderLeft: "1px solid #E5E5E8",
              height: "86vh",
              // overflowY: "auto",
            }}
          >
            <SimpleBar
              forceVisible="y"
              autoHide={true}
              style={{
                maxHeight: "88vh",
                ".simplebar-scrollbar": {
                  background: "red",
                },
              }}
              className="custom-scrollbar"
            >
              {activeContent.component === "Chats" && (
                <OrderChats
                  userActiveData={userActiveData}
                  packageActiveData={packageActiveData}
                  closeHistory={closeHistoryHandler}
                />
              )}
              {activeContent.component === "History" && (
                <OrderHistory
                  closeHistory={closeHistoryHandler}
                  packageActiveData={packageActiveData}
                />
              )}
              {(activeContent.component === "Actions" ||
                activeContent.data?.serialNumber) &&
                selectedPackages.length === 0 && (
                  <PackageTraking
                    packageActiveData={packageActiveData}
                    collection={
                      activeContent.data?.serialNumber
                        ? "shelfConsolidatedPackages"
                        : "shelfPackages"
                    }
                    shipmentCollection="shelfConsolidatedPackages"
                    steps={steps}
                    activeStep={activeStep}
                    pageName="consolidateRequest"
                    userActiveData={userActiveData}
                  />
                )}
              {/* <PackageSplit /> */}
              {(selectedPackages.length > 0 ||
                (!activeContent.data?.serialNumber &&
                  activeContent.data?.serialNumber !== null &&
                  activeContent.component !== "Actions")) && (
                <Consolidate
                  selectedPackages={selectedPackages}
                  userActiveData={userActiveData}
                />
              )}
            </SimpleBar>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ConsolidatedShipping;
