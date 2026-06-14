import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Award } from "lucide-react-native";

export default function TeamAttendanceCard({
  teams,
  getTeamIcon,
  vacationers = [],
}: any) {
  return (
    <View className="bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm">
      <View className="flex-row justify-between items-center mb-5">
        <Text className="font-bold text-lg text-gray-900">팀별 출근 현황</Text>
        <View className="bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
          <Text className="text-xs font-bold text-gray-500">실시간</Text>
        </View>
      </View>

      <View className="space-y-1">
        {teams.map((team: any) => {
          const presentCount = team.status.filter(
            (s: string) => s === "present",
          ).length;
          const lateCount = team.status.filter(
            (s: string) => s === "late",
          ).length;
          const leaveCount = team.status.filter(
            (s: string) => s === "leave",
          ).length;

          return (
            <View
              key={team.name}
              className="flex-row items-center justify-between py-3 border-b border-gray-100/50"
            >
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-xl bg-gray-50 items-center justify-center border border-gray-100">
                  {getTeamIcon(team.teamType)}
                </View>
                <View>
                  <View className="flex-row items-center gap-1.5">
                    <Text className="font-bold text-base text-gray-900">
                      {team.name}
                    </Text>
                    {team.rate === "100%" && (
                      <Award size={14} color="#059669" />
                    )}
                  </View>
                  <Text className="text-xs font-semibold text-gray-400 mt-0.5">
                    {team.rate} 달성 중
                  </Text>
                </View>
              </View>

              <View className="flex-row gap-4">
                <View className="items-center">
                  <Text className="text-[10px] font-bold text-gray-400">
                    출근
                  </Text>
                  <Text className="text-sm font-black">{presentCount}</Text>
                </View>
                <View className="items-center">
                  <Text className="text-[10px] font-bold text-orange-400">
                    지각
                  </Text>
                  <Text className="text-sm font-black text-orange-500">
                    {lateCount}
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-[10px] font-bold text-blue-400">
                    휴가
                  </Text>
                  <Text className="text-sm font-black text-blue-700">
                    {leaveCount}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      <View className="mt-5 pt-5 border-t border-gray-100">
        <Text className="text-xs font-black text-gray-400 mb-3 uppercase">
          오늘 휴가자
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {vacationers.map((person: any) => (
            <View
              key={person.name}
              className="bg-blue-50/50 px-3 py-2 rounded-xl border border-blue-100/30"
            >
              <Text className="text-sm font-bold text-blue-900">
                {person.name}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
