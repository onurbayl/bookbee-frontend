import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../AuthContext.js";
import { auth } from "../components/firebase/firebase.js";

function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();

  const localUser = user || localStorage.getItem("user")
  if (!localUser) {
    return <Navigate to="/login" replace />;
  }

  if(loading){
    return <div>Loading!!!</div>
  }
  
  if (!allowedRoles.includes(localUser.role)) {
    return <div>Unauthorized!!!</div>
    //return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
