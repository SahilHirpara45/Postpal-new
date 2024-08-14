import React, { useContext, useState } from "react";
import { Badge, Box, Card, Grid, IconButton, Typography } from "@mui/material";
import PageHeader from "../../../components/PageHeader";
import PackageTraking from "../../../components/PackageTraking";
import SidebarContext from "../../../context/SidebarContext";
import SimpleBar from "simplebar-react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import HelpIcon from "@mui/icons-material/Help";
import PackagesShopping from "./PackagesShopping";
import AllUsersShopping from "./AllUsersShoppping";
import OrderHistory from "../../../components/common/History/OrderHistory";
import OrderChats from "../../../components/common/orderChat/OrderChats";

function ShoppingRequest() {
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
    setPackageActiveData(item);
  };

  const historyClickHandler = async (id, item, e) => {
    e.stopPropagation();
    setActiveContent({ component: "History", data: id });
    setPackageActiveData(item);
  };

  const userClickHandler = async (id, item) => {
    setActiveContent({ component: "Actions", data: id });
    setUserActiveData(item);
  };

  const packageClickHandler = async (id, item) => {
    setActiveContent({ component: "Actions", data: id });
    setPackageActiveData(item);
  };

  const closeHistoryHandler = () => {
    setActiveContent({ component: "Actions", data: undefined });
  };
  const activeStep =
    packageActiveData?.packageTrackingStatus === "Ordered"
      ? 2
      : packageActiveData?.packageTrackingStatus === "Received"
      ? 3
      : packageActiveData?.packageTrackingStatus === "Done"
      ? 4
      : 1;

  const steps = [
    {
      label: "Requested",
      date: packageActiveData?.requestedAt
        ? new Date(
            packageActiveData?.requestedAt.seconds * 1000
          ).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
        : "-",
    },
    {
      label: "Ordered",
      date: packageActiveData?.orderedAt
        ? new Date(
            packageActiveData?.orderedAt.seconds * 1000
          ).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
        : "-",
    },
    {
      label: "Received",
      date: packageActiveData?.receivedAt
        ? new Date(
            packageActiveData?.receivedAt.seconds * 1000
          ).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
        : "",
    },
    { label: "Done", date: "-" },
  ];

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
      <PageHeader pageTitle={"Shoppings"} />
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
          <Grid item sm={12} md={3}>
            <AllUsersShopping
              userClickHandler={userClickHandler}
              userActiveData={userActiveData}
            />
          </Grid>
          <Grid
            item
            sm={12}
            md={3}
            sx={{
              borderLeft: "1px solid #E5E5E8",
              borderRight: "1px solid #E5E5E8",
            }}
          >
            <PackagesShopping
              userActiveData={userActiveData}
              packageClickHandler={packageClickHandler}
              packageActiveData={packageActiveData}
              historyClickHandler={historyClickHandler}
              chatClickHandler={chatClickHandler}
            />
          </Grid>
          <Grid item sm={12} md={6}>
            <SimpleBar
              forceVisible="y"
              autoHide={true}
              style={{ maxHeight: "88vh" }}
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
              {activeContent.component === "Actions" && (
                <PackageTraking
                  packageActiveData={packageActiveData}
                  collection={"shelfShoppingPackages"}
                  steps={steps}
                  activeStep={activeStep}
                  pageName="shopping request"
                  userActiveData={userActiveData}
                />
              )}
            </SimpleBar>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default ShoppingRequest;
