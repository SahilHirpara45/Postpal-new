import React from "react";
import Sidebar from "./Sidebar";
import ShippingRequest from "../pages/Shipment/shippingRequest";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Packages from "../pages/Shipment/Packages";
import { SidebarProvider } from "../context/SidebarContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Integration from "../pages/Shipping/Integration";
import ReceivingWorkStation from "../components/ReceivingWorkStationDrawer";
import RoutePartner from "../pages/Shipping/routePartner";
import AddRoutePartner from "../pages/Shipping/routePartner/AddRoutePartner";
import RoutePartnerDetails from "../pages/Shipping/routePartner/RoutePartnerDetails";
import AddMuse from "../pages/Shipping/routePartner/AddMuse";
import AddWarehouseAddress from "../pages/Shipping/routePartner/AddWarehouseAddress";
import NoSuites from "../pages/Shipment/noSuites";
import Abandoned from "../pages/Shipment/Abandoned";
import ShoppingRequest from "../pages/Shipment/shopping";
import ReceivingWorkstation from "../pages/ReceivingWorkStation";
import ExpressRequest from "../pages/Shipment/expressRequest";
import Login from "../pages/Login";
import ShippingComplete from "../pages/Shipment/shippingComplete";
import User from "../pages/Users/User";
import UserDetails from "../pages/Users/User/UserDetails";
import Brand from "../pages/Shopping/Brands";
import BrandDetails from "../pages/Shopping/Brands/BrandDetails";
import AddBrand from "../pages/Shopping/Brands/AddBrand";
import AllDeals from "../pages/Shopping/AllDeals";
import AllIsues from "../pages/Shopping/AllIssues";
import ProtectedRoute from "./ProtectedRoute";
import Admins from "../pages/Settings/Admins";
import ConsolidatedShipping from "../pages/Shipment/ConsolidatedShipping";
import ShippingService from "../pages/Shipping/ShippingService";
import AddShipping from "../pages/Shipping/ShippingService/AddShipping";
import ShippingServiceDetails from "../pages/Shipping/ShippingService/ShippingServiceDetails";
import InspectionForm from "../pages/InspectionForm";
import MeasurementForm from "../pages/MeasurementForm";
import ConditionForm from "../pages/ConditionForm";

