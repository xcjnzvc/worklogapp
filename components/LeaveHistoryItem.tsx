import React from "react";
import { View, Text } from "react-native";

export type DbStatus = "PENDING" | "APPROVED" | "REJECTED";

interface LeaveHistoryItemProps {
  startDate: string;
  type: "ANNUAL" | "HALF_AM" | "HALF_PM";
  timeRange: string;
  status: DbStatus;
}

export default function LeaveHistoryItem({
  startDate,
  type,
  timeRange,
  status,
}: LeaveHistoryItemProps) {
  const getStatusLabel = (s: DbStatus) => {
    const map = {
      PENDING: "승인 대기",
      APPROVED: "승인 완료",
      REJECTED: "반려",
    };
    return map[s];
  };

  const getTypeLabel = (t: string) => (t === "ANNUAL" ? "하루 종일" : "반차");

  const isHalfLeave = type !== "ANNUAL";
  const iconColor = isHalfLeave ? "#F69722" : "#2357E5";
  const typeBgColor = isHalfLeave ? "#FFF7ED" : "#DBEAFE";

  const statusConfig: Record<DbStatus, { color: string }> = {
    PENDING: { color: "#FF822E" },
    APPROVED: { color: "#0CAF60" },
    REJECTED: { color: "#F84040" },
  };

  const { color: dotColor } = statusConfig[status];

  const dateObj = new Date(startDate);
  const formattedDate = `${dateObj.getFullYear()}년 ${String(dateObj.getMonth() + 1).padStart(2, "0")}월 ${String(dateObj.getDate()).padStart(2, "0")}일`;

  return (
    <View className="flex-row items-center justify-between py-4 border-b border-gray-50">
      <View className="flex-row items-center gap-4">
        {/* 아이콘 컨테이너 */}
        <View
          style={{ backgroundColor: typeBgColor }}
          className="w-12 h-12 rounded-2xl items-center justify-center"
        >
          <Text style={{ color: iconColor, fontSize: 20 }}>
            {isHalfLeave ? "🕐" : "📅"}
          </Text>
        </View>

        <View className="flex-col">
          <Text className="text-[15px] font-bold text-gray-900">
            {formattedDate}
          </Text>
          <Text className="text-[13px] text-gray-400 font-medium">
            {getTypeLabel(type)} ({timeRange})
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2">
        <View
          style={{ backgroundColor: dotColor }}
          className="w-2 h-2 rounded-full"
        />
        <Text style={{ color: dotColor }} className="text-[13px] font-bold">
          {getStatusLabel(status)}
        </Text>
      </View>
    </View>
  );
}
