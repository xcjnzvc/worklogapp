// import { useEffect } from "react";
// import { Stack, router } from "expo-router";
// import { useUserStore } from "@/store/useUserStore";
// import Header from "@/components/Header";

// export default function ProtectedLayout() {
//   const { isLoggedIn, isRestoring } = useUserStore();

//   useEffect(() => {
//     if (!isRestoring && !isLoggedIn) {
//       router.replace("/(auth)");
//     }
//   }, [isLoggedIn, isRestoring]);

//   if (isRestoring || !isLoggedIn) return null;

//   return (
//     <Stack
//       screenOptions={{
//         header: () => <Header />,
//         contentStyle: { backgroundColor: "#F8F9FA" },
//       }}
//     />
//   );
// }

// app/(protected)/_layout.tsx
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
