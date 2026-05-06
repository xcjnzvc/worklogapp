// import { Stack } from "expo-router";

// export default function MainLayout() {
//   return (
//     <Stack
//       screenOptions={{
//         headerShown: false,
//         contentStyle: { backgroundColor: "#F8F9FA" },
//       }}
//     />
//   );
// }

import { Stack } from "expo-router";
import Header from "@/components/Header";

export default function MainLayout() {
  return (
    <Stack
      screenOptions={({ route }) => ({
        header: () => <Header showBackButton={route.name !== "index"} />,
        contentStyle: { backgroundColor: "#F8F9FA" },
      })}
    />
  );
}
