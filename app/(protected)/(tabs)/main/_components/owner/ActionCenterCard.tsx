import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FileCheck, ChevronRight, UserPlus } from "lucide-react-native";

interface ActionCenterCardProps {
  holidayCount?: number;
  attendanceCount?: number;
  onHolidayClick: () => void;
  onAttendanceClick: () => void;
  onInviteClick: () => void;
}

export default function ActionCenterCard({
  holidayCount = 0,
  attendanceCount = 0,
  onHolidayClick,
  onAttendanceClick,
  onInviteClick,
}: ActionCenterCardProps) {
  return (
    <View className="bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm">
      <View className="flex-row items-center gap-2 mb-4">
        <FileCheck size={20} color="#059669" />
        <Text className="font-black text-lg text-gray-900">운영 액션 센터</Text>
        <View className="bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
          <Text className="text-[10px] font-bold text-emerald-600">
            처리 필요
          </Text>
        </View>
      </View>

      <View className="gap-3">
        <TouchableOpacity
          onPress={onHolidayClick}
          className="flex-row items-center justify-between p-4 bg-gray-50 rounded-2xl"
        >
          <Text className="font-semibold text-gray-800">휴가 결재 요청</Text>
          <View className="flex-row items-center gap-2">
            <View className="w-6 h-6 rounded-full bg-blue-500 items-center justify-center">
              <Text className="text-white text-xs font-bold">
                {holidayCount}
              </Text>
            </View>
            <ChevronRight size={16} color="#9ca3af" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onAttendanceClick}
          className="flex-row items-center justify-between p-4 bg-gray-50 rounded-2xl"
        >
          <Text className="font-semibold text-gray-800">근태 정정 요청</Text>
          <View className="flex-row items-center gap-2">
            <View className="w-6 h-6 rounded-full bg-blue-500 items-center justify-center">
              <Text className="text-white text-xs font-bold">
                {attendanceCount}
              </Text>
            </View>
            <ChevronRight size={16} color="#9ca3af" />
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={onInviteClick}
        className="mt-5 p-4 bg-[#0029C0] rounded-2xl flex-row items-center justify-between"
      >
        <View className="flex-row items-center gap-3">
          <View className="p-2 bg-white/10 rounded-xl">
            <UserPlus size={18} color="white" />
          </View>
          <View>
            <Text className="font-bold text-white">새 팀원 초대</Text>
            <Text className="text-blue-200 text-xs">초대코드 발행하기</Text>
          </View>
        </View>
        <ChevronRight size={16} color="white" />
      </TouchableOpacity>
    </View>
  );
}
