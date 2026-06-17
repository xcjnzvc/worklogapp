import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { useUserStore } from "@/store/useUserStore";
import { useAuthStore } from "@/store/useAuthStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-toast-message";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());
  const { setUser, setIsRestoring, isRestoring } = useUserStore();

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await SecureStore.getItemAsync("accessToken");
        if (token) {
          useAuthStore.setState({ token });
        }

        const savedUser = await SecureStore.getItemAsync("auth_user");
        if (savedUser) setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("세션 복구 실패", e);
      } finally {
        setIsRestoring(false);
      }
    };
    restoreSession();
  }, [setIsRestoring, setUser]);

  if (isRestoring) return null;

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }} />
        <Toast />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
