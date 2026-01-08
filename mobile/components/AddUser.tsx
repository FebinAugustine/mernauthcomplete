import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  createNewUser,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../api/admin.api";
import { getReportsByUserId } from "../api/report.api";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  fellowship?: { name: string };
  phone: number;
  address?: string;
  gender?: string;
  dob?: string;
  zionId: number;
  subZone?: { name: string };
  reports: string;
  createdAt: string;
}

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    fellowship: "",
    phone: "",
    address: "",
    gender: "",
    dob: "",
    zionId: "",
    subZone: "",
  });
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    role: "user",
    fellowship: "",
    phone: "",
    address: "",
    gender: "",
    dob: "",
    zionId: "",
    subZone: "",
  });
  const [editLoading, setEditLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [reportsModalVisible, setReportsModalVisible] = useState(false);
  const [userReports, setUserReports] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [reportsLoading, setReportsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const timeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 10000)
        );
        const data = await Promise.race([getAllUsers(), timeout]);
        setUsers(data.users || []);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setUsersLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = useCallback((name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.role ||
      !formData.fellowship ||
      !formData.phone ||
      !formData.zionId
    ) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const dataToSend: any = {
        ...formData,
        phone: parseInt(formData.phone),
        zionId: parseInt(formData.zionId),
      };
      if (!dataToSend.subZone.trim()) delete dataToSend.subZone;

      const result = await createNewUser(dataToSend);
      Alert.alert("Success", "User created successfully!");
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "user",
        fellowship: "",
        phone: "",
        address: "",
        gender: "",
        dob: "",
        zionId: "",
        subZone: "",
      });
      // Update cache with new user
      if (result.user) {
        setUsers((prev) => [...prev, result.user]);
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to create user"
      );
    } finally {
      setLoading(false);
    }
  }, [formData]);

  const handleEdit = useCallback((user: User) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      fellowship: user.fellowship?.name || "",
      phone: user.phone.toString(),
      address: user.address || "",
      gender: user.gender || "",
      dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
      zionId: user.zionId.toString(),
      subZone: user.subZone?.name || "",
    });
    setModalVisible(true);
  }, []);

  const handleEditSubmit = useCallback(async () => {
    if (!editingUser) return;

    setEditLoading(true);
    try {
      const dataToSend: any = {
        ...editFormData,
        phone: parseInt(editFormData.phone),
        zionId: parseInt(editFormData.zionId),
      };
      if (!dataToSend.subZone.trim()) delete dataToSend.subZone;

      const result = await updateUser(editingUser._id, dataToSend);
      Alert.alert("Success", "User updated successfully!");
      setModalVisible(false);
      setEditingUser(null);
      // Update cache with updated user
      if (result.user) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === editingUser._id ? result.user : user
          )
        );
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update user"
      );
    } finally {
      setEditLoading(false);
    }
  }, [editingUser, editFormData]);

  const handleDelete = useCallback(async (id: string) => {
    Alert.alert("Delete User", "Are you sure you want to delete this user?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteUser(id);
            Alert.alert("Success", "User deleted successfully!");
            // Update cache by removing deleted user
            setUsers((prev) => prev.filter((user) => user._id !== id));
          } catch (error: any) {
            console.error(error);
            const errorMessage =
              error.response?.data?.message || "Failed to delete user";
            Alert.alert("Error", errorMessage);
          }
        },
      },
    ]);
  }, []);

  const handleEditChange = useCallback((name: string, value: string) => {
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleViewReports = useCallback(async (user: User) => {
    setSelectedUser(user);
    setReportsLoading(true);
    try {
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 10000)
      );
      const data = await Promise.race([getReportsByUserId(user._id), timeout]);

      setUserReports(data.reports || []);
      setReportsModalVisible(true);
    } catch (error) {
      console.error(error);
    } finally {
      setReportsLoading(false);
    }
  }, []);

  const filteredUsers = users.filter((user) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.phone.toString().includes(searchLower) ||
      user.zionId.toString().includes(searchLower)
    );
  });

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <ScrollView className="flex-1 p-4">
      <Text className="text-3xl font-bold text-gray-900 mb-6">
        Add New User
      </Text>

      {/* Add Form */}
      <View className="bg-white rounded-lg shadow p-4 mb-6">
        <View className="space-y-4">
          {/* Name */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Name *
            </Text>
            <TextInput
              value={formData.name}
              onChangeText={(value) => handleChange("name", value)}
              className="border border-gray-300 rounded-md p-2"
              placeholder="Enter name"
            />
          </View>

          {/* Email */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Email *
            </Text>
            <TextInput
              value={formData.email}
              onChangeText={(value) => handleChange("email", value)}
              className="border border-gray-300 rounded-md p-2"
              placeholder="Enter email"
              keyboardType="email-address"
            />
          </View>

          {/* Password */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Password *
            </Text>
            <TextInput
              value={formData.password}
              onChangeText={(value) => handleChange("password", value)}
              className="border border-gray-300 rounded-md p-2"
              placeholder="Enter password"
              secureTextEntry
            />
          </View>

          {/* Role */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Role *
            </Text>
            <View className="border border-gray-300 rounded-md">
              <Picker
                selectedValue={formData.role}
                onValueChange={(value) => handleChange("role", value)}
              >
                <Picker.Item label="User" value="user" />
                {/* <Picker.Item label="Zonal" value="zonal" />
                <Picker.Item label="Admin" value="admin" /> */}
                <Picker.Item
                  label="Evangelism Coordinator"
                  value="evngcordinator"
                />
                <Picker.Item label="Coordinator" value="cordinator" />
              </Picker>
            </View>
          </View>

          {/* Fellowship */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Fellowship Name *
            </Text>
            <TextInput
              value={formData.fellowship}
              onChangeText={(value) => handleChange("fellowship", value)}
              className="border border-gray-300 rounded-md p-2"
              placeholder="Enter fellowship name"
            />
          </View>

          {/* Phone */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Phone *
            </Text>
            <TextInput
              value={formData.phone}
              onChangeText={(value) => handleChange("phone", value)}
              className="border border-gray-300 rounded-md p-2"
              placeholder="Enter phone"
              keyboardType="phone-pad"
            />
          </View>

          {/* Address */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Address
            </Text>
            <TextInput
              value={formData.address}
              onChangeText={(value) => handleChange("address", value)}
              className="border border-gray-300 rounded-md p-2"
              placeholder="Enter address"
            />
          </View>

          {/* Gender */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Gender
            </Text>
            <View className="border border-gray-300 rounded-md">
              <Picker
                selectedValue={formData.gender}
                onValueChange={(value) => handleChange("gender", value)}
              >
                <Picker.Item label="Select Gender" value="" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>
          </View>

          {/* Date of Birth */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </Text>
            <TextInput
              value={formData.dob}
              onChangeText={(value) => handleChange("dob", value)}
              className="border border-gray-300 rounded-md p-2"
              placeholder="YYYY-MM-DD"
            />
          </View>

          {/* Zion ID */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Zion ID *
            </Text>
            <TextInput
              value={formData.zionId}
              onChangeText={(value) => handleChange("zionId", value)}
              className="border border-gray-300 rounded-md p-2"
              placeholder="Enter Zion ID"
              keyboardType="numeric"
            />
          </View>

          {/* SubZone */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              SubZone Name
            </Text>
            <TextInput
              value={formData.subZone}
              onChangeText={(value) => handleChange("subZone", value)}
              className="border border-gray-300 rounded-md p-2"
              placeholder="Enter subzone name"
            />
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className="bg-indigo-600 p-3 rounded-md"
          >
            <Text className="text-white text-center font-medium">
              {loading ? "Creating User..." : "Create User"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Users List Header */}
      <Text className="text-2xl font-bold text-gray-900 mb-4">
        Existing Users
      </Text>

      {/* Search */}
      <View className="mb-4">
        <TextInput
          value={search}
          onChangeText={setSearch}
          className="border border-gray-300 rounded-md p-4 mb-4 w-full"
          placeholder="Search users by name, email, phone, or Zion ID..."
        />
      </View>

      {usersLoading ? (
        <View className="items-center justify-center py-8">
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : filteredUsers.length === 0 ? (
        <Text className="text-center py-8 text-gray-500">
          {search ? "No users match your search." : "No users found."}
        </Text>
      ) : (
        filteredUsers.map((item) => (
          <View
            key={item._id}
            className="bg-white rounded-lg shadow-md border border-gray-400 p-4 mb-4 mx-2"
          >
            <View className="flex-row justify-between items-start mb-4">
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900 mb-2">
                  {item.name}
                </Text>
                <View
                  className={`bg-blue-100 px-2 py-1 rounded-full self-start ${
                    item.role === "admin"
                      ? "bg-red-100"
                      : item.role === "zonal"
                        ? "bg-blue-100"
                        : "bg-green-100"
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      item.role === "admin"
                        ? "text-red-800"
                        : item.role === "zonal"
                          ? "text-blue-800"
                          : "text-green-800"
                    }`}
                  >
                    {item.role}
                  </Text>
                </View>
              </View>
              <View className="flex-row">
                <TouchableOpacity
                  onPress={() => handleEdit(item)}
                  className="p-2 mr-2 bg-gray-100 rounded"
                >
                  <Text className="text-blue-600">✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(item._id)}
                  className="p-2 bg-gray-100 rounded"
                >
                  <Text className="text-red-600">🗑️</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleViewReports(item)}
                  className="p-2 bg-gray-100 rounded"
                >
                  <Text className="text-green-600">📊</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="space-y-2">
              <View className="flex-row">
                <Text className="font-medium w-24 text-sm text-gray-600">
                  Email:
                </Text>
                <Text className="text-sm text-gray-800 w-56">{item.email}</Text>
              </View>
              <View className="flex-row">
                <Text className="font-medium w-24 text-sm text-gray-600">
                  Phone:
                </Text>
                <Text className="text-sm text-gray-800">{item.phone}</Text>
              </View>
              <View className="flex-row">
                <Text className="font-medium w-24 text-sm text-gray-600">
                  Fellowship:
                </Text>
                <Text className="text-sm text-gray-800">
                  {item.fellowship?.name || "N/A"}
                </Text>
              </View>
              <View className="flex-row">
                <Text className="font-medium w-24 text-sm text-gray-600">
                  SubZone:
                </Text>
                <Text className="text-sm text-gray-800">
                  {item.subZone?.name || "N/A"}
                </Text>
              </View>
              <View className="flex-row">
                <Text className="font-medium w-24 text-sm text-gray-600">
                  Zion ID:
                </Text>
                <Text className="text-sm text-gray-800">{item.zionId}</Text>
              </View>
              {item.address && (
                <View className="flex-row">
                  <Text className="font-medium w-24 text-sm text-gray-600 text-wrap">
                    Address:
                  </Text>
                  <Text className="text-sm text-gray-800 w-56 text-wrap">
                    {item.address}
                  </Text>
                </View>
              )}
              {item.reports && (
                <View className="flex-row">
                  <Text>Reports: {item.reports.length}</Text>
                </View>
              )}
              {item.gender && (
                <View className="flex-row">
                  <Text className="font-medium w-24 text-sm text-gray-600">
                    Gender:
                  </Text>
                  <Text className="text-sm text-gray-800">{item.gender}</Text>
                </View>
              )}
              {item.dob && (
                <View className="flex-row">
                  <Text className="font-medium w-24 text-sm text-gray-600">
                    DOB:
                  </Text>
                  <Text className="text-sm text-gray-800">
                    {new Date(item.dob).toLocaleDateString()}
                  </Text>
                </View>
              )}
            </View>

            <View className="mt-4 pt-4 border-t border-gray-100">
              <Text className="text-xs text-gray-500">
                Created: {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        ))
      )}

      {/* Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded-lg p-6 w-11/12 max-w-md">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Edit User
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="space-y-4">
                {/* Name */}
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </Text>
                  <TextInput
                    value={editFormData.name}
                    onChangeText={(value) => handleEditChange("name", value)}
                    className="border border-gray-300 rounded-md p-2"
                    placeholder="Enter name"
                  />
                </View>

                {/* Email */}
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </Text>
                  <TextInput
                    value={editFormData.email}
                    onChangeText={(value) => handleEditChange("email", value)}
                    className="border border-gray-300 rounded-md p-2"
                    placeholder="Enter email"
                    keyboardType="email-address"
                  />
                </View>

                {/* Role */}
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Role *
                  </Text>
                  <View className="border border-gray-300 rounded-md">
                    <Picker
                      selectedValue={editFormData.role}
                      onValueChange={(value) => handleEditChange("role", value)}
                    >
                      <Picker.Item label="User" value="user" />
                      {/* <Picker.Item label="Zonal" value="zonal" />
                      <Picker.Item label="Admin" value="admin" /> */}
                      <Picker.Item
                        label="Evangelism Coordinator"
                        value="evngcordinator"
                      />
                      <Picker.Item label="Coordinator" value="cordinator" />
                    </Picker>
                  </View>
                </View>

                {/* Fellowship */}
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Fellowship Name
                  </Text>
                  <TextInput
                    value={editFormData.fellowship}
                    onChangeText={(value) =>
                      handleEditChange("fellowship", value)
                    }
                    className="border border-gray-300 rounded-md p-2"
                    placeholder="Enter fellowship name"
                  />
                </View>

                {/* Phone */}
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </Text>
                  <TextInput
                    value={editFormData.phone}
                    onChangeText={(value) => handleEditChange("phone", value)}
                    className="border border-gray-300 rounded-md p-2"
                    placeholder="Enter phone"
                    keyboardType="phone-pad"
                  />
                </View>

                {/* Address */}
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Address
                  </Text>
                  <TextInput
                    value={editFormData.address}
                    onChangeText={(value) => handleEditChange("address", value)}
                    className="border border-gray-300 rounded-md p-2"
                    placeholder="Enter address"
                  />
                </View>

                {/* Gender */}
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </Text>
                  <View className="border border-gray-300 rounded-md">
                    <Picker
                      selectedValue={editFormData.gender}
                      onValueChange={(value) =>
                        handleEditChange("gender", value)
                      }
                    >
                      <Picker.Item label="Select Gender" value="" />
                      <Picker.Item label="Male" value="Male" />
                      <Picker.Item label="Female" value="Female" />
                      <Picker.Item label="Other" value="Other" />
                    </Picker>
                  </View>
                </View>

                {/* Date of Birth */}
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </Text>
                  <TextInput
                    value={editFormData.dob}
                    onChangeText={(value) => handleEditChange("dob", value)}
                    className="border border-gray-300 rounded-md p-2"
                    placeholder="YYYY-MM-DD"
                  />
                </View>

                {/* Zion ID */}
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Zion ID *
                  </Text>
                  <TextInput
                    value={editFormData.zionId}
                    onChangeText={(value) => handleEditChange("zionId", value)}
                    className="border border-gray-300 rounded-md p-2"
                    placeholder="Enter Zion ID"
                    keyboardType="numeric"
                  />
                </View>

                {/* SubZone */}
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    SubZone Name
                  </Text>
                  <TextInput
                    value={editFormData.subZone}
                    onChangeText={(value) => handleEditChange("subZone", value)}
                    className="border border-gray-300 rounded-md p-2"
                    placeholder="Enter subzone name"
                  />
                </View>
              </View>
            </ScrollView>

            <View className="flex-row justify-end space-x-3 pt-4">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="px-4 py-2 bg-gray-200 rounded-md"
              >
                <Text className="text-gray-700">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleEditSubmit}
                disabled={editLoading}
                className="px-4 py-2 bg-blue-600 rounded-md"
              >
                <Text className="text-white">
                  {editLoading ? "Updating..." : "Update User"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Reports Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={reportsModalVisible}
        onRequestClose={() => setReportsModalVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 justify-center items-center bg-black bg-opacity-50 pt-12 pb-12"
          onPress={() => setReportsModalVisible(false)}
          activeOpacity={1}
        >
          <TouchableOpacity
            className="bg-white rounded-lg p-6 w-11/12 max-h-3/4"
            activeOpacity={1}
            onPress={() => {}}
          >
            <Text className="text-lg font-semibold text-gray-900 mb-4 mt-20">
              Reports for {selectedUser?.name}
            </Text>
            {reportsLoading ? (
              <View className="items-center justify-center py-8">
                <ActivityIndicator size="large" color="#3b82f6" />
              </View>
            ) : (
              <FlatList
                data={userReports}
                renderItem={({ item, index }) => (
                  <View className="mb-4 p-4 bg-gray-50 rounded">
                    <Text className="text-sm text-gray-800">
                      Date: {new Date(item.date).toLocaleDateString()}
                    </Text>
                    <Text className="text-sm text-gray-800">
                      Report Type: {item.typeOfReport}
                    </Text>
                    <Text className="text-sm text-gray-800">
                      Hearer Name: {item.hearerName}
                    </Text>
                    <Text className="text-sm text-gray-800">
                      Status: {item.status}
                    </Text>
                    <Text className="text-sm text-gray-800">
                      Place: {item.location}
                    </Text>
                    <Text className="text-sm text-gray-800">
                      Phone: {item.mobileNumber}
                    </Text>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={
                  <Text className="text-center py-4">No reports found.</Text>
                }
                showsVerticalScrollIndicator={false}
              />
            )}
            <TouchableOpacity
              onPress={() => setReportsModalVisible(false)}
              className="mt-4 px-4 py-2 bg-blue-600 rounded-md self-center mb-20"
            >
              <Text className="text-white">Close</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
};

export default AddUser;
