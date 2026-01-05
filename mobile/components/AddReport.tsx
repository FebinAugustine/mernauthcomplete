import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createReport } from "../api/report.api";

interface AddReportProps {
  user: any;
  setActiveTab: (tab: string) => void;
}

export default function AddReport({ user, setActiveTab }: AddReportProps) {
  const [formData, setFormData] = useState({
    fellowship: "",
    typeOfReport: "",
    date: new Date().toISOString().split("T")[0],
    hearerName: "",
    noOfHearers: 1,
    location: "",
    mobileNumber: "",
    status: "Neutral",
    remarks: "",
    followUpStatus: "First Contact",
    nextFollowUpDate: "",
    followUpRemarks: "",
    appointmentDate: "",
    appointmentTime: "",
    appointmentLocation: "",
    appointmentStatus: "Not Scheduled",
    evangelistAssigned: "",
    appointmentRemarks: "",
  });
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAppointmentDatePicker, setShowAppointmentDatePicker] =
    useState(false);
  const [showNextFollowUpDatePicker, setShowNextFollowUpDatePicker] =
    useState(false);

  const handleChange = (name: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!user || !user._id) {
      Alert.alert("Error", "User not authenticated");
      return;
    }
    if (
      !formData.fellowship ||
      !formData.typeOfReport ||
      !formData.date ||
      !formData.hearerName ||
      !formData.location ||
      !formData.mobileNumber
    ) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }
    setLoading(true);
    try {
      const reportData = {
        ...formData,
        user: user._id,
        date: new Date(formData.date),
        nextFollowUpDate: formData.nextFollowUpDate
          ? new Date(formData.nextFollowUpDate)
          : null,
        appointmentDate: formData.appointmentDate
          ? new Date(formData.appointmentDate)
          : null,
      };
      await createReport(reportData);
      Alert.alert("Success", "Report added successfully!");
      // Reset form
      setFormData({
        fellowship: "",
        typeOfReport: "",
        date: new Date().toISOString().split("T")[0],
        hearerName: "",
        noOfHearers: 1,
        location: "",
        mobileNumber: "",
        status: "Neutral",
        remarks: "",
        followUpStatus: "First Contact",
        nextFollowUpDate: "",
        followUpRemarks: "",
        appointmentDate: "",
        appointmentTime: "",
        appointmentLocation: "",
        appointmentStatus: "Not Scheduled",
        evangelistAssigned: "",
        appointmentRemarks: "",
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to add report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 p-4">
      <Text className="text-2xl font-bold text-blue-900 mb-4">
        Add New Report
      </Text>

      <View className="space-y-4">
        {/* Fellowship */}
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1">
            Fellowship *
          </Text>
          <View className="border border-gray-300 rounded-md">
            <Picker
              selectedValue={formData.fellowship}
              onValueChange={(value) => handleChange("fellowship", value)}
            >
              <Picker.Item label="Select Your Fellowship" value="" />
              <Picker.Item label="Thevara" value="Thevara" />
              <Picker.Item label="FortKochi" value="FortKochi" />
              <Picker.Item label="Palarivattom" value="Palarivattom" />
              <Picker.Item label="Varappuzha" value="Varappuzha" />
              <Picker.Item label="Pala" value="Pala" />
              <Picker.Item label="Zion" value="Zion" />
            </Picker>
          </View>
        </View>

        {/* Type of Report */}
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1">
            Type of Report *
          </Text>
          <View className="border border-gray-300 rounded-md">
            <Picker
              selectedValue={formData.typeOfReport}
              onValueChange={(value) => handleChange("typeOfReport", value)}
            >
              <Picker.Item label="Select Type" value="" />
              <Picker.Item label="Calling" value="Calling" />
              <Picker.Item label="DTD" value="DTD" />
              <Picker.Item label="Card" value="Card" />
              <Picker.Item label="Survey" value="Survey" />
              <Picker.Item label="Personal" value="Personal" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>
        </View>

        {/* Date */}
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1">Date *</Text>
          <TouchableOpacity
            className="border border-gray-300 rounded-md p-2"
            onPress={() => setShowDatePicker(true)}
          >
            <Text className="text-gray-700">{formData.date}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={new Date(formData.date)}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  handleChange(
                    "date",
                    selectedDate.toISOString().split("T")[0]
                  );
                }
              }}
            />
          )}
        </View>

        {/* Hearer Name */}
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1">
            Hearer Name *
          </Text>
          <TextInput
            className="border border-gray-300 rounded-md p-2"
            value={formData.hearerName}
            onChangeText={(value) => handleChange("hearerName", value)}
          />
        </View>

        {/* Number of Hearers */}
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1">
            Number of Hearers *
          </Text>
          <TextInput
            className="border border-gray-300 rounded-md p-2"
            keyboardType="numeric"
            value={formData.noOfHearers.toString()}
            onChangeText={(value) =>
              handleChange("noOfHearers", parseInt(value) || 1)
            }
          />
        </View>

        {/* Location */}
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1">
            Location *
          </Text>
          <TextInput
            className="border border-gray-300 rounded-md p-2"
            value={formData.location}
            onChangeText={(value) => handleChange("location", value)}
          />
        </View>

        {/* Mobile Number */}
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1">
            Mobile Number *
          </Text>
          <TextInput
            className="border border-gray-300 rounded-md p-2"
            keyboardType="phone-pad"
            value={formData.mobileNumber}
            onChangeText={(value) => handleChange("mobileNumber", value)}
          />
        </View>

        {/* Status */}
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1">
            Status *
          </Text>
          <View className="border border-gray-300 rounded-md">
            <Picker
              selectedValue={formData.status}
              onValueChange={(value) => handleChange("status", value)}
            >
              <Picker.Item label="Neutral" value="Neutral" />
              <Picker.Item label="Positive" value="Positive" />
              <Picker.Item label="Negative" value="Negative" />
            </Picker>
          </View>
        </View>

        {/* Remarks */}
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1">
            Remarks
          </Text>
          <TextInput
            className="border border-gray-300 rounded-md p-2"
            multiline
            numberOfLines={3}
            value={formData.remarks}
            onChangeText={(value) => handleChange("remarks", value)}
          />
        </View>

        {/* Follow Up Status */}
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1">
            Follow Up Status
          </Text>
          <View className="border border-gray-300 rounded-md">
            <Picker
              selectedValue={formData.followUpStatus}
              onValueChange={(value) => handleChange("followUpStatus", value)}
            >
              <Picker.Item label="First Contact" value="First Contact" />
              <Picker.Item label="Second Contact" value="Second Contact" />
              <Picker.Item label="Third Contact" value="Third Contact" />
              <Picker.Item label="Ready" value="Ready" />
              <Picker.Item label="Attended" value="Attended" />
            </Picker>
          </View>
        </View>

        {/* Next Follow Up Date */}
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1">
            Next Follow Up Date
          </Text>
          <TouchableOpacity
            className="border border-gray-300 rounded-md p-2"
            onPress={() => setShowNextFollowUpDatePicker(true)}
          >
            <Text className="text-gray-700">
              {formData.nextFollowUpDate || "Select Date"}
            </Text>
          </TouchableOpacity>
          {showNextFollowUpDatePicker && (
            <DateTimePicker
              value={
                formData.nextFollowUpDate
                  ? new Date(formData.nextFollowUpDate)
                  : new Date()
              }
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowNextFollowUpDatePicker(false);
                if (selectedDate) {
                  handleChange(
                    "nextFollowUpDate",
                    selectedDate.toISOString().split("T")[0]
                  );
                }
              }}
            />
          )}
        </View>

        {/* Follow Up Remarks */}
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1">
            Follow Up Remarks
          </Text>
          <TextInput
            className="border border-gray-300 rounded-md p-2"
            multiline
            numberOfLines={2}
            value={formData.followUpRemarks}
            onChangeText={(value) => handleChange("followUpRemarks", value)}
          />
        </View>

        {/* Appointment Date */}
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1">
            Appointment Date
          </Text>
          <TouchableOpacity
            className="border border-gray-300 rounded-md p-2"
            onPress={() => setShowAppointmentDatePicker(true)}
          >
            <Text className="text-gray-700">
              {formData.appointmentDate || "Select Date"}
            </Text>
          </TouchableOpacity>
          {showAppointmentDatePicker && (
            <DateTimePicker
              value={
                formData.appointmentDate
                  ? new Date(formData.appointmentDate)
                  : new Date()
              }
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowAppointmentDatePicker(false);
                if (selectedDate) {
                  handleChange(
                    "appointmentDate",
                    selectedDate.toISOString().split("T")[0]
                  );
                }
              }}
            />
          )}
        </View>

        {/* Appointment Time */}
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1">
            Appointment Time
          </Text>
          <TextInput
            className="border border-gray-300 rounded-md p-2"
            placeholder="HH:MM"
            value={formData.appointmentTime}
            onChangeText={(value) => handleChange("appointmentTime", value)}
          />
        </View>

        {/* Appointment Location */}
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1">
            Appointment Location
          </Text>
          <TextInput
            className="border border-gray-300 rounded-md p-2"
            value={formData.appointmentLocation}
            onChangeText={(value) => handleChange("appointmentLocation", value)}
          />
        </View>

        {/* Appointment Status */}
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1">
            Appointment Status
          </Text>
          <View className="border border-gray-300 rounded-md">
            <Picker
              selectedValue={formData.appointmentStatus}
              onValueChange={(value) =>
                handleChange("appointmentStatus", value)
              }
            >
              <Picker.Item label="Not Scheduled" value="Not Scheduled" />
              <Picker.Item label="Scheduled" value="Scheduled" />
              <Picker.Item label="Completed" value="Completed" />
              <Picker.Item label="Cancelled" value="Cancelled" />
            </Picker>
          </View>
        </View>

        {/* Evangelist Assigned */}
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1">
            Evangelist Assigned
          </Text>
          <TextInput
            className="border border-gray-300 rounded-md p-2"
            value={formData.evangelistAssigned}
            onChangeText={(value) => handleChange("evangelistAssigned", value)}
          />
        </View>

        {/* Appointment Remarks */}
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1">
            Appointment Remarks
          </Text>
          <TextInput
            className="border border-gray-300 rounded-md p-2"
            multiline
            numberOfLines={2}
            value={formData.appointmentRemarks}
            onChangeText={(value) => handleChange("appointmentRemarks", value)}
          />
        </View>

        <TouchableOpacity
          className="bg-blue-600 py-3 rounded-md mt-4"
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text className="text-white text-center font-semibold">
            {loading ? "Adding Report..." : "Add Report"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
