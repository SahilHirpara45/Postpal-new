import TableActionMenu from "./TableActions/TableActionMenu";
import warning from "../../assets/svg/warning.svg";
import approve from "../../assets/svg/approve.svg";
import { Box, Typography } from "@mui/material";

export const generateBrandColumns = (actions) => {
  return [
    {
      name: "Brand",
      grow: 2,
      selector: (row) => row?.brand,
      cell: (row) => {
        return (
          <>
            {row.brandLogo ? (
              <img
                src={row.brandLogo}
                style={{ width: "24px", height: "24px", borderRadius: "50%" }}
                staticImage
                alt={row.brandName}
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
                {row?.brandName?.charAt(0).toUpperCase()}
              </div>
            )}
            <Typography
              sx={{ fontSize: "14px", fontWeight: 500, marginLeft: "5px" }}
            >
              {row?.brandName}
            </Typography>
          </>
        );
      },
      // sortable: true,
    },
    {
      name: "Created on",
      selector: (row) => row.createdAt,
      cell: (row) => (
        <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
          {new Date(row?.createdAt?.seconds * 1000).toDateString()}
        </Typography>
      ),
      // sortable: true,
      // hide: "lg",
    },
    {
      name: "Category",
      // grow: 2,
      selector: (row) => row.brandCategory,
      cell: (row) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
            {row.brandCategory}
          </Typography>
        );
      },
      // sortable: true,
    },
    {
      name: "Affiliate link",
      // grow: 2,
      selector: (row) => (
        <Typography
          sx={{ fontSize: "14px", fontWeight: 500, marginRight: "5px" }}
        >
          {row?.notAffiliateLink ? "No" : "Yes"}
        </Typography>
      ),
      // sortable: true,
    },
    {
      name: "Location",
      selector: (row) => (
        <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
          {row.brandLocation}
        </Typography>
      ),
      // cell: (row) => <span>{row.brandLocation}</span>,
      // sortable: true,
      // hide: "md",
    },
    {
      name: "Followers",
      selector: (row) => row.followers,
      cell: (row) => (
        <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
          {row.followers}
        </Typography>
      ),
      // sortable: true,
      // hide: "md",
    },
    {
      name: "Status",
      selector: (row) => row.brandStatus,
      cell: (row) => {
        return (
          row.brandStatus && (
            <Typography
              sx={{
                fontSize: "12px",
                lineHeight: "14px",
                fontWeight: 500,
                paddingX: "8px",
                paddingY: "4px",
                backgroundColor:
                  row?.brandStatus?.toLowerCase() === "active"
                    ? "#2DC58C"
                    : "#EB5757",
                borderRadius: "2px",
                color: "white",
              }}
            >
              {row.brandStatus}
            </Typography>
          )
        );
      },
      // sortable: true,
      // hide: "md",
    },
    {
      name: "Action",
      cell: (row) => {
        const updatedAction= actions.filter((act) => {
          if(act?.actionName==="Approve"||act?.actionName==="Reject"){
            if(row?.brandStatus?.toLowerCase()==="pending"){
              return act
            }
          }
          else{
            return act;
          }
        })
        return <TableActionMenu row={row} updatedActionList={updatedAction} />;
      },
      sortable: false,
      // hide: "md",
    },
  ];
};

