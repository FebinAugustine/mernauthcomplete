import React from "react";
import { AppData } from "../context/AppContext";
import Home from "./Home";
import AdminDashboard from "./AdminDashboard";
import RegionalDashboard from "./RegionalDashboard";
import ZonalDashboard from "./ZonalDashboard";

const MainRouter = () => {
  const { user } = AppData();

  if (!user) {
    return null; // or loading
  }

  if (user.role === "zonal") {
    return <ZonalDashboard />;
  }

  const adminRoles = ["admin", "evngcordinator", "cordinator"];

  if (adminRoles.includes(user.role)) {
    return <AdminDashboard />;
  }

  if (user.role === "regional") {
    return <RegionalDashboard />;
  }

  return <Home />;
};

export default MainRouter;
