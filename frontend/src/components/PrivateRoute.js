// PrivateRoute.js

import React from "react";
import { Route, Navigate } from "react-router-dom";

const PrivateRoute = ({ element, ...rest }) => {
  const isLoggedIn = localStorage.getItem("isUserLoggedIn") === "true";

  if (!isLoggedIn) {
    // Redirect to login page if user is not logged in
    return <Navigate to="/" replace />;
  }

  return <Route {...rest} element={element} />;
};

export default PrivateRoute;
