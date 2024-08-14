import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Button,
  Menu,
  MenuItem,
  Typography,
  alpha,
  styled,
} from "@mui/material";
import AddmuseImg from "../../../assets/svg/muse.svg";
import actionIcon from "../../../assets/svg/action_more.svg";
import TableActionMenu from "./TableActions/TableActionMenu";
import { ImGoogle3 } from "react-icons/im";

export const generateRoutePartnersColumns = (actions, user) => {
  const arr = [
    {
      name: "Name",
      grow: 2,
      selector: (row) => row?.name,
      cell: (row) => {
        return (
          <>
            {row.logoUrl ? (
              <img
                src={row.logoUrl}
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
            <span className="ps-2">{row.name}</span>
          </>
        );
      },
      // sortable: true,
    },
    {
      name: "Date",
      grow: 2,
      selector: (row) => row?.createdAt,
      cell: (row) => {
        return (
          <span>{new Date(row?.createdAt?.seconds * 1000).toDateString()}</span>
        );
      },
      // sortable: true,
      // hide: "lg",
    },
    {
      name: "Rating",
      grow: 2,
      selector: (row) => row.rating,
      cell: (row) => <span>{`${row.rating.toFixed(2) || 0}/5`}</span>,
      // sortable: true,
    },
    {
      name: "Headquarter",
      grow: 2,
      selector: (row) => row?.country,
      // sortable: true,
    },
    {
      name: "Total Bays",
      grow: 2,
      selector: (row) => row?.totalBays,
      // sortable: true,
      // hide: "md",
    },
    {
      name: "Carrier",
      selector: (row) => row?.isCarrierPartner,
      cell: (row) => (row.isCarrierPartner ? "Yes" : "No"),
    },
    {
      name: "action",
      cell: (row) => {
        // console.log(actions, "actions>>>");
        // console.log(row, "row>>>");
        const updatedActionList = actions.filter((act) => {
          if (act.id === "add-main-address") {
            if (row.isRoutePartner) {
              return true;
            } else {
              return false;
            }
          } else {
            return true;
          }
        });
        // console.log(updatedActionList, "updatedActionList>>>");
        return (
          <TableActionMenu row={row} updatedActionList={updatedActionList} />
        );
      },
      sortable: false,
      // hide: "md",
    },
  ];
  //   return user?.role === "Superadmin" || user?.role === "Platform Admin"
  //     ? arr
  //     : arr.filter((a) => a.name !== "action");

  // return arr.filter((a) => a.name !== "action");
  return arr;
};

export const customersDetailsColumns = (actions) => {
  return [
    {
      name: "Added on",
      selector: (row) => row?.createdAt,
      cell: (row) => (
        <span>{new Date(row?.createdAt?.seconds * 1000).toDateString()}</span>
      ),
    },
    {
      name: "Name",
      grow: 2,
      selector: (row) => row?.profileImage,
      cell: (row) => {
        return (
          <>
            {row?.profileImage ? (
              <img
                src={row.profileImage}
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                staticImage
                alt={row.name}
              />
            ) : (
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  backgroundColor: "#8770DE",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "20px",
                }}
              >
                {row.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="ps-2">{row?.name}</span>
          </>
        );
      },
    },
    {
      name: "Varified",
      selector: (row) => row?.verified,
      cell: (row) => <span>{row?.verified}</span>,
    },

    {
      name: "Bay No.",
      selector: (row) => row?.bayNo,
      cell: (row) => <span>{row?.bayNo}</span>,
    },
    {
      name: "Orders",
      selector: (row) => row?.orderIds,
      cell: (row) => <span>{row?.orderIds}</span>,
      center: true,
    },
    {
      name: "Location",
      selector: (row) => row?.country,
      cell: (row) => <span>{row?.country}</span>,
    },
    {
      name: "Status",
      selector: (row) => row?.status,
      cell: (row) => {
        return (
          <>
            {row?.status && (
              <span
                style={{
                  padding: "4px 8px",
                  borderRadius: "2px",
                  color: "#fff",
                  backgroundColor:
                    row?.status?.toLowerCase() === "active"
                      ? "#2DC58C"
                      : "#EB5757",
                }}
              >
                {row?.status}
              </span>
            )}
          </>
        );
      },
    },
    {
      name: "action",
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
    },
  ];
};

export const issueColumns = [
  {
    name: "Date",
    grow: 1,
    selector: (row) => row?.createdAt,
    cell: (row) => (
      <span>{new Date(row?.createdAt?.seconds * 1000).toDateString()}</span>
    ),
  },
  {
    name: "Order Number",
    grow: 1,
    selector: (row) => row?.orderId,
    cell: (row) => {
      return (
        <>
          <span className="ps-2 text-info">{row?.orderId}</span>
        </>
      );
    },
  },
  {
    name: "Customer Name",
    grow: 1,
    selector: (row) => row?.name,
    cell: (row) => <span>{row?.name}</span>,
  },
  {
    name: "Issue Details",
    grow: 2,
    selector: (row) => row?.issue,
    cell: (row) => {
      return <span>{row?.issue}</span>;
    },
  },
  {
    name: "",
    grow: 0,
  },
];