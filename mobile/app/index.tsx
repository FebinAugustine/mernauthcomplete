import "../global.css";
import React from "react";
import {
  Text,
  View,
  ActivityIndicator,
  Image,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

export default function App() {
  const { user, isLoading, isAuth } = useAuth();
  const [isRedirecting, setIsRedirecting] = React.useState(false);

  React.useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);


  React.useEffect(() => {
    if (!isLoading && !isRedirecting) {
      setIsRedirecting(true);
      if (isAuth) {
        // User is authenticated, redirect based on role
        if (user?.role === "user") {
          router.replace("/home");
        } else {
          router.replace("/admin");
        }
      } else {
        // User not authenticated, redirect to login
        router.replace("/login");
      }
      // Hide splash after routing
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 2000);
    }
  }, [isLoading, isAuth, user, isRedirecting]);

  if (isLoading || isRedirecting) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Image
          source={require("../assets/images/evapod_logo.png")}
          style={{ width: 200, height: 200, resizeMode: "contain" }}
        />
        <ActivityIndicator
          size="large"
          color="#3b82f6"
          style={{ marginTop: 20 }}
        />
      </View>
    );
  }

  if (!isAuth) {
    return null; // Will redirect
  }

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Image
        source={require("../assets/images/evapod_logo.png")}
        style={{ width: 100, height: 100, resizeMode: "contain" }}
      />
      <Text>Welcome to Evapod!</Text>
      <ActivityIndicator
        size="large"
        color="#3b82f6"
        style={{ marginTop: 20 }}
      />
    </View>
  );
}
