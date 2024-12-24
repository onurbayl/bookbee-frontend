import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../AuthContext.js";
import { auth } from "../components/firebase/firebase.js";
import { ClipLoader } from "react-spinners";

function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();

  const localUser = user || localStorage.getItem("user")
  if (!localUser) {
    return <Navigate to="/login" replace />;
  }

  if(loading){
    return (<div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <ClipLoader color="#36d7b7" loading={loading} size={50} />
      </div>)
  }
  
  if (!allowedRoles.includes(localUser.role)) {
    return <div>Unauthorized!!!</div>
    //return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
