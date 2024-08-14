import React from "react";
import { Box, Icon, Typography } from "@mui/material";
import arrow from "../../../assets/svg/backspace.svg";
import HistoryStatus from "./HistoryStatus";

export default function OrderHistory({ closeHistory, packageActiveData }) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "24px",
          borderBottom: "1px solid #E5E5E8",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{ cursor: "pointer", marginRight: "20px" }}
            onClick={closeHistory}
          >
            <img src={arrow} alt="back_arrow" />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ ml: "8px" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="subtitle2">History</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box>
        <Box
          sx={{
            p: "24px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: "#959BA1",
              mb: 2,
            }}
          >
            <Typography variant="subtitle2">PRE-SHOPPING</Typography>
          </Box>
          <Box>
            <HistoryStatus
              historyData={packageActiveData?.history?.preShopping}
            />
          </Box>
        </Box>

        <Box
          sx={{
            p: "0 24px 24px 24px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: "#959BA1",
              mb: 2,
            }}
          >
            <Typography variant="subtitle2">VERIFICATION</Typography>
          </Box>
          <Box>
            <HistoryStatus
              historyData={packageActiveData?.history?.verification}
            />
          </Box>
        </Box>

        <Box
          sx={{
            p: "0 24px 24px 24px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: "#959BA1",
              mb: 2,
            }}
          >
            <Typography variant="subtitle2">POST-SHOPPING</Typography>
          </Box>
          <Box>
            <HistoryStatus
              historyData={packageActiveData?.history?.postShopping}
            />
          </Box>
        </Box>

        <Box
          sx={{
            p: "0 24px 24px 24px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: "#959BA1",
              mb: 2,
            }}
          >
            <Typography variant="subtitle2">FINAL PRICE</Typography>
          </Box>
          <Box>
            <HistoryStatus
              historyData={packageActiveData?.history?.finalPrice}
            />
          </Box>
        </Box>

        <Box
          sx={{
            p: "0 24px 24px 24px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: "#959BA1",
              mb: 2,
            }}
          >
            <Typography variant="subtitle2">PRE-SHIPPING (PACKING)</Typography>
          </Box>
          <Box>
            <HistoryStatus
              historyData={packageActiveData?.history?.preShipping}
            />
          </Box>
        </Box>

        <Box
          sx={{
            p: "0 24px 24px 24px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: "#959BA1",
              mb: 2,
            }}
          >
            <Typography variant="subtitle2">
              POST-SHIPPING (EN-ROUTE)
            </Typography>
          </Box>
          <Box>
            <HistoryStatus
              historyData={packageActiveData?.history?.postShipping}
            />
          </Box>
        </Box>

        <Box
          sx={{
            p: "0 24px 24px 24px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: "#959BA1",
              mb: 2,
            }}
          >
            <Typography variant="subtitle2">
              CUSTOMER RATING & REVIEW
            </Typography>
          </Box>
          <Box>
            <HistoryStatus />
          </Box>
        </Box>

        <Box
          sx={{
            p: "0 24px 24px 24px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: "#959BA1",
              mb: 2,
            }}
          >
            <Typography variant="subtitle2">PACKAGE</Typography>
          </Box>
          <Box>
            <HistoryStatus historyData={packageActiveData?.history?.package} />
          </Box>
        </Box>
      </Box>
    </>
  );
}
