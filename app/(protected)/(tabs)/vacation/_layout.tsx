// import { Stack } from "expo-router";

// export default function Layout() {
//   return (
//     <Stack
//       screenOptions={{
//         headerShown: false,
//         contentStyle: { backgroundColor: "#F8F9FA" },
//       }}
//     />
//   );
// }

// app/(protected)/(tabs)/vacation/_layout.tsx
import { Stack } from "expo-router";
import Header from "@/components/Header";

export default function VacationLayout() {
  return (
    <Stack
      screenOptions={({ route }) => ({
        header: () => <Header showBackButton={route.name !== "index"} />,
        contentStyle: { backgroundColor: "#F8F9FA" },
      })}
    />
  );
}
