import { toast, ToastContainer } from "react-toastify";
import "./App.css";
import Layout from "./layout/index";
import ThemeProvider from "./theme";
import "react-quill/dist/quill.snow.css";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./store/store";
import { useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { setUser } from "./store/authSlice";

function App(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.value);
  const auth = getAuth();
  // console.log(userData, "userData in useselector");
  // console.log(auth, "auth");

  useEffect(() => {
    const fetchData = async () => {
      const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
        // console.log(authUser, "authUser 1");
        const user = authUser;
        // dispatch(setUser(authUser));
        if (authUser) {
          // console.log("User logged in already", user);
        } else {
          // User is signed out
          // toast.error("User is signed out")
          signOut(auth)
            .then(() => {
              console.log("sign out from here 2");
              navigate("/");
              localStorage.clear();
            })
            .catch((error) => {
              console.log(error);
            });
          // setUserDetails(null);
          // setToken(null);
        }
      });

      const querySnapshot = await getDocs(collection(db, "admins"));
      let arr = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      // console.log(arr, "data of admins after login");

      const userWithRole = arr.find(
        (admin) => admin.email === auth.currentUser?.email
      );
      // console.log(userWithRole, "userWithRole");
      if (userWithRole) {
        if (userWithRole?.role === "Route Partner Admin") {
          try {
            const querySnapshot = collection(db, "routePartners");
            const q = query(
              querySnapshot,
              where("isDeleted", "==", false),
              where("isRoutePartner", "==", true),
              where("emailId", "==", auth.currentUser?.email)
            );
            onSnapshot(q, (snapshot) => {
              let arr1 = [];
              snapshot.forEach((doc) => {
                arr1.push({ ...doc.data(), id: doc.id });
              });
              // console.log(arr1, "obj for routepartner role");
              dispatch(
                setUser({
                  ...auth.currentUser,
                  ...userWithRole,
                  routePartnerId: arr1[0]?.id,
                })
              );
            });
          } catch (error) {
            console.log(error, "error");
          }
        } else {
          dispatch(
            setUser({
              ...auth.currentUser,
              ...userWithRole,
              routePartnerId: "",
            })
          );
        }
        // localStorage.setItem("token", user.accessToken);
        // navigate("/home");
      } else if (auth.currentUser) {
        toast.error("Admin User not found.");
      }
      return () => unsubscribe();
    };
    fetchData();
  }, []);

  return (
    <>
      <ThemeProvider>
        <Layout>{props.children}</Layout>
      </ThemeProvider>
      <ToastContainer />
    </>
  );
}

export default App;
