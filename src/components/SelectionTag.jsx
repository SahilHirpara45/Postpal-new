import React from "react";
import { Badge, Box, Chip, Stack } from "@mui/material";
import dayjs from "dayjs";

export default function SelectionTag({ packageActiveData }) {
  const calculateRemainingDays = (date) => {
    const today = dayjs();
    const targetDate = dayjs(date?.seconds * 1000);
    // console.log(date, "date>>>");
    // console.log(targetDate, "targetDate>>>");
    return targetDate.diff(today, "day");
  };

  // const freeStorageDays = -191;
  // const paidStorageDays = -91;
  // const abandonedDays = -1;

  const freeStorageDays = calculateRemainingDays(packageActiveData.freeStorage);
  const paidStorageDays = calculateRemainingDays(packageActiveData.paidStorage);
  const abandonedDays = calculateRemainingDays(packageActiveData.abandoned);

  return (
    <Box sx={{ padding: "20px", borderBottom: "1px solid #E5E5E8" }}>
      <Box sx={{ marginTop: "20px" }}>
        <h1
          style={{
            textAlign: "left",
            fontSize: "26px",
            fontWeight: "bold",
          }}
        >
          Storage tag
        </h1>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ marginX: "10px", marginY: "10px" }}>
          <Chip
            label={`Free Storage: ${
              freeStorageDays > 0 ? freeStorageDays : 0
            } Days`}
            color="primary"
          />
          {/* <Chip
            label={`Free Storage: ${
              freeStorageDays <= 30
                ? freeStorageDays > 0
                  ? freeStorageDays
                  : 0
                : 0
            } Days`}
            color="primary"
          /> */}
        </Box>
        <Box sx={{ marginX: "10px", marginY: "10px" }}>
          <Chip
            label={`Paid Storage: ${
              paidStorageDays > 0 ? paidStorageDays : 0
            } Days`}
            color="warning"
          />
          {/* <Chip
            label={`Paid Storage: ${
              paidStorageDays <= 60
                ? paidStorageDays > 0
                  ? paidStorageDays
                  : 0
                : 60
            } Days`}
            color="warning"
          /> */}
        </Box>
        <Box sx={{ marginX: "10px", marginY: "10px" }}>
          <Chip
            label={`Abandonment: ${abandonedDays > 0 ? abandonedDays : 0} Days`}
            color="error"
          />
          {/* <Chip
            label={`Abandonment: ${
              abandonedDays <= 90 ? (abandonedDays > 0 ? abandonedDays : 0) : 90
            } Days`}
            color="error"
          /> */}
        </Box>
      </Box>
    </Box>
  );
}
