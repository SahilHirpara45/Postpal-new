import React, { useEffect } from "react";
import { Navigate, Outlet, Route, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function ProtectedRoute(props) {
  const user = useSelector((state) => state.auth.value);
  // console.log(user.uid,"<--uid");
  const navigate = useNavigate();

  const auth = getAuth();
  const token = localStorage.getItem("token");

  if (props.roleRequired) {
    return token ? (
      user?.role ? (
        props.roleRequired.includes(user.role) ? (
          <Outlet />
        ) : (
          <>
            <Navigate to="/home" />
          </>
        )
      ) : (
        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
          <div className="custom-loader"></div>
        </div>
      )
    ) : (
      <Navigate to="/" />
    );
  }

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (authUser) => {
  //     // console.log(auth, "auth");
  //     console.log(authUser, "authUser Login");
  //     if (authUser) {
  //       // User is signed in
  //       // setUserDetails(authUser);

  //       authUser
  //         .getIdToken()
  //         .then((idToken) => {
  //           // console.log(idToken, "idToken");
  //           // Set the Firebase authentication token
  //           // setToken(idToken);

  //           // Check if the token is valid (optional)
  //           // You can add your custom validation logic here if needed
  //           if (token !== idToken) {
  //             navigate("/");
  //             localStorage.clear();
  //           } else {
  //             navigate("/home");
  //           }
  //         })
  //         .catch((error) => {
  //           // Handle error
  //           console.error("Error getting token:", error);
  //         });
  //     } else {
  //       // User is signed out
  //       // setUserDetails(null);
  //       // setToken(null);
  //     }
  //   });
  //   return () => unsubscribe();
  // }, []);

  // Check if the token exists in localStorage or your preferred authentication method
  // console.log(token,"<--uid");
  return token ? <Outlet /> : <Navigate to="/" />;
}

export default ProtectedRoute;
