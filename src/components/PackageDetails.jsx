import React from "react";
import { Box, Typography } from "@mui/material";

export default function PackageDetails({ packageActiveData }) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginLeft: "20px",
          marginTop: "10px",
          width: "100%",
        }}
      >
        <Box sx={{ display: "grid", width: "30%" }}>
          <label
            style={{
              color: "#959BA1",
              fontWeight: "500",
              fontSize: "14px",
            }}
          >
            Merchant
          </label>
          <Box sx={{ display: "flex", marginTop: "5px" }}>
            {packageActiveData?.brand &&
            packageActiveData?.brand?.brandLogo !== "" ? (
              <img
                src={packageActiveData?.brand?.brandLogo}
                alt="brandLogo"
                style={{ width: "30px", height: "20px", objectFit: "contain" }}
              />
            ) : (
              ""
            )}
            <label
              style={{
                color: "#1C2630",
                fontWeight: "bold",
                fontSize: "16px",
                marginLeft: "5px",
              }}
            >
              {packageActiveData?.brand?.brandName
                ? packageActiveData?.brand?.brandName
                : packageActiveData?.merchantCount
                ? packageActiveData?.merchantCount
                : "-"}
            </label>
          </Box>
        </Box>
        <Box sx={{ display: "grid", width: "30%" }}>
          <label
            style={{
              color: "#959BA1",
              fontWeight: "500",
              fontSize: "14px",
            }}
          >
            merchant indicator
          </label>
          <label
            style={{
              color: "#1C2630",
              fontWeight: "bold",
              fontSize: "16px",
              marginTop: "5px",
            }}
          >
            {packageActiveData?.merchantIndicator || "-"}
          </label>
        </Box>
        <Box sx={{ display: "grid", width: "30%" }}>
          <label
            style={{
              color: "#959BA1",
              fontWeight: "500",
              fontSize: "14px",
            }}
          >
            Nickname
          </label>
          <label
            style={{
              color: "#1C2630",
              fontWeight: "bold",
              fontSize: "16px",
              marginTop: "5px",
            }}
          >
            {packageActiveData?.nickName || "-"}
          </label>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginLeft: "20px",
          marginTop: "40px",
          width: "100%",
        }}
      >
        <Box sx={{ display: "grid", width: "30%" }}>
          <label
            style={{
              color: "#959BA1",
              fontWeight: "500",
              fontSize: "14px",
            }}
          >
            Weight
          </label>
          <label
            style={{
              color: "#1C2630",
              fontWeight: "bold",
              fontSize: "16px",
              marginTop: "5px",
            }}
          >
            {packageActiveData?.packageTotalWeight?.toFixed(2) || "-"}
          </label>
        </Box>
        <Box sx={{ display: "grid", width: "30%" }}>
          <label
            style={{
              color: "#959BA1",
              fontWeight: "500",
              fontSize: "14px",
            }}
          >
            Dimention
          </label>
          <label
            style={{
              color: "#1C2630",
              fontWeight: "bold",
              fontSize: "16px",
              marginTop: "5px",
            }}
          >
            {/* {`${packageActiveData?.dimentionL || ""} X ${
              packageActiveData?.dimentionW || ""
            } X ${packageActiveData?.dimentionH || ""} ` || "-"} */}
            {[
              packageActiveData?.dimensionL,
              packageActiveData?.dimensionW,
              packageActiveData?.dimensionH,
            ]
              .filter(Boolean)
              .join(" X ") || "-"}
          </label>
        </Box>
        <Box sx={{ display: "grid", width: "30%" }}>
          <label
            style={{
              color: "#959BA1",
              fontWeight: "500",
              fontSize: "14px",
            }}
          >
            Shelf ID
          </label>
          <label
            style={{
              color: "#1C2630",
              fontWeight: "bold",
              fontSize: "16px",
              marginTop: "5px",
            }}
          >
            {packageActiveData?.shelfId || "-"}
          </label>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginLeft: "20px",
          marginTop: "40px",
          width: "100%",
        }}
      >
        <Box sx={{ display: "grid", width: "30%", whiteSpace: "nowrap" }}>
          <label
            style={{
              color: "#959BA1",
              fontWeight: "500",
              fontSize: "14px",
            }}
          >
            Expecting date
          </label>
          <label
            style={{
              color: "#1C2630",
              fontWeight: "bold",
              fontSize: "16px",
              marginTop: "5px",
            }}
          >
            {packageActiveData?.expectedDate || "-"}
          </label>
        </Box>
        <Box sx={{ display: "grid", width: "30%" }}>
          <label
            style={{
              color: "#959BA1",
              fontWeight: "500",
              fontSize: "14px",
            }}
          >
            Ship on
          </label>
          <label
            style={{
              color: "#1C2630",
              fontWeight: "bold",
              fontSize: "16px",
              marginTop: "5px",
            }}
          >
            {packageActiveData?.shipOn || "-"}
          </label>
        </Box>
        <Box sx={{ display: "grid", width: "30%", whiteSpace: "nowrap" }}>
          <label
            style={{
              color: "#959BA1",
              fontWeight: "500",
              fontSize: "14px",
            }}
          >
            Shipping method
          </label>
          <label
            style={{
              color: "#1C2630",
              fontWeight: "bold",
              fontSize: "16px",
              marginTop: "5px",
            }}
          >
            {packageActiveData?.shipMethod || "-"}
          </label>
        </Box>
      </Box>
    </>
  );
}
