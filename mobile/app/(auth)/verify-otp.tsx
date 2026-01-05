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
  Image,
} from "react-native";
import { Link, router } from "expo-router";
import { verifyOtp, VerifyOtpData } from "../../api/auth.api";
import { storeAuthData } from "../../utils/auth";
import logo from "../../assets/images/evapod_logo.png";

export default function VerifyOtpScreen() {
  const [formData, setFormData] = useState<VerifyOtpData>({
    email: "",
    otp: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof VerifyOtpData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleVerifyOtp = async () => {
    if (!formData.email || !formData.otp) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (formData.otp.length !== 6) {
      Alert.alert("Error", "OTP must be 6 digits");
      return;
    }

    setIsLoading(true);
    try {
      const response = await verifyOtp(formData);
      // Store authentication data
      await storeAuthData(
        {
          csrfToken: response.sessionInfo.csrfToken,
          sessionId: response.sessionInfo.sessionId,
        },
        response.user
      );
      Alert.alert("Success", `Welcome ${response.user.name}!`);
      router.replace("/");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "OTP verification failed. Please try again.";
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingBottom: 20,
        }}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
      >
        <View className="flex-1 justify-center px-6 py-12">
          {/* Logo */}
          <Image
            source={logo}
            className="mx-auto h-12 w-auto mb-4"
            resizeMode="contain"
          />
          <Text className="text-blue-700 text-lg font-bold text-center mb-2">
            THE EVAPOD APP
          </Text>
          <Text className="text-center text-xs mb-4 text-gray-500">
            Verify your Account.
          </Text>

          {/* Header */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-900 text-center mb-2">
              Verify OTP
            </Text>
            <Text className="text-gray-600 text-center">
              Enter the 6-digit code sent to your email
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

            {/* OTP Input */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">
                OTP Code
              </Text>
              <TextInput
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 text-center text-2xl font-mono tracking-widest"
                placeholder="000000"
                value={formData.otp}
                onChangeText={(value) =>
                  handleInputChange(
                    "otp",
                    value.replace(/[^0-9]/g, "").slice(0, 6)
                  )
                }
                keyboardType="numeric"
                maxLength={6}
                autoComplete="one-time-code"
              />
            </View>
          </View>

          {/* Verify OTP Button */}
          <TouchableOpacity
            className={`w-full py-3 rounded-lg mt-6 ${
              isLoading ? "bg-gray-400" : "bg-blue-600"
            }`}
            onPress={handleVerifyOtp}
            disabled={isLoading}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Text>
          </TouchableOpacity>

          {/* Resend OTP Link */}
          <View className="mt-6">
            <Text className="text-gray-600 text-center">
              Didn&apos;t receive the code?{" "}
              <TouchableOpacity
                onPress={() =>
                  Alert.alert(
                    "Info",
                    "Resend functionality would be implemented here"
                  )
                }
              >
                <Text className="text-blue-600 font-semibold">Resend OTP</Text>
              </TouchableOpacity>
            </Text>
          </View>

          {/* Back to Login Link */}
          <View className="mt-4">
            <Text className="text-gray-600 text-center">
              Wrong email?{" "}
              <Link href="./login" className="text-blue-600 font-semibold">
                Go Back
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
