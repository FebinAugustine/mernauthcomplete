import React from "react";
import { View, Text } from "react-native";

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
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-xl">Reports Screen</Text>
    </View>
  );
}
