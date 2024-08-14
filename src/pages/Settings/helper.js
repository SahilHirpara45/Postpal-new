import TableActionMenu from "./Admins/TableActions/TableActionMenu";
import warning from "../../assets/svg/warning.svg";
import approve from "../../assets/svg/approve.svg";
import { Box, Typography } from "@mui/material";

export const generateAdminColumns = (actions) => {
  return [
    {
      name: "Name",
      // grow: 1.5,
      selector: (row) => row.name,
      cell: (row) => {
        return (
          <>
            {row?.logoUrl ? (
              <img
                src={row?.logoUrl}
                style={{ width: "24px", height: "24px", borderRadius: "50%" }}
                staticImage
                alt={row?.logoUrl}
              />
            ) : (
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  backgroundColor: "#8770DE",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "14px",
                }}
              >
                {row?.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
            <Typography sx={{ fontSize: "14px", fontWeight: 500, ml: 1 }}>
              {row.name}
            </Typography>
          </>
        );
      },
      width: "25%",
      // sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      // grow: 1.5,
      cell: (row) => {
        return (
          <>
            <Typography sx={{ fontSize: "14px", fontWeight: 500, mr: 0.5 }}>
              {row.email}
            </Typography>
          </>
        );
      },
      // sortable: true,
      // hide: "md",
      width: "25%",
    },
    {
      name: "Phone Number",
      selector: (row) => row?.phoneNumber,
      cell: (row) => {
        return (
          <>
            <Typography sx={{ fontSize: "14px", fontWeight: 500, mr: 0.5 }}>
              <span>{row?.phoneNumber}</span>
            </Typography>
          </>
        );
      },
      // sortable: true,
      // hide: "md",
      width: "20%",
    },
    {
      name: "Role",
      selector: (row) => row.role,
      grow: 0,
      cell: (row) => {
        return (
          row?.role && (
            <span
              style={{
                width: "fit-content",
                fontSize: "14px",
                fontWeight: 500,
                padding: "4px 8px",
                backgroundColor: "#DFDFDF",
                borderRadius: "2px",
                color: "black",
              }}
            >
              {row.role}
            </span>
          )
        );
      },
      width: "20%",
    },
    {
      name: "action",
      grow: 0,
      cell: (row) => {
        return <TableActionMenu row={row} updatedActionList={actions} />;
      },
      sortable: false,
      // hide: "md",
      width: "10%"
    },
  ];
};
