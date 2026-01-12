import React from "react";
import { AppData } from "../context/AppContext";
import Home from "./Home";
import AdminDashboard from "./AdminDashboard";
import RegionalDashboard from "./RegionalDashboard";
import ZonalDashboard from "./ZonalDashboard";
import CordinatorDashboard from "./CordinatorDashboard";
import EvngCordinatorDashboard from "./EvngCordinatorDashboard";

const MainRouter = () => {
  const { user } = AppData();

  if (!user) {
    return null; // or loading
  }

  if (user.role === "zonal") {
    return <ZonalDashboard />;
  }

  if (user.role === "cordinator") {
    return <CordinatorDashboard />;
  }

  if (user.role === "evngcordinator") {
    return <EvngCordinatorDashboard />;
  }

  const adminRoles = ["admin"];

  if (adminRoles.includes(user.role)) {
    return <AdminDashboard />;
  }

  if (user.role === "regional") {
    return <RegionalDashboard />;
  }

  return <Home />;
};

export default MainRouter;
