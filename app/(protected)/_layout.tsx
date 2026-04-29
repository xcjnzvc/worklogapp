import { useEffect } from "react";
import { Stack, router } from "expo-router";
import { useUserStore } from "@/store/useUserStore";
import Header from "@/components/Header";

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
        header: () => <Header />,
        contentStyle: { backgroundColor: "#ffffff" },
      }}
    />
  );
}
