import {
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  Input,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import {
  push,
  ref as realtimeRef,
  set,
  serverTimestamp as realtimeTimestamp,
  onValue,
  get,
  orderByChild,
  limitToLast,
  update,
  remove,
} from "firebase/database";
import React, { useEffect, useMemo, useRef, useState } from "react";
import VerifiedIcon from "@mui/icons-material/Verified";
import { Icon } from "@iconify/react/dist/iconify.js";
import { IoSend } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import dummyImage from "../../../../assets/svg/logo_blue.svg";
import { RiCheckDoubleLine } from "react-icons/ri";
import { FiDownload } from "react-icons/fi";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { dbRealtime, storage } from "../../../../firebaseConfig";
import SimpleBar from "simplebar-react";
import { isValidUrl } from "../../../../helper";
import MessageActions from "./Message";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { AiOutlinePaperClip } from "react-icons/ai";
import { VscUnverified } from "react-icons/vsc";

const OrderChats = ({ activeChatId, orderactiveData }) => {
  const [chatsData, setChatsData] = useState([]);
  const [orderChatsData, setOrderChatsData] = useState([]);
  const [messageValue, setMessageValue] = useState("");
  const [isEdited, setIsEdited] = useState(false);
  const [editedMessageId, setEditedMessageId] = useState(false);
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const chatPanelRef = useRef(null);
  const fileInputRef = useRef(null);

  // console.log(activeChatId, "activeChatId");
  // console.log(orderactiveData, "orderactiveData");

  useEffect(() => {
    // console.log(orderactive, "orderactive useEffect");

    if (activeChatId) {
      // Create a reference to the chats node for the active order
      const chatRef = realtimeRef(
        dbRealtime,
        "orderChats/" + activeChatId + "/chats"
      );

      // Set up a listener for changes to the chat data for the active order
      const unsubscribe = onValue(chatRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Convert the data object into an array
          const arr = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));

          // Sort the array by the 'date' field in descending order (most recent first)
          arr.sort((a, b) => b.date - a.date);

          // Take the first 10 messages (most recent) for the active order
          const lastTenMessages = arr.slice(0, 10);

          // console.log(lastTenMessages, "lastTenMessages in chats realtime");
          setChatsData(arr);

          // Scroll to the bottom when new messages arrive
          // if (chatContainerRef.current) {
          //   chatContainerRef.current.scrollTop =
          //     chatContainerRef.current.scrollHeight;
          // }
        } else {
          // Handle the case where there is no data for the active order
          setChatsData([]);
        }
      });
      return () => {
        unsubscribe();
      };
    }
  }, [activeChatId]);

  useEffect(() => {
    const chatPath = "orderChats/" + activeChatId;

    const chatRef = realtimeRef(dbRealtime, chatPath);

    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setOrderChatsData(data);
      } else {
        console.log("No data at path", chatPath);
        setOrderChatsData();
      }
    });
    return () => {
      unsubscribe();
    };
  }, [activeChatId]);

  // console.log(chatsData, "chatsData");
  // console.log(orderChatsData, "orderChatsData");

  useEffect(() => {
    // console.log("calledd????????");
    // chatPanelRef.current.scrollTo({
    //   top: chatPanelRef.current.scrollHeight,
    //   behavior: "smooth",
    // });
    if (chatPanelRef.current) {
      // Check if the chat panel has content
      const hasContent =
        chatPanelRef.current.scrollHeight > chatPanelRef.current.clientHeight;

      if (hasContent) {
        // Use a vanilla JavaScript approach to scroll to the bottom
        chatPanelRef.current.scrollTop = chatPanelRef.current.scrollHeight;
      }
    }
  }, [chatsData]);

  // Group messages by date
  const groupedMessages = {};
  chatsData.forEach((message) => {
    const date = new Date(message.date);
    const dateKey = date.toDateString(); // Grouping by date (excluding time)
    if (!groupedMessages[dateKey]) {
      groupedMessages[dateKey] = [];
    }
    groupedMessages[dateKey].push(message);
  });

  const sortedDates = Object.keys(groupedMessages).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA - dateB; // Sort in descending order (latest date first)
  });

  // console.log(groupedMessages, "groupedMessages");
  // console.log(sortedDates, "sortedDates");
  // console.log(selectedOrderData, "selectedOrderData");
  // console.log(orderChatsData, "orderChatsData");

  // Handle hover events for messages
  const handleMouseEnter = (messageId) => {
    setHoveredMessageId(messageId);
  };

  const handleMouseLeave = () => {
    setHoveredMessageId(null);
  };

  const downloadFile = (filePath, fileName) => {
    // saveAs(filePath, fileName)
    const proxyUrl = "https://cors-anywhere.herokuapp.com/"; // Use the proxy URL
    // console.log(filePath, fileName, "filePath");

    fetch(filePath)
      .then((response) => {
        response.blob().then((blob) => {
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement("a");
          a.href = url;
          a.download = fileName;
          a.click();
        });
      })
      .catch((error) => console.error("Error downloading the file:", error));
  };

  const messageSendHandler = async () => {
    const isLink = isValidUrl(messageValue);
    try {
      // const docRef = await addDoc(collection(db, "orderChat", orderactive, "chats"), {
      //   message: messageValue,
      //   date: serverTimestamp(),
      // }).then(async (res) => {
      //   // console.log(res, "res in AddMainAddress");
      //   setMessageValue("")
      //   toast.success("message sended Successfully");
      // });
      const chatRef = realtimeRef(
        dbRealtime,
        "orderChats/" + activeChatId + "/chats"
      );
      const newChatEntryRef = push(chatRef); // Create a new unique key for the message

      const messageId = newChatEntryRef.key; // Get the generated messageId

      await set(newChatEntryRef, {
        message: messageValue,
        date: realtimeTimestamp(),
        sentBy: orderactiveData.routePartnerId,
        isReadAdmin: true,
        isReadUser: false,
        messageId: messageId,
        messageType: !isLink ? "text" : "link",
      }).then(async (res) => {
        // console.log(res, "res in AddMainAddress");
        // toast.success("message sended Successfully");
        setMessageValue("");

        const chatRefOrder = realtimeRef(
          dbRealtime,
          `orderChats/${activeChatId}`
        );

        update(chatRefOrder, {
          isOrderChatActive: true,
          // adminId: userData?.id,
          userId: orderactiveData.userId,
          lastMessageDate: realtimeTimestamp(),
        })
          .then(() => {
            // toast.success("OrderChatActive updated successfully.");
          })
          .catch((error) => {
            console.error("Error updating data:", error);
          });
      });
    } catch (error) {
      console.log(error, "error");
    }
    // if(activeContent === "Chats") {
    //   console.log("Here 2");
    //   readStatusChange()
    // }
  };

  const checkForEnter = (e) => {
    if ((e.keyCode || e.which) == 13 && !e.shiftKey) {
      isEdited ? editMessage() : messageSendHandler();
    }
  };

  const sendMessage = (messageContent, mediaType, fileName) => {
    try {
      const chatRef = realtimeRef(
        dbRealtime,
        "orderChats/" + activeChatId + "/chats"
      );
      const newChatEntryRef = push(chatRef);

      const messageId = newChatEntryRef.key;

      set(newChatEntryRef, {
        message: messageContent,
        date: realtimeTimestamp(),
        sentBy: orderactiveData.routePartnerId,
        isReadAdmin: true,
        isReadUser: false,
        messageId: messageId,
        messageType: "media",
        mediaType: mediaType,
        fileName: fileName,
      }).then(() => {
        setMessageValue("");
        const chatRef = realtimeRef(dbRealtime, `orderChats/${activeChatId}`);

        update(chatRef, {
          isOrderChatActive: true,
          // adminId: userData?.id,
          userId: orderactiveData.userId,
          lastMessageDate: realtimeTimestamp(),
        })
          .then(() => {
            // Chat updated successfully
          })
          .catch((error) => {
            console.error("Error updating data:", error);
          });
      });
    } catch (error) {
      console.log(error, "error");
    }
  };

  const editField = (id, message) => {
    setIsEdited(true);
    setMessageValue(message);
    setEditedMessageId(id);
  };

  const editMessage = () => {
    setIsEdited(false);
    try {
      const chatRef = realtimeRef(
        dbRealtime,
        `orderChats/${activeChatId}/chats/${editedMessageId}`
      );

      update(chatRef, { message: messageValue })
        .then(() => {
          setMessageValue("");
          // toast.success("Message edited successfully.");
        })
        .catch((error) => {
          console.error("Error editing message:", error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteMessage = (messageId) => {
    try {
      // Create a reference to the path of the message you want to delete
      const chatRef = realtimeRef(
        dbRealtime,
        `orderChats/${activeChatId}/chats/${messageId}`
      );

      // Use the remove method to delete the message
      remove(chatRef)
        .then(() => {
          toast.success("Message deleted successfully.");
        })
        .catch((error) => {
          console.error("Error deleting message:", error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    console.log(file, "file");

    if (file) {
      setIsGeneratingLink(true);

      try {
        // Generate a unique file name or use the original file name
        const fileName = `${Date.now()}-${file.name}`;

        const storageRef1 = ref(storage, `/chatAttachments/${fileName}`);
        const uploadTask1 = uploadBytesResumable(storageRef1, file);
        const [snapshot1] = await Promise.all([uploadTask1]);

        const photoUrl1 = await getDownloadURL(snapshot1.ref);
        // .then((url) => {
        //   // `url` is the download URL for 'images/stars.jpg'

        //   // This can be downloaded directly:
        //   const xhr = new XMLHttpRequest();
        //   xhr.responseType = "blob";
        //   xhr.onload = (event) => {
        //     const blob = xhr.response;
        //   };
        //   xhr.open("GET", url);
        //   xhr.send();

        //   // Or inserted into an <img> element
        //   const img = document.getElementById("myimg");
        //   img.setAttribute("src", url);
        // })
        // .catch((error) => {
        //   // Handle any errors
        // });

        if (photoUrl1) {
          sendMessage(photoUrl1, file.type, file.name);
          fileInputRef.current.value = "";
        }
      } catch (error) {
        console.log(error, "error");
      } finally {
        setIsGeneratingLink(false); // Clear the loading state when done
      }
    }
  };

  const changeChatCloseManually = (val) => {
    const chatRef = realtimeRef(dbRealtime, `orderChats/${activeChatId}`);

    update(chatRef, { isOrderChatActive: val })
      .then(() => {
        // Chat updated successfully
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "24px",
          borderBottom: "1px solid #E5E5E8",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ mr: "12px" }}>
            <Icon
              icon={"ic:baseline-keyboard-backspace"}
              width={24}
              height={24}
              style={{ color: "#959BA1", cursor: "pointer" }}
            />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={
                  orderactiveData?.profileImage
                    ? orderactiveData?.profileImage
                    : dummyImage
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
                  cursor: "pointer",
                }}
              >
                <CircularProgressbar
                  value={
                    orderactiveData?.trustScore
                      ? orderactiveData?.trustScore
                      : 0
                  }
                  text={`${
                    orderactiveData?.trustScore
                      ? orderactiveData?.trustScore
                      : 0
                  }`}
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
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ ml: "8px" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="subtitle2">
                    {orderactiveData?.name}
                  </Typography>
                  {orderactiveData?.phoneVerified === true ? (
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
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{ padding: "16px 0px 24px 24px" }}>
        <Box sx={{ position: "relative", height: "72vh" }}>
          {/* <Box ref={chatPanelRef} sx={{ height: "100%", overflow: "auto" }}> */}
            <SimpleBar autoHide={true} scrollableNodeProps={{ ref: chatPanelRef }} style={{ height: "65vh" }}>
              {sortedDates.length > 0 &&
                sortedDates.map((dateKey) => {
                  const date = new Date(dateKey);
                  const today = new Date();
                  const yesterday = new Date(today);
                  yesterday.setDate(today.getDate() - 1);

                  let dateString;
                  if (date.toDateString() === today.toDateString()) {
                    dateString = "Today";
                  } else if (date.toDateString() === yesterday.toDateString()) {
                    dateString = "Yesterday";
                  } else {
                    // Format the date for other days
                    const options = {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    };
                    dateString = date.toLocaleDateString(undefined, options);
                  }

                  // Sort the messages within each group by their internal date
                  const messagesInGroup = groupedMessages[dateKey].sort(
                    (a, b) => a.date - b.date
                  );
                  // console.log(messagesInGroup, "messagesInGroup");
                  return (
                    <Box key={dateKey} sx={{ pr: "24px" }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Box
                          sx={{
                            textAlign: "center",
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{
                              bgcolor: "#EBEBEE",
                              color: "#959BA1",
                              borderRadius: "4px",
                              p: "8px",
                            }}
                          >
                            {dateString}
                          </Typography>
                        </Box>
                      </Box>
                      {messagesInGroup.map((message) => {
                        const messageDate = new Date(message.date);
                        const timeString = messageDate.toLocaleTimeString(
                          "en-US",
                          {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true, // Ensure AM/PM format
                          }
                        );

                        const formattedTimeString =
                          timeString.slice(0, -3) + timeString.slice(-3); // Remove the last three characters (seconds and space)

                        const me =
                          message.sentBy === orderactiveData.routePartnerId;
                        if (message.messageType === "text") {
                          return (
                            <Box
                              key={message.messageId}
                              sx={{
                                display: "flex",
                                justifyContent: me ? "flex-start" : "",
                                flexDirection: me ? "row-reverse" : "row",
                                gap: "10px",
                                mt: "8px",
                              }}
                              onMouseEnter={() =>
                                handleMouseEnter(message.messageId)
                              }
                              onMouseLeave={handleMouseLeave}
                            >
                              <Box sx={{ display: "inline-block" }}>
                                <Typography
                                  variant="subtitle1"
                                  sx={{
                                    display: "flex",
                                    background: me ? "#481AA3" : "#E4E4E7",
                                    borderRadius: "12px",
                                    color: me ? "#fff" : "#1C2630",
                                    padding: "8px",
                                    maxWidth: "500px",
                                  }}
                                >
                                  {message.message}
                                </Typography>
                                <Typography
                                  variant="subtitle1"
                                  sx={{
                                    color: "#9B9B9B",
                                    fontSize: "14px",
                                    display: "flex",
                                    justifyContent: me ? "flex-end" : "",
                                    gap: "5px",
                                  }}
                                >
                                  {formattedTimeString}{" "}
                                  {me && message.isReadUser ? (
                                    <RiCheckDoubleLine
                                      size={20}
                                      style={{ color: "#42ADE2" }}
                                    />
                                  ) : (
                                    <RiCheckDoubleLine size={20} />
                                  )}
                                </Typography>
                              </Box>
                              {me && hoveredMessageId === message.messageId && (
                                <MessageActions
                                  deleteMessage={() =>
                                    deleteMessage(message.id)
                                  }
                                  editMessage={() =>
                                    editField(message.id, message.message)
                                  }
                                />
                              )}
                            </Box>
                          );
                        } else if (message.messageType === "link") {
                          const messageDate = new Date(message.date);
                          const timeString = messageDate.toLocaleTimeString(
                            "en-US",
                            {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true, // Ensure AM/PM format
                            }
                          );

                          const formattedTimeString =
                            timeString.slice(0, -3) + timeString.slice(-3);
                          return (
                            <Box
                              key={message.messageId}
                              sx={{
                                display: "flex",
                                justifyContent: me ? "flex-start" : "",
                                flexDirection: me ? "row-reverse" : "row",
                                gap: "10px",
                                mt: "8px",
                              }}
                              onMouseEnter={() =>
                                handleMouseEnter(message.messageId)
                              }
                              onMouseLeave={handleMouseLeave}
                            >
                              <Box sx={{ display: "inline-block" }}>
                                <Typography
                                  variant="subtitle1"
                                  sx={{
                                    display: "flex",
                                    background: me ? "#481AA3" : "#E4E4E7",
                                    borderRadius: "12px",
                                    color: me ? "#fff" : "#1C2630",
                                    padding: "8px",
                                  }}
                                >
                                  <a
                                    href={message.message}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    // className={
                                    //   message.sentBy ===
                                    //   selectedOrderData[0].routePartnerId
                                    //     ? "text-white"
                                    //     : ""
                                    // }
                                    style={{ textDecoration: "underline" }}
                                  >
                                    {message.message}
                                  </a>
                                </Typography>
                                <Typography
                                  variant="subtitle1"
                                  sx={{
                                    color: "#9B9B9B",
                                    fontSize: "14px",
                                    display: "flex",
                                    justifyContent: me ? "flex-end" : "",
                                    gap: "5px",
                                  }}
                                >
                                  {formattedTimeString}{" "}
                                  {me && message.isReadUser ? (
                                    <RiCheckDoubleLine
                                      size={20}
                                      style={{ color: "#42ADE2" }}
                                    />
                                  ) : (
                                    <RiCheckDoubleLine size={20} />
                                  )}
                                </Typography>
                              </Box>
                              {me && hoveredMessageId === message.messageId && (
                                <MessageActions
                                  deleteMessage={() =>
                                    deleteMessage(message.id)
                                  }
                                  editMessage={() =>
                                    editField(message.id, message.message)
                                  }
                                />
                              )}
                            </Box>
                          );
                        }
                        if (message.messageType === "media") {
                          const messageDate = new Date(message.date);
                          const timeString = messageDate.toLocaleTimeString(
                            "en-US",
                            {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true, // Ensure AM/PM format
                            }
                          );

                          const formattedTimeString =
                            timeString.slice(0, -3) + timeString.slice(-3);

                          const imageRegex =
                            /^image\/(jpeg|png|gif|bmp|webp|svg\+xml|jpg|pjpeg|vnd\.microsoft\.icon)/i;
                          if (imageRegex.test(message.mediaType)) {
                            return (
                              <Box
                                key={message.messageId}
                                sx={{
                                  display: "flex",
                                  justifyContent: me ? "flex-start" : "",
                                  flexDirection: me ? "row-reverse" : "row",
                                  gap: "10px",
                                  mt: "8px",
                                }}
                                onMouseEnter={() =>
                                  handleMouseEnter(message.messageId)
                                }
                                onMouseLeave={handleMouseLeave}
                              >
                                <Box
                                  sx={{
                                    display: "inline-block",
                                    cursor: "pointer",
                                  }}
                                >
                                  <Typography
                                    variant="subtitle1"
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      background: me ? "#481AA3" : "#E4E4E7",
                                      borderRadius: "12px",
                                      color: me ? "#fff" : "#1C2630",
                                      padding: "8px",
                                    }}
                                  >
                                    <span
                                      className="mr-2 cursor-pointer"
                                      onClick={() =>
                                        downloadFile(
                                          message.message,
                                          message.fileName
                                        )
                                      }
                                    >
                                      <FiDownload size={20} />
                                    </span>
                                    <a
                                      href={message.message}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      // className={
                                      //   message.sentBy ===
                                      //   selectedOrderData[0].routePartnerId
                                      //     ? "text-white"
                                      //     : ""
                                      // }
                                      // download
                                    >
                                      {message.fileName}
                                    </a>
                                  </Typography>
                                  <Typography
                                    variant="subtitle1"
                                    sx={{
                                      color: "#9B9B9B",
                                      fontSize: "14px",
                                      display: "flex",
                                      justifyContent: me ? "flex-end" : "",
                                      gap: "5px",
                                    }}
                                  >
                                    {formattedTimeString}{" "}
                                    {me && message.isReadUser ? (
                                      <RiCheckDoubleLine
                                        size={20}
                                        style={{ color: "#42ADE2" }}
                                      />
                                    ) : (
                                      <RiCheckDoubleLine size={20} />
                                    )}
                                  </Typography>
                                </Box>
                                {me &&
                                  hoveredMessageId === message.messageId && (
                                    <MessageActions
                                      deleteMessage={() =>
                                        deleteMessage(message.id)
                                      }
                                      media={true}
                                    />
                                  )}
                              </Box>
                            );
                          } else if (message.mediaType === "application/pdf") {
                            const messageDate = new Date(message.date);
                            const timeString = messageDate.toLocaleTimeString(
                              "en-US",
                              {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true, // Ensure AM/PM format
                              }
                            );

                            const formattedTimeString =
                              timeString.slice(0, -3) + timeString.slice(-3);
                            // Handle PDF files
                            <Box
                              key={message.messageId}
                              sx={{
                                display: "flex",
                                justifyContent: me ? "flex-start" : "",
                                flexDirection: me ? "row-reverse" : "row",
                                gap: "10px",
                                mt: "8px",
                              }}
                              onMouseEnter={() =>
                                handleMouseEnter(message.messageId)
                              }
                              onMouseLeave={handleMouseLeave}
                            >
                              <Box sx={{ display: "inline-block" }}>
                                <Typography
                                  variant="subtitle1"
                                  sx={{
                                    display: "flex",
                                    background: me ? "#481AA3" : "#E4E4E7",
                                    borderRadius: "12px",
                                    color: me ? "#fff" : "#1C2630",
                                    padding: "8px",
                                  }}
                                >
                                  {message.message}
                                </Typography>
                                <Typography
                                  variant="subtitle1"
                                  sx={{
                                    color: "#9B9B9B",
                                    fontSize: "14px",
                                    display: "flex",
                                    justifyContent: me ? "flex-end" : "",
                                    gap: "5px",
                                  }}
                                >
                                  {formattedTimeString}{" "}
                                  {me && message.isReadUser ? (
                                    <RiCheckDoubleLine
                                      size={20}
                                      style={{ color: "#42ADE2" }}
                                    />
                                  ) : (
                                    <RiCheckDoubleLine size={20} />
                                  )}
                                </Typography>
                              </Box>
                              {me && hoveredMessageId === message.messageId && (
                                <MessageActions
                                  deleteMessage={() =>
                                    deleteMessage(message.id)
                                  }
                                  media={true}
                                />
                              )}
                            </Box>;
                          }
                        }
                      })}
                    </Box>
                  );
                })}
            </SimpleBar>
          {/* </Box> */}
          <Box sx={{ position: "sticky" }}>
            {orderChatsData?.isOrderChatActive ? (
              <span className="text-sm">
                Order is now {orderactiveData.status} please{" "}
                <span
                  className="text-blue-700 cursor-pointer"
                  onClick={() => changeChatCloseManually(false)}
                >
                  click
                </span>{" "}
                to close chat with {orderactiveData.name}
              </span>
            ) : (
              <span className="text-sm">
                Order is now {orderactiveData?.status} please{" "}
                <span
                  className="text-blue-700 cursor-pointer"
                  onClick={() => changeChatCloseManually(true)}
                >
                  click
                </span>{" "}
                to open chat with {orderactiveData.name}
              </span>
            )}
            {(orderactiveData?.status?.toUpperCase() !== "CLOSED" ||
              orderactiveData?.status?.toUpperCase() !== "CANCELED" ||
              orderactiveData?.status?.toUpperCase() !== "DRAFT") &&
              (orderChatsData?.isOrderChatActive ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "8px",
                    pr: "24px",
                  }}
                >
                  <TextField
                    variant="outlined"
                    placeholder="Type a message..."
                    fullWidth
                    value={messageValue}
                    onChange={(e) => setMessageValue(e.target.value)}
                    onKeyDown={(e) => checkForEnter(e)}
                    InputProps={{
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <IconButton
                              onClick={() => fileInputRef.current.click()}
                              sx={{ color: "#959BA1" }}
                            >
                              <AiOutlinePaperClip />
                            </IconButton>
                          </InputAdornment>
                          <input
                            type="file"
                            accept="image/*,application/pdf" // Define accepted file types
                            style={{ display: "none" }}
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                          />
                        </>
                      ),
                      endAdornment: (
                        <>
                          {isEdited ? (
                            <InputAdornment
                              position="end"
                              onClick={() => editMessage()}
                            >
                              <IconButton>
                                <FaCheck
                                  style={{
                                    color: "#959BA1",
                                    width: "19px",
                                    height: "18px",
                                  }}
                                />
                              </IconButton>
                            </InputAdornment>
                          ) : (
                            <InputAdornment
                              position="end"
                              onClick={() => messageSendHandler()}
                            >
                              <IconButton>
                                <IoSend
                                  style={{
                                    color: "#959BA1",
                                    width: "19px",
                                    height: "18px",
                                  }}
                                />
                              </IconButton>
                            </InputAdornment>
                          )}
                        </>
                      ),
                    }}
                  />
                </Box>
              ) : (
                ""
              ))}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default OrderChats;
