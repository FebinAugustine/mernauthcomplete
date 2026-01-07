import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  createFellowship,
  getAllFellowships,
  updateFellowship,
  deleteFellowship,
} from "../api/admin.api";

interface Fellowship {
  _id: string;
  name: string;
  zone: string;
  subzone: string;
  coordinator?: { name: string; zionId: any };
  evngCoordinator?: { name: string; zionId: any };
  zonalCoordinator?: { name: string; zionId: any };
  totalMembers: number;
  address?: string;
  createdAt: string;
}

const AddFellowship = () => {
  const [formData, setFormData] = useState({
    name: "",
    zone: "Kochi",
    subzone: "Thevara",
    coordinator: "",
    evngCoordinator: "",
    zonalCoordinator: "",
    totalMembers: "0",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [fellowships, setFellowships] = useState<Fellowship[]>([]);
  const [fellowshipsLoading, setFellowshipsLoading] = useState(true);
  const [editingFellowship, setEditingFellowship] = useState<Fellowship | null>(
    null
  );
  const [editFormData, setEditFormData] = useState({
    name: "",
    zone: "Kochi",
    subzone: "Thevara",
    coordinator: "",
    evngCoordinator: "",
    zonalCoordinator: "",
    totalMembers: "0",
    address: "",
  });
  const [editLoading, setEditLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchFellowships = async () => {
      try {
        const data = await getAllFellowships();
        setFellowships(data.fellowships || []);
      } catch (error) {
        console.error("Failed to fetch fellowships", error);
        Alert.alert("Error", "Failed to load fellowships");
      } finally {
        setFellowshipsLoading(false);
      }
    };
    fetchFellowships();
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
      !formData.zone ||
      !formData.subzone ||
      !formData.coordinator
    ) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const dataToSend: any = {
        ...formData,
        totalMembers: parseInt(formData.totalMembers),
        coordinator: parseInt(formData.coordinator),
      };
      if (formData.evngCoordinator)
        dataToSend.evngCoordinator = parseInt(formData.evngCoordinator);
      if (formData.zonalCoordinator)
        dataToSend.zonalCoordinator = parseInt(formData.zonalCoordinator);

      const result = await createFellowship(dataToSend);
      Alert.alert("Success", "Fellowship added successfully!");
      setFormData({
        name: "",
        zone: "Kochi",
        subzone: "Thevara",
        coordinator: "",
        evngCoordinator: "",
        zonalCoordinator: "",
        totalMembers: "0",
        address: "",
      });
      // Update cache with new fellowship
      if (result.fellowship) {
        setFellowships((prev) => [...prev, result.fellowship]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to add fellowship");
    } finally {
      setLoading(false);
    }
  }, [formData]);

  const handleEdit = useCallback((fellowship: Fellowship) => {
    setEditingFellowship(fellowship);
    setEditFormData({
      name: fellowship.name,
      zone: fellowship.zone,
      subzone: fellowship.subzone,
      coordinator: fellowship.coordinator?.zionId?.toString() || "",
      evngCoordinator: fellowship.evngCoordinator?.zionId?.toString() || "",
      zonalCoordinator: fellowship.zonalCoordinator?.zionId?.toString() || "",
      totalMembers: fellowship.totalMembers.toString(),
      address: fellowship.address || "",
    });
    setModalVisible(true);
  }, []);

  const handleEditSubmit = useCallback(async () => {
    if (!editingFellowship) return;

    setEditLoading(true);
    try {
      const dataToSend: any = {
        ...editFormData,
        totalMembers: parseInt(editFormData.totalMembers),
        coordinator: parseInt(editFormData.coordinator),
      };
      if (editFormData.evngCoordinator)
        dataToSend.evngCoordinator = parseInt(editFormData.evngCoordinator);
      if (editFormData.zonalCoordinator)
        dataToSend.zonalCoordinator = parseInt(editFormData.zonalCoordinator);

      const result = await updateFellowship(editingFellowship._id, dataToSend);
      Alert.alert("Success", "Fellowship updated successfully!");
      setModalVisible(false);
      setEditingFellowship(null);
      // Update cache with updated fellowship
      if (result.fellowship) {
        setFellowships((prev) =>
          prev.map((fellowship) =>
            fellowship._id === editingFellowship._id
              ? result.fellowship
              : fellowship
          )
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update fellowship");
    } finally {
      setEditLoading(false);
    }
  }, [editingFellowship, editFormData]);

  const handleDelete = useCallback(async (id: string) => {
    Alert.alert(
      "Delete Fellowship",
      "Are you sure you want to delete this fellowship?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteFellowship(id);
              Alert.alert("Success", "Fellowship deleted successfully!");
              // Update cache by removing deleted fellowship
              setFellowships((prev) =>
                prev.filter((fellowship) => fellowship._id !== id)
              );
            } catch (error: any) {
              console.error(error);
              const errorMessage =
                error.response?.data?.message || "Failed to delete fellowship";
              Alert.alert("Error", errorMessage);
            }
          },
        },
      ]
    );
  }, []);

  const handleEditChange = useCallback((name: string, value: string) => {
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  return (
    <ScrollView className="flex-1 p-4">
      <Text className="text-3xl font-bold text-gray-900 mb-6">
        Add Fellowship
      </Text>

      {/* Add Form */}
      <View className="bg-white rounded-lg shadow p-4 mb-6">
        <View className="space-y-4">
          {/* Name */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Fellowship Name *
            </Text>
            <TextInput
              value={formData.name}
              onChangeText={(value) => handleChange("name", value)}
              className="border border-gray-300 rounded-md p-2"
              placeholder="Enter fellowship name"
            />
          </View>

          {/* Zone */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Zone *
            </Text>
            <View className="border border-gray-300 rounded-md">
              <Picker
                selectedValue={formData.zone}
                onValueChange={(value) => handleChange("zone", value)}
              >
                <Picker.Item label="Kochi" value="Kochi" />
                <Picker.Item label="Ernakulam" value="Ernakulam" />
                <Picker.Item label="Varappuzha" value="Varappuzha" />
                <Picker.Item label="Pala" value="Pala" />
                <Picker.Item label="Zion" value="Zion" />
              </Picker>
            </View>
          </View>

          {/* Subzone */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Subzone *
            </Text>
            <View className="border border-gray-300 rounded-md">
              <Picker
                selectedValue={formData.subzone}
                onValueChange={(value) => handleChange("subzone", value)}
              >
                <Picker.Item label="Thevara" value="Thevara" />
                <Picker.Item label="FortKochi" value="FortKochi" />
                <Picker.Item label="Ernakulam1" value="Ernakulam1" />
                <Picker.Item label="Ernakulam2" value="Ernakulam2" />
                <Picker.Item label="Varappuzha1" value="Varappuzha1" />
                <Picker.Item label="Varappuzha2" value="Varappuzha2" />
                <Picker.Item label="Pala1" value="Pala1" />
                <Picker.Item label="Pala2" value="Pala2" />
                <Picker.Item label="Zion1" value="Zion1" />
                <Picker.Item label="Zion2" value="Zion2" />
              </Picker>
            </View>
          </View>

          {/* Coordinator */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Coordinator Zion ID *
            </Text>
            <TextInput
              value={formData.coordinator}
              onChangeText={(value) => handleChange("coordinator", value)}
              className="border border-gray-300 rounded-md p-2"
              placeholder="Enter Zion ID"
              keyboardType="numeric"
            />
          </View>

          {/* Evangelism Coordinator */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Evangelism Coordinator Zion ID
            </Text>
            <TextInput
              value={formData.evngCoordinator}
              onChangeText={(value) => handleChange("evngCoordinator", value)}
              className="border border-gray-300 rounded-md p-2"
              placeholder="Enter Zion ID"
              keyboardType="numeric"
            />
          </View>

          {/* Zonal Coordinator */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Zonal Coordinator Zion ID
            </Text>
            <TextInput
              value={formData.zonalCoordinator}
              onChangeText={(value) => handleChange("zonalCoordinator", value)}
              className="border border-gray-300 rounded-md p-2"
              placeholder="Enter Zion ID"
              keyboardType="numeric"
            />
          </View>

          {/* Total Members */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Total Members *
            </Text>
            <TextInput
              value={formData.totalMembers}
              onChangeText={(value) => handleChange("totalMembers", value)}
              className="border border-gray-300 rounded-md p-2"
              placeholder="Enter total members"
              keyboardType="numeric"
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

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className="bg-indigo-600 p-3 rounded-md"
          >
            <Text className="text-white text-center font-medium">
              {loading ? "Adding Fellowship..." : "Add Fellowship"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Fellowships List Header */}
      <Text className="text-2xl font-bold text-gray-900 mb-4">
        Existing Fellowships
      </Text>

      {fellowshipsLoading ? (
        <View className="items-center justify-center py-8">
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : fellowships.length === 0 ? (
        <Text className="text-center py-8 text-gray-500">
          No fellowships found.
        </Text>
      ) : (
        fellowships.map((item) => (
          <View
            key={item._id}
            className="bg-white rounded-lg shadow-md border border-gray-400 p-4 mb-4 mx-2"
          >
            <View className="flex-row justify-between items-start mb-4">
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900 mb-2">
                  {item.name}
                </Text>
                <View className="bg-blue-100 px-2 py-1 rounded-full self-start">
                  <Text className="text-xs font-medium text-blue-800">
                    {item.zone}
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
              </View>
            </View>

            <View className="space-y-2">
              <View className="flex-row">
                <Text className="font-medium w-24 text-sm text-gray-600">
                  Subzone:
                </Text>
                <Text className="text-sm text-gray-800">{item.subzone}</Text>
              </View>
              <View className="flex-row">
                <Text className="font-medium w-24 text-sm text-gray-600">
                  Coordinator:
                </Text>
                <Text className="text-sm text-gray-800">
                  {item.coordinator?.name || "N/A"}
                </Text>
              </View>
              <View className="flex-row">
                <Text className="font-medium w-24 text-sm text-gray-600">
                  Evng Coord:
                </Text>
                <Text className="text-sm text-gray-800">
                  {item.evngCoordinator?.name || "N/A"}
                </Text>
              </View>
              <View className="flex-row">
                <Text className="font-medium w-24 text-sm text-gray-600">
                  Zonal Coord:
                </Text>
                <Text className="text-sm text-gray-800">
                  {item.zonalCoordinator?.name || "N/A"}
                </Text>
              </View>
              <View className="flex-row">
                <Text className="font-medium w-24 text-sm text-gray-600">
                  Members:
                </Text>
                <Text className="text-sm text-gray-800">
                  {item.totalMembers || 0}
                </Text>
              </View>
              {item.address && (
                <View className="flex-row">
                  <Text className="font-medium w-24 text-sm text-gray-600">
                    Address:
                  </Text>
                  <Text className="text-sm text-gray-800">{item.address}</Text>
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
              Edit Fellowship
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="space-y-4">
                {/* Name */}
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Fellowship Name *
                  </Text>
                  <TextInput
                    value={editFormData.name}
                    onChangeText={(value) => handleEditChange("name", value)}
                    className="border border-gray-300 rounded-md p-2"
                    placeholder="Enter fellowship name"
                  />
                </View>

                {/* Zone */}
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Zone *
                  </Text>
                  <View className="border border-gray-300 rounded-md">
                    <Picker
                      selectedValue={editFormData.zone}
                      onValueChange={(value) => handleEditChange("zone", value)}
                    >
                      <Picker.Item label="Kochi" value="Kochi" />
                      <Picker.Item label="Ernakulam" value="Ernakulam" />
                      <Picker.Item label="Varappuzha" value="Varappuzha" />
                      <Picker.Item label="Pala" value="Pala" />
                      <Picker.Item label="Zion" value="Zion" />
                    </Picker>
                  </View>
                </View>

                {/* Subzone */}
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Subzone *
                  </Text>
                  <View className="border border-gray-300 rounded-md">
                    <Picker
                      selectedValue={editFormData.subzone}
                      onValueChange={(value) =>
                        handleEditChange("subzone", value)
                      }
                    >
                      <Picker.Item label="Thevara" value="Thevara" />
                      <Picker.Item label="FortKochi" value="FortKochi" />
                      <Picker.Item label="Ernakulam1" value="Ernakulam1" />
                      <Picker.Item label="Ernakulam2" value="Ernakulam2" />
                      <Picker.Item label="Varappuzha1" value="Varappuzha1" />
                      <Picker.Item label="Varappuzha2" value="Varappuzha2" />
                      <Picker.Item label="Pala1" value="Pala1" />
                      <Picker.Item label="Pala2" value="Pala2" />
                      <Picker.Item label="Zion1" value="Zion1" />
                      <Picker.Item label="Zion2" value="Zion2" />
                    </Picker>
                  </View>
                </View>

                {/* Coordinator */}
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Coordinator Zion ID *
                  </Text>
                  <TextInput
                    value={editFormData.coordinator}
                    onChangeText={(value) =>
                      handleEditChange("coordinator", value)
                    }
                    className="border border-gray-300 rounded-md p-2"
                    placeholder="Enter Zion ID"
                    keyboardType="numeric"
                  />
                </View>

                {/* Evangelism Coordinator */}
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Evangelism Coordinator Zion ID
                  </Text>
                  <TextInput
                    value={editFormData.evngCoordinator}
                    onChangeText={(value) =>
                      handleEditChange("evngCoordinator", value)
                    }
                    className="border border-gray-300 rounded-md p-2"
                    placeholder="Enter Zion ID"
                    keyboardType="numeric"
                  />
                </View>

                {/* Zonal Coordinator */}
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Zonal Coordinator Zion ID
                  </Text>
                  <TextInput
                    value={editFormData.zonalCoordinator}
                    onChangeText={(value) =>
                      handleEditChange("zonalCoordinator", value)
                    }
                    className="border border-gray-300 rounded-md p-2"
                    placeholder="Enter Zion ID"
                    keyboardType="numeric"
                  />
                </View>

                {/* Total Members */}
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Total Members *
                  </Text>
                  <TextInput
                    value={editFormData.totalMembers}
                    onChangeText={(value) =>
                      handleEditChange("totalMembers", value)
                    }
                    className="border border-gray-300 rounded-md p-2"
                    placeholder="Enter total members"
                    keyboardType="numeric"
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
                  {editLoading ? "Updating..." : "Update Fellowship"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default AddFellowship;
