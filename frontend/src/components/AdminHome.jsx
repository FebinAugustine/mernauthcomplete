import React, { useState, useEffect } from "react";
import { getDashboardStats } from "../api/admin.api";
import { toast } from "react-toastify";

const AdminHome = ({ user }) => {
  const [stats, setStats] = useState({
    totalSubzones: 0,
    totalFellowships: 0,
    totalUsers: 0,
    totalReports: 0,
    positiveReports: 0,
    negativeReports: 0,
    neutralReports: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="pt-0">
      {/* Classic Navbar */}
      <div className="bg-white shadow-md p-4 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex flex-col md:flex-row md:items-center space-x-2">
            <h2 className="md:hidden text-xl font-bold text-blue-900">
              EVAPOD ADMIN
            </h2>
            <h3 className="md:text-xl font-medium md:font-bold text-blue-900 overflow-hidden">
              Welcome Back, {user?.name}!
            </h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6 ml-2 mr-2 md:ml-6 md:mr-6">
        <h2 className="text-xl font-semibold mb-4">System Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-900">
              Total Subzones
            </h3>
            <p className="text-blue-600 text-2xl font-bold">
              {stats.totalSubzones}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-900">
              Total Fellowships
            </h3>
            <p className="text-green-600 text-2xl font-bold">
              {stats.totalFellowships}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-purple-900">Total Users</h3>
            <p className="text-purple-600 text-2xl font-bold">
              {stats.totalUsers}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-yellow-900">
              Total Reports
            </h3>
            <p className="text-yellow-600 text-2xl font-bold">
              {stats.totalReports}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 ml-2 mr-2 md:ml-6 md:mr-6">
        <h2 className="text-xl font-semibold mb-4">Report Status Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg flex items-center">
            <span className="text-2xl mr-3">👍</span>
            <div>
              <h3 className="text-lg font-medium text-green-900">Positive</h3>
              <p className="text-green-600 text-xl font-bold">
                {stats.positiveReports}
              </p>
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg flex items-center">
            <span className="text-2xl mr-3">👎</span>
            <div>
              <h3 className="text-lg font-medium text-red-900">Negative</h3>
              <p className="text-red-600 text-xl font-bold">
                {stats.negativeReports}
              </p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg flex items-center">
            <span className="text-2xl mr-3">😐</span>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Neutral</h3>
              <p className="text-gray-600 text-xl font-bold">
                {stats.neutralReports}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
