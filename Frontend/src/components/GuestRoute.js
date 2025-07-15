import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

const GuestRoute = ({ children }) => {
  if (isAuthenticated()) {
    return <Navigate to="/chat" replace />;
  }
  return children;
};

export default GuestRoute;
