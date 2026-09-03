import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // home | profile
  if (localStorage.getItem("userToken")) {
    // user logged
    return children;
  } else {
    return <Navigate to={"/"} />;
  }
}
