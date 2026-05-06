// import axios from "axios";
// import * as SecureStore from "expo-secure-store";

// export const axiosInstance = axios.create({
//   baseURL: process.env.EXPO_PUBLIC_API_URL,
//   headers: { "Content-Type": "application/json" },
// });

// axiosInstance.interceptors.request.use(async (config) => {
//   const token = await SecureStore.getItemAsync("accessToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { Alert } from "react-native";

export const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log(
          `✉️ [Request] ${config.method?.toUpperCase()} ${config.url} | Token: Yes`,
        );
      } else {
        console.log(
          `⚠️ [Request] ${config.method?.toUpperCase()} ${config.url} | Token: Missing`,
        );
      }
    } catch (error) {
      console.error("❌ 토큰 로드 중 오류:", error);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log("🚫 [401 Error] 토큰 만료 또는 인증 실패");

      // logout() 안에서 accessToken 삭제 + clearUser() 까지 다 해줌
      const { useAuthStore } = await import("@/store/useAuthStore");
      await useAuthStore.getState().logout();

      Alert.alert(
        "세션 만료",
        "장시간 사용하지 않아 자동으로 로그아웃됐어요. 다시 로그인해주세요.",
        [
          {
            text: "확인",
            onPress: () => router.replace("/(auth)"),
          },
        ],
      );
    }
    return Promise.reject(error);
  },
);
