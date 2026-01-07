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
  createSubzone,
  getAllSubzones,
  updateSubzone,
  deleteSubzone,
} from "../api/admin.api";

interface Subzone {
  _id: string;
  name: string;
  zone: string;
  zonalCoordinator?: { name: string; zionId: string };
  evngCoordinator?: { name: string; zionId: string };
  totalMembers: number;
  createdAt: string;
}

const AddSubzone = () => {
  const [formData, setFormData] = useState({
    name: "",
    zone: "Kochi",
    zonalCoordinator: "",
    evngCoordinator: "",
    totalMembers: "0",
  });
  const [loading, setLoading] = useState(false);
  const [subzones, setSubzones] = useState<Subzone[]>([]);
  const [subzonesLoading, setSubzonesLoading] = useState(true);
  const [editingSubzone, setEditingSubzone] = useState<Subzone | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    zone: "Kochi",
    zonalCoordinator: "",
    evngCoordinator: "",
    totalMembers: "0",
  });
  const [editLoading, setEditLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchSubzones = async () => {
      try {
        const data = await getAllSubzones();
        setSubzones(data.subZones || []);
      } catch (error) {
        console.error("Failed to fetch subzones", error);
        Alert.alert("Error", "Failed to load subzones");
      } finally {
        setSubzonesLoading(false);
      }
    };
    fetchSubzones();
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
      !formData.zonalCoordinator ||
      !formData.evngCoordinator
    ) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const result = await createSubzone({
        ...formData,
        totalMembers: parseInt(formData.totalMembers),
        zonalCoordinator: parseInt(formData.zonalCoordinator),
        evngCoordinator: parseInt(formData.evngCoordinator),
      });
      Alert.alert("Success", "Subzone added successfully!");
      setFormData({
        name: "",
        zone: "Kochi",
        zonalCoordinator: "",
        evngCoordinator: "",
        totalMembers: "0",
      });
      // Update cache with new subzone
      if (result.subZone) {
        setSubzones((prev) => [...prev, result.subZone]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to add subzone");
    } finally {
      setLoading(false);
    }
  }, [formData]);

  const handleEdit = useCallback((subzone: Subzone) => {
    setEditingSubzone(subzone);
    setEditFormData({
      name: subzone.name,
      zone: subzone.zone,
      zonalCoordinator: subzone.zonalCoordinator?.zionId || "",
      evngCoordinator: subzone.evngCoordinator?.zionId || "",
      totalMembers: subzone.totalMembers.toString(),
    });
    setModalVisible(true);
  }, []);

  const handleEditSubmit = useCallback(async () => {
    if (!editingSubzone) return;

    setEditLoading(true);
    try {
      const result = await updateSubzone(editingSubzone._id, {
        ...editFormData,
        totalMembers: parseInt(editFormData.totalMembers),
        zonalCoordinator: parseInt(editFormData.zonalCoordinator),
        evngCoordinator: parseInt(editFormData.evngCoordinator),
      });
      Alert.alert("Success", "Subzone updated successfully!");
      setModalVisible(false);
      setEditingSubzone(null);
      // Update cache with updated subzone
      if (result.subZone) {
        setSubzones((prev) =>
          prev.map((subzone) =>
            subzone._id === editingSubzone._id ? result.subZone : subzone
          )
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update subzone");
    } finally {
      setEditLoading(false);
    }
  }, [editingSubzone, editFormData]);

  const handleDelete = useCallback(async (id: string) => {
    Alert.alert(
      "Delete Subzone",
      "Are you sure you want to delete this subzone?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteSubzone(id);
              Alert.alert("Success", "Subzone deleted successfully!");
              // Update cache by removing deleted subzone
              setSubzones((prev) =>
                prev.filter((subzone) => subzone._id !== id)
              );
            } catch (error: any) {
              console.error(error);
              const errorMessage =
                error.response?.data?.message || "Failed to delete subzone";
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
      <Text className="text-3xl font-bold text-gray-900 mb-6">Add Subzone</Text>

      {/* Add Form */}
      <View className="bg-white rounded-lg shadow p-4 mb-6">
        <View className="space-y-4">
          {/* Name */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Subzone Name *
            </Text>
            <TextInput
              value={formData.name}
              onChangeText={(value) => handleChange("name", value)}
              className="border border-gray-300 rounded-md p-2"
              placeholder="Enter subzone name"
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
              </Picker>
            </View>
          </View>

          {/* Zonal Coordinator */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Zonal Coordinator Zion ID *
            </Text>
            <TextInput
              value={formData.zonalCoordinator}
              onChangeText={(value) => handleChange("zonalCoordinator", value)}
              className="border border-gray-300 rounded-md p-2"
              placeholder="Enter Zion ID"
              keyboardType="numeric"
            />
          </View>

          {/* Evangelism Coordinator */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Evangelism Coordinator Zion ID *
            </Text>
            <TextInput
              value={formData.evngCoordinator}
              onChangeText={(value) => handleChange("evngCoordinator", value)}
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

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className="bg-indigo-600 p-3 rounded-md"
          >
            <Text className="text-white text-center font-medium">
              {loading ? "Adding Subzone..." : "Add Subzone"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Subzones List Header */}
      <Text className="text-2xl font-bold text-gray-900 mb-4">
        Existing Subzones
      </Text>

      {subzonesLoading ? (
        <View className="items-center justify-center py-8">
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : subzones.length === 0 ? (
        <Text className="text-center py-8 text-gray-500">
          No subzones found.
        </Text>
      ) : (
        subzones.map((item) => (
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
                  Zonal Coord:
                </Text>
                <Text className="text-sm text-gray-800">
                  {item.zonalCoordinator?.name || "N/A"}
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
                  Members:
                </Text>
                <Text className="text-sm text-gray-800">
                  {item.totalMembers || 0}
                </Text>
              </View>
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
              Edit Subzone
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="space-y-4">
                {/* Name */}
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Subzone Name *
                  </Text>
                  <TextInput
                    value={editFormData.name}
                    onChangeText={(value) => handleEditChange("name", value)}
                    className="border border-gray-300 rounded-md p-2"
                    placeholder="Enter subzone name"
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
                    </Picker>
                  </View>
                </View>

                {/* Zonal Coordinator */}
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Zonal Coordinator Zion ID *
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

                {/* Evangelism Coordinator */}
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Evangelism Coordinator Zion ID *
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
                  {editLoading ? "Updating..." : "Update Subzone"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default AddSubzone;
