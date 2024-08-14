import { Box } from "@mui/material";
import React, { useContext } from "react";
import SidebarContext from "../../../context/SidebarContext";
import Header from "./Header";
import ShippingStepper from "./ShippingStepper";

export default function AddShipping() {
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
      <Box sx={{ borderBottom: "1px solid #E5E5E8" }}>
        <Header
          pageTitle={`Add Shipping`}
          currentRoute={`Add Shipping Service`}
          //   buttonName="Save"
          //   handleCancle={() => handleCancle()}
          //   handleSave={addRoutePartnerForm.handleSubmit}
          //   loading={loading}
        />
      </Box>
      <Box sx={{ marginTop: 5 }}>
        <ShippingStepper />
      </Box>
    </Box>
  );
}
