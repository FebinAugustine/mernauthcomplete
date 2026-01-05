import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { changePassword } from "../api/user.api";

interface SettingsProps {
  setActiveTab: (tab: string) => void;
}

export default function Settings({ setActiveTab }: SettingsProps) {
  const { user } = useAuth();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordSubmit = async () => {
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      Alert.alert("Error", "New password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      Alert.alert("Success", "Password changed successfully");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-white p-4 shadow">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-xl font-bold text-blue-900">
              Settings for {user?.name}
            </Text>
          </View>
          <View className="relative">
            <TouchableOpacity
              onPress={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-2"
            >
              <Text className="text-gray-700">▼</Text>
            </TouchableOpacity>
            {isDropdownOpen && (
              <View className="absolute right-0 top-10 bg-white border rounded-md shadow-lg py-1 z-20 w-48">
                <TouchableOpacity
                  onPress={() => {
                    setActiveTab("profile");
                    setIsDropdownOpen(false);
                  }}
                  className="px-4 py-2"
                >
                  <Text className="text-gray-700">Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setActiveTab("settings");
                    setIsDropdownOpen(false);
                  }}
                  className="px-4 py-2"
                >
                  <Text className="text-gray-700">Settings</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>

      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-900 mb-6">
          Change Password
        </Text>
        <View className="bg-white rounded-lg shadow p-4">
          <View className="space-y-4">
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Current Password
              </Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg">
                <TextInput
                  className="flex-1 px-3 py-2"
                  value={passwordForm.currentPassword}
                  onChangeText={(value) =>
                    handlePasswordChange("currentPassword", value)
                  }
                  secureTextEntry={!showCurrentPassword}
                  placeholder="Enter current password"
                />
                <TouchableOpacity
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="px-3 py-2"
                >
                  <Text className="text-gray-500">
                    {showCurrentPassword ? "🙈" : "👁️"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">
                New Password
              </Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg">
                <TextInput
                  className="flex-1 px-3 py-2"
                  value={passwordForm.newPassword}
                  onChangeText={(value) =>
                    handlePasswordChange("newPassword", value)
                  }
                  secureTextEntry={!showNewPassword}
                  placeholder="Enter new password"
                />
                <TouchableOpacity
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  className="px-3 py-2"
                >
                  <Text className="text-gray-500">
                    {showNewPassword ? "🙈" : "👁️"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg">
                <TextInput
                  className="flex-1 px-3 py-2"
                  value={passwordForm.confirmPassword}
                  onChangeText={(value) =>
                    handlePasswordChange("confirmPassword", value)
                  }
                  secureTextEntry={!showConfirmPassword}
                  placeholder="Confirm new password"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="px-3 py-2"
                >
                  <Text className="text-gray-500">
                    {showConfirmPassword ? "🙈" : "👁️"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              onPress={handlePasswordSubmit}
              className="w-full bg-blue-600 py-3 rounded-lg mt-4"
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text className="text-white text-center font-semibold">
                  Change Password
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
