import React, { useEffect, useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  CircularProgress,
  IconButton,
  InputBase,
  Typography,
  alpha,
  styled,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import VerifiedIcon from "@mui/icons-material/Verified";
import { Icon } from "@iconify/react/dist/iconify.js";
import dummyImage1 from "../../../assets/svg/logo_blue.svg";
import flag from "../../../assets/images/flag.png";
import { BsFillChatTextFill } from "react-icons/bs";
import { FaArrowRight } from "react-icons/fa";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "simplebar-react/dist/simplebar.min.css";
import countryFlags from "../../../CountryFlags.json";
import {
  arrayRemove,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db, dbRealtime } from "../../../firebaseConfig";
import SimpleBar from "simplebar-react";
import { VscUnverified } from "react-icons/vsc";
import { onValue, ref as realtimeRef, update } from "firebase/database";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "12px",
  backgroundColor: "#FAFAFA",
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
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
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const AllUserComplete = ({
  chatClickHandler,
  userClickHandler,
  userActiveData,
}) => {
  const [ordersData, setOrdersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatsData, setChatsData] = useState([]);
  const [chatsOrderData, setChatsOrderData] = useState([]);
  // const [chatsOrderData, setChatsOrderData] = useState({});
  const [isClickOnChat, setIsClickOnChat] = useState(false);
  const user = useSelector((state) => state.auth.value);

  useEffect(() => {
    if (userActiveData?.id) {
      const chatRef = realtimeRef(
        dbRealtime,
        "orderChats/" + userActiveData?.id + "/chats"
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
  }, [userActiveData?.id, userActiveData]);

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
    setLoading(true);
    try {
      const fetchData = async () => {
        const querySnapshot = collection(db, "shipments");
        const q = query(querySnapshot);
        const snapshot = await getDocs(q);

        const promises = snapshot.docs.map(async (docSnapshot) => {
          const orderData = docSnapshot.data();
          // const routePartnerId = orderData.routePartnerId;
          const userId = orderData.userId;
          const packageIds = orderData.packageIds || [];
          console.log(packageIds, "packageIds");

          let isConsolidated = false;

          if (packageIds.length > 0) {
            const packageChecks = await Promise.all(
              packageIds.map(async (packageId) => {
                const packageDoc = await getDoc(
                  doc(db, "shelfPackages", packageId)
                );
                const packageData = packageDoc.data();

                if (
                  user?.role === "Route Partner Admin" &&
                  user?.routePartnerId !== packageData?.warehouseRoutePartnerId
                ) {
                  return false;
                }

                if (packageData?.isPackageConsolidated) {
                  isConsolidated = true;
                }

                return true;
              })
            );

            if (packageChecks.some((check) => check === false)) {
              return null;
            }
          } else {
            return null;
          }

          if (isConsolidated) return null;

          if (userId) {
            // const mapUserRoutePartnersQuery = query(
            //   collection(db, "mapUserRoutePartners"),
            //   where("routePartnerId", "==", routePartnerId),
            //   where("userId", "==", userId)
            // );

            // const mapUserRoutePartnersSnapshot = await getDocs(
            //   mapUserRoutePartnersQuery
            // );

            // for (const mapUserRoutePartnersDoc of mapUserRoutePartnersSnapshot.docs) {
            const userData = await getUserData(userId);
            // const bayNumber =
            //   mapUserRoutePartnersDoc.data().uniqueAddressCode;

            if (userData) {
              return {
                ...orderData,
                id: docSnapshot.id,
                // bayNumber: bayNumber,
                name: userData.name,
                profileImage: userData.profileImage,
                phoneVerified: userData.phoneVerified,
              };
            } else if (!userData) {
              return {
                ...orderData,
                id: docSnapshot.id,
                // bayNumber: bayNumber,
              };
            } else {
              return null; // If both userData and bayNumber are undefined, return null
            }
            // }
          } else {
            return orderData;
          }
        });

        const arr = await Promise.all(promises);
        // Filter out null and undefined elements from the array
        const filteredArr = arr.filter(
          (item) => item !== null && item !== undefined
        );
        // console.log(filteredArr, "arr in booking");
        setOrdersData(filteredArr);
        setLoading(false);
      };

      fetchData();
    } catch (error) {
      setLoading(false);
      console.log(error, "error");
    }
  }, []);

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
        `orderChats/${userActiveData?.id}/chats`
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

  const getUserData = async (userId) => {
    if (!getUserData.cache) {
      getUserData.cache = new Map();
    }

    if (getUserData.cache.has(userId)) {
      return getUserData.cache.get(userId);
    } else {
      const userDocRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDocRef);
      const userData = userDocSnap.exists() ? userDocSnap.data() : null;
      getUserData.cache.set(userId, userData);
      return userData;
    }
  };

  const getImageUrlByCountryCode = (countryName) => {
    const country = countryFlags.find(
      (country) => country?.name === countryName
    );
    return country ? country.image : "";
  };

  return (
    <div className="">
      <Box sx={{ p: "0px 16px" }}>
        <Typography variant="h5" sx={{ m: "12px 0 16px 12px" }}>
          Shippings
        </Typography>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
          />
        </Search>
      </Box>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            mt: "16px",
          }}
        >
          <CircularProgress size={30} />
        </Box>
      ) : ordersData?.length > 0 ? (
        <SimpleBar
          forceVisible="y"
          autoHide={true}
          style={{ maxHeight: "75vh", marginTop: "16px" }}
        >
          <Box>
            {ordersData?.length > 0 &&
              ordersData?.map((item, index) => (
                <Box
                  key={index}
                  onClick={() => {
                    userClickHandler(item?.id, item);
                    setIsClickOnChat(false);
                  }}
                  sx={{
                    // height: "74px",
                    position: "relative",
                    cursor: "pointer",
                    ":hover": { backgroundColor: "#EBE4FA" },
                    backgroundColor:
                      userActiveData?.id === item?.id && "#EBE4FA",
                  }}
                >
                  <Box
                    sx={{
                      p: "14px 24px",
                      display: "flex",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box sx={{ position: "relative" }}>
                      <Avatar
                        src={
                          item?.profileImage ? item?.profileImage : dummyImage1
                        }
                        alt=""
                        sx={{ width: "40px", height: "40px" }}
                      />
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          position: "absolute",
                          bottom: -5,
                          right: -5,
                        }}
                      >
                        <CircularProgressbar
                          value={item?.trustScore ? item?.trustScore : 0}
                          text={`${item?.trustScore ? item?.trustScore : 0}`}
                          strokeWidth={15}
                          background={true}
                          styles={buildStyles({
                            textSize: "50px",
                            pathColor: "#2DC58C",
                            textColor: "#2DC58C",
                            transformOrigin: "center center",
                            backgroundColor: "#fff",
                            fontSize: 600,
                          })}
                        />
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        width: "100%",
                      }}
                    >
                      <Box sx={{ ml: "12px" }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography variant="subtitle2">
                            {/* {item?.routePartnerName} */}
                            {item?.name}
                          </Typography>
                          {item?.phoneVerified === true ? (
                            <VerifiedIcon
                              sx={{
                                ml: "4px",
                                color: "primary.main",
                                fontSize: "16px",
                              }}
                            />
                          ) : (
                            <VscUnverified
                              style={{
                                marginLeft: "4px",
                                color: "#F0AD4E",
                                fontSize: "18px",
                              }}
                            />
                          )}
                        </Box>
                        <Box
                          sx={{
                            mt: "6px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="h6">
                            {item?.bayNumber ? item?.bayNumber : "N/A"}
                          </Typography>
                          {/* <img src={item?.country} alt="" style={{ marginLeft: "4px" }} /> */}
                          {item?.country && (
                            <img
                              src={getImageUrlByCountryCode(item?.country)}
                              alt={`Flag of ${item?.country}`}
                              style={{ marginLeft: "4px" }}
                              width={12}
                              height={14}
                            />
                          )}
                        </Box>
                        <Box
                          sx={{
                            mt: "6px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="h6">
                            {item?.id ? item?.id : "N/A"}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              height: "13px",
                              width: "13px",
                              borderRadius: "50%",
                              backgroundColor: "#481AA3",
                              color: "#fff",
                              marginLeft: "4px",
                            }}
                          >
                            <FaArrowRight style={{ fontSize: "9px" }} />
                          </Box>
                        </Box>
                      </Box>
                      <Box
                        onClick={(e) => {
                          chatClickHandler(e, item?.id, item);
                          setIsClickOnChat(true);
                          // readStatusChange();
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
                </Box>
              ))}
          </Box>
        </SimpleBar>
      ) : (
        <Box sx={{ textAlign: "center", mt: "20px" }}>No Shipping Found</Box>
      )}
    </div>
  );
};

export default AllUserComplete;
