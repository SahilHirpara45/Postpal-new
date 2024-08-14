import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  InputBase,
  Tooltip,
  Typography,
  alpha,
  styled,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import SearchIcon from "@mui/icons-material/Search";
import { BorderBottom, BorderRight } from "@mui/icons-material";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import SimpleBar from "simplebar-react";
import { useSelector } from "react-redux";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "12px",
  backgroundColor: "#FAFAFA",
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  marginRight: "12px",
  // width: "230px",
  height: "40px",
  [theme.breakpoints.up("sm")]: {
    // marginLeft: theme.spacing(1),
    // width: "auto",
  },
  border: "1px solid #EEEEEE",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      // width: "12ch",
      "&:focus": {
        // width: "20ch",
      },
    },
  },
}));

const PackagesUserwise = ({
  userActiveData,
  packageClickHandler,
  packageActiveData,
}) => {
  const [loading, setLoading] = useState(false);
  const [packagesData, setPackagesData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [tooltipText, setTooltipText] = useState({});

  const user = useSelector((state) => state.auth.value);
  console.log(user, "user");
  console.log(userActiveData, "userActiveData");

  useEffect(() => {
    if (userActiveData?.userId && user) {
      setLoading(true);
      try {
        const fetchUserPackages = async () => {
          const querySnapshot = collection(db, "shelfPackages");

          const q1 = query(
            querySnapshot,
            where("userId", "==", userActiveData?.userId),
            where("isNoSuite", "==", false),
            where("isPackageAddedToShipment", "==", false),
            where("warehouseRoutePartnerId", "==", user.routePartnerId)
          );
          const q2 = query(
            querySnapshot,
            where("userId", "==", userActiveData?.userId),
            where("isNoSuite", "==", false),
            where("isPackageAddedToShipment", "==", false)
          );
          const q = user?.role === "Superadmin" ? q2 : q1;
          const unsubscribe = onSnapshot(q, (snapshot) => {
            const arr = [];
            snapshot.forEach((doc) => {
              arr.push({ ...doc.data(), id: doc.id });
            });

            const filterNonAbandonedPackages = arr.filter((item) =>
              item.abandoned
                ? new Date(item.abandoned.seconds * 1000) > new Date()
                : true
            );

            // Sort packages by arrivedAt timestamp
            filterNonAbandonedPackages.sort((a, b) => {
              const dateA = a.arrivedAt
                ? new Date(a.arrivedAt.seconds * 1000)
                : new Date(0);
              const dateB = b.arrivedAt
                ? new Date(b.arrivedAt.seconds * 1000)
                : new Date(0);
              return dateB - dateA; // Latest packages first
            });

            setPackagesData(filterNonAbandonedPackages);
          });
          return () => unsubscribe();
        };
        fetchUserPackages();
      } catch (error) {
        setLoading(false);
        console.log(error, "error");
      }
    }
  }, [user, userActiveData]);

  const getNextTrackingId = (existingIds) => {
    const lastId = existingIds.sort().pop();
    if (!lastId) return "A";

    let nextId = "";
    let carry = true;
    for (let i = lastId.length - 1; i >= 0; i--) {
      if (carry) {
        if (lastId[i] === "Z") {
          nextId = "A" + nextId;
        } else {
          nextId = String.fromCharCode(lastId.charCodeAt(i) + 1) + nextId;
          carry = false;
        }
      } else {
        nextId = lastId[i] + nextId;
      }
    }
    if (carry) nextId = "A" + nextId;

    return nextId;
  };

  const handleIconClick = (id, trackingId) => {
    navigator.clipboard.writeText(trackingId);
    setTooltipText((prev) => ({ ...prev, [id]: "Copied!" }));
    setTimeout(() => {
      setTooltipText((prev) => ({ ...prev, [id]: "Copy" }));
    }, 2000);
  };

  const filterPackages = packagesData?.filter((item) =>
    item?.packageTrackingId?.toLowerCase().includes(searchValue?.toLowerCase())
  );

  // console.log(filterPackages, "filterPackages");

  return (
    <div>
      <Box sx={{ p: "12px 0px 12px 12px" }}>
        <Typography variant="h5" sx={{ mb: "16px", ml: "12px" }}>
          Select Package
        </Typography>
        <Box>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search Tracking and package ID"
              inputProps={{ "aria-label": "search" }}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </Search>
        </Box>
        <FormGroup sx={{ mt: "8px" }}>
          <SimpleBar
            forceVisible="y"
            autoHide={true}
            style={{ maxHeight: "80vh", width: "100%" }}
          >
            {filterPackages && filterPackages.length > 0 ? (
              filterPackages?.map((item, index) => {
                const date = new Date(item?.createdAt?.seconds * 1000); // Convert seconds to milliseconds
                const formattedDate = date.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
                const formattedTime = date.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                });
                const formattedDateTime = `${formattedDate} ${formattedTime}`;

                return (
                  <Box
                    key={index}
                    sx={{
                      position: "relative",
                      mr: "12px",
                      mt: "8px",
                    }}
                    onClick={() => {
                      packageClickHandler(item?.id, item);
                    }}
                  >
                    <Box
                      sx={{
                        borderRadius: "4px",
                        display: "flex",
                        padding: "8px 12px 8px 12px",
                        overflow: "hidden",
                        cursor: "pointer",
                        border:
                          packageActiveData?.id === item?.id
                            ? "1px solid #481AA3"
                            : "1px solid #EEEEEE",
                        backgroundColor:
                          packageActiveData?.id === item?.id && "#EBE4FA",
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            sx={{
                              "& .MuiCheckbox-sizeSmall": {
                                border: "1px solid #E5E5E8",
                              },
                            }}
                          />
                        }
                        label={
                          <Typography variant="subtitle2">
                            {item?.packageId ? item?.packageId : "-"}
                          </Typography>
                        }
                        sx={{
                          color: "primary.main",
                        }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Box sx={{ display: "flex", gap: "1px" }}>
                          <Typography variant="subtitle1">
                            {item?.packageTrackingId}
                          </Typography>
                          <Tooltip
                            title={tooltipText[item?.id] || "Copy"}
                            arrow
                            placement="right"
                          >
                            <Icon
                              icon="material-symbols:content-copy-outline-sharp"
                              width={16}
                              height={16}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleIconClick(
                                  item?.id,
                                  item?.packageTrackingId
                                );
                              }}
                              style={{ cursor: "pointer", color: "#828282" }}
                            />
                          </Tooltip>
                        </Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ color: "#8C8C8C" }}
                        >
                          {formattedDateTime}
                        </Typography>
                      </Box>
                    </Box>
                    {!item.shelfId && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: "0px",
                          left: "-5px",
                          width: 0,
                          height: 0,
                          borderLeft: "10px solid transparent",
                          borderRight: "10px solid transparent",
                          borderBottom: "10px solid #EB5757",
                          transform: "rotate(-45deg)",
                        }}
                      ></Box>
                    )}
                  </Box>
                );
              })
            ) : (
              <Box sx={{ textAlign: "center", mt: "20px" }}>
                No Packages Found
              </Box>
            )}
          </SimpleBar>
        </FormGroup>
      </Box>
    </div>
  );
};

export default PackagesUserwise;
