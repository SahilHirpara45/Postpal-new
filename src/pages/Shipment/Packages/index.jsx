import React, { useContext, useState } from "react";
import { Box, Grid } from "@mui/material";
import PageHeader from "../../../components/PageHeader";
import PackageTraking from "../../../components/PackageTraking";
import SidebarContext from "../../../context/SidebarContext";
import SimpleBar from "simplebar-react";
import AllUsers from "./AllUsers";
import PackagesUserwise from "./PackagesUserwise";

function Packages() {
  const { open } = useContext(SidebarContext);
  const [userActiveData, setUserActiveData] = useState({});
  const [packageActiveData, setPackageActiveData] = useState({});
  const [activeUserName, setActiveUserName] = useState("");

  console.log(userActiveData, "user active data---------------");

  const [activeContent, setActiveContent] = useState({
    component: "Actions",
    data: undefined,
  });

  const userClickHandler = async (id, item) => {
    setActiveContent({ component: "Packages", data: id });
    setActiveUserName(item.name);
    setUserActiveData(item);
  };

  const packageClickHandler = async (id, item) => {
    setActiveContent({ component: "Actions", data: id });
    setPackageActiveData(item);
  };

  const steps = [
    {
      label: "Arrived",
      date: packageActiveData?.arrivedAt
        ? new Date(
            packageActiveData?.arrivedAt?.seconds * 1000
          ).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
        : "-",
    },
    { label: "Packaging", date: "-" },
    { label: "Delivery", date: "-" },
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
      <PageHeader pageTitle={"Packages"} />
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
            <AllUsers
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
            <PackagesUserwise
              packageClickHandler={packageClickHandler}
              userActiveData={userActiveData}
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
              <PackageTraking
                packageActiveData={packageActiveData}
                userName={activeUserName}
                collection="shelfPackages"
                steps={steps}
                pageName="packages"
              />
            </SimpleBar>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Packages;
