import React from "react";
import { AppData } from "../context/AppContext";
import Home from "./Home";
import AdminDashboard from "./AdminDashboard";

const MainRouter = () => {
  const { user } = AppData();

  if (!user) {
    return null; // or loading
  }

  const adminRoles = ["zonal", "admin", "evngcordinator", "cordinator"];

  if (adminRoles.includes(user.role)) {
    return <AdminDashboard />;
  }

  return <Home />;
};

export default MainRouter;
