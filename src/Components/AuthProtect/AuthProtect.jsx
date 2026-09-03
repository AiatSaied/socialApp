import React from "react";
import { Navigate } from "react-router-dom";

export default function AuthProtect({ children }) {
  if (localStorage.getItem("userToken")) {
    // user logged
    return <Navigate to="/home" />;
  } else {
    return children;
  }
}
