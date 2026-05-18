import React from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useVacation } from "@/hooks/useVacation";
import LeaveHistoryItem from "@/components/LeaveHistoryItem";
import CardErrorFallback from "@/components/CardErrorFallback";

export default function LeaveStatusCard() {
  const { useVacationList } = useVacation();
  const { data, isLoading, isError, refetch } = useVacationList();

  const summary = data?.summary;
  const leaveList = data?.pages[0]?.list || [];

  const usedPercentage = summary ? (summary.used / summary.total) * 100 : 0;

  //  1. 로딩 중일 때는 여기서 먼저 깔끔하게 리턴 (얼리 리턴)
  if (isLoading) {
    return (
      <View className="py-10 items-center justify-center bg-white rounded-[32px] border border-gray-100 shadow-sm w-full">
        <ActivityIndicator size="small" color="#0029C0" />
      </View>
    );
  }

  //  2. 에러가 났거나 데이터가 없을 때도 여기서 먼저 리턴
  if (isError || !summary) {
    return (
      <CardErrorFallback
        message="연차 현황을 불러오지 못했어요"
        onRetry={refetch}
      />
    );
  }

  //  3. 성공했을 때의 뷰 (더 이상 삼항 연산자 괄호에 갇히지 않아 안전합니다)
  return (
    <View className="p-6 bg-white rounded-[32px] border border-gray-100 shadow-sm w-full">
      {/* 상단: 남은 연차 정보 */}
      <View className="flex-row justify-between items-start mb-8">
        <View>
          <Text className="text-lg font-bold text-gray-950 mb-3">
            연차 현황
          </Text>
          <View className="flex-row items-baseline gap-1">
            <Text className="text-5xl font-black text-black">
              {summary.remaining}
            </Text>
            <Text className="text-lg font-bold text-gray-400">일 남음</Text>
          </View>
        </View>
        <View className="w-12 h-12 bg-gray-50 rounded-2xl items-center justify-center opacity-50">
          <Text className="text-2xl">🌴</Text>
        </View>
      </View>

      {/* 중간: 프로그레스 바 */}
      <View className="mb-8">
        <Text className="text-sm font-medium text-gray-500 mb-3">
          전체 {summary.total}일 중 {summary.used}일을 사용했습니다.
        </Text>
        <View className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <View
            style={{ width: `${usedPercentage}%` }}
            className="h-full bg-[#0029C0] rounded-full"
          />
        </View>
        <View className="flex-row justify-between mt-2">
          <Text className="text-xs font-bold text-[#0029C0]">
            사용 {summary.used}
          </Text>
          <Text className="text-xs font-bold text-gray-400">
            남음 {summary.remaining}
          </Text>
        </View>
      </View>

      {/* 하단: 최근 신청 내역 */}
      <View className="mb-6">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-lg font-bold text-gray-900">
            최근 신청 내역
          </Text>
        </View>

        <View className="gap-2">
          {leaveList.map((item: any) => (
            <LeaveHistoryItem
              key={item.id}
              startDate={item.startDate}
              type={item.type}
              timeRange={item.timeRange}
              status={item.status}
            />
          ))}
          {leaveList.length === 0 && (
            <Text className="text-sm text-gray-400 text-center py-4">
              신청 내역이 없습니다.
            </Text>
          )}
        </View>
      </View>

      {/* 더보기 버튼 */}
      <Pressable
        onPress={() => router.push("/vacation")}
        className="flex-row items-center justify-center py-4 mt-2"
      >
        <Text className="text-gray-500 font-bold text-base">+ 더보기</Text>
      </Pressable>
    </View>
  );
}
