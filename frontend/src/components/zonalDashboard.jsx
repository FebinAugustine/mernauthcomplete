import React, { useState, useEffect, useCallback } from "react";
import {
  getDashboardStats,
  getSubzonesPaginated,
  getFellowshipsPaginated,
  getUsersWithReportsPaginated,
  getUsersPaginated,
} from "../api/admin.api";

const ZonalDashboard = () => {
  const [stats, setStats] = useState({
    totalRegions: 0,
    totalZones: 0,
    totalSubzones: 0,
    totalFellowships: 0,
    totalUsers: 0,
    totalReports: 0,
    positiveReports: 0,
    negativeReports: 0,
    neutralReports: 0,
    totalCoordinators: 0,
    totalEvngCoordinators: 0,
    totalZonalCoordinators: 0,
    totalRegionalCoordinators: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for lists
  const [subzones, setSubzones] = useState([]);
  const [fellowships, setFellowships] = useState([]);
  const [usersReports, setUsersReports] = useState([]);
  const [users, setUsers] = useState([]);

  // Search state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Pagination states
  const [subzonesPage, setSubzonesPage] = useState(1);
  const [fellowshipsPage, setFellowshipsPage] = useState(1);
  const [reportsPage, setReportsPage] = useState(1);
  const [usersPage, setUsersPage] = useState(1);

  const [totalPages, setTotalPages] = useState({
    subzones: 1,
    fellowships: 1,
    reports: 1,
    users: 1,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchSubzones();
  }, [subzonesPage]);

  useEffect(() => {
    fetchFellowships();
  }, [fellowshipsPage]);

  useEffect(() => {
    fetchUsersReports();
  }, [reportsPage]);

  useEffect(() => {
    fetchUsers();
  }, [usersPage, debouncedSearch]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setUsersPage(1); // Reset to first page on search
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [search]);

  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubzones = async () => {
    try {
      const data = await getSubzonesPaginated(subzonesPage);
      setSubzones(data.subzones);
      setTotalPages((prev) => ({ ...prev, subzones: data.pages }));
    } catch (err) {
      console.error("Failed to load subzones", err);
    }
  };

  const fetchFellowships = async () => {
    try {
      const data = await getFellowshipsPaginated(fellowshipsPage);
      setFellowships(data.fellowships);
      setTotalPages((prev) => ({ ...prev, fellowships: data.pages }));
    } catch (err) {
      console.error("Failed to load fellowships", err);
    }
  };

  const fetchUsersReports = async () => {
    try {
      const data = await getUsersWithReportsPaginated(reportsPage);
      setUsersReports(data.users);
      setTotalPages((prev) => ({ ...prev, reports: data.pages }));
    } catch (err) {
      console.error("Failed to load users reports", err);
    }
  };

  const fetchUsers = useCallback(async () => {
    try {
      const data = await getUsersPaginated(usersPage, 5, debouncedSearch);
      setUsers(data.users);
      setTotalPages((prev) => ({ ...prev, users: data.pages }));
    } catch (err) {
      console.error("Failed to load users", err);
    }
  }, [usersPage, debouncedSearch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Zonal Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
        <div className="bg-red-500 text-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Total Regions</h2>
          <p className="text-3xl">{stats.totalRegions || 0}</p>
        </div>
        <div className="bg-orange-500 text-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Total Zones</h2>
          <p className="text-3xl">{stats.totalZones || 0}</p>
        </div>
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Total Subzones</h2>
          <p className="text-3xl">{stats.totalSubzones || 0}</p>
        </div>
        <div className="bg-green-500 text-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Total Fellowships</h2>
          <p className="text-3xl">{stats.totalFellowships || 0}</p>
        </div>
        <div className="bg-purple-500 text-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-3xl">{stats.totalUsers || 0}</p>
        </div>
        <div className="bg-yellow-500 text-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Total Reports</h2>
          <p className="text-3xl">{stats.totalReports || 0}</p>
        </div>
      </div>

      {/* Sentiment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-600 text-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Positive Reports</h2>
          <p className="text-3xl">{stats.positiveReports || 0}</p>
        </div>
        <div className="bg-red-600 text-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Negative Reports</h2>
          <p className="text-3xl">{stats.negativeReports || 0}</p>
        </div>
        <div className="bg-gray-600 text-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Neutral Reports</h2>
          <p className="text-3xl">{stats.neutralReports || 0}</p>
        </div>
      </div>

      {/* Coordinator Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-indigo-500 text-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Regional Coordinators</h2>
          <p className="text-3xl">{stats.totalRegionalCoordinators || 0}</p>
        </div>
        <div className="bg-teal-500 text-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Zonal Coordinators</h2>
          <p className="text-3xl">{stats.totalZonalCoordinators || 0}</p>
        </div>
        <div className="bg-cyan-500 text-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Coordinators</h2>
          <p className="text-3xl">{stats.totalCoordinators || 0}</p>
        </div>
        <div className="bg-pink-500 text-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Evangelism Coordinators</h2>
          <p className="text-3xl">{stats.totalEvngCoordinators || 0}</p>
        </div>
      </div>

      {/* Lists */}
      <div className="space-y-8">
        {/* Subzones */}
        <div className="bg-white p-2 md:p-4 rounded-md">
          <h2 className="text-2xl font-bold mb-4">Subzones</h2>
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
            {subzones.map((subzone) => (
              <div
                key={subzone._id}
                className="bg-white p-4 rounded-lg shadow border border-gray-300 flex flex-col md:flex-row justify-between "
              >
                <h3 className="text-lg font-semibold">{subzone.name}</h3>
                <p>
                  Evangelism Coordinator:{" "}
                  {subzone.evngCoordinator?.name || "N/A"}
                </p>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setSubzonesPage(Math.max(1, subzonesPage - 1))}
              disabled={subzonesPage === 1}
              className="px-4 py-2 bg-gray-300 rounded-l disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-4 py-2 bg-gray-200">
              {subzonesPage} / {totalPages.subzones}
            </span>
            <button
              onClick={() =>
                setSubzonesPage(Math.min(totalPages.subzones, subzonesPage + 1))
              }
              disabled={subzonesPage === totalPages.subzones}
              className="px-4 py-2 bg-gray-300 rounded-r disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {/* Fellowships */}
        <div className="bg-white p-2 md:p-4 rounded-md">
          <h2 className="text-2xl font-bold mb-4">Fellowships</h2>
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
            {fellowships.map((fellowship) => (
              <div
                key={fellowship._id}
                className="bg-white p-4 rounded-lg shadow border border-gray-300 flex flex-col md:flex-row justify-between"
              >
                <h3 className="text-lg font-semibold">{fellowship.name}</h3>
                <p>Coordinator: {fellowship.coordinator?.name || "N/A"}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={() =>
                setFellowshipsPage(Math.max(1, fellowshipsPage - 1))
              }
              disabled={fellowshipsPage === 1}
              className="px-4 py-2 bg-gray-300 rounded-l disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-4 py-2 bg-gray-200">
              {fellowshipsPage} / {totalPages.fellowships}
            </span>
            <button
              onClick={() =>
                setFellowshipsPage(
                  Math.min(totalPages.fellowships, fellowshipsPage + 1)
                )
              }
              disabled={fellowshipsPage === totalPages.fellowships}
              className="px-4 py-2 bg-gray-300 rounded-r disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {/* Reports (Users with Reports) */}
        <div className="bg-white p-2 md:p-4 rounded-md">
          <h2 className="text-2xl font-bold mb-4">Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
            {usersReports.map((user) => (
              <div
                key={user._id}
                className="bg-white p-4 rounded-lg shadow border border-gray-300 flex flex-col md:flex-row justify-between"
              >
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p>Total Reports: {user.totalReports}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setReportsPage(Math.max(1, reportsPage - 1))}
              disabled={reportsPage === 1}
              className="px-4 py-2 bg-gray-300 rounded-l disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-4 py-2 bg-gray-200">
              {reportsPage} / {totalPages.reports}
            </span>
            <button
              onClick={() =>
                setReportsPage(Math.min(totalPages.reports, reportsPage + 1))
              }
              disabled={reportsPage === totalPages.reports}
              className="px-4 py-2 bg-gray-300 rounded-r disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {/* Users */}
        <div className="bg-white p-2 md:p-4 rounded-md">
          <h2 className="text-2xl font-bold mb-4">Users</h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
            {users.map((user) => (
              <div
                key={user._id}
                className="bg-white p-4 rounded-lg shadow border border-gray-300 flex flex-col md:flex-row justify-between"
              >
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p>Fellowship: {user.fellowship?.name || "N/A"}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setUsersPage(Math.max(1, usersPage - 1))}
              disabled={usersPage === 1}
              className="px-4 py-2 bg-gray-300 rounded-l disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-4 py-2 bg-gray-200">
              {usersPage} / {totalPages.users}
            </span>
            <button
              onClick={() =>
                setUsersPage(Math.min(totalPages.users, usersPage + 1))
              }
              disabled={usersPage === totalPages.users}
              className="px-4 py-2 bg-gray-300 rounded-r disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZonalDashboard;
