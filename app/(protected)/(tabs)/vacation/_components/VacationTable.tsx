import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react-native";
import { VacationTableRow } from "@/types/vacation";

interface VacationTableProps {
  data: VacationTableRow[];
  onItemClick: (item: any) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

const VacationTable = ({
  data,
  onItemClick,
  onApprove,
  onReject,
}: VacationTableProps) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "APPROVED":
        return {
          bg: "bg-[#E6F8F1]",
          text: "text-[#10B981]",
          icon: CheckCircle2,
          color: "#10B981",
          label: "승인 완료",
        };
      case "REJECTED":
        return {
          bg: "bg-[#FFF1F2]",
          text: "text-[#F43F5E]",
          icon: XCircle,
          color: "#F43F5E",
          label: "승인 반려",
        };
      case "PENDING":
        return {
          bg: "bg-[#FFF4E5]",
          text: "text-[#EA580C]",
          icon: AlertCircle,
          color: "#EA580C",
          label: "승인 대기",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-500",
          icon: AlertCircle,
          color: "#9CA3AF",
          label: "상태 없음",
        };
    }
  };

  const getTypeStyle = (type: string) => {
    return type === "ANNUAL"
      ? {
          iconBg: "#E0EDFF",
          iconColor: "#2357E5",
          icon: Calendar,
          label: "연차",
        }
      : { iconBg: "#FFF9E5", iconColor: "#F59E0B", icon: Clock, label: "반차" };
  };

  return (
    <View className="pb-4">
      {data.map((item, index) => {
        console.log(`[Item ${index}]`, item);
        const statusStyle = getStatusStyle(item.status);
        const typeStyle = getTypeStyle(item.type);
        const StatusIcon = statusStyle.icon;
        const TypeIcon = typeStyle.icon;

        const showActions =
          !!onApprove && !!onReject && item.status === "PENDING";

        return (
          <TouchableOpacity
            key={item.id}
            onPress={() => onItemClick(item)}
            className="bg-white rounded-[32px] p-6 mb-4 border border-gray-50 shadow-sm"
          >
            {/* NO. 번호 및 승인 대기 태그 영역 */}
            <View className="flex-row justify-between items-center mb-[20px]">
              <Text className="text-[12px] font-bold text-[#A3AED0] tracking-wider uppercase">
                NO. {String(index + 1).padStart(3, "0")}
              </Text>

              {/* 승인 대기 태그: Owner/User 구분 없이 승인 대기일 때만 상단에 표시 */}
              {item.status === "PENDING" && (
                <View className="bg-[#FFF8E7] px-3 py-1 rounded-full">
                  <Text className="text-[11px] font-black text-[#FFA800]">
                    승인 대기
                  </Text>
                </View>
              )}
            </View>

            {/* 본문 영역 */}
            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-row items-center gap-4">
                <View
                  className="w-14 h-14 rounded-2xl items-center justify-center"
                  style={{ backgroundColor: typeStyle.iconBg }}
                >
                  <TypeIcon size={26} color={typeStyle.iconColor} />
                </View>
                <View>
                  <Text className="text-gray-400 font-bold text-[14px] mb-1">
                    {typeStyle.label}
                  </Text>
                  <Text className="text-gray-900 font-bold text-[14px]">
                    {item.startDate} ~ {item.endDate}
                  </Text>
                </View>
              </View>

              <View className="items-end">
                <Text className="text-gray-900 font-black text-[22px] leading-none">
                  {(item.durationText || "1.0").replace("일", "")}
                </Text>
                <Text className="text-gray-300 font-black text-[10px] tracking-widest mt-1">
                  DAYS
                </Text>
              </View>
            </View>

            {/* Owner 전용 액션 버튼: 승인 대기 중일 때 표시 */}
            {showActions ? (
              <View className="flex-row gap-2 mt-2">
                <TouchableOpacity
                  onPress={() => onReject(item.id)}
                  className="flex-1 py-3.5 bg-[#FFF1F2] rounded-2xl items-center justify-center"
                >
                  <Text className="font-bold text-[#F43F5E] text-sm">반려</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onApprove(item.id)}
                  className="flex-1 py-3.5 bg-[#4318FF] rounded-2xl items-center justify-center"
                >
                  <Text className="font-bold text-white text-sm">승인</Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* Owner가 아니거나 승인 대기 상태가 아닐 때만 상태바 표시 */
              <View
                className={`flex-row items-center justify-center py-3 rounded-2xl gap-2 ${statusStyle.bg}`}
              >
                <StatusIcon size={18} color={statusStyle.color} />
                <Text className={`font-medium text-[14px] ${statusStyle.text}`}>
                  {statusStyle.label}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default VacationTable;
