import {
  Badge,
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
import { db, dbRealtime } from "../../../firebaseConfig";
import SimpleBar from "simplebar-react";
import { BsFillChatTextFill } from "react-icons/bs";
import { onValue, ref as realtimeRef, update } from "firebase/database";
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

const PackagesShopping = ({
  userActiveData,
  packageClickHandler,
  packageActiveData,
  historyClickHandler,
  chatClickHandler,
}) => {
  const [loading, setLoading] = useState(false);
  const [packagesData, setPackagesData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [chatsData, setChatsData] = useState([]);
  const [chatsOrderData, setChatsOrderData] = useState([]);
  const [isClickOnChat, setIsClickOnChat] = useState(false);
  const [tooltipText, setTooltipText] = useState({});
  const user = useSelector((state) => state.auth.value);

  useEffect(() => {
    if (packageActiveData?.id) {
      const chatRef = realtimeRef(
        dbRealtime,
        "orderChats/" + packageActiveData.id + "/chats"
      );

      const unsubscribe = onValue(chatRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Convert the data object into an array
          const arr = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setChatsData(arr);
          isClickOnChat && readStatusChange(arr);
        } else {
          setChatsData([]);
        }
      });
      return () => {
        unsubscribe();
      };
    }
  }, [isClickOnChat, packageActiveData.id]);

  useEffect(() => {
    const chatOrderRef = realtimeRef(dbRealtime, "orderChats/");

    const unsubscribe = onValue(chatOrderRef, (snapshot) => {
      const data = snapshot.val();
      // console.log(data, "data in orderchats realtime");
      if (data) {
        // Convert the data object into an array
        const arr = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        setChatsOrderData(arr);
        console.log(arr, "arr");
      } else {
        // Handle the case where there is no data
        setChatsOrderData([]);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (userActiveData?.userId && user?.role) {
      setLoading(true);
      try {
        const fetchUserPackages = async () => {
          const querySnapshot = collection(db, "shelfShoppingPackages");
          const q1 = query(
            querySnapshot,
            where("userId", "==", userActiveData?.userId),
            where("isNoSuite", "==", false),
            where("warehouseRoutePartnerId", "==", user.routePartnerId)
          );
          const q2 = query(
            querySnapshot,
            where("userId", "==", userActiveData?.userId),
            where("isNoSuite", "==", false)
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
  }, [userActiveData, user]);

  // const unReadMessageHandler = () => {
  const orderUnreadCounts = {};
  chatsOrderData.forEach((order) => {
    const orderId = order.id;
    let unreadCount = 0;

    // Iterate through the chats within each order
    for (const chatId in order.chats) {
      const chat = order.chats[chatId];
      if (!chat.isReadAdmin) {
        unreadCount++;
      }
    }

    // Store the unread count for the order
    orderUnreadCounts[orderId] = unreadCount;
    // console.log(orderUnreadCounts, "orderUnreadCounts");
  });
  // // }

  console.log(chatsData, "chatsData in readStatusChange outside");
  const readStatusChange = async (arr) => {
    console.log(chatsData, "chatsData in readStatusChange");
    const unread = arr.filter((m) => m.isReadAdmin === false);
    console.log(unread, "unread messages");

    if (unread.length > 0) {
      const chatUpdates = {};

      unread.forEach((u) => {
        const chatKey = u.messageId;
        chatUpdates[`${chatKey}/isReadAdmin`] = true;

        // Update the isRead field in your chatsData array
        // const chatIndex = chatsData.findIndex((chat) => chat.messageId === chatKey);
        // if (chatIndex !== -1) {
        //   chatsData[chatIndex].isRead = true;
        // }
      });
      const chatRef = realtimeRef(
        dbRealtime,
        `orderChats/${packageActiveData?.id}/chats`
      );

      await update(chatRef, chatUpdates)
        .then(() => {
          // toast.success("Data updated successfully.");
        })
        .catch((error) => {
          console.error("Error updating data:", error);
        });
    }
  };

  const filterPackages = packagesData?.filter((item) =>
    item?.packageTrackingId?.toLowerCase().includes(searchValue?.toLowerCase())
  );

  // console.log(filterPackages, "filterPackages");

  const handleIconClick = (id, trackingId) => {
    navigator.clipboard.writeText(trackingId);
    setTooltipText((prev) => ({ ...prev, [id]: "Copied!" }));
    setTimeout(() => {
      setTooltipText((prev) => ({ ...prev, [id]: "Copy" }));
    }, 2000);
  };

  return (
    <div>
      <Box sx={{ p: "12px 0px 12px 12px" }}>
        <Typography variant="h5" sx={{ mb: "16px", ml: "12px" }}>
          Select Request
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
                const date = new Date(item?.requestedAt?.seconds * 1000); // Convert seconds to milliseconds
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
                      setIsClickOnChat(false);
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
                        <Box
                          sx={{ mt: "4px", cursor: "pointer" }}
                          onClick={(e) =>
                            historyClickHandler(item?.id, item, e)
                          }
                        >
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, color: "primary.main" }}
                          >
                            See history
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        onClick={(e) => {
                          chatClickHandler(e, item?.id, item);
                          setIsClickOnChat(true);
                          // readStatusChange(chatsData);
                        }}
                        sx={{
                          ml: "auto",
                          cursor: "pointer",
                        }}
                      >
                        <Badge
                          color="secondary"
                          badgeContent={
                            orderUnreadCounts[item.id]
                              ? orderUnreadCounts[item.id]
                              : 0
                          }
                          sx={{
                            "& .MuiBadge-badge": {
                              fontSize: "10px",
                              fontWeight: 600,
                              minWidth: 15,
                              height: 15,
                              mt: "2px",
                            },
                          }}
                        >
                          <BsFillChatTextFill size={20} color="#959BA1" />
                        </Badge>
                      </Box>
                    </Box>
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

export default PackagesShopping;
