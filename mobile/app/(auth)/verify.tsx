import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Link, router } from "expo-router";
import { verify, VerifyData } from "../../api/auth.api";

export default function VerifyScreen() {
  const [formData, setFormData] = useState<VerifyData>({
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof VerifyData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleVerify = async () => {
    if (!formData.email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const response = await verify(formData);
      Alert.alert(
        "Success",
        "Verification email sent! Please check your email for the OTP."
      );
      router.push("./verify-otp");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to send verification email. Please try again.";
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-6 py-12">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-900 text-center mb-2">
              Verify Your Email
            </Text>
            <Text className="text-gray-600 text-center">
              Enter your email address to receive a verification code
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            {/* Email Input */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Email Address
              </Text>
              <TextInput
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900"
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={(value) => handleInputChange("email", value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            className={`w-full py-3 rounded-lg mt-6 ${
              isLoading ? "bg-gray-400" : "bg-blue-600"
            }`}
            onPress={handleVerify}
            disabled={isLoading}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {isLoading ? "Sending..." : "Send Verification Code"}
            </Text>
          </TouchableOpacity>

          {/* Back to Login Link */}
          <View className="mt-6">
            <Text className="text-gray-600 text-center">
              Remember your password?{" "}
              <Link href="./login" className="text-blue-600 font-semibold">
                Sign In
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
