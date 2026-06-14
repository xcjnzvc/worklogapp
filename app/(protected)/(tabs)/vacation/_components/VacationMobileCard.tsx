import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react-native";
import { VacationData, VacationTableRow } from "@/types/vacation";

interface VacationMobileCardProps {
  data: VacationTableRow[];
  onItemClick: (item: VacationData) => void;
}

const VacationMobileCard = ({ data, onItemClick }: VacationMobileCardProps) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "APPROVED":
        return {
          bg: "bg-[#E6F8F1]",
          text: "text-[#10B981]",
          icon: CheckCircle2,
          color: "#10B981",
        };
      case "REJECTED":
        return {
          bg: "bg-[#FFF1F2]",
          text: "text-[#F43F5E]",
          icon: XCircle,
          color: "#F43F5E",
        };
      case "PENDING":
        return {
          bg: "bg-[#FFF4E5]",
          text: "text-[#EA580C]",
          icon: AlertCircle,
          color: "#EA580C",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-500",
          icon: AlertCircle,
          color: "#9CA3AF",
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

  if (data.length === 0) {
    return (
      <Text className="py-20 text-center text-[#A3AED0]">
        휴가 내역이 없습니다.
      </Text>
    );
  }

  return (
    <View className="flex-col gap-4">
      {data.map((item) => {
        const statusStyle = getStatusStyle(item.status);
        const typeStyle = getTypeStyle(item.type);
        const StatusIcon = statusStyle.icon;
        const TypeIcon = typeStyle.icon;

        return (
          <TouchableOpacity
            key={item.id}
            onPress={() => onItemClick(item as VacationData)}
            className="bg-white rounded-[32px] p-6 border border-gray-50 shadow-sm"
          >
            <Text className="text-gray-400 font-bold text-[13px] mb-4">
              {item.displayId}
            </Text>

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
                  <Text className="text-gray-900 font-black text-[17px]">
                    {item.formattedPeriod}
                  </Text>
                </View>
              </View>

              <View className="items-end">
                <Text className="text-gray-900 font-black text-[22px] leading-none">
                  {item.durationText}
                </Text>
                <Text className="text-gray-300 font-black text-[10px] tracking-widest mt-1">
                  DAYS
                </Text>
              </View>
            </View>

            <View
              className={`flex-row items-center justify-center py-3 rounded-2xl gap-2 ${statusStyle.bg}`}
            >
              <StatusIcon size={18} color={statusStyle.color} />
              <Text className={`font-bold text-[15px] ${statusStyle.text}`}>
                {item.status === "APPROVED"
                  ? "승인 완료"
                  : item.status === "REJECTED"
                    ? "승인 반려"
                    : "승인 대기"}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default VacationMobileCard;
