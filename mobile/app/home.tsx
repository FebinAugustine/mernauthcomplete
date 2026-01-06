import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../context/AuthContext";
import { getMyProfile } from "../api/user.api";
import { getReportsByUser } from "../api/report.api";
import Dashboard from "../components/Dashboard";
import Reports from "../components/Reports";
import AddReport from "../components/AddReport";
import Profile from "../components/Profile";
import Settings from "../components/Settings";

export default function HomeScreen() {
  const { user, setUser, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("home");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: logout },
    ]);
  };

  const refreshProfile = useCallback(async () => {
    try {
      const data = await getMyProfile();
      setUser(data);
    } catch (error) {
      console.error(error);
    }
  }, [setUser]);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getReportsByUser();
      setReports(data.reports || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "profile") {
      refreshProfile();
    } else if (activeTab === "reports" || activeTab === "home") {
      fetchReports();
    }
  }, [activeTab, refreshProfile, fetchReports]);

  useEffect(() => {
    refreshProfile(); // Refresh profile on mount to ensure user details are loaded
  }, [refreshProfile]);

  const renderContent = () => {
    if (loading) {
      return (
        <View className="flex-1 items-center justify-center pt-50">
          <Image
            source={require("../assets/images/evapod_logo.png")}
            style={{ width: 100, height: 100, resizeMode: "contain" }}
          />
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
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
            refreshReports={fetchReports}
            setActiveTab={setActiveTab}
          />
        );
      case "add-report":
        return <AddReport user={user} setActiveTab={setActiveTab} />;
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

  const tabs = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "reports", label: "Reports", icon: "📊" },
    { id: "add-report", label: "Add", icon: "➕" },
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <SafeAreaView
      className="flex-1 bg-gray-100"
      edges={["top", "left", "right"]}
    >
      {/* Header */}
      <View className="bg-white p-4 shadow">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Image
              source={require("../assets/images/evapod_logo.png")}
              style={{ width: 30, height: 30, resizeMode: "contain" }}
            />
            <Text className="text-blue-700 text-lg font-bold ml-4">
              THE EVAPOD APP
            </Text>
          </View>
          <View className="flex-row items-center">
            {/* <Text className="text-gray-600 mr-4">Home</Text> */}
            <TouchableOpacity
              onPress={handleLogout}
              className="bg-red-600 px-3 py-1 rounded"
            >
              {/* show logout icon */}
              <Ionicons name="log-out-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Content */}
      {activeTab === "reports" ? (
        renderContent()
      ) : (
        <ScrollView className="flex-1">{renderContent()}</ScrollView>
      )}

      {/* Bottom Navigation */}
      <View
        className="bg-white flex-row justify-around py-2 border-t border-gray-200"
        style={{ paddingBottom: insets.bottom }}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            className={`flex-1 items-center py-2 ${
              activeTab === tab.id ? "bg-blue-50" : ""
            }`}
          >
            <Text className="text-2xl mb-1">{tab.icon}</Text>
            <Text
              className={`text-xs ${
                activeTab === tab.id
                  ? "text-blue-600 font-medium"
                  : "text-gray-500"
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}
