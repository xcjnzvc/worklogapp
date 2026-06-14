import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AttendanceWorkLog } from "@/types/attendance";

interface AttendanceTableProps {
  data: AttendanceWorkLog[];
  type: "view" | "correction";
  isOwner?: boolean;
  onItemClick?: (item: AttendanceWorkLog) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

const AttendanceTable = ({
  data,
  type,
  isOwner = false,
  onItemClick,
  onApprove,
  onReject,
}: AttendanceTableProps) => {
  if (!data || data.length === 0) {
    return (
      <Text className="py-20 text-center text-[#A3AED0]">기록이 없습니다.</Text>
    );
  }

  return (
    <View className="flex-col gap-4">
      {data.map((item, index) => (
        <View
          key={item.id}
          className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50"
        >
          {type === "view" ? (
            /* 1. 근무 기록 내역 (기존 디자인 유지) */
            <View className="flex flex-col gap-5">
              <View className="flex-row items-center justify-between">
                <Text className="text-[12px] font-bold text-[#A3AED0] tracking-wider uppercase">
                  NO. {String(index + 1).padStart(3, "0")}
                </Text>
                <View className="flex-row gap-2">
                  <View className="bg-[#F4F7FE] px-2.5 py-1.5 rounded-full">
                    <Text className="text-[11px] font-bold text-[#707EAE]">
                      {item.workMinutes || 0}m
                    </Text>
                  </View>
                  <View
                    className={`px-2.5 py-1.5 rounded-full ${item.status === "NORMAL" ? "bg-[#E6F8F1]" : "bg-[#FFF1F2]"}`}
                  >
                    <Text
                      className={`text-[11px] font-black ${item.status === "NORMAL" ? "text-[#10B981]" : "text-[#F43F5E]"}`}
                    >
                      {item.status === "NORMAL" ? "정상" : "결근"}
                    </Text>
                  </View>
                </View>
              </View>
              <Text className="text-[22px] font-black text-[#1B254B]">
                {item.date.slice(0, 10)}
              </Text>
              <View className="flex-row items-center justify-between py-1">
                <View>
                  <Text className="text-[10px] font-bold text-[#4318FF] uppercase">
                    CLOCK IN
                  </Text>
                  <Text className="text-[24px] font-black text-[#1B254B]">
                    {item.clockIn?.slice(11, 16) || "--:--"}
                  </Text>
                </View>
                <View className="flex-1 h-[1px] bg-[#E0E5F2] mx-4" />
                <View className="items-end">
                  <Text className="text-[10px] font-bold text-[#4318FF] uppercase">
                    CLOCK OUT
                  </Text>
                  <Text className="text-[24px] font-black text-[#1B254B]">
                    {item.clockOut?.slice(11, 16) || "--:--"}
                  </Text>
                </View>
              </View>
              {item.status !== "NORMAL" && (
                <TouchableOpacity
                  onPress={() => onItemClick?.(item)}
                  className="w-full py-4 bg-[#4318FF] rounded-[20px] items-center"
                >
                  <Text className="text-white font-bold text-[14px]">
                    정정 요청
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            /* 2. 정정 신청 내역 (Log-Entry 스타일 - 강조 위주) */
            <View className="flex flex-col gap-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-[13px] font-bold text-[#4318FF]">
                  NO. {String(index + 1).padStart(3, "0")}
                </Text>
                <View className="bg-[#FFF8E7] px-3 py-1 rounded-full">
                  <Text className="text-[11px] font-black text-[#FFA800]">
                    승인 대기
                  </Text>
                </View>
              </View>

              <View>
                <Text className="text-[12px] font-bold text-[#A3AED0] mb-1">
                  대상 날짜
                </Text>
                <Text className="text-[18px] font-black text-[#1B254B]">
                  {item.date.slice(0, 10)}
                </Text>
              </View>

              <View className="bg-[#F7F9FF] p-4 rounded-[20px]">
                <Text className="text-[12px] font-bold text-[#707EAE] mb-1">
                  정정 사유
                </Text>
                <Text className="text-[14px] font-medium text-[#1B254B] leading-6">
                  {item.fixReason || "사유 미입력"}
                </Text>
              </View>

              <View className="flex-row items-center justify-between pt-2">
                <Text className="text-[12px] font-bold text-[#A3AED0]">
                  신청일: {item.createdAt?.slice(0, 10)}
                </Text>
                <View className="flex-row items-center bg-gray-50 px-3 py-1.5 rounded-full">
                  <Text className="text-[12px] font-bold text-[#707EAE]">
                    승인자:{" "}
                  </Text>
                  <Text className="text-[12px] font-bold text-[#1B254B]">
                    {item.approverName || "미정"}
                  </Text>
                  <Text className="text-[12px] text-[#A3AED0]">
                    ({item.approverPosition || "팀장"})
                  </Text>
                </View>
              </View>

              {isOwner && item.apprStatus === "PENDING" && (
                <View className="flex-row gap-2 mt-2">
                  <TouchableOpacity
                    onPress={() => onReject?.(item.id)}
                    className="flex-1 py-3.5 bg-[#FFF1F2] rounded-xl items-center"
                  >
                    <Text className="text-[#F43F5E] font-bold text-[13px]">
                      반려
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => onApprove?.(item.id)}
                    className="flex-1 py-3.5 bg-[#4318FF] rounded-xl items-center"
                  >
                    <Text className="text-white font-bold text-[13px]">
                      승인
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

export default AttendanceTable;
