import React from "react";
import { Icon } from "@iconify/react";

const getIcon = (name) => <Icon icon={name} width={24} height={24} />;

export const menu = [
  {
    icon: getIcon("ic:round-dashboard"),
    title: "Dashboard",
    items: [],
    path: "/dashboard",
    hasExpandIcon: false,
  },
  {
    icon: getIcon("material-symbols:box-rounded"),
    title: "Shipment",
    hasExpandIcon: true,
    expandIconPath: "shipment/receiving_workstation",
    items: [
      {
        title: "Packages",
        status: 0,
        path: "shipment/packages",
      },
      {
        title: "Single shipping",
        status: 0,
        path: "shipment/single_shipping",
      },
      {
        title: "Consolidated shipping",
        status: 0,
        path: "shipment/consolidated_shipping",
      },
      {
        title: "Shopping request",
        status: 0,
        path: "shipment/shopping_request",
      },
      {
        title: "Express request",
        status: 0,
        path: "/shipment/express_request",
      },
      {
        title: "Shipping complete",
        status: 0,
        path: "/shipment/shipping_complete",
      },
      {
        title: "No suites",
        status: 0,
        path: "shipment/no-suites",
      },
      {
        title: "Abandoned",
        status: 0,
        path: "shipment/abandoned",
      },
    ],
  },
  {
    icon: getIcon("gravity-ui:signal"),
    title: "Shipping Service",
    path: "/shipping_service",
    hasExpandIcon: false,
    items: [
      {
        title: "Route Partner",
        status: 0,
        path: "/shipping/route-partner",
      },
      {
        title: "Setup Service",
        status: 0,
        path: "/shipping/setup_service",
      },
      {
        title: "Shipping Service",
        status: 0,
        path: "/shipping/shipping-service",
      },
      {
        title: "Integration",
        status: 0,
        path: "/shipping/integration",
      },
    ],
  },
  {
    icon: getIcon("material-symbols:shopping-bag"),
    title: "Shopping",
    hasExpandIcon: false,
    items: [
      {
        title: "Brand",
        status: 0,
        path: "/shopping/brand",
      },
      {
        title: "All Deals",
        status: 0,
        path: "/shopping/all-deals",
      },
      {
        title: "All Issues",
        status: 0,
        path: "/shopping/all-issues",
      },
    ],
  },
  {
    icon: getIcon("mdi:account-group"),
    title: "Users",
    hasExpandIcon: false,
    items: [
      {
        title: "Order",
        status: 0,
        path: "",
      },
      {
        title: "User",
        status: 0,
        path: "/users/user",
      },
      {
        title: "Clever",
        status: 0,
        path: "",
      },
    ],
  },
  {
    icon: getIcon("mdi:cog"),
    title: "Settings",
    hasExpandIcon: false,
    items: [
      {
        title: "Admins",
        status: 0,
        path: "/settings/admins",
      },
    ],
  },
];
