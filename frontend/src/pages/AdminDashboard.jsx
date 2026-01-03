import React, { useState, useEffect, useCallback } from "react";
import { AppData } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { getMyProfile } from "../api/user.api";
import { getReportsByUser } from "../api/report.api";
import { toast } from "react-toastify";
import Reports from "../components/reports";
import Profile from "../components/profile";
import Dashboard from "../components/dashboard";
import Settings from "../components/settings";

import AddReport from "../components/addReport";
import AddSubzone from "../components/addSubzone";
import AddFellowship from "../components/addFellowship";
import AddUser from "../components/addUser";
import ZonalDashboard from "../components/zonalDashboard";

const AdminDashboard = () => {
  const { logoutUser, user, setUser } = AppData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshProfile = useCallback(async () => {
    try {
      const data = await getMyProfile();
      setUser(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to refresh profile");
    }
  }, [setUser]);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getReportsByUser();
      console.log(data.reports);
      setReports(data.reports || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  }, [setReports, setLoading]);

  useEffect(() => {
    if (activeTab === "profile") {
      refreshProfile();
    } else if (activeTab === "reports" || activeTab === "home") {
      fetchReports();
    }
  }, [activeTab, refreshProfile, fetchReports]);

  const handleLogout = () => {
    logoutUser(navigate);
  };

  const refreshReports = async () => {
    try {
      const data = await getReportsByUser();
      setReports(data.reports || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to refresh reports");
    }
  };

  const sidebarItems = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "reports", label: "All Reports", icon: "📊" },
    { id: "add-report", label: "Add Report", icon: "➕" },
    { id: "profile", label: "Profile", icon: "👤" },

    { id: "", label: "ADMIN TOOLS", icon: "" },
    { id: "zonal-dashboard", label: "Zonal Dashboard", icon: "📊" },
    { id: "add-subzone", label: "Add Subzone", icon: "🏘️" },
    { id: "add-fellowship", label: "Add Fellowship", icon: " 👥" },
    { id: "add-user", label: "Add User", icon: "👤" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      );
    }

    switch (activeTab) {
      case "home":
        return (
          <Dashboard
            user={user}
            reports={reports}
            setActiveTab={setActiveTab}
          />
        );
      case "reports":
        return (
          <Reports
            reports={reports}
            user={user}
            refreshReports={refreshReports}
            setActiveTab={setActiveTab}
          />
        );
      case "add-report":
        return <AddReport user={user} setActiveTab={setActiveTab} />;
      case "zonal-dashboard":
        return <ZonalDashboard />;
      case "add-subzone":
        return <AddSubzone />;
      case "add-fellowship":
        return <AddFellowship />;
      case "add-user":
        return <AddUser />;
      case "profile":
        return (
          <Profile
            refreshProfile={refreshProfile}
            setActiveTab={setActiveTab}
          />
        );
      case "settings":
        return <Settings setActiveTab={setActiveTab} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-20 md:w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 shrink-0">
          {/* logo */}
          <img
            src="./src/assets/evapod_logo.png"
            alt="EVAPOD LOGO"
            className="mx-auto h-6 w-auto mb-4"
          />
          <h1 className="hidden md:block text-blue-700 text-lg font-bold title-font mb-2 text-center">
            THE EVAPOD {user.role.toUpperCase()}
          </h1>
          {/* <h2 className="hidden md:block text-2xl font-bold text-gray-800">
            Dashboard
          </h2> */}
        </div>
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .sidebar-nav::-webkit-scrollbar {
            display: none;
          }
        `,
          }}
        />
        <nav
          className="flex-1 overflow-y-auto sidebar-nav"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex flex-col md:flex-row items-center md:px-6 py-6 text-left hover:bg-gray-100 ${
                activeTab === item.id
                  ? "bg-indigo-100 border-r-4 border-indigo-600 text-indigo-800 font-medium"
                  : "text-gray-500"
              }`}
            >
              <span className="md:mr-3">{item.icon}</span>
              <span className="text-xs md:text-lg text-center md:inline">
                {item.label}
              </span>
            </button>
          ))}
        </nav>
        <div className="p-4 md:p-6 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-2 px-2 md:px-4 rounded-md hover:bg-red-700 transition duration-200 text-sm md:text-base"
          >
            <span className="hidden md:inline">Logout</span>
            <span className="md:hidden">{/* power lucide icon */}⏻</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">{renderContent()}</div>
    </div>
  );
};

export default AdminDashboard;
