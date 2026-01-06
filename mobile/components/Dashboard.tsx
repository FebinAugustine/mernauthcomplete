import React from "react";
import { View, Text, ScrollView, Share, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DashboardProps {
  user: any;
  reports: any[];
  setActiveTab: (tab: string) => void;
}

export default function Dashboard({
  user,
  reports,
  setActiveTab,
}: DashboardProps) {
  const positiveCount = reports.filter((r) => r.status === "Positive").length;
  const negativeCount = reports.filter((r) => r.status === "Negative").length;
  const neutralCount = reports.filter((r) => r.status === "Neutral").length;
  const firstContactCount = reports.filter(
    (r) => r.followUpStatus === "First Contact"
  ).length;
  const secondContactCount = reports.filter(
    (r) => r.followUpStatus === "Second Contact"
  ).length;
  const thirdContactCount = reports.filter(
    (r) => r.followUpStatus === "Third Contact"
  ).length;
  const readyCount = reports.filter((r) => r.followUpStatus === "Ready").length;
  const attendedCount = reports.filter(
    (r) => r.followUpStatus === "Attended"
  ).length;

  const shareReportSummary = async () => {
    const message = `Report Summary by ${user?.name}:\nTotal Reports: ${reports.length}\nPositive: ${positiveCount}\nNegative: ${negativeCount}\nNeutral: ${neutralCount}`;
    try {
      await Share.share({ message });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const shareFollowUpSummary = async () => {
    const message = `Follow-Up Status Summary by ${user?.name}:\n1st Contact: ${firstContactCount}\n2nd Contact: ${secondContactCount}\n3rd Contact: ${thirdContactCount}\nReady: ${readyCount}\nAttended: ${attendedCount}`;
    try {
      await Share.share({ message });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <ScrollView className="flex-1 p-4">
      <Text className="text-2xl font-bold text-blue-900 mb-4">
        Welcome Back, {user?.name}!
      </Text>

      <View className="bg-white rounded-lg p-4 mb-4">
        <View className="flex-col justify-between mb-4">
          <View className="flex-1 bg-blue-50 p-3 rounded-lg mb-2">
            <Text className="text-lg font-medium text-blue-900">Role</Text>
            <Text className="text-blue-600">{user?.role}</Text>
          </View>
          <View className="flex-1 bg-green-50 p-3 rounded-lg mr-2">
            <Text className="text-lg font-medium text-green-900">Email</Text>
            <Text className="text-green-600">{user?.email}</Text>
          </View>
          <View className="flex-1 bg-purple-50 p-3 rounded-lg">
            <Text className="text-lg font-medium text-purple-900">Reports</Text>
            <Text className="text-purple-600">{reports.length}</Text>
          </View>
        </View>
      </View>

      <View className="bg-white rounded-lg p-4 mb-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-semibold">Report Summary</Text>
          <TouchableOpacity onPress={shareReportSummary}>
            <Ionicons name="share-outline" size={24} color="#1e40af" />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-between">
          <View className="flex-1 bg-green-50 p-3 rounded-lg mr-2 items-center">
            <Text className="text-2xl mb-1">👍</Text>
            <Text className="text-lg font-medium text-green-900">Positive</Text>
            <Text className="text-green-600 text-xl font-bold">
              {positiveCount}
            </Text>
          </View>
          <View className="flex-1 bg-red-50 p-3 rounded-lg mr-2 items-center">
            <Text className="text-2xl mb-1">👎</Text>
            <Text className="text-lg font-medium text-red-900">Negative</Text>
            <Text className="text-red-600 text-xl font-bold">
              {negativeCount}
            </Text>
          </View>
          <View className="flex-1 bg-gray-50 p-3 rounded-lg items-center">
            <Text className="text-2xl mb-1">😐</Text>
            <Text className="text-lg font-medium text-gray-900">Neutral</Text>
            <Text className="text-gray-600 text-xl font-bold">
              {neutralCount}
            </Text>
          </View>
        </View>
      </View>

      <View className="bg-white rounded-lg p-4 mb-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-semibold">
            Follow-Up Status Summary
          </Text>
          <TouchableOpacity onPress={shareFollowUpSummary}>
            <Ionicons name="share-outline" size={24} color="#1e40af" />
          </TouchableOpacity>
        </View>
        <View className="flex-row flex-wrap justify-between">
          <View className="w-1/2 p-2">
            <View className="bg-blue-50 p-3 rounded-lg items-center">
              <Text className="text-2xl mb-1">1️⃣</Text>
              <Text className="text-lg font-medium text-blue-900">1st</Text>
              <Text className="text-blue-600 text-xl font-bold">
                {firstContactCount}
              </Text>
            </View>
          </View>
          <View className="w-1/2 p-2">
            <View className="bg-green-50 p-3 rounded-lg items-center">
              <Text className="text-2xl mb-1">2️⃣</Text>
              <Text className="text-lg font-medium text-green-900">2nd</Text>
              <Text className="text-green-600 text-xl font-bold">
                {secondContactCount}
              </Text>
            </View>
          </View>
          <View className="w-1/2 p-2">
            <View className="bg-yellow-50 p-3 rounded-lg items-center">
              <Text className="text-2xl mb-1">3️⃣</Text>
              <Text className="text-lg font-medium text-yellow-900">3rd</Text>
              <Text className="text-yellow-600 text-xl font-bold">
                {thirdContactCount}
              </Text>
            </View>
          </View>
          <View className="w-1/2 p-2">
            <View className="bg-purple-50 p-3 rounded-lg items-center">
              <Text className="text-2xl mb-1">✅</Text>
              <Text className="text-lg font-medium text-purple-900">Ready</Text>
              <Text className="text-purple-600 text-xl font-bold">
                {readyCount}
              </Text>
            </View>
          </View>
          <View className="w-full p-2">
            <View className="bg-red-50 p-3 rounded-lg items-center">
              <Text className="text-2xl mb-1">🎉</Text>
              <Text className="text-lg font-medium text-red-900">Attended</Text>
              <Text className="text-red-600 text-xl font-bold">
                {attendedCount}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
