import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { useUserStore } from "@/store/useUserStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import "../global.css";

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());
  const { setUser, setIsRestoring, isRestoring } = useUserStore();

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedUser = await SecureStore.getItemAsync("auth_user");
        if (savedUser) setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("세션 복구 실패", e);
      } finally {
        setIsRestoring(false);
      }
    };
    restoreSession();
  }, []);

  if (isRestoring) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  );
}
