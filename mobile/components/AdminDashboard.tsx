import React, { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import {
  getDashboardStats,
  getUsersWithReportsPaginated,
} from "../api/admin.api";

interface Stats {
  totalUsers?: number;
  totalReports?: number;
  positiveReports?: number;
  negativeReports?: number;
  neutralReports?: number;
}

interface UserReport {
  _id: string;
  name: string;
  totalReports: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // States for lists
  const [usersReports, setUsersReports] = useState<UserReport[]>([]);

  // Pagination states
  const [reportsPage, setReportsPage] = useState(1);
  const [totalPages, setTotalPages] = useState({
    reports: 1,
  });

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

  const fetchUsersReports = useCallback(async () => {
    try {
      const data = await getUsersWithReportsPaginated(reportsPage);
      setUsersReports(data.users);
      setTotalPages((prev) => ({ ...prev, reports: data.pages }));
    } catch (err) {
      console.error("Failed to load users reports", err);
    }
  }, [reportsPage]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchUsersReports();
  }, [reportsPage, fetchUsersReports]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="p-6">
        <Text className="text-red-600">{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-6">
      <Text className="text-3xl font-bold text-gray-900 mb-6">
        Admin Dashboard
      </Text>

      {/* Stats Cards */}
      <View className="grid grid-cols-1 gap-6 mb-8">
        <View className="bg-blue-500 text-white p-6 rounded-lg shadow">
          <Text className="text-xl font-semibold">Total Users</Text>
          <Text className="text-3xl">{stats.totalUsers || 0}</Text>
        </View>
        <View className="bg-purple-500 text-white p-6 rounded-lg shadow">
          <Text className="text-xl font-semibold">Total Reports</Text>
          <Text className="text-3xl">{stats.totalReports || 0}</Text>
        </View>
      </View>

      {/* Sentiment Cards */}
      <View className="grid grid-cols-1 gap-6 mb-8">
        <View className="bg-green-600 text-white p-6 rounded-lg shadow">
          <Text className="text-xl font-semibold">Positive Reports</Text>
          <Text className="text-3xl">{stats.positiveReports || 0}</Text>
        </View>
        <View className="bg-red-600 text-white p-6 rounded-lg shadow">
          <Text className="text-xl font-semibold">Negative Reports</Text>
          <Text className="text-3xl">{stats.negativeReports || 0}</Text>
        </View>
        <View className="bg-gray-600 text-white p-6 rounded-lg shadow">
          <Text className="text-xl font-semibold">Neutral Reports</Text>
          <Text className="text-3xl">{stats.neutralReports || 0}</Text>
        </View>
      </View>

      {/* Reports (Users with Reports) */}
      <View className="bg-white p-4 rounded-md mb-8">
        <Text className="text-2xl font-bold mb-4">Reports by Users</Text>
        <View className="space-y-4">
          {usersReports.map((user) => (
            <View
              key={user._id}
              className="bg-gray-50 p-4 rounded-lg shadow border border-gray-300 flex flex-row justify-between"
            >
              <Text className="text-lg font-semibold">{user.name}</Text>
              <Text>Total Reports: {user.totalReports}</Text>
            </View>
          ))}
        </View>
        <View className="flex justify-center mt-4">
          <View className="flex-row">
            <Text
              onPress={() => setReportsPage(Math.max(1, reportsPage - 1))}
              className={`px-4 py-2 bg-gray-300 rounded-l ${reportsPage === 1 ? "opacity-50" : ""}`}
            >
              Prev
            </Text>
            <Text className="px-4 py-2 bg-gray-200">
              {reportsPage} / {totalPages.reports}
            </Text>
            <Text
              onPress={() =>
                setReportsPage(Math.min(totalPages.reports, reportsPage + 1))
              }
              className={`px-4 py-2 bg-gray-300 rounded-r ${reportsPage === totalPages.reports ? "opacity-50" : ""}`}
            >
              Next
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default AdminDashboard;
