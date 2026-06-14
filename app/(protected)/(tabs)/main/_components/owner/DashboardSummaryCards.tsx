import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { CheckSquare, AlarmClock, ClipboardList } from "lucide-react-native";

export default function DashboardSummaryCards({
  onAttendanceClick,
  onLateAbsentClick,
  onPendingApprovalClick,
}: any) {
  const cards = [
    {
      title: "오늘 출근률",
      val: "75%",
      icon: <CheckSquare size={18} color="#22c55e" />,
      onPress: onAttendanceClick,
    },
    {
      title: "이번 달 지각",
      val: "5.8%",
      icon: <AlarmClock size={18} color="#ef4444" />,
      onPress: onLateAbsentClick,
    },
    {
      title: "미처리 승인",
      val: "17건",
      icon: <ClipboardList size={18} color="#f97316" />,
      onPress: onPendingApprovalClick,
    },
  ];

  return (
    <View className="gap-3">
      {cards.map((c, i) => (
        <TouchableOpacity
          key={i}
          onPress={c.onPress}
          className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm"
        >
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-xs font-bold text-gray-400 uppercase">
              {c.title}
            </Text>
            {c.icon}
          </View>
          <Text className="text-3xl font-black text-[#0029C0]">{c.val}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
