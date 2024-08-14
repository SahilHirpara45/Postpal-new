import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { useState } from "react";
import { Avatar, Collapse, Menu } from "@mui/material";
import Logo from "../../assets/svg/logo.svg";
import { hasChildren } from "./utils";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { menu } from "./menu";
import expand from "../../assets/svg/menu-expand.svg";
import { Link, useNavigate, useLocation } from "react-router-dom";
import SidebarContext from "../../context/SidebarContext";
import ReceivingWorkStationDrawer from "../../components/ReceivingWorkStationDrawer";
import { useEffect } from "react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import dayjs from "dayjs";
import { Icon } from "@iconify/react/dist/iconify.js";
import { getAuth, signOut } from "firebase/auth";
import { useSelector } from "react-redux";

const drawerWidth = 255;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.standard,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.standard,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(8)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(9)} + 4px)`,
  },
});

const DrawerHeader = styled("div")(({ theme, open }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: open ? "" : "center",
  padding: theme.spacing(0, 1),
  marginBottom: theme.spacing(2),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  backgroundColor: "#481AA3",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

// export default function Sidebar() {
//   const theme = useTheme();
//   const [open, setOpen] = useState(false);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedIndex, setSelectedIndex] = useState(1);
//   const openSubMenu = Boolean(anchorEl);

//   const handleClickListItem = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleDrawerOpen = () => {
//     setOpen(true);
//   };

//   const handleDrawerClose = () => {
//     setOpen(false);
//   };
//   return (
//     <Box
//       sx={{ display: "flex" }}
//       onMouseOver={handleDrawerOpen}
//       onMouseOut={handleDrawerClose}
//       y7
//     >
//       <CssBaseline />
//       {/* <AppBar position="fixed" open={open}>
//         <Toolbar>
//           <IconButton
//             color="inherit"
//             aria-label="open drawer"
//             onClick={handleDrawerOpen}
//             edge="start"
//             sx={{
//               marginRight: 5,
//               ...(open && { display: 'none' }),
//             }}
//           >
//             <MenuIcon />
//           </IconButton>
//           <Typography variant="h6" noWrap component="div">
//             Mini variant drawer
//           </Typography>
//         </Toolbar>
//       </AppBar> */}
//       <Drawer
//         variant="permanent"
//         open={open}
//         sx={{
//           "& .MuiDrawer-paper": {
//             backgroundColor: theme.palette.primary.main,
//             color: "#fff",
//           },
//         }}
//       >
//         <DrawerHeader open={open}>
//           {/* <IconButton onClick={handleDrawerChange}>
//             {!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
//           </IconButton> */}
//           <Box sx={{ mr: open ? 2.33 : "auto" }}>
//             <Avatar src={Logo} alt="photoURL" />
//           </Box>
//           <Typography variant="h4" sx={{ display: open ? "block" : "none" }}>
//             POSTPAL
//           </Typography>
//         </DrawerHeader>
//         <Divider />
//         <List>
//           {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
//             <>
//               <ListItem key={text} disablePadding sx={{ display: "block" }}>
//                 <ListItemButton
//                   // aria-haspopup="listbox"
//                   aria-controls="lock-menu"
//                   aria-expanded={open ? "true" : undefined}
//                   sx={{
//                     minHeight: 48,
//                     justifyContent: open ? "initial" : "center",
//                     px: 2.5,
//                   }}
//                 >
//                   <ListItemIcon
//                     sx={{
//                       minWidth: 0,
//                       mr: open ? 3 : "auto",
//                       justifyContent: "center",
//                     }}
//                   >
//                     {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
//                   </ListItemIcon>
//                   <ListItemText
//                     primary={text}
//                     sx={{ display: open ? "block" : "none" }}
//                   />
//                 </ListItemButton>
//               </ListItem>
//             </>
//           ))}
//         </List>
//       </Drawer>
//     </Box>
//   );
// }

export default function Sidebar() {
  const theme = useTheme();
  // const [open, setOpen] = useState(false);
  const { open, setOpen } = React.useContext(SidebarContext);
  const [openMultilevel, setOpenMultilevel] = React.useState(null); // State to manage open multilevel items
  const [allMenu, setAllMenu] = useState(menu); // Use initialMenu as initial state

  const [menuCounts, setMenuCounts] = useState({
    Dashboard: 0,
    Packages: 0,
    "Single shipping": 0,
    "Consolidated shipping": 0,
    "Shopping request": 0,
    "Express request": 0,
    "Shipping complete": 0,
    "No suites": 0,
    Abandoned: 0,
    "Route Partner": 0,
    "Setup Service": 0,
    Integration: 0,
  });
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.value);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const packagesQuery = query(collection(db, "shelfPackages"));
        // const q1 = query(
        //   querySnapshot,
        //   where("userId", "==", userActiveData?.userId),
        //   where("isNoSuite", "==", false),
        //   where("isPackageAddedToShipment", "==", false),
        //   where("warehouseRoutePartnerId", "==", user.routePartnerId)
        // );
        // const q2 = query(
        //   querySnapshot,
        //   where("userId", "==", userActiveData?.userId),
        //   where("isNoSuite", "==", false),
        //   where("isPackageAddedToShipment", "==", false),
        // );
        // const q = user?.role === "Superadmin" ? q2 : q1;

        const packagesUnsubscribe = onSnapshot(
          packagesQuery,
          async (snapshot) => {
            let packagesCount = 0;
            // let singleshippingCount = 0;
            let expressRequestCount = 0;
            let shippingCompleteCount = 0;
            // let consolidatedCount = 0;
            let noSuitesCount = 0;
            let abandonedCount = 0;
            const today = dayjs().startOf("day");
            // console.log(snapshot, "snapshot");

            snapshot.forEach((doc) => {
              const data = doc.data();
              if (
                !data.isNoSuite &&
                !(
                  data.abandoned &&
                  new Date(data.abandoned.seconds * 1000) < new Date()
                ) &&
                !data?.isPackageAddedToShipment 
                // && data.warehouseRoutePartnerId === user.routePartnerId
              ) {
                packagesCount += 1;
              }
              if (data.isNoSuite) noSuitesCount += 1;
              if (
                data.abandoned &&
                dayjs(data.abandoned.toDate()).isBefore(today)
              ) {
                abandonedCount += 1;
              }
            });

            // console.log(
            //   "packagesCount",
            //   packagesCount,
            //   "noSuitesCount",
            //   noSuitesCount,
            //   "abandonedCount",
            //   abandonedCount,
            //   "singleshippingCount",
            //   singleshippingCount
            // );

            setMenuCounts({
              Packages: packagesCount,
              // "Single shipping": singleshippingCount,
              "Express request": expressRequestCount,
              "Shipping complete": shippingCompleteCount,
              "No suites": noSuitesCount,
              Abandoned: abandonedCount,
            });
            setAllMenu((prevMenu) =>
              prevMenu.map((menuItem) => {
                if (menuItem.title === "Shipment") {
                  const updatedItems = menuItem.items.map((item) => {
                    switch (item.title) {
                      case "Packages":
                        return { ...item, status: packagesCount };
                      // case "Single shipping":
                      //   return { ...item, status: singleshippingCount };
                      case "Express request":
                        return { ...item, status: expressRequestCount };
                      case "Shipping complete":
                        return { ...item, status: shippingCompleteCount };
                      case "No suites":
                        return { ...item, status: noSuitesCount };
                      case "Abandoned":
                        return { ...item, status: abandonedCount };
                      default:
                        return item;
                    }
                  });
                  return { ...menuItem, items: updatedItems };
                }
                return menuItem;
              })
            );
          }
        );

        const shoppingQuery = query(collection(db, "shelfShoppingPackages"));

        const shoppingUnsubscribe = onSnapshot(shoppingQuery, (snapshot) => {
          let shoppingRequestCount = 0;
          snapshot.forEach((doc) => {
            shoppingRequestCount += 1;
            // Add additional counts based on your logic
          });

          setMenuCounts((prevMenuCounts) => ({
            ...prevMenuCounts,
            "Shopping request": shoppingRequestCount,
          }));
          setAllMenu((prevMenu) =>
            prevMenu.map((menuItem) => {
              if (menuItem.title === "Shipment") {
                const updatedItems = menuItem.items.map((item) => {
                  if (item.title === "Shopping request") {
                    return { ...item, status: shoppingRequestCount };
                  }
                  return item;
                });
                return { ...menuItem, items: updatedItems };
              }
              return menuItem;
            })
          );
        });

        const singleShippingQuery = query(collection(db, "mySuiteShipments"));
        const singleShippingUnsubscribe = onSnapshot(
          singleShippingQuery,
          (snapshot) => {
            let singleShippingCount = 0;

            snapshot.forEach((doc) => {
              const data = doc.data();
              const packageIds = data?.packageIds;

              if (packageIds && Array.isArray(packageIds)) {
                singleShippingCount += packageIds.length;
              }
            });
            // console.log("singleShippingCount", singleShippingCount);

            setMenuCounts((prevMenuCounts) => ({
              ...prevMenuCounts,
              "Single shipping": singleShippingCount,
            }));
            setAllMenu((prevMenu) =>
              prevMenu.map((menuItem) => {
                if (menuItem.title === "Shipment") {
                  const updatedItems = menuItem.items.map((item) => {
                    if (item.title === "Single shipping") {
                      return { ...item, status: singleShippingCount };
                    }
                    return item;
                  });
                  return { ...menuItem, items: updatedItems };
                }
                return menuItem;
              })
            );
          }
        );

        const consolidatedShippingQuery = query(
          collection(db, "shelfConsolidatedPackages")
        );
        const consolidatedShippingUnsubscribe = onSnapshot(
          consolidatedShippingQuery,
          (snapshot) => {
            let consolidatedShippingCount = 0;
            snapshot.forEach((doc) => {
              const data = doc.data();
              const packageIds = data?.packageIds;
              if (packageIds && Array.isArray(packageIds)) {
                consolidatedShippingCount += packageIds.length;
              }
            });
            setMenuCounts((prevMenuCounts) => ({
              ...prevMenuCounts,
              "Consolidated shipping": consolidatedShippingCount,
            }));
            setAllMenu((prevMenu) =>
              prevMenu.map((menuItem) => {
                if (menuItem.title === "Shipment") {
                  const updatedItems = menuItem.items.map((item) => {
                    if (item.title === "Consolidated shipping") {
                      return { ...item, status: consolidatedShippingCount };
                    }
                    return item;
                  });
                  return { ...menuItem, items: updatedItems };
                }
                return menuItem;
              })
            );
          }
        );

        // Cleanup subscriptions
        return () => {
          packagesUnsubscribe();
          shoppingUnsubscribe();
          singleShippingUnsubscribe();
          consolidatedShippingUnsubscribe();
        };
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // console.log(allMenu, "allMenu");
  // console.log(menuCounts, "menuCounts");

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMultilevelClick = (index) => {
    // console.log(openMultilevel, "openMultilevel 112");
    // console.log(index, "index 112");
    setOpenMultilevel(openMultilevel === index ? null : index); // Toggle the clicked multilevel item
  };

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        // console.log("Sign-out successful");
        navigate("/");
        localStorage.clear();
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };

  return (
    <Box
      sx={{ display: "flex" }}
      onMouseOver={handleDrawerOpen}
      onMouseOut={handleDrawerClose}
    >
      <CssBaseline />
      <Drawer
        className="sidebar"
        variant="permanent"
        open={open}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: theme.palette.primary.main,
            color: "#fff",
          },
        }}
      >
        <DrawerHeader open={open}>
          <Box sx={{ mr: open ? 2.33 : "auto" }}>
            <Avatar src={Logo} alt="photoURL" />
          </Box>
          <Typography variant="h4" sx={{ display: open ? "block" : "none" }}>
            POSTPAL
          </Typography>
        </DrawerHeader>
        <List>
          {allMenu.map((item, key) => {
            return (
              <MenuItem
                key={key}
                item={item}
                openSidebar={open}
                openMultilevel={openMultilevel}
                handleMultilevelClick={() => handleMultilevelClick(item?.title)}
                count={menuCounts[item.title]}
              />
            );
          })}
          <ListItem
            button
            onClick={handleLogout}
            sx={{
              minHeight: 48,
              justifyContent: open ? "initial" : "center",
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : "auto",
                justifyContent: "center",
              }}
            >
              <Icon
                icon="material-symbols:logout"
                width={24}
                height={24}
                color="#fff"
              />
            </ListItemIcon>
            <ListItemText
              primary={"Logout"}
              sx={{
                display: open ? "block" : "none",
              }}
              primaryTypographyProps={{
                fontSize: "14px",
                lineHeight: "16.94px",
              }}
            />
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
}

const MenuItem = ({
  item,
  openSidebar,
  openMultilevel,
  handleMultilevelClick,
  count,
}) => {
  // console.log(count,"count 1");
  // console.log(openMultilevel, "openMultilevel 11");
  const Component = hasChildren(item) ? MultiLevel : SingleLevel;
  return (
    <Component
      item={item}
      openSidebar={openSidebar}
      openMultilevel={openMultilevel}
      handleMultilevelClick={handleMultilevelClick}
      count={count}
    />
  );
};

const SingleLevel = ({ item, openSidebar, count }) => {
  const location = useLocation(); // Get the current path
  const isActive = location.pathname === item.path; // Check if the current path matches the item's path
  return (
    <Link to={item.path}>
      <ListItem
        button
        sx={{
          minHeight: 48,
          justifyContent: openSidebar ? "initial" : "center",
          px: 2.5,
          backgroundColor: isActive ? "rgba(255, 255, 255, 0.1)" : "inherit", // Apply active style
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: openSidebar ? 3 : "auto",
            // justifyContent: "center",
            color: isActive ? "white" : "inherit", // Change icon color if active
          }}
        >
          {item.icon}
        </ListItemIcon>
        <ListItemText
          primary={item.title}
          sx={{
            display: openSidebar ? "block" : "none",
            color: isActive ? "white" : "inherit", // Change text color if active
          }}
          primaryTypographyProps={{
            fontSize: "14px",
            lineHeight: "16.94px",
          }}
        />
        {count !== undefined && (
          <Typography
            variant="body2"
            sx={{
              color: "#ccc",
              display: openSidebar ? "block" : "none",
              ml: "auto",
              mr: 2,
            }}
          >
            {count}
          </Typography>
        )}
      </ListItem>
    </Link>
  );
};

const MultiLevel = ({
  item,
  openSidebar,
  openMultilevel,
  handleMultilevelClick,
  count,
}) => {
  const { items: children, hasExpandIcon, expandIconPath } = item;
  // const [open, setOpen] = useState(false);
  const open = openMultilevel === item.title;
  const location = useLocation(); // Get the current path
  const isActive =
    location.pathname.startsWith(item.path) ||
    children.some((child) => location.pathname.startsWith(child.path));

  // console.log(openSidebar, "open openSidebar");
  // console.log(openMultilevel, "openMultilevel");

  const navigate = useNavigate();

  // const handleClick = () => {
  //   setOpen((prev) => !prev);
  // };

  const onClickonExpandIcon = (e) => {
    e.stopPropagation();
    navigate(expandIconPath);
  };

  return (
    <>
      <ListItem
        button
        onClick={handleMultilevelClick}
        sx={{
          minHeight: 48,
          justifyContent: openSidebar ? "" : "center",
          px: 2.5,
          backgroundColor: isActive ? "rgba(255, 255, 255, 0.1)" : "inherit", // Apply active style
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: openSidebar ? 3 : "auto",
            justifyContent: "center",
            color: isActive ? "white" : "inherit", // Change icon color if active
          }}
        >
          {item.icon}
        </ListItemIcon>
        <ListItemText
          primary={item.title}
          sx={{
            display: openSidebar ? "block" : "none",
            color: isActive ? "white" : "inherit", // Change text color if active
          }}
          primaryTypographyProps={{
            fontSize: "14px",
            lineHeight: "16.94px",
          }}
        />
        {openSidebar && hasExpandIcon && (
          <>
            <Box onClick={(e) => onClickonExpandIcon(e)}>
              <img src={expand} alt="expand_icon" />
            </Box>
            {/* <ReceivingWorkStationDrawer
              open={workStationDrawerOpen}
              onClose={toggleWorkStationDrawer}
            /> */}
          </>
        )}
      </ListItem>
      {count !== undefined && (
        <Typography
          variant="body2"
          sx={{
            color: "#ccc",
            display: openSidebar ? "block" : "none",
            ml: "auto",
            mr: 2,
          }}
        >
          {count}
        </Typography>
      )}
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {item.items.map((subItem, index) => (
            <Link to={subItem.path} key={index}>
              <ListItem
                button
                sx={{
                  minHeight: 48,
                  pl: openSidebar ? 5.5 : 2.5,
                  display: openSidebar ? "flex" : "none",
                  backgroundColor:
                    location.pathname === subItem.path
                      ? "rgba(255, 255, 255, 0.1)"
                      : "inherit",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: openSidebar ? 3 : "auto",
                    color:
                      location.pathname === subItem.path ? "white" : "inherit",
                  }}
                ></ListItemIcon>
                <ListItemText
                  primary={`${subItem.title} ${
                    subItem.status ? `(${subItem.status})` : ""
                  }`}
                  sx={{
                    color:
                      location.pathname === subItem.path ? "white" : "inherit",
                  }}
                  primaryTypographyProps={{
                    fontSize: "14px",
                    lineHeight: "16.94px",
                  }}
                />
              </ListItem>
            </Link>
          ))}
        </List>
      </Collapse>
    </>
  );
};
