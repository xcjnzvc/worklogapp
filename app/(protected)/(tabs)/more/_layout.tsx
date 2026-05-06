import { Stack } from "expo-router";
import Header from "@/components/Header";

export default function MoreLayout() {
  return (
    <Stack
      screenOptions={({ route }) => ({
        header: () => <Header showBackButton={route.name !== "index"} />,
        contentStyle: { backgroundColor: "#F8F9FA" },
      })}
    />
  );
}
