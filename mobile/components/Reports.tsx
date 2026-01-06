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
import { Ionicons } from "@expo/vector-icons";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  const openModal = (report: any) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedReport(null);
    setIsModalOpen(false);
  };

  const shareReport = async (report: any) => {
    const message = `Report Details:\n\nType: ${report.typeOfReport}\nDate: ${new Date(report.date).toLocaleDateString()}\nHearer: ${report.hearerName}\nStatus: ${report.status}\nLocation: ${report.location}`;
    try {
      await Share.share({ message });
    } catch (error) {
      Alert.alert("Error", "Unable to share");
    }
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
                  className="bg-green-500 px-3 py-1 rounded"
                >
                  <Ionicons name="share" size={20} color="white" />
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
                Full Report Details
              </Text>
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
              </View>
              <TouchableOpacity
                onPress={() => shareReport(selectedReport)}
                className="bg-green-500 px-4 py-2 rounded mt-4 self-center"
              >
                <Text className="text-white">Share Full Report</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </Modal>
    </ScrollView>
  );
}
