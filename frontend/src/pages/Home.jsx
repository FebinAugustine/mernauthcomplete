import React, { useState, useEffect } from "react";
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

const Home = () => {
  const { logoutUser, user, setUser } = AppData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "profile") {
      refreshProfile();
    } else if (activeTab === "reports" || activeTab === "home") {
      fetchReports();
    }
  }, [activeTab]);

  const refreshProfile = async () => {
    try {
      const data = await getMyProfile();
      setUser(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to refresh profile");
    }
  };

  const fetchReports = async () => {
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
  };

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
        return <Dashboard user={user} reports={reports} />;
      case "reports":
        return (
          <Reports
            reports={reports}
            user={user}
            refreshReports={refreshReports}
          />
        );
      case "add-report":
        return <AddReport user={user} />;
      case "profile":
        return <Profile refreshProfile={refreshProfile} />;
      case "settings":
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-20 md:w-64 bg-white shadow-lg">
        <div className="p-6">
          {/* logo */}
          <img
            src="./src/assets/evapod_logo.png"
            alt="EVAPOD LOGO"
            className="mx-auto h-6 w-auto mb-4"
          />
          <h1 className="hidden md:block text-blue-700 text-lg font-bold title-font mb-2 text-center">
            THE EVAPOD HOME
          </h1>
          {/* <h2 className="hidden md:block text-2xl font-bold text-gray-800">
            Dashboard
          </h2> */}
        </div>
        <nav className="mt-6">
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
        <div className="absolute bottom-0 w-20 md:w-64 p-4 md:p-6">
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

export default Home;
