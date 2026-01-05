import React from "react";
import { View, Text } from "react-native";

interface AddReportProps {
  user: any;
  setActiveTab: (tab: string) => void;
}

export default function AddReport({ user, setActiveTab }: AddReportProps) {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-xl">Add Report Screen</Text>
    </View>
  );
}
