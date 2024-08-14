import React, { useContext } from "react";
import SidebarContext from "../../../context/SidebarContext";
import { Box } from "@mui/material";
import PageHeader from "../../../components/PageHeader";
import IssueList from "./IssueList";

export default function AllIsues() {
  const { open } = useContext(SidebarContext);

  // const issueData = [
  //   {
  //     Date: "Thu, Aug 17 2023",
  //     User: "Arlene McCoy",
  //     UserLocation: "India",
  //     issueType: "My main address was blocked",
  //     Note: "abc",
  //   },
  //   {
  //     Date: "Thu, Aug 17 2023",
  //     User: "Arlene McCoy",
  //     UserLocation: "India",
  //     issueType: "My main address was blocked",
  //     Note: "abc",
  //   },
  //   {
  //     Date: "Thu, Aug 17 2023",
  //     User: "Denish",
  //     UserLocation: "India",
  //     issueType: "My main address was blocked",
  //     Note: "abc",
  //   },
  //   {
  //     Date: "Thu, Aug 17 2023",
  //     User: "Charles",
  //     UserLocation: "India",
  //     issueType: "My main address was blocked",
  //     Note: "abc",
  //   },
  //   {
  //     Date: "Thu, Aug 17 2023",
  //     User: "Peter",
  //     UserLocation: "India",
  //     issueType: "My main address was blocked",
  //     Note: "abc",
  //   },
  // ];
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
        <PageHeader pageTitle={"All Issues"} />
      </Box>
      <IssueList />
    </Box>
  );
}
