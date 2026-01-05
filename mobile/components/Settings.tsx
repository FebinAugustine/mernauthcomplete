import React from "react";
import { View, Text } from "react-native";

interface SettingsProps {
  setActiveTab: (tab: string) => void;
}

export default function Settings({ setActiveTab }: SettingsProps) {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-xl">Settings Screen</Text>
    </View>
  );
}
