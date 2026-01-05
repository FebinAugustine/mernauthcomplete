import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "../context/AuthContext";
import { updateUser } from "../api/user.api";

interface ProfileProps {
  refreshProfile: () => void;
  setActiveTab: (tab: string) => void;
}

export default function Profile({
  refreshProfile,
  setActiveTab,
}: ProfileProps) {
  const { user } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phone: "",
    fellowship: "",
    address: "",
    gender: "",
    dob: "",
    zionId: "",
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openEditModal = () => {
    if (user) {
      setEditFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone?.toString() || "",
        fellowship: user.fellowship?.name || user.fellowship || "",
        address: user.address || "",
        gender: user.gender || "",
        dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
        zionId: user.zionId?.toString() || "",
      });
      setIsEditModalOpen(true);
    }
  };

  const closeEditModal = () => {
    setEditFormData({
      name: "",
      email: "",
      phone: "",
      fellowship: "",
      address: "",
      gender: "",
      dob: "",
      zionId: "",
    });
    setIsEditModalOpen(false);
  };

  const handleEditSubmit = async () => {
    setIsLoading(true);
    try {
      await updateUser(editFormData);
      Alert.alert("Success", "Profile updated successfully");
      closeEditModal();
      refreshProfile();
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-white p-4 shadow">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-xl font-bold text-blue-900">
              Profile Details Of {user?.name}!
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
                  className="px-4 py-2 text-gray-700"
                >
                  <Text>Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setActiveTab("settings");
                    setIsDropdownOpen(false);
                  }}
                  className="px-4 py-2 text-gray-700"
                >
                  <Text>Settings</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>

      <View className="p-4">
        <TouchableOpacity
          onPress={openEditModal}
          className="bg-blue-600 p-3 rounded-lg self-end mb-4"
        >
          <Text className="text-white font-semibold">Edit Profile</Text>
        </TouchableOpacity>

        {/* Personal Information Card */}
        <View className="bg-white rounded-lg p-4 mb-4 shadow">
          <View className="flex-row items-center mb-4">
            <Text className="text-xl mr-2">👤</Text>
            <Text className="text-xl font-semibold">Personal Info</Text>
          </View>
          <View className="space-y-2">
            <View>
              <Text className="text-sm text-gray-500">Name</Text>
              <Text className="text-lg font-medium">{user?.name}</Text>
            </View>
            <View>
              <Text className="text-sm text-gray-500">Email</Text>
              <Text className="text-lg">
                📧 {user?.email || "Not provided"}
              </Text>
            </View>
            <View>
              <Text className="text-sm text-gray-500">Phone</Text>
              <Text className="text-lg">
                📞 {user?.phone || "Not provided"}
              </Text>
            </View>
            <View>
              <Text className="text-sm text-gray-500">Gender</Text>
              <Text className="text-lg">{user?.gender || "Not specified"}</Text>
            </View>
            <View>
              <Text className="text-sm text-gray-500">Date of Birth</Text>
              <Text className="text-lg">
                📅{" "}
                {user?.dob
                  ? new Date(user.dob).toLocaleDateString()
                  : "Not specified"}
              </Text>
            </View>
            <View>
              <Text className="text-sm text-gray-500">Address</Text>
              <Text className="text-lg">{user?.address || "Not provided"}</Text>
            </View>
          </View>
        </View>

        {/* Church Information Card */}
        <View className="bg-white rounded-lg p-4 mb-4 shadow">
          <View className="flex-row items-center mb-4">
            <Text className="text-xl mr-2">📍</Text>
            <Text className="text-xl font-semibold">Church Info</Text>
          </View>
          <View className="space-y-2">
            <View>
              <Text className="text-sm text-gray-500">Fellowship</Text>
              <Text className="text-lg font-medium">
                {user?.fellowship?.name || user?.fellowship || "Not specified"}
              </Text>
            </View>
            <View>
              <Text className="text-sm text-gray-500">Zion ID</Text>
              <Text className="text-lg">
                # {user?.zionId || "Not assigned"}
              </Text>
            </View>
            <View>
              <Text className="text-sm text-gray-500">Role</Text>
              <Text className="text-lg capitalize">{user?.role}</Text>
            </View>
          </View>
        </View>

        {/* Account Status Card */}
        <View className="bg-white rounded-lg p-4 shadow">
          <View className="flex-row items-center mb-4">
            <Text className="text-xl mr-2">✅</Text>
            <Text className="text-xl font-semibold">Account Status</Text>
          </View>
          <View className="space-y-2">
            <View className="flex-row items-center">
              <Text className="text-sm text-gray-500 mr-2">Verified:</Text>
              <Text className="text-lg">{user.isVerified ? "✅" : "❌"}</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-sm text-gray-500 mr-2">Blocked:</Text>
              <Text className="text-lg">{user.isBlocked ? "Yes" : "No"}</Text>
            </View>
            <View>
              <Text className="text-sm text-gray-500">Member Since</Text>
              <Text className="text-lg">
                🕒{" "}
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"}
              </Text>
            </View>
            <View>
              <Text className="text-sm text-gray-500">Last Updated</Text>
              <Text className="text-lg">
                {user.updatedAt
                  ? new Date(user.updatedAt).toLocaleDateString()
                  : "N/A"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Edit Modal */}
      <Modal
        visible={isEditModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={closeEditModal}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50 p-4">
          <ScrollView className="bg-white rounded-lg p-4 w-full max-h-4/5">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-2xl font-bold">Edit Profile</Text>
              <TouchableOpacity onPress={closeEditModal}>
                <Text className="text-2xl text-gray-500">×</Text>
              </TouchableOpacity>
            </View>
            <View className="space-y-4">
              <View>
                <Text className="text-sm font-medium mb-1">Name</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  value={editFormData.name}
                  onChangeText={(value) => handleInputChange("name", value)}
                />
              </View>
              <View>
                <Text className="text-sm font-medium mb-1">Email</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  value={editFormData.email}
                  onChangeText={(value) => handleInputChange("email", value)}
                  keyboardType="email-address"
                />
              </View>
              <View>
                <Text className="text-sm font-medium mb-1">Phone</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  value={editFormData.phone}
                  onChangeText={(value) => handleInputChange("phone", value)}
                  keyboardType="phone-pad"
                />
              </View>
              <View>
                <Text className="text-sm font-medium mb-1">Fellowship</Text>
                <Picker
                  selectedValue={editFormData.fellowship}
                  onValueChange={(value) =>
                    handleInputChange("fellowship", value)
                  }
                  className="border border-gray-300 rounded-lg"
                >
                  <Picker.Item label="Select Fellowship" value="" />
                  <Picker.Item label="FortKochi" value="FortKochi" />
                  <Picker.Item label="Thevara" value="Thevara" />
                  <Picker.Item label="Palarivattom" value="Palarivattom" />
                  <Picker.Item label="Thoppumpady" value="Thoppumpady" />
                  <Picker.Item label="Palluruthi" value="Palluruthi" />
                  <Picker.Item label="Perumpadappu" value="Perumpadappu" />
                  <Picker.Item label="Kannamaly" value="Kannamaly" />
                  <Picker.Item label="Kumbalangi" value="Kumbalangi" />
                  <Picker.Item label="Kattiparambu" value="Kattiparambu" />
                </Picker>
              </View>
              <View>
                <Text className="text-sm font-medium mb-1">Address</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  value={editFormData.address}
                  onChangeText={(value) => handleInputChange("address", value)}
                  multiline
                  numberOfLines={2}
                />
              </View>
              <View>
                <Text className="text-sm font-medium mb-1">Gender</Text>
                <Picker
                  selectedValue={editFormData.gender}
                  onValueChange={(value) => handleInputChange("gender", value)}
                  className="border border-gray-300 rounded-lg"
                >
                  <Picker.Item label="Select Gender" value="" />
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Female" value="Female" />
                  <Picker.Item label="Other" value="Other" />
                </Picker>
              </View>
              <View>
                <Text className="text-sm font-medium mb-1">Date of Birth</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  value={editFormData.dob}
                  onChangeText={(value) => handleInputChange("dob", value)}
                  placeholder="YYYY-MM-DD"
                />
              </View>
              <View>
                <Text className="text-sm font-medium mb-1">Zion ID</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  value={editFormData.zionId}
                  onChangeText={(value) => handleInputChange("zionId", value)}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View className="flex-row justify-end space-x-3 mt-4">
              <TouchableOpacity
                onPress={closeEditModal}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                <Text className="text-gray-700">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleEditSubmit}
                className="px-4 py-2 bg-blue-600 rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text className="text-white">Update Profile</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}
