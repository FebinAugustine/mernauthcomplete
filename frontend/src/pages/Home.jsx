import React, { useState, useEffect } from "react";
import { AppData } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { getMyProfile } from "../api/user.api";
import { getReportsByUser } from "../api/report.api";
import { toast } from "react-toastify";
import Reports from "../components/reports";

const Home = () => {
  const { logoutUser, user } = AppData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profile, setProfile] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "profile") {
      fetchProfile();
    } else if (activeTab === "reports") {
      fetchReports();
    }
  }, [activeTab]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await getMyProfile();

      setProfile(data);
      toast.success(`Profile loaded successfully`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
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

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "reports", label: "Reports", icon: "📊" },
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
      case "dashboard":
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">
                Welcome back, {user?.name}!
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-blue-900">Role</h3>
                  <p className="text-blue-600">{user?.role}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-green-900">Email</h3>
                  <p className="text-green-600">{user?.email}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-purple-900">
                    Reports
                  </h3>
                  <p className="text-purple-600">{reports.length}</p>
                </div>
              </div>
            </div>
          </div>
        );
      case "reports":
        return <Reports reports={reports} />;
      case "profile":
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>
            <div className="bg-white rounded-lg shadow p-6">
              {profile && profile.user && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <p className="mt-1 text-lg text-gray-900">
                      {profile.user.name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <p className="mt-1 text-lg text-gray-900">
                      {profile.user.email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <p className="mt-1 text-lg text-gray-900">
                      {profile.user.role}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <p className="mt-1 text-lg text-gray-900">
                      {profile.user.phone}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Fellowship
                    </label>
                    <p className="mt-1 text-lg text-gray-900">
                      {profile.user.fellowship}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">
                Settings functionality coming soon...
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-20 md:w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="hidden md:block text-2xl font-bold text-gray-800">
            Dashboard
          </h2>
        </div>
        <nav className="mt-6">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 md:px-6 py-3 text-left hover:bg-gray-100 ${
                activeTab === item.id
                  ? "bg-indigo-50 border-r-4 border-indigo-600 text-indigo-600"
                  : "text-gray-700"
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              <span className="hidden md:inline">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 w-20 md:w-64 p-4 md:p-6">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-2 px-2 md:px-4 rounded-md hover:bg-red-700 transition duration-200 text-sm md:text-base"
          >
            <span className="hidden md:inline">Logout</span>
            <span className="md:hidden">🚪</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">{renderContent()}</div>
    </div>
  );
};

export default Home;
