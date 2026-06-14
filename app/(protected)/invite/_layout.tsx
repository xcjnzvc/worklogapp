import { Stack } from "expo-router";
import Header from "@/components/Header";

export default function InviteLayout() {
  return (
    <Stack
      screenOptions={() => ({
        // 조건문을 제거하여 모든 페이지에서 항상 뒤로가기가 보이게 설정
        header: () => <Header showBackButton={true} />,
        contentStyle: { backgroundColor: "#F8F9FA" },
      })}
    />
  );
}
