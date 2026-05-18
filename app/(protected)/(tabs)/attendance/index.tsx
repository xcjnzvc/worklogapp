import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { ArrowRight } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useWorkLogList } from "@/hooks/useAttendance";
import HistoryLayout from "@/components/HistoryLayout";
import SearchFilterBottomSheet, {
  FilterData,
} from "../../../../components/SearchFilterBottomSheet";

export default function AttendanceHistoryScreen() {
  const router = useRouter();
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useWorkLogList();

  const attendanceList = data?.pages.flatMap((page) => page.result || []) || [];

  const formatDate = (isoString: string) => {
    if (!isoString) return { dateStr: "--.--.--", dayStr: "" };
    try {
      const date = new Date(isoString);
      return {
        dateStr: `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`,
        dayStr: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][
          date.getDay()
        ],
      };
    } catch {
      return { dateStr: "--.--.--", dayStr: "" };
    }
  };

  const formatTime = (isoString: string) => {
    if (!isoString || isoString === "--:--") return "--:--";
    try {
      const date = new Date(isoString);
      return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    } catch {
      return "--:--";
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "NORMAL":
        return { bg: "bg-[#E6F4EA]", text: "text-[#137333]", label: "✓ 정상" };
      case "LATE":
      case "LATE_EARLY":
        return { bg: "bg-[#FCE8E6]", text: "text-[#C5221F]", label: "⚠ 지각" };
      case "ABSENT":
        return { bg: "bg-[#FEF7E0]", text: "text-[#B06000]", label: "✕ 결근" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-500", label: "⚠ 미달" };
    }
  };

  return (
    <View className="flex-1">
      <HistoryLayout
        title="근태 기록"
        placeholder="기록을 검색하세요"
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onFilterPress={() => setIsFilterVisible(true)}
        // 💡 컴포넌트 내부로 로직을 위임 및 인터페이스 결합
        onLoadMore={() => fetchNextPage()}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      >
        {isLoading ? (
          <View className="py-20 items-center justify-center">
            <ActivityIndicator size="large" color="#3B28FF" />
          </View>
        ) : isError ? (
          <View className="py-20 items-center justify-center">
            <Text className="text-red-500 text-sm font-bold">
              데이터를 가져오지 못했습니다.
            </Text>
          </View>
        ) : attendanceList.length === 0 ? (
          <View className="py-20 items-center justify-center bg-white rounded-[32px] border border-gray-100 p-6">
            <Text className="text-gray-400 text-sm font-medium">
              조회된 근태 기록이 없습니다.
            </Text>
          </View>
        ) : (
          attendanceList.map((item: any, index: number) => {
            const statusStyle = getStatusStyle(item.status);
            const currentNo = String(attendanceList.length - index).padStart(
              3,
              "0",
            );
            const parsedDate = formatDate(item.date);

            return (
              <View
                key={item.id || index}
                className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm mb-5"
              >
                {/* 기존 내역 카드 아이템 UI 보존 */}
                <View className="flex-row justify-between items-center mb-5">
                  <Text className="text-gray-400 font-bold text-[12px] tracking-wider">
                    NO. 2026-{currentNo}
                  </Text>
                  <View className="flex-row gap-1.5">
                    <View className="px-2.5 py-1 bg-gray-100 rounded-full">
                      <Text className="text-[11px] font-bold text-gray-400">{`⏱ ${item.workMinutes ?? 0}m`}</Text>
                    </View>
                    <View
                      className={`px-2.5 py-1 rounded-full ${statusStyle.bg}`}
                    >
                      <Text
                        className={`text-[11px] font-bold ${statusStyle.text}`}
                      >
                        {statusStyle.label}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="flex-row items-baseline gap-2 mb-6">
                  <Text className="text-[24px] font-black text-gray-900">
                    {parsedDate.dateStr}
                  </Text>
                  <Text className="text-[13px] font-bold text-gray-400 tracking-wider">
                    {parsedDate.dayStr}
                  </Text>
                </View>

                <View className="flex-row items-center justify-between mb-8 px-1">
                  <View className="flex-1">
                    <Text className="text-[11px] font-bold text-[#3B28FF] mb-1.5">
                      CLOCK IN
                    </Text>
                    <Text className="text-[30px] font-black text-gray-900 tabular-nums">
                      {formatTime(item.clockIn)}
                    </Text>
                  </View>
                  <View className="flex-1 h-[1px] bg-gray-200 relative mx-3">
                    <View className="absolute -top-[5px] left-1/2 -ml-[6px] bg-white px-1">
                      <ArrowRight size={12} color="#D1D5DB" />
                    </View>
                  </View>
                  <View className="flex-1 items-end">
                    <Text className="text-[11px] font-bold text-[#3B28FF] mb-1.5">
                      CLOCK OUT
                    </Text>
                    <Text className="text-[30px] font-black text-gray-900 tabular-nums">
                      {formatTime(item.clockOut)}
                    </Text>
                  </View>
                </View>

                <View className="w-full">
                  {item.status === "NORMAL" ? (
                    <View className="w-full bg-white border border-dashed border-gray-200 py-3.5 rounded-2xl items-center justify-center">
                      <Text className="text-gray-400 text-xs font-bold">
                        ✓ 정상 기록
                      </Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() =>
                        router.push({
                          pathname: "/attendance/create",
                          params: { id: item.id },
                        })
                      }
                      className="w-full bg-[#3B28FF] py-4 rounded-2xl flex-row items-center justify-center"
                    >
                      <Text className="text-white font-bold text-[14px]">
                        정정 요청
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
        )}
      </HistoryLayout>

      <SearchFilterBottomSheet
        isVisible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        categoryTitle="근태 종류"
        categoryOptions={["전체보기", "정상", "지각", "지각&조퇴", "병결"]}
        onApply={(filterData: FilterData) => {
          setIsFilterVisible(false);
        }}
      />
    </View>
  );
}
