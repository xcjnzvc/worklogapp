import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useUserStore } from "@/store/useUserStore";
import { router } from "expo-router";
import {
  UserPlus,
  ArrowRight,
  ShieldCheck,
  Clock,
  CalendarDays,
  Code,
  Palette,
  Megaphone,
  Briefcase,
  Users,
  Building2,
} from "lucide-react-native";

import UserProfileCard from "../attendance/_components/UserProfileCard";
import TeamAttendanceCard from "./_components/owner/TeamAttendanceCard";
import WorkStatusCard from "./_components/user/WorkStatusCard";
import AttendanceSummaryCard from "./_components/user/AttendanceSummaryCard";
import LeaveStatusCard from "./_components/user/LeaveStatusCard";

interface Team {
  name: string;
  status: string[];
  rate: string;
  overtimeHours: number;
  overtimeMembers: string[];
  teamType: "dev" | "design" | "marketing" | "sales" | "hr";
}

const MOCK_TEAMS: Team[] = [
  {
    name: "개발팀",
    status: [
      "present",
      "present",
      "present",
      "present",
      "present",
      "present",
      "leave",
    ],
    rate: "88%",
    overtimeHours: 42,
    overtimeMembers: ["김개발", "이코딩"],
    teamType: "dev",
  },
  {
    name: "디자인팀",
    status: ["present", "present", "late", "absent"],
    rate: "75%",
    overtimeHours: 15,
    overtimeMembers: ["박디자인"],
    teamType: "design",
  },
  {
    name: "마케팅팀",
    status: ["present", "present", "present", "present", "absent"],
    rate: "80%",
    overtimeHours: 8,
    overtimeMembers: [],
    teamType: "marketing",
  },
  {
    name: "영업팀",
    status: ["present", "present", "present", "leave"],
    rate: "75%",
    overtimeHours: 24,
    overtimeMembers: ["최영업"],
    teamType: "sales",
  },
  {
    name: "인사팀",
    status: ["present", "present", "present"],
    rate: "100%",
    overtimeHours: 0,
    overtimeMembers: [],
    teamType: "hr",
  },
];

const getTeamIcon = (type: string) => {
  switch (type) {
    case "dev":
      return <Code color="#4f46e5" size={16} />;
    case "design":
      return <Palette color="#db2777" size={16} />;
    case "marketing":
      return <Megaphone color="#ea580c" size={16} />;
    case "sales":
      return <Briefcase color="#2563eb" size={16} />;
    case "hr":
      return <Users color="#059669" size={16} />;
    default:
      return <Building2 color="#4b5563" size={16} />;
  }
};

export default function MainScreen() {
  const { user } = useUserStore();

  if (!user) return null;

  return (
    <ScrollView
      className="flex-1 bg-[#F8F9FA]"
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
    >
      <View className="mt-4 mb-4">
        <UserProfileCard />
      </View>

      {user.role === "OWNER" ? (
        <View className="gap-6">
          {/* 팀별 출근 현황 카드 (데이터 전달!) */}
          <TeamAttendanceCard teams={MOCK_TEAMS} getTeamIcon={getTeamIcon} />

          {/* 초대 카드 */}
          <View className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
            <View className="flex-row justify-between items-center mb-5">
              <View className="w-12 h-12 bg-indigo-50 rounded-2xl items-center justify-center">
                <UserPlus size={24} color="#3B28FF" />
              </View>
              <View className="flex-row items-center bg-indigo-50 px-3 py-1 rounded-full">
                <ShieldCheck size={12} color="#3B28FF" />
                <Text className="text-[11px] font-bold text-[#3B28FF] ml-1">
                  ADMIN MODE
                </Text>
              </View>
            </View>
            <Text className="text-[20px] font-bold text-gray-900 mb-1">
              팀원 초대
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/invite")}
              className="bg-[#3B28FF] py-4 rounded-2xl flex-row items-center justify-center mt-4"
            >
              <Text className="text-white font-semibold text-[15px] mr-2">
                링크 생성하기
              </Text>
              <ArrowRight size={16} color="white" />
            </TouchableOpacity>
          </View>

          {/* 관리자 요약 */}
          <View className="flex-row gap-4">
            <TouchableOpacity
              onPress={() => router.push("/attendance?tab=APPROVALS")}
              className="flex-1 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm items-center"
            >
              <Clock size={24} color="#6366f1" />
              <Text className="text-xs font-bold text-gray-400 mt-2">
                근태 승인
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/vacation")}
              className="flex-1 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm items-center"
            >
              <CalendarDays size={24} color="#10b981" />
              <Text className="text-xs font-bold text-gray-400 mt-2">
                휴가 승인
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View className="gap-4">
          <Text className="text-lg font-bold text-gray-900 mt-2">
            내 근태 현황
          </Text>
          <WorkStatusCard />
          <AttendanceSummaryCard />
          <LeaveStatusCard />
        </View>
      )}
    </ScrollView>
  );
}
