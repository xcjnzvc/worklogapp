import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useQuery } from "@tanstack/react-query";
import { getWeeklyAttendanceAPI } from "@/api/attendance";
import { AttendanceStatus } from "@/types/attendance";

const THEME_COLORS: Record<
  string,
  { bg: string; text: string; from: string; to: string }
> = {
  NORMAL: { bg: "#F5F8FF", text: "#2357E5", from: "#A7C0FF", to: "#2357E5" },
  LATE: { bg: "#FFF7ED", text: "#9A3412", from: "#FED7AA", to: "#EA580C" },
  EARLY_LEAVE: {
    bg: "#FEF2F2",
    text: "#991B1B",
    from: "#FCA5A5",
    to: "#DC2626",
  },
  ABSENT: { bg: "#F5F3FF", text: "#5B21B6", from: "#DDD6FE", to: "#7C3AED" },
  DEFAULT: { bg: "#F8FAFC", text: "#1E293B", from: "#E2E8F0", to: "#94A3B8" },
};

const STAT_LABEL_MAP: Record<string, string> = {
  "정상 출근": "NORMAL",
  "누적 지각": "LATE",
  결근: "ABSENT",
  조퇴: "EARLY_LEAVE",
  // 출근율: "DEFAULT",
};

export default function AttendanceSummaryCard() {
  const { data, isLoading, isError } = useQuery<any>({
    queryKey: ["summaryAttendance"],
    queryFn: getWeeklyAttendanceAPI,
  });

  const enrichedStats = useMemo(() => {
    if (!data?.stats) return [];
    return data.stats.map((item: any) => {
      const type = STAT_LABEL_MAP[item.label] || "DEFAULT";
      return { ...item, ...THEME_COLORS[type] };
    });
  }, [data]);

  if (isLoading || isError || !data) return null;

  return (
    <View className="p-6 bg-white rounded-[32px] border border-gray-100 shadow-sm w-full">
      <Text className="font-bold text-lg text-gray-950 mb-1">근태 요약</Text>
      <Text className="text-sm font-bold text-gray-700">
        이번주 총 근무시간
      </Text>
      <Text className="text-sm text-gray-400 mb-6">
        {data.weeklySummary.period}
      </Text>

      <View className="flex-row items-baseline gap-2 mb-8">
        <Text className="text-6xl font-black text-black tracking-tighter">
          {data.weeklySummary.totalHours}
        </Text>
        <Text className="text-3xl font-bold text-gray-400">h</Text>
        <Text className="text-6xl font-black text-black tracking-tighter ml-2">
          {data.weeklySummary.totalMinutes}
        </Text>
        <Text className="text-3xl font-bold text-gray-400">m</Text>
      </View>

      {/* 그래프 영역: 4개의 그리드 선 */}
      <View className="w-full h-[180px] bg-[#F8FAFC] rounded-3xl p-6 mb-6">
        {/* 요일 위부터 상단까지 4개의 선 */}
        <View className="absolute left-6 right-6 top-6 bottom-14 justify-between pointer-events-none">
          {[1, 2, 3, 4].map((i) => (
            <View key={i} className="w-full h-[1px] bg-gray-200" />
          ))}
        </View>

        <View className="flex-row flex-1 justify-between items-end">
          {data.dailyGraph.map((item: any) => {
            const colors = THEME_COLORS[item.status] || THEME_COLORS.DEFAULT;
            return (
              <View key={item.day} className="items-center z-10">
                <LinearGradient
                  colors={[colors.from, colors.to]}
                  style={{
                    height: `${Math.max(item.percent, 10)}%`,
                    width: 32,
                    borderRadius: 16,
                  }}
                />
                <Text className="text-sm font-bold text-gray-400 mt-3">
                  {item.day}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* 하단 통계 박스 */}
      <View className="flex-row gap-2 justify-between">
        {enrichedStats.map((item: any) => (
          <View
            key={item.label}
            style={{ backgroundColor: item.bg }}
            className="flex-1 items-center py-4 rounded-2xl"
          >
            <Text
              style={{ color: item.text }}
              className="text-[11px] font-bold mb-2"
            >
              {item.label}
            </Text>
            <View className="flex-row items-baseline">
              <Text className="text-xl font-black text-gray-900">
                {item.value}
              </Text>
              <Text className="text-[10px] font-bold text-gray-500 ml-0.5">
                {item.unit}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
