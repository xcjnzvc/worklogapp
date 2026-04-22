//

import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useUserStore } from "@/store/useUserStore";
import { router } from "expo-router";
import Button from "@/components/Button";
import WorkStatusCard from "./_components/WorkStatusCard";
import AttendanceSummaryCard from "./_components/AttendanceSummaryCard";
import LeaveStatusCard from "./_components/LeaveStatusCard";

export default function MainScreen() {
  const { user, isLoggedIn, isLoading } = useUserStore();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F8F9FA]">
        <Text>로딩 중...</Text>
      </View>
    );
  }

  if (!isLoggedIn || !user) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F8F9FA]">
        <Text className="text-lg font-bold text-gray-700 mb-4">
          로그인이 필요한 서비스입니다.
        </Text>
        <Button text="로그인하러 가기" onPress={() => router.push("/login")} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerClassName="p-5 bg-[#F8F9FA]">
      <Text className="text-xl font-bold text-[#222] mb-5">
        <Text className="text-[#0029C0]">{user.companyName}</Text> {user.name}님
        환영합니다!
      </Text>

      {user.role === "OWNER" ? (
        <View className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <Text className="text-lg font-bold text-[#0023A1]">
            관리자 대시보드
          </Text>
          <Text className="text-gray-400 my-2">
            팀원을 초대하여 근태 관리를 시작하세요.
          </Text>
          <Button
            text="초대 링크 생성"
            onPress={() => router.push("/invite")}
          />
        </View>
      ) : (
        // 세로로 한 줄 나열 (가로 배치 제거)
        <View className="gap-4">
          <WorkStatusCard />
          <AttendanceSummaryCard />
          <LeaveStatusCard />
        </View>
      )}
    </ScrollView>
  );
}