export const generateDealColumns = (actions) => {
  return [
    {
      name: "Created on",
      selector: (row) => row?.createdAt,
      cell: (row) => (
        <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
          {new Date(row?.createdAt?.seconds * 1000).toDateString()}
        </Typography>
      ),
      // sortable: true,
      // hide: "lg",
    },
    {
      name: "Deal Type",
      selector: (row) => row?.dealType,
      cell: (row) => {
        return (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 500,
              paddingX: "8px",
              paddingY: "4px",
              backgroundColor: row.dealType === "Sales" ? "#9B51E0" : "#2F80ED",
              borderRadius: "2px",
              color: "white",
              whiteSpace: "nowrap",
            }}
          >
            {row.dealType}
          </Typography>
        );
      },
      // sortable: true,
      // hide: "md",
    },
    {
      name: "Deal Category",
      selector: (row) => row?.dealCategory,
      cell: (row) => (
        <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
          {row?.dealCategory}
        </Typography>
      ),
      // sortable: true,
      // hide: "md",
    },
    {
      name: "Coupon",
      selector: (row) => row.coupon,
      cell: (row) => (
        <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
          {row.coupon}
        </Typography>
      ),
      // sortable: true,
      // hide: "md",
    },
    {
      name: "Start At",
      selector: (row) => row.startingDate,
      cell: (row) => (
        <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
          {new Date(row?.startingDate?.seconds * 1000).toDateString()}
        </Typography>
      ),
      // sortable: true,
      // hide: "lg",
    },
    {
      name: "End At",
      selector: (row) => row.endDate,
      cell: (row) => (
        <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
          {new Date(row?.endDate?.seconds * 1000).toDateString()}
        </Typography>
      ),
      // sortable: true,
      // hide: "lg",
    },
    {
      name: "Review",
      selector: (row) => row.reviewDate,
      cell: (row) => (
        <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
          {new Date(row?.reviewDate?.seconds * 1000).toDateString()}
        </Typography>
      ),
      // sortable: true,
      // hide: "lg",
    },
    {
      name: "Featured",
      selector: (row) => row.isFeatureDeal,
      cell: (row) => (
        <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
          {row.isFeatureDeal ? "Yes" : "no"}
        </Typography>
      ),
      // sortable: true,
      // hide: "md",
    },
    {
      name: "Action",
      cell: (row) => (
        <TableActionMenu
          row={row}
          updatedActionList={actions}
        />
      ),
      // sortable: false,
      // hide: "md",
    },
  ];
};

export const issueColumns = [
  {
    name: "Date",
    grow: 1,
    selector: (row) => row?.createdAt,
    cell: (row) => (
      // <span>{new Date(row?.createdAt?.seconds * 1000).toDateString()}</span>
      <span>{new Date(row?.createdAt?.seconds * 1000).toDateString()}</span>
    ),
  },
  {
    name: "User",
    grow: 1,
    selector: (row) => row?.userName,
    cell: (row) => {
      return (
        <>
          {/* <span className="ps-2 text-info">{row?.userName}</span> */}
          <a
            // href="#"
            onClick={() => {
              const userId = row?.userId;
              const newURL = `/users/user/view/${userId}`;
              window.location.href = newURL;
            }}
            className="text-blue-500"
          >
            {row?.userName}
          </a>
          {/* <span onClick={() => {
            navigate(`/users/user/view/${row?.userId}`)
          }} className="text-blue-500">
            {row?.userName}
          </span> */}
        </>
      );
    },
  },
  {
    name: "User Location",
    grow: 1,
    selector: (row) => row?.userLocation,
    cell: (row) => <span>{row?.userLocation}</span>,
  },
  {
    name: "Issue Type",
    grow: 2,
    selector: (row) => row?.issueType,
    cell: (row) => {
      return <span>{row?.issueType}</span>;
    },
  },
  {
    name: "Note",
    grow: 2,
    selector: (row) => row.note,
    cell: (row) => {
      return <span>{row.note}</span>;
    },
  },
];

