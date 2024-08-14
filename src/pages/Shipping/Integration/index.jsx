import { Box } from "@mui/material";
import React, { useContext, useState } from "react";
import PageHeader from "../../../components/PageHeader";
import ConnectAPI from "./ConnectAPI";
import SidebarContext from "../../../context/SidebarContext";
import IntegrationTable from "./IntegrationTable";

function Integration() {
  const { open } = useContext(SidebarContext);

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
      <PageHeader pageTitle={"Shipping Service Integration"} />
      <ConnectAPI />
    </Box>
  );
}

export default Integration;
