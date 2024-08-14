import React, { useContext, useState } from "react";
import { Box, Grid } from "@mui/material";
import PageHeader from "../../../components/PageHeader";
import PackageTraking from "../../../components/PackageTraking";
import SidebarContext from "../../../context/SidebarContext";
import SimpleBar from "simplebar-react";
import AllUserComplete from "./AllUserComplete";
import CompletePackages from "./CompletePackages";
import OrderChats from "../../../components/common/orderChat/OrderChats";

function ShippingComplete() {
  const { open } = useContext(SidebarContext);
  const [userActiveData, setUserActiveData] = useState({});
  const [packageActiveData, setPackageActiveData] = useState({});

  const [activeContent, setActiveContent] = useState({
    component: "Actions",
    data: undefined,
  });

  const chatClickHandler = async (e, id, item) => {
    e.stopPropagation();
    setActiveContent({ component: "Chats", data: id });
    setUserActiveData(item);
  };

  const userClickHandler = async (id, item) => {
    console.log("user click handler", item);
    setActiveContent({ component: "Actions", data: id });
    setUserActiveData(item);
    setPackageActiveData({});
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
      label: packageActiveData?.packageShipmentRequestDate
        ? new Date(
            packageActiveData?.packageShipmentRequestDate?.seconds * 1000
          ).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
        : "-",
      date: "-",
    },
    { label: "Done", date: "-" },
  ];

  console.log("userActiveData", userActiveData);
  // console.log("packageActiveData", packageActiveData);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "96vh",
        margin: "20px",
        marginRight: "0px",
        width: open === true ? "calc(98vw - 240px)" : "calc(98vw - 80px)",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "12px",
      }}
    >
      <PageHeader pageTitle={"Shipping Complete"} />
      <Box
        sx={{
          flex: 1,
          backgroundColor: "white",
          borderTop: "1px solid #E5E5E8",
        }}
      >
        <Grid
          container
          spacing={0}
          sx={{
            width: open === false ? "calc(97vw - 80px)" : "calc(97vw - 240px)",
          }}
        >
          <Grid item xs={12} sm={12} md={3} lg={3}>
            <AllUserComplete
              chatClickHandler={chatClickHandler}
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
            sx={{ borderLeft: "1px solid #E5E5E8" }}
          >
            <CompletePackages
              userActiveData={userActiveData}
              packageClickHandler={packageClickHandler}
              packageActiveData={packageActiveData}
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
            }}
          >
            <SimpleBar
              forceVisible="y"
              autoHide={true}
              style={{ maxHeight: "86vh" }}
              className="custom-scrollbar"
            >
              {activeContent.component === "Chats" && (
                <OrderChats
                  userActiveData={userActiveData}
                  packageActiveData={userActiveData}
                  closeHistory={closeHistoryHandler}
                />
              )}
              {activeContent.component === "Actions" && (
                <PackageTraking
                  packageActiveData={packageActiveData}
                  userActiveData={userActiveData}
                  collection="shelfPackages"
                  shipmentCollection="mySuiteShipments"
                  steps={steps}
                  activeStep={3}
                  pageName="shippingComplete"
                />
              )}
            </SimpleBar>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default ShippingComplete;