export const generateAllDealsColumns = (actions, user) => {
  const arr = [
    {
      name: "Created On",
      grow: 2,
      selector: (row) => row?.createdAt,
      cell: (row) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
            {new Date(row?.createdAt?.seconds * 1000).toDateString()}
          </Typography>
        );
      },
      // sortable: true,
      // hide: "lg",
    },
    {
      name: "Deal Type",
      grow: 2,
      selector: (row) => row?.dealType,
      //   cell: (row) => (row.isCarrierPartner ? "Yes" : "No"),
      cell: (row) => {
        return (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 500,
              paddingX: "8px",
              paddingY: "4px",
              backgroundColor: row?.dealType === "Sales" ? "#9B51E0" : "#2F80ED",
              borderRadius: "2px",
              color: "white",
              whiteSpace: "nowrap",
            }}
          >
            {row.dealType}
          </Typography>
        );
      },
    },
    {
      name: "Brand",
      grow: 2,
      selector: (row) => row.brand,
      //   cell: (row) => <span>{`${row.rating.toFixed(2) || 0}/5`}</span>,
      cell: (row) => {
        return (
          // <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
          //   {row.brand}
          // </Typography>
          <>
            {row.brandLogo ? (
              <img
                src={row.brandLogo}
                style={{ width: "24px", height: "24px", borderRadius: "50%" }}
                staticImage
                alt={row.brandName}
              />
            ) : (
              row?.brandName ? (
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
                  {row?.brandName?.charAt(0).toUpperCase()}
                </div>
              ) :
                (" ")
            )}
            <Typography
              sx={{ fontSize: "14px", fontWeight: 500, marginLeft: "5px" }}
            >
              {row?.brandName}
            </Typography>
          </>
        );
      },
      // sortable: true,
    },
    {
      name: "Deal Category",
      grow: 2,
      selector: (row) => row?.dealCategory,
      //   cell: (row) => <span>{`${row.rating.toFixed(2) || 0}/5`}</span>,
      cell: (row) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
            {row?.dealCategory}
          </Typography>
        );
      },
      // sortable: true,
    },
    {
      name: "Coupon",
      grow: 2,
      selector: (row) => row?.coupon,
      // sortable: true,
      cell: (row) => {
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              sx={{ fontSize: "14px", fontWeight: 500, marginRight: "5px" }}
            >
              {row?.coupon}
            </Typography>
          </Box>
        );
      },
    },
    {
      name: "Start At",
      grow: 2,
      selector: (row) => row?.startingDate,
      // sortable: true,
      // hide: "md",
      cell: (row) => {
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              sx={{ fontSize: "14px", fontWeight: 500, marginRight: "5px" }}
            >
              {new Date(row?.startingDate?.seconds * 1000).toDateString()}
            </Typography>
          </Box>
        );
      },
    },
    {
      name: "End At",
      grow: 2,
      selector: (row) => row?.endDate,
      // sortable: true,
      // hide: "md",
      cell: (row) => {
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              sx={{ fontSize: "14px", fontWeight: 500, marginRight: "5px" }}
            >
              {new Date(row?.endDate?.seconds * 1000).toDateString()}
            </Typography>
          </Box>
        );
      },
    },
    {
      name: "Review",
      grow: 2,
      selector: (row) => row?.reviewDate,
      // sortable: true,
      // hide: "md",
      cell: (row) => {
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              sx={{ fontSize: "14px", fontWeight: 500, marginRight: "5px" }}
            >
              {new Date(row?.reviewDate?.seconds * 1000).toDateString()}
            </Typography>
          </Box>
        );
      },
    },
    {
      name: "Featured",
      selector: (row) => row?.isFeatureDeal,
      cell: (row) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
            {row?.isFeatureDeal ? "Yes" : "no"}
          </Typography>
        );
      },
    },
    {
      name: "Action",
      cell: (row) => {
        // console.log(actions, "actions>>>");
        // console.log(row, "row>>>");
        // const updatedActionList = actions.filter((act) => {
        //   if (act.id === "add-main-address") {
        //     if (row.isRoutePartner) {
        //       return true;
        //     } else {
        //       return false;
        //     }
        //   } else {
        //     return true;
        //   }
        // });
        // console.log(updatedActionList, "updatedActionList>>>");
        return (
          <TableActionMenu row={row} updatedActionList={actions} />
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
