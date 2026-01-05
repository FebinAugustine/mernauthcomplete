import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "user_data";

export interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
  csrfToken: string;
  sessionId: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
  phone?: number;
  fellowship?: any; // Can be ObjectId or populated object
  address?: string;
  gender?: string;
  dob?: string;
  zionId?: number;
  isVerified?: boolean;
  isBlocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const storeAuthData = async (tokens: AuthTokens, user: User) => {
  try {
    if (tokens.accessToken)
      await AsyncStorage.setItem(TOKEN_KEY, tokens.accessToken);
    if (tokens.refreshToken)
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    await AsyncStorage.setItem("csrf_token", tokens.csrfToken);
    await AsyncStorage.setItem("session_id", tokens.sessionId);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error("Error storing auth data:", error);
  }
};

export const getAuthData = async () => {
  try {
    const accessToken = await AsyncStorage.getItem(TOKEN_KEY);
    const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    const csrfToken = await AsyncStorage.getItem("csrf_token");
    const sessionId = await AsyncStorage.getItem("session_id");
    const userString = await AsyncStorage.getItem(USER_KEY);
    const user = userString ? JSON.parse(userString) : null;

    return {
      accessToken,
      refreshToken,
      csrfToken,
      sessionId,
      user,
    };
  } catch (error) {
    console.error("Error getting auth data:", error);
    return null;
  }
};

export const clearAuthData = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
    await AsyncStorage.removeItem("csrf_token");
    await AsyncStorage.removeItem("session_id");
    await AsyncStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error("Error clearing auth data:", error);
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  const authData = await getAuthData();
  return !!(authData?.sessionId && authData?.user);
};
