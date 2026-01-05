import "../global.css";
import React from "react";
import {
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { router } from "expo-router";

export default function App() {
  const { user, isLoading, isAuth, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: logout },
    ]);
  };

  React.useEffect(() => {
    if (!isLoading) {
      if (isAuth) {
        // User is authenticated, show main app
      } else {
        // User not authenticated, redirect to login
        router.replace("/login");
      }
    }
  }, [isLoading, isAuth]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!isAuth) {
    return null; // Will redirect
  }

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-2xl font-bold text-gray-900 mb-2">
        Welcome back, {user?.name}!
      </Text>
      <Text className="text-gray-600 text-center mb-8">
        You are successfully logged in.
      </Text>
      <TouchableOpacity
        className="w-full py-3 bg-red-600 rounded-lg"
        onPress={handleLogout}
      >
        <Text className="text-white text-center font-semibold text-lg">
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
}
