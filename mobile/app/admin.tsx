import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

export default function AdminScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: logout },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="bg-white p-4 shadow mb-4">
        <Text className="text-2xl font-bold text-blue-900">
          Admin Dashboard
        </Text>
        <Text className="text-gray-600">Welcome, {user?.name}!</Text>
      </View>

      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-lg text-gray-700 mb-8 text-center">
          Admin functionalities will be implemented here.
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
    </SafeAreaView>
  );
}
