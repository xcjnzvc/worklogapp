import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronRight } from "lucide-react-native";

export default function MonthlyAttendanceSummaryCard({
  teams,
  onDetailClick,
}: any) {
  return (
    <View className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="font-bold text-lg text-gray-900">
          이번 달 근태 요약
        </Text>
        <TouchableOpacity
          onPress={onDetailClick}
          className="flex-row items-center"
        >
          <Text className="text-xs font-bold text-gray-500">상세 보기</Text>
          <ChevronRight size={14} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <View className="flex-row gap-3 mb-6">
        <View className="flex-1 bg-gray-50 p-4 rounded-2xl items-center">
          <Text className="text-2xl font-black text-[#0029C0]">83.2%</Text>
        </View>
        <View className="flex-1 bg-orange-50 p-4 rounded-2xl items-center">
          <Text className="text-2xl font-black text-orange-500">5건</Text>
        </View>
        <View className="flex-1 bg-red-50 p-4 rounded-2xl items-center">
          <Text className="text-2xl font-black text-red-500">1건</Text>
        </View>
      </View>
    </View>
  );
}
