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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router } from "expo-router";
import { verifyOtp } from "../../api/auth.api";
import { storeAuthData } from "../../utils/auth";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const logo = require("../../assets/images/evapod_logo.png");

export default function VerifyOtpScreen() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert("Error", "Please enter the OTP");
      return;
    }

    if (otp.length !== 6) {
      Alert.alert("Error", "OTP must be 6 digits");
      return;
    }

    const email = await AsyncStorage.getItem("email");
    if (!email) {
      Alert.alert("Error", "Email not found. Please login again.");
      router.replace("./login");
      return;
    }

    setIsLoading(true);
    try {
      const response = await verifyOtp({ email, otp });
      // Store authentication data
      await storeAuthData(
        {
          csrfToken: response.sessionInfo.csrfToken,
          sessionId: response.sessionInfo.sessionId,
        },
        response.user
      );
      await AsyncStorage.removeItem("email");
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
            className="mx-auto h-12 mb-4"
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
            {/* OTP Input */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">
                OTP Code
              </Text>
              <TextInput
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 text-center text-2xl font-mono tracking-widest"
                placeholder="000000"
                value={otp}
                onChangeText={(value) =>
                  setOtp(value.replace(/[^0-9]/g, "").slice(0, 6))
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
              <Link href="./login" className="text-blue-600 font-semibold">
                Back to Login
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
