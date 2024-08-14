import React, { useContext } from "react";
import SidebarContext from "../../../context/SidebarContext";
import { Box, Button, InputBase, alpha, styled } from "@mui/material";
import PageHeader from "../../../components/PageHeader";
import SearchIcon from "@mui/icons-material/Search";
import BrandList from "./BrandList";

export default function Brand() {
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
        <PageHeader pageTitle={"Brand"} />
      </Box>
      <BrandList />
    </Box>
  );
}
