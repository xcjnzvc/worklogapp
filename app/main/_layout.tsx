// import { Stack } from "expo-router";

// export default function MainLayout() {
//   return <Stack screenOptions={{ headerShown: false }} />;
// }

// import { Stack } from "expo-router";
// import { useEffect, useState } from "react";
// import { View } from "react-native";

// export default function MainLayout() {
//   const [ready, setReady] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => setReady(true), 500);
//     return () => clearTimeout(timer);
//   }, []);

//   if (!ready) return <View className="flex-1 bg-[#F8F9FA]" />;

//   return <Stack screenOptions={{ headerShown: false }} />;
// }

import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function MainLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // 1. Stack은 항상 존재해야 네비게이션 컨텍스트가 살아있습니다.
  // 2. ready가 아닐 때는 그냥 빈 스택을 보여주거나 로딩 레이아웃을 Stack 안에서 처리합니다.
  if (!ready) {
    return <View className="flex-1 bg-[#F8F9FA]" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
