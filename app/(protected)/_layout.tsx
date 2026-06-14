import { useEffect } from "react";
import { Stack, router } from "expo-router";
import { useUserStore } from "@/store/useUserStore";

export default function ProtectedLayout() {
  const { isLoggedIn, isRestoring } = useUserStore();

  useEffect(() => {
    if (!isRestoring && !isLoggedIn) {
      router.replace("/(auth)");
    }
  }, [isLoggedIn, isRestoring]);

  if (isRestoring || !isLoggedIn) return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false, // 전역 헤더 제거, 각 layout에서 관리
        contentStyle: { backgroundColor: "#F8F9FA" },
      }}
    />
  );
}
