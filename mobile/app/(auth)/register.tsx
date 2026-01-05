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
import { register, RegisterData } from "../../api/auth.api";
const logo = require("../../assets/images/evapod_logo.png");

export default function RegisterScreen() {
  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    phone: "",
    fellowship: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof RegisterData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !confirmPassword ||
      !formData.phone ||
      !formData.fellowship
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (formData.password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    try {
      const response = await register(formData);
      Alert.alert(
        "Success",
        "Registration successful! Please check your email for verification link."
      );
      router.replace("./login");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
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
            Setup your Account to Get Started.
          </Text>

          {/* Header */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-900 text-center mb-2">
              Create Account
            </Text>
            <Text className="text-gray-600 text-center">
              Join us and start your journey
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            {/* Name Input */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Full Name
              </Text>
              <TextInput
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900"
                placeholder="Enter your full name"
                value={formData.name}
                onChangeText={(value) => handleInputChange("name", value)}
                autoCapitalize="words"
                autoComplete="name"
              />
            </View>

            {/* Email Input */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Email
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

            {/* Password Input */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Password
              </Text>
              <TextInput
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900"
                placeholder="Enter your password"
                value={formData.password}
                onChangeText={(value) => handleInputChange("password", value)}
                secureTextEntry
                autoComplete="password-new"
              />
            </View>

            {/* Phone Input */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </Text>
              <TextInput
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChangeText={(value) => handleInputChange("phone", value)}
                keyboardType="phone-pad"
                autoComplete="tel"
              />
            </View>

            {/* Fellowship Input */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Fellowship
              </Text>
              <TextInput
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900"
                placeholder="Enter your fellowship"
                value={formData.fellowship}
                onChangeText={(value) => handleInputChange("fellowship", value)}
                autoComplete="off"
              />
            </View>

            {/* Confirm Password Input */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </Text>
              <TextInput
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoComplete="password-new"
              />
            </View>
          </View>

          {/* Register Button */}
          <TouchableOpacity
            className={`w-full py-3 rounded-lg mt-6 ${isLoading ? "bg-gray-400" : "bg-blue-600"}`}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {isLoading ? "Creating Account..." : "Create Account"}
            </Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View className="mt-6">
            <Text className="text-gray-600 text-center">
              Already have an account?{" "}
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
