import TableActionMenu from "./TableActions/TableActionMenu";
import { Box, Typography } from "@mui/material";

export const generateShippingServiceColumns = (actions, user) => {
  const arr = [
    {
      name: "Created On",
      grow: 2,
      selector: (row) => row?.createdOn,
      cell: (row) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
            {row.createdOn}
          </Typography>
        );
      },
      // sortable: true,
      // hide: "lg",
    },
    {
      name: "Warehouse",
      grow: 2,
      selector: (row) => row.warehouse,
      cell: (row) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
            {row.warehouse}
          </Typography>
        );
      },
      // sortable: true,
    },
    {
      name: "Routing Type",
      grow: 2,
      selector: (row) => row.routingType,
      cell: (row) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
            {row.routingType}
          </Typography>
        );
      },
      // sortable: true,
    },
    {
      name: "Departure-Delivery",
      grow: 2,
      selector: (row) => row?.departDelivery,
      cell: (row) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
            {row.departDelivery}
          </Typography>
        );
      },
      // sortable: true,
      // hide: "lg",
    },
    {
      name: "Departing To",
      grow: 2,
      selector: (row) => row?.departTo,
      cell: (row) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
            {row.departTo}
          </Typography>
        );
      },
      // sortable: true,
      // hide: "lg",
    },
    {
      name: "Available Weight(Pounds)",
      grow: 2,
      selector: (row) => row?.weight,
      cell: (row) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
            {row.weight}
          </Typography>
        );
      },
      // sortable: true,
      // hide: "lg",
    },
    {
      name: "Bookings",
      grow: 2,
      selector: (row) => row?.bookings,
      cell: (row) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
            {row.bookings}
          </Typography>
        );
      },
      // sortable: true,
      // hide: "lg",
    },
    {
      name: "Carrier",
      grow: 2,
      selector: (row) => row?.carrier,
      cell: (row) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
            {row.carrier}
          </Typography>
        );
      },
      // sortable: true,
      // hide: "lg",
    },
    {
      name: "Status",
      selector: (row) => row?.status,
      //   cell: (row) => (row.isCarrierPartner ? "Yes" : "No"),
      cell: (row) => {
        return (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 500,
              paddingX: "8px",
              paddingY: "4px",
              backgroundColor:
                row.status === "In Progress" ? "#F2994A" : "#2DC58C",
              borderRadius: "2px",
              color: "white",
              whiteSpace: "nowrap",
            }}
          >
            {row.status}
          </Typography>
        );
      },
    },
    {
      name: "Action",
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
