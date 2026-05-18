import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useUserStore } from "@/store/useUserStore";
import { router } from "expo-router";
import Button from "@/components/Button";
import WorkStatusCard from "./_components/WorkStatusCard";
import AttendanceSummaryCard from "./_components/AttendanceSummaryCard";
import LeaveStatusCard from "./_components/LeaveStatusCard";
import UserProfileCard from "./_components/UserProfileCard";

export default function MainScreen() {
  const { user } = useUserStore();

  if (!user) return null; // (protected)/_layout.tsx에서 이미 처리됨

  return (
    <ScrollView contentContainerClassName=" px-[20px]">
      {user.role === "OWNER" ? (
        <View className=" p-5 rounded-3xl border border-gray-100 shadow-sm">
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
        <View className="gap-4 mt-[10px] mb-[40px]">
          <UserProfileCard />
          <WorkStatusCard />
          <AttendanceSummaryCard />
          <LeaveStatusCard />
        </View>
      )}
    </ScrollView>
  );
}
