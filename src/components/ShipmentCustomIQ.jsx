import { Box, FormControlLabel, FormGroup, Switch } from "@mui/material";
import React from "react";

function ShipmentCustomIQ() {
  const data = [
    {
      category: "Dangerous and restricted Items",
      system: { disabled: false },
      human: { disabled: false },
      child: [
        {
          category: "Dangerous Goods",
          system: { disabled: true },
          human: { disabled: false, checked: false },
        },
        {
          category: "Licence for export or import",
          system: { disabled: true },
          human: { disabled: false, checked: false },
        },
        {
          category: "Trade bans",
          system: { disabled: true },
          human: { disabled: false, checked: false },
        },
        {
          category: "Carrier restriction",
          system: { disabled: true },
          human: { disabled: false, checked: false },
        },
      ],
    },
    {
      category: "Export Compliance",
      system: { disabled: false },
      human: { disabled: false },
      child: [
        {
          category: "Electronic Export Information (EEI)",
          system: { disabled: true },
          human: { disabled: false, checked: false },
        },
      ],
    },
    {
      category: "Safty regulation",
      system: { disabled: false },
      human: { disabled: false },
      child: [
        {
          category: "Bettery regulation",
          system: { disabled: true },
          human: { disabled: false, checked: false },
        },
      ],
    },
  ];

  const data2 = [
    {
      category: "Tax and Duties",
      system: { disabled: false },
      human: { disabled: false },
      child: [
        {
          category: "Subject to  GST",
          system: { disabled: true },
          human: { disabled: false, checked: false },
        },
        {
          category: "Average Duties is higher",
          system: { disabled: true },
          human: { disabled: false, checked: false },
        },
      ],
    },
  ];

  const data3 = [
    {
      category: "Packaging and Content Details",
      system: { disabled: false },
      human: { disabled: false },
      child: [
        {
          category: "Shoesbox",
          system: { disabled: true },
          human: { disabled: false, checked: false },
        },
      ],
    },
  ];

  return (
    <>
      <Box sx={{ marginTop: "20px", marginBottom: "10px" }}>
        <label
          style={{
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          Regulatory and Legal Compilance
        </label>
      </Box>
      {data.map((parentCategory, parentIndex) => (
        <React.Fragment key={parentIndex}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#F9FAFC",
              height: "38px",
              border: "1px solid #E5E5E8",
              paddingX: "20px",
              paddingY: "10px",
            }}
          >
            <Box sx={{ width: "50%" }}>
              <label
                style={{
                  fontSize: "14px",
                }}
              >
                {parentCategory.category}
              </label>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "25%",
              }}
            >
              <label
                style={{
                  fontSize: "14px",
                }}
              >
                System
              </label>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "25%",
              }}
            >
              <label
                style={{
                  fontSize: "14px",
                }}
              >
                Human
              </label>
            </Box>
          </Box>
          {parentCategory.child.map((childCategory, childIndex) => (
            <Box
              key={childIndex}
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "white",
                height: "44px",
                border: "1px solid #E5E5E8",
                borderTop: "none",
                paddingX: "20px",
                paddingY: "10px",
              }}
            >
              <Box sx={{ width: "50%" }}>
                <label
                  style={{
                    fontSize: "14px",
                  }}
                >
                  {childCategory.category}
                </label>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "25%",
                }}
              >
                <FormGroup>
                  <FormControlLabel
                    disabled={childCategory.system.disabled}
                    control={
                      <Switch defaultChecked={childCategory.system.checked} />
                    }
                  />
                </FormGroup>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "25%",
                }}
              >
                <FormGroup>
                  <FormControlLabel
                    disabled={childCategory.human.disabled}
                    control={
                      <Switch defaultChecked={childCategory.human.checked} />
                    }
                  />
                </FormGroup>
              </Box>
            </Box>
          ))}
        </React.Fragment>
      ))}
      <Box sx={{ marginTop: "20px", marginBottom: "10px" }}>
        <label
          style={{
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          Financial Considerations
        </label>
      </Box>
      {data2.map((parentCategory, parentIndex) => (
        <React.Fragment key={parentIndex}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#F9FAFC",
              height: "38px",
              border: "1px solid #E5E5E8",
              paddingX: "20px",
              paddingY: "10px",
            }}
          >
            <Box sx={{ width: "50%" }}>
              <label
                style={{
                  fontSize: "14px",
                }}
              >
                {parentCategory.category}
              </label>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "25%",
              }}
            >
              <label
                style={{
                  fontSize: "14px",
                }}
              >
                System
              </label>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "25%",
              }}
            >
              <label
                style={{
                  fontSize: "14px",
                }}
              >
                Human
              </label>
            </Box>
          </Box>
          {parentCategory.child.map((childCategory, childIndex) => (
            <Box
              key={childIndex}
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "white",
                height: "44px",
                border: "1px solid #E5E5E8",
                borderTop: "none",
                paddingX: "20px",
                paddingY: "10px",
              }}
            >
              <Box sx={{ width: "50%" }}>
                <label
                  style={{
                    fontSize: "14px",
                  }}
                >
                  {childCategory.category}
                </label>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "25%",
                }}
              >
                <FormGroup>
                  <FormControlLabel
                    disabled={childCategory.system.disabled}
                    control={
                      <Switch defaultChecked={childCategory.system.checked} />
                    }
                  />
                </FormGroup>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "25%",
                }}
              >
                <FormGroup>
                  <FormControlLabel
                    disabled={childCategory.human.disabled}
                    control={
                      <Switch defaultChecked={childCategory.human.checked} />
                    }
                  />
                </FormGroup>
              </Box>
            </Box>
          ))}
        </React.Fragment>
      ))}
      <Box sx={{ marginTop: "20px", marginBottom: "10px" }}>
        <label
          style={{
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          Product-Specific Considerations
        </label>
      </Box>
      {data3.map((parentCategory, parentIndex) => (
        <React.Fragment key={parentIndex}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#F9FAFC",
              height: "38px",
              border: "1px solid #E5E5E8",
              paddingX: "20px",
              paddingY: "10px",
            }}
          >
            <Box sx={{ width: "50%" }}>
              <label
                style={{
                  fontSize: "14px",
                }}
              >
                {parentCategory.category}
              </label>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "25%",
              }}
            >
              <label
                style={{
                  fontSize: "14px",
                }}
              >
                System
              </label>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "25%",
              }}
            >
              <label
                style={{
                  fontSize: "14px",
                }}
              >
                Human
              </label>
            </Box>
          </Box>
          {parentCategory.child.map((childCategory, childIndex) => (
            <Box
              key={childIndex}
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "white",
                height: "44px",
                border: "1px solid #E5E5E8",
                borderTop: "none",
                paddingX: "20px",
                paddingY: "10px",
              }}
            >
              <Box sx={{ width: "50%" }}>
                <label
                  style={{
                    fontSize: "14px",
                  }}
                >
                  {childCategory.category}
                </label>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "25%",
                }}
              >
                <FormGroup>
                  <FormControlLabel
                    disabled={childCategory.system.disabled}
                    control={
                      <Switch defaultChecked={childCategory.system.checked} />
                    }
                  />
                </FormGroup>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "25%",
                }}
              >
                <FormGroup>
                  <FormControlLabel
                    disabled={childCategory.human.disabled}
                    control={
                      <Switch defaultChecked={childCategory.human.checked} />
                    }
                  />
                </FormGroup>
              </Box>
            </Box>
          ))}
        </React.Fragment>
      ))}
    </>
  );
}

export default ShipmentCustomIQ;