const AppLayout = ({ children }) => (
  <SidebarProvider>
    <div className="flex w-full h-screen bg-gray-100 ">
      <div className="position-relative">
        <Sidebar />
      </div>
      {children}
    </div>
  </SidebarProvider>
);
const AppRoutes = () => {
  const location = useLocation();
  const isLayoutNeeded =
    location.pathname !== "/workstation" &&
    location.pathname !== "/inspectionForm" &&
    location.pathname !== "/measurementForm" &&
    location.pathname !== "/conditionForm" &&
    location.pathname !== "/";

  return (
    <>
      {isLayoutNeeded ? (
        <AppLayout>
          <Routes>
            <Route path="/workstation" element={<ReceivingWorkstation />} />
            <Route path="/inspectionForm" element={<InspectionForm />} />
            <Route path="/measurementForm" element={<MeasurementForm />} />
            <Route path="/conditionForm" element={<ConditionForm />} />

            <Route
              path="shipping"
              element={
                <ProtectedRoute
                  roleRequired={["Superadmin", "Platform Admin"]}
                />
              }
            >
              <Route
                path="route-partner/addNew"
                element={<AddRoutePartner />}
              />
              <Route
                path="route-partner/view/:id"
                element={<RoutePartnerDetails />}
              />
              <Route path="route-partner/addMuse" element={<AddMuse />} />
              <Route
                path="route-partner/addNewMainAddress"
                element={<AddWarehouseAddress />}
              />
            </Route>

            <Route path="shipping" element={<ProtectedRoute />}>
              <Route path="route-partner" element={<RoutePartner />} />
              <Route path="/shipping/integration" element={<Integration />} />
              <Route
                path="/shipping/shipping-service"
                element={<ShippingService />}
              />
              <Route path="shipping-service/addNew" element={<AddShipping />} />
              <Route
                path="shipping-service/view/:id"
                element={<ShippingServiceDetails />}
              />
            </Route>

            <Route path="shipment" element={<ProtectedRoute />}>
              <Route path="packages" element={<Packages />} />
              <Route path="single_shipping" element={<ShippingRequest />} />
              <Route
                path="consolidated_shipping"
                element={<ConsolidatedShipping />}
              />
              <Route
                path="receiving_workstation"
                element={<ReceivingWorkStation />}
              />
              <Route path="no-suites" element={<NoSuites />} />
              <Route path="abandoned" element={<Abandoned />} />

              <Route path="shopping_request" element={<ShoppingRequest />} />

              <Route path="express_request" element={<ExpressRequest />} />
              <Route
                path="/shipment/shipping_complete"
                element={<ShippingComplete />}
              />
            </Route>

            <Route
              path="users"
              element={
                <ProtectedRoute
                  roleRequired={["Superadmin", "Platform Admin"]}
                />
              }
            >
              <Route path="user" element={<User />} />
              <Route path="user/view/:id" element={<UserDetails />} />
            </Route>

            <Route path="shopping" element={<ProtectedRoute />}>
              <Route path="brand" element={<Brand />} />
              <Route path="brand/view/:id" element={<BrandDetails />} />
              <Route path="brand/addNew" element={<AddBrand />} />
              <Route path="all-deals" element={<AllDeals />} />
              <Route path="all-issues" element={<AllIsues />} />
            </Route>
            <Route path="settings" element={<ProtectedRoute />}>
              <Route path="admins" element={<Admins />} />
            </Route>
          </Routes>
        </AppLayout>
      ) : (
        <Routes>
          <Route path="/workstation" element={<ReceivingWorkstation />} />
          <Route path="/inspectionForm" element={<InspectionForm />} />
          <Route path="/measurementForm" element={<MeasurementForm />} />
          <Route path="/conditionForm" element={<ConditionForm />} />
          <Route path="/" element={<Login />} />
        </Routes>
      )}
    </>
  );
};

const index = () => {
  return (
    <>
      {/* <Router> */}
      <AppRoutes />
      {/* </Router> */}
    </>
  );
};

// const index = () => {
//   return (
//     <>
//       <Router>
//         <SidebarProvider>
//           <div className="flex w-full h-screen bg-gray-100 ">
//             <div className="position-relative">
//               <Sidebar />
//             </div>
//             <Routes>
//               <Route path="/" element={<ReceivingWorkstation />} />
//               <Route path="/shipment/packages" element={<Packages />} />
//               <Route
//                 path="/shipment/shipping_request"
//                 element={<ShippingRequest />}
//               />
//               <Route path="/shipping/integration" element={<Integration />} />
//               <Route
//                 path="/shipping/route-partner"
//                 element={<RoutePartner />}
//               />
//               <Route
//                 path="/shipping/route-partner/addNew"
//                 element={<AddRoutePartner />}
//               />
//               <Route
//                 path="/shipping/route-partner/edit-route-partner"
//                 element={<EditRoutePartner />}
//               />
//               <Route
//                 path="/shipping/route-partner/addMuse"
//                 element={<AddMuse />}
//               />
//               <Route
//                 path="/shipping/route-partner/view/:id"
//                 element={<RoutePartnerDetails />}
//               />
//               <Route
//                 path="/shipping/route-partner/addNewMainAddress"
//                 element={<AddWarehouseAddress />}
//               />
//               <Route
//                 path="/shipment/receiving_workstation"
//                 element={<ReceivingWorkStation />}
//               />
//               <Route
//                 path="/shipment/no-suites"
//                 element={<NoSuites />}
//               />
//               <Route
//                 path="/shipment/abandoned"
//                 element={<Abandoned />}
//               />
//             </Routes>
//           </div>
//         </SidebarProvider>
//       </Router>
//       <ToastContainer />
//     </>
//   );
// };

export default index;
