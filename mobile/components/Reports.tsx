import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  Share,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { updateReportById } from "../api/report.api";

interface ReportsProps {
  reports: any[];
  user: any;
  refreshReports: () => void;
  setActiveTab: (tab: string) => void;
}

export default function Reports({
  reports,
  user,
  refreshReports,
  setActiveTab,
}: ReportsProps) {
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedReport, setEditedReport] = useState<any>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentDateField, setCurrentDateField] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  const openModal = (report: any) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedReport(null);
    setIsModalOpen(false);
    setIsEditing(false);
  };

  const openEditModal = (report: any) => {
    setSelectedReport(report);
    setEditedReport({
      ...report,
      date: new Date(report.date),
      nextFollowUpDate: report.nextFollowUpDate
        ? new Date(report.nextFollowUpDate)
        : undefined,
      appointmentDate: report.appointmentDate
        ? new Date(report.appointmentDate)
        : undefined,
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const shareReport = async (report: any, fullDetails: boolean = false) => {
    let message = "";
    if (fullDetails) {
      message = `Full Report Details:\n\nFellowship: ${report.fellowship}\nType: ${report.typeOfReport}\nDate: ${new Date(report.date).toLocaleDateString()}\nHearer: ${report.hearerName}\nHearers: ${report.noOfHearers}\nLocation: ${report.location}\nMobile: ${report.mobileNumber}\nStatus: ${report.status}\nRemarks: ${report.remarks || "N/A"}\nFollow Up: ${report.followUpStatus}\nNext Follow Up: ${report.nextFollowUpDate ? new Date(report.nextFollowUpDate).toLocaleDateString() : "N/A"}\nFollow Up Remarks: ${report.followUpRemarks || "N/A"}\nAppointment Date: ${report.appointmentDate ? new Date(report.appointmentDate).toLocaleDateString() : "N/A"}\nAppointment Time: ${report.appointmentTime || "N/A"}\nAppointment Location: ${report.appointmentLocation || "N/A"}\nAppointment Status: ${report.appointmentStatus}\nEvangelist Assigned: ${report.evangelistAssigned || "N/A"}\nAppointment Remarks: ${report.appointmentRemarks || "N/A"}\nSubmitted by: ${user.name}`;
    } else {
      message = `Report Details:\n\nType: ${report.typeOfReport}\nDate: ${new Date(report.date).toLocaleDateString()}\nHearer: ${report.hearerName}\nStatus: ${report.status}\nPhone: ${report.mobileNumber}\nSubmitted by: ${user.name}`;
    }
    try {
      await Share.share({ message });
    } catch (error) {
      Alert.alert("Error", "Unable to share");
    }
  };

  const saveEditedReport = async () => {
    try {
      await updateReportById(selectedReport._id, editedReport);
      refreshReports();
      closeModal();
      Alert.alert("Success", "Report updated successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update report";
      Alert.alert("Error", errorMessage);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setEditedReport({ ...editedReport, [currentDateField]: selectedDate });
    }
  };

  const openDatePicker = (field: string) => {
    setCurrentDateField(field);
    setShowDatePicker(true);
  };

  const filteredReports = reports.filter((report) => {
    const term = searchTerm.toLowerCase();
    return (
      report.typeOfReport?.toLowerCase().includes(term) ||
      report.hearerName?.toLowerCase().includes(term) ||
      report.mobileNumber?.toString().includes(term)
    );
  });

  const sortedReports = [...filteredReports].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    if (sortOrder === "asc") {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });

  return (
    <ScrollView className="flex-1 p-4">
      <Text className="text-2xl font-bold text-blue-900 mb-4">
        Reports Submitted By: {user?.name}
      </Text>

      {/* Search */}
      <View className="mb-4">
        <TextInput
          className="border border-gray-300 rounded-md px-3 py-2"
          placeholder="Search by type, name, or mobile"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      {/* Sort */}
      <View className="mb-4 flex-row items-center">
        <Text className="mr-2">Sort by Date:</Text>
        <TouchableOpacity
          onPress={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="bg-blue-500 px-3 py-1 rounded"
        >
          <Text className="text-white">
            {sortOrder === "asc" ? "Newest First" : "Oldest First"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Reports List */}
      {sortedReports.length > 0 ? (
        sortedReports.map((report) => (
          <View
            key={report._id}
            className="bg-white rounded-lg p-4 mb-2 shadow"
          >
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-lg font-medium">
                  {report.typeOfReport} Report
                </Text>
                <Text>Status: {report.status}</Text>
                <Text>Hearer: {report.hearerName}</Text>
                <Text>Date: {new Date(report.date).toLocaleDateString()}</Text>
              </View>
              <View className="flex-row">
                <TouchableOpacity
                  onPress={() => openModal(report)}
                  className="bg-blue-500 px-3 py-1 rounded mr-2"
                >
                  <Ionicons name="eye" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => shareReport(report)}
                  className="bg-green-500 px-3 py-1 rounded mr-2"
                >
                  <Ionicons name="share" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => openEditModal(report)}
                  className="bg-orange-500 px-3 py-1 rounded"
                >
                  <Ionicons name="pencil" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))
      ) : (
        <Text className="text-center text-gray-500">No reports found.</Text>
      )}

      {/* Modal */}
      <Modal
        visible={isModalOpen}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <ScrollView className="flex-1 p-4">
          <TouchableOpacity onPress={closeModal} className="self-end mb-4">
            <Text className="text-2xl">×</Text>
          </TouchableOpacity>
          {selectedReport && (
            <View>
              <Text className="text-2xl font-bold mb-4">
                {isEditing ? "Edit Report" : "Full Report Details"}
              </Text>
              <ScrollView className="flex-1 pb-2">
                {isEditing ? (
                  <View className="space-y-4">
                    {/* Basic Information */}
                    <View>
                      <Text className="text-lg font-bold mb-2">
                        Basic Information:
                      </Text>
                      <View className="flex-col flex-wrap">
                        <View className="w-full p-1">
                          <Text className="text-sm font-medium">
                            Fellowship
                          </Text>
                          <View className="border border-gray-300 rounded">
                            <Picker
                              selectedValue={editedReport.fellowship}
                              onValueChange={(value) =>
                                setEditedReport({
                                  ...editedReport,
                                  fellowship: value,
                                })
                              }
                            >
                              <Picker.Item label="Thevara" value="Thevara" />
                              <Picker.Item
                                label="FortKochi"
                                value="FortKochi"
                              />
                              <Picker.Item
                                label="Palarivattom"
                                value="Palarivattom"
                              />
                              <Picker.Item
                                label="Varappuzha"
                                value="Varappuzha"
                              />
                              <Picker.Item label="Pala" value="Pala" />
                              <Picker.Item label="Zion" value="Zion" />
                            </Picker>
                          </View>
                        </View>
                        <View className="w-full p-1">
                          <Text className="text-sm font-medium">
                            Type of Report
                          </Text>
                          <View className="border border-gray-300 rounded">
                            <Picker
                              selectedValue={editedReport.typeOfReport}
                              onValueChange={(value) =>
                                setEditedReport({
                                  ...editedReport,
                                  typeOfReport: value,
                                })
                              }
                            >
                              <Picker.Item label="Calling" value="Calling" />
                              <Picker.Item label="DTD" value="DTD" />
                              <Picker.Item label="Card" value="Card" />
                              <Picker.Item label="Survey" value="Survey" />
                              <Picker.Item label="Personal" value="Personal" />
                              <Picker.Item label="Other" value="Other" />
                            </Picker>
                          </View>
                        </View>
                        <View className="w-full p-1">
                          <Text className="text-sm font-medium">Date</Text>
                          <TouchableOpacity
                            onPress={() => openDatePicker("date")}
                            className="border border-gray-300 rounded px-2 py-3"
                          >
                            <Text>
                              {editedReport.date
                                ? new Date(
                                    editedReport.date
                                  ).toLocaleDateString()
                                : "Select Date"}
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <View className="w-full p-1">
                          <Text className="text-sm font-medium">
                            Hearer Name
                          </Text>
                          <TextInput
                            className="border border-gray-300 rounded px-2 py-3"
                            value={editedReport.hearerName}
                            onChangeText={(text) =>
                              setEditedReport({
                                ...editedReport,
                                hearerName: text,
                              })
                            }
                          />
                        </View>
                        <View className="w-full p-1">
                          <Text className="text-sm font-medium">
                            Number of Hearers
                          </Text>
                          <TextInput
                            className="border border-gray-300 rounded px-2 py-3"
                            value={editedReport.noOfHearers?.toString()}
                            onChangeText={(text) =>
                              setEditedReport({
                                ...editedReport,
                                noOfHearers: parseInt(text) || 1,
                              })
                            }
                            keyboardType="numeric"
                          />
                        </View>
                        <View className="w-full p-1">
                          <Text className="text-sm font-medium">Location</Text>
                          <TextInput
                            className="border border-gray-300 rounded px-2 py-3"
                            value={editedReport.location}
                            onChangeText={(text) =>
                              setEditedReport({
                                ...editedReport,
                                location: text,
                              })
                            }
                          />
                        </View>
                        <View className="w-full p-1">
                          <Text className="text-sm font-medium">
                            Mobile Number
                          </Text>
                          <TextInput
                            className="border border-gray-300 rounded px-2 py-3"
                            value={editedReport.mobileNumber?.toString()}
                            onChangeText={(text) =>
                              setEditedReport({
                                ...editedReport,
                                mobileNumber: parseInt(text),
                              })
                            }
                            keyboardType="numeric"
                          />
                        </View>
                        <View className="w-full p-1">
                          <Text className="text-sm font-medium">Status</Text>
                          <View className="border border-gray-300 rounded">
                            <Picker
                              selectedValue={editedReport.status}
                              onValueChange={(value) =>
                                setEditedReport({
                                  ...editedReport,
                                  status: value,
                                })
                              }
                            >
                              <Picker.Item label="Neutral" value="Neutral" />
                              <Picker.Item label="Positive" value="Positive" />
                              <Picker.Item label="Negative" value="Negative" />
                            </Picker>
                          </View>
                        </View>
                        <View className="w-full p-1">
                          <Text className="text-sm font-medium">Remarks</Text>
                          <TextInput
                            className="border border-gray-300 rounded px-2 py-1"
                            value={editedReport.remarks}
                            onChangeText={(text) =>
                              setEditedReport({
                                ...editedReport,
                                remarks: text,
                              })
                            }
                            multiline
                            numberOfLines={3}
                          />
                        </View>
                      </View>
                    </View>

                    {/* Follow Up Information */}
                    <View>
                      <Text className="text-lg font-bold mb-2">
                        Follow Up Information
                      </Text>
                      <View className="flex-col flex-wrap">
                        <View className="w-full p-1">
                          <Text className="text-sm font-medium">
                            Follow Up Status
                          </Text>
                          <View className="border border-gray-300 rounded">
                            <Picker
                              selectedValue={editedReport.followUpStatus}
                              onValueChange={(value) =>
                                setEditedReport({
                                  ...editedReport,
                                  followUpStatus: value,
                                })
                              }
                            >
                              <Picker.Item
                                label="First Contact"
                                value="First Contact"
                              />
                              <Picker.Item
                                label="Second Contact"
                                value="Second Contact"
                              />
                              <Picker.Item
                                label="Third Contact"
                                value="Third Contact"
                              />
                              <Picker.Item label="Ready" value="Ready" />
                              <Picker.Item label="Attended" value="Attended" />
                            </Picker>
                          </View>
                        </View>
                        <View className="w-full p-1">
                          <Text className="text-sm font-medium">
                            Next Follow Up Date
                          </Text>
                          <TouchableOpacity
                            onPress={() => openDatePicker("nextFollowUpDate")}
                            className="border border-gray-300 rounded px-2 py-3"
                          >
                            <Text>
                              {editedReport.nextFollowUpDate
                                ? new Date(
                                    editedReport.nextFollowUpDate
                                  ).toLocaleDateString()
                                : "Select Date"}
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <View className="w-full p-1">
                          <Text className="text-sm font-medium">
                            Follow Up Remarks
                          </Text>
                          <TextInput
                            className="border border-gray-300 rounded px-2 py-3"
                            value={editedReport.followUpRemarks}
                            onChangeText={(text) =>
                              setEditedReport({
                                ...editedReport,
                                followUpRemarks: text,
                              })
                            }
                            multiline
                            numberOfLines={3}
                          />
                        </View>
                      </View>
                    </View>

                    {/* Appointment Information */}
                    <View>
                      <Text className="text-lg font-bold mb-2">
                        Appointment Information
                      </Text>
                      <View className="flex-col flex-wrap">
                        <View className="w-full p-1">
                          <Text className="text-sm font-medium">
                            Appointment Date
                          </Text>
                          <TouchableOpacity
                            onPress={() => openDatePicker("appointmentDate")}
                            className="border border-gray-300 rounded px-2 py-3"
                          >
                            <Text>
                              {editedReport.appointmentDate
                                ? new Date(
                                    editedReport.appointmentDate
                                  ).toLocaleDateString()
                                : "Select Date"}
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <View className="w-full p-1">
                          <Text className="text-sm font-medium">
                            Appointment Time
                          </Text>
                          <TextInput
                            className="border border-gray-300 rounded px-2 py-3"
                            value={editedReport.appointmentTime}
                            onChangeText={(text) =>
                              setEditedReport({
                                ...editedReport,
                                appointmentTime: text,
                              })
                            }
                          />
                        </View>
                        <View className="w-full p-1">
                          <Text className="text-sm font-medium">
                            Appointment Location
                          </Text>
                          <TextInput
                            className="border border-gray-300 rounded px-2 py-3"
                            value={editedReport.appointmentLocation}
                            onChangeText={(text) =>
                              setEditedReport({
                                ...editedReport,
                                appointmentLocation: text,
                              })
                            }
                          />
                        </View>
                        <View className="w-full p-1">
                          <Text className="text-sm font-medium">
                            Appointment Status
                          </Text>
                          <View className="border border-gray-300 rounded">
                            <Picker
                              selectedValue={editedReport.appointmentStatus}
                              onValueChange={(value) =>
                                setEditedReport({
                                  ...editedReport,
                                  appointmentStatus: value,
                                })
                              }
                            >
                              <Picker.Item
                                label="Not Scheduled"
                                value="Not Scheduled"
                              />
                              <Picker.Item
                                label="Scheduled"
                                value="Scheduled"
                              />
                              <Picker.Item
                                label="Completed"
                                value="Completed"
                              />
                              <Picker.Item
                                label="Cancelled"
                                value="Cancelled"
                              />
                            </Picker>
                          </View>
                        </View>
                        <View className="w-full p-1">
                          <Text className="text-sm font-medium">
                            Evangelist Assigned
                          </Text>
                          <TextInput
                            className="border border-gray-300 rounded px-2 py-3"
                            value={editedReport.evangelistAssigned}
                            onChangeText={(text) =>
                              setEditedReport({
                                ...editedReport,
                                evangelistAssigned: text,
                              })
                            }
                          />
                        </View>
                        <View className="w-full p-1">
                          <Text className="text-sm font-medium">
                            Appointment Remarks
                          </Text>
                          <TextInput
                            className="border border-gray-300 rounded px-2 py-3"
                            value={editedReport.appointmentRemarks}
                            onChangeText={(text) =>
                              setEditedReport({
                                ...editedReport,
                                appointmentRemarks: text,
                              })
                            }
                            multiline
                            numberOfLines={3}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                ) : (
                  <View className="space-y-2">
                    <Text>Fellowship: {selectedReport.fellowship}</Text>
                    <Text>Type: {selectedReport.typeOfReport}</Text>
                    <Text>
                      Date: {new Date(selectedReport.date).toLocaleDateString()}
                    </Text>
                    <Text>Hearer: {selectedReport.hearerName}</Text>
                    <Text>Hearers: {selectedReport.noOfHearers}</Text>
                    <Text>Location: {selectedReport.location}</Text>
                    <Text>Mobile: {selectedReport.mobileNumber}</Text>
                    <Text>Status: {selectedReport.status}</Text>
                    <Text>Remarks: {selectedReport.remarks || "N/A"}</Text>
                    <Text>Follow Up: {selectedReport.followUpStatus}</Text>
                    <Text>
                      Next Follow Up:{" "}
                      {selectedReport.nextFollowUpDate
                        ? new Date(
                            selectedReport.nextFollowUpDate
                          ).toLocaleDateString()
                        : "N/A"}
                    </Text>
                    <Text>
                      Follow Up Remarks:{" "}
                      {selectedReport.followUpRemarks || "N/A"}
                    </Text>
                    <Text>
                      Appointment Date:{" "}
                      {selectedReport.appointmentDate
                        ? new Date(
                            selectedReport.appointmentDate
                          ).toLocaleDateString()
                        : "N/A"}
                    </Text>
                    <Text>
                      Appointment Time:{" "}
                      {selectedReport.appointmentTime || "N/A"}
                    </Text>
                    <Text>
                      Appointment Location:{" "}
                      {selectedReport.appointmentLocation || "N/A"}
                    </Text>
                    <Text>
                      Appointment Status: {selectedReport.appointmentStatus}
                    </Text>
                    <Text>
                      Evangelist Assigned:{" "}
                      {selectedReport.evangelistAssigned || "N/A"}
                    </Text>
                    <Text>
                      Appointment Remarks:{" "}
                      {selectedReport.appointmentRemarks || "N/A"}
                    </Text>
                  </View>
                )}
              </ScrollView>
              {isEditing ? (
                <View className="flex-row justify-around mt-4 pb-2 mb-8">
                  <TouchableOpacity
                    onPress={saveEditedReport}
                    className="bg-blue-500 px-4 py-2 rounded"
                  >
                    <Text className="text-white">Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={closeModal}
                    className="bg-gray-500 px-4 py-2 rounded"
                  >
                    <Text className="text-white">Cancel</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => shareReport(selectedReport, true)}
                  className="bg-green-500 px-4 py-2 rounded mt-4 self-center"
                >
                  <Text className="text-white">Share Full Report</Text>
                </TouchableOpacity>
              )}
              {showDatePicker && (
                <DateTimePicker
                  value={editedReport[currentDateField] || new Date()}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
            </View>
          )}
        </ScrollView>
      </Modal>
    </ScrollView>
  );
}
