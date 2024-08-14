import TableActionMenu from "./TableActions/TableActionMenu";
import warning from "../../assets/svg/warning.svg";
import approve from "../../assets/svg/approve.svg";
import { Box, Typography } from "@mui/material";

export const generateUserColumns = (actions) => {
  return [
    {
      name: "Name",
      // grow: 1.5,
      selector: (row) => row.name,
      cell: (row) => {
        return (
          <>
            {row.profileImage ? (
              <img
                src={row.profileImage}
                style={{ width: "24px", height: "24px", borderRadius: "50%" }}
                staticImage
                alt={row.name}
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
                  fontSize: "16px",
                }}
              >
                {row.name.charAt(0).toUpperCase()}
              </div>
            )}
            <Typography sx={{ fontSize: "14px", fontWeight: 500, ml: 1 }}>
              {row.name}
            </Typography>
          </>
        );
      },
      // sortable: true,
    },
    {
      name: "Joined Date",
      selector: (row) => row.createdAt,
      // grow: 1.5,
      cell: (row) => (
        <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
          {new Date(row?.createdAt?.seconds * 1000).toDateString()}
        </Typography>
      ),
      // sortable: true,
      // hide: "lg",
    },
    {
      name: "Country",
      selector: (row) => row.country,
      // grow: 1.5,
      cell: (row) => (
        <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
          {row.country}
        </Typography>
      ),
      // sortable: true,
      // hide: "md",
    },
    {
      name: "Phone No.",
      selector: (row) => row.phoneNumber,
      // grow: 1.5,
      cell: (row) => {
        return (
          <>
            <Typography sx={{ fontSize: "14px", fontWeight: 500, mr: 0.5 }}>
              <span>(+{row.phoneCode})&nbsp;</span>
              <span>{row.phoneNumber}</span>
            </Typography>
            <img
              src={row?.phoneVerified === "warning" ? warning : approve}
              alt="status"
              width="16px"
              height="16px"
            />
          </>
        );
      },
      // sortable: true,
      // hide: "md",
    },
    {
      name: "Email",
      selector: (row) => row.emailId,
      // grow: 1.5,
      cell: (row) => {
        return (
          <>
            <Typography sx={{ fontSize: "14px", fontWeight: 500, mr: 0.5 }}>
              {row.emailId}
            </Typography>
            <img
              src={row?.emailVerified === "approve" ? approve : warning}
              alt="status"
              width="16px"
              height="16px"
            />
          </>
        );
      },
      // sortable: true,
      // hide: "md",
    },
    {
      name: "Last login",
      selector: (row) => row.lastLoginAt,
      // grow: 1.5,
      cell: (row) => (
        <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>{new Date(row?.lastLoginAt?.seconds * 1000).toDateString()}</Typography>
      ),
      // sortable: true,
      // hide: "md",
    },
    {
      name: "Status",
      selector: (row) => row.status,
      grow: 0,
      cell: (row) => {
        return (
          row?.status && (
            <span
              style={{
                fontSize: "14px",
                fontWeight: 500,
                padding: "4px 8px",
                backgroundColor:
                  row.status === "Active" ? "#2DC58C" : "#EB5757",
                borderRadius: "2px",
                color: "white",
              }}
            >
              {row.status}
            </span>
          )
        );
      },
    },
    {
      name: "action",
      grow: 0,
      cell: (row) => {
        const updatedAction = actions.filter((act) => {
          if (act.actionName === "Unblock") {
            if (row.status === "Blocked") {
              return act;
            }
          } else if (act.actionName === "Block") {
            if (row.status === "Active") {
              return act;
            }
          } else {
            return act;
          }
        });

        return <TableActionMenu row={row} updatedActionList={updatedAction} />;
      },
      sortable: false,
      // hide: "md",
    },
  ];
};

export const UserIssuesColumns = [
  {
    name: "Date",
    grow: 1,
    selector: (row) => row?.createdAt,
    cell: (row) => (
      <span>{new Date(row?.createdAt?.seconds * 1000).toDateString()}</span>
    ),
    // sortable: true,
    // hide: "lg",
  },
  {
    name: "RouterPartner Name",
    grow: 2,
    selector: (row) => row.routePartnerName,
    cell: (row) => <span>{row?.routePartnerName}</span>,
  },
  {
    name: "Customer Name",
    grow: 1,
    selector: (row) => row.customerName,
    cell: (row) => (
      // <a
      //   // href="#"
      //   onClick={() => {
      //     const userId = row?.userId;
      //     const newURL = `/systems/user/view/${userId}`;
      //     window.location.href = newURL;
      //   }}
      //   className="text-info"
      // >
      //   {row?.userName}
      // </a>
      <span>{row?.customerName}</span>
    ),
    // <a href={`systems/user/view/${""}`} className="text-info">{row.userName}</a>
    // sortable: true,
    // hide: "md",
  },
  {
    name: "Order Number",
    grow: 1,
    selector: (row) => row.orderNumber,
    cell: (row) => <span>{row.orderNumber}</span>,
    // sortable: true,
    // hide: "md",
  },
  {
    name: "Issue Type",
    grow: 1,
    selector: (row) => row.issueType,
    cell: (row) => <span>{row.issueType}</span>,
    // sortable: true,
    // hide: "md",
  },
  {
    name: "Note",
    grow: 4,
    selector: (row) => row.describeIssue,
    center: true,
    cell: (row) => <span>{row.describeIssue}</span>,
    // sortable: true,
    // hide: "lg",
  },
];
