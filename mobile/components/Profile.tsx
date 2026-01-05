import React from "react";
import { View, Text } from "react-native";

interface ProfileProps {
  refreshProfile: () => void;
  setActiveTab: (tab: string) => void;
}

export default function Profile({
  refreshProfile,
  setActiveTab,
}: ProfileProps) {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-xl">Profile Screen</Text>
    </View>
  );
}
