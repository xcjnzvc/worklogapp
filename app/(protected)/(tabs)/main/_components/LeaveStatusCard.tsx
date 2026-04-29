import React from "react";
import { View, Text, Pressable } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getVacationAPI } from "@/api/vacation";
import { VacationResponse } from "@/types/vacation";
import LeaveHistoryItem from "@/components/LeaveHistoryItem";
import { useRouter } from "expo-router";
import Button from "@/components/Button";

function LoadingSkeleton() {
  return <View className="p-8 h-[500px] w-full bg-gray-50 rounded-3xl" />;
}

export default function LeaveStatusCard() {
  const router = useRouter();
  const { data, isLoading, isError } = useQuery<VacationResponse>({
    queryKey: ["vacations"],
    queryFn: getVacationAPI,
  });

  const usedPercentage = data
    ? (data.summary.used / data.summary.total) * 100
    : 0;

  return (
    <View className="p-6 bg-white rounded-[32px] border border-gray-100 shadow-sm w-full">
      {isLoading ? (
        <LoadingSkeleton />
      ) : isError || !data ? null : (
        <>
          {/* 상단: 남은 연차 정보 */}
          <View className="flex-row justify-between items-start mb-8">
            <View>
              <Text className="text-lg font-bold text-gray-950 mb-3">
                연차 현황
              </Text>
              <View className="flex-row items-baseline gap-1">
                <Text className="text-5xl font-black text-black">
                  {data.summary.remaining}
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
              전체 {data.summary.total}일 중 {data.summary.used}일을
              사용했습니다.
            </Text>
            <View className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <View
                style={{ width: `${usedPercentage}%` }}
                className="h-full bg-[#0029C0] rounded-full"
              />
            </View>
            <View className="flex-row justify-between mt-2">
              <Text className="text-xs font-bold text-[#0029C0]">
                사용 {data.summary.used}
              </Text>
              <Text className="text-xs font-bold text-gray-400">
                남음 {data.summary.remaining}
              </Text>
            </View>
          </View>

          {/* 하단: 최근 신청 내역 */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-bold text-gray-900">
                최근 신청 내역
              </Text>
              {/* <Pressable>
                <Text className="text-xs font-bold text-gray-400">
                  더보기 &gt;
                </Text>
              </Pressable> */}
            </View>

            <View className="gap-2">
              {data.data.map((item) => (
                <LeaveHistoryItem
                  key={item.id}
                  startDate={item.startDate}
                  type={item.type}
                  timeRange={item.timeRange}
                  status={item.status}
                />
              ))}
            </View>
          </View>

          {/* 버튼 */}
          {/* <Button text="신청하기" onPress={() => {}} /> */}
          <Pressable
            onPress={() => router.push("/leave-history")}
            className="flex-row items-center justify-center py-4 mt-2"
          >
            <Text className="text-gray-500 font-bold text-base">+ 더보기</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}
