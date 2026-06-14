import React from "react";
import { View, Text } from "react-native";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react-native";

export type ApprovalStatus = "APPROVED" | "REJECTED" | "PENDING";

interface StatusBadgeProps {
  status: ApprovalStatus | string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const upperStatus = status?.toUpperCase();

  // 💡 '승인'이라는 범용적인 단어로 통일하여 결재가 필요한 모든 화면에서 공유합니다.
  const getStyle = () => {
    switch (upperStatus) {
      case "APPROVED":
        return {
          bg: "bg-[#E6F8F1]",
          text: "text-[#10B981]",
          hexColor: "#10B981",
          icon: CheckCircle2,
          label: "승인 완료",
        };
      case "REJECTED":
        return {
          bg: "bg-[#FFF1F2]",
          text: "text-[#F43F5E]",
          hexColor: "#F43F5E",
          icon: XCircle,
          label: "승인 반려",
        };
      case "PENDING":
      default:
        return {
          bg: "bg-[#FFF4E5]",
          text: "text-[#EA580C]",
          hexColor: "#EA580C",
          icon: AlertCircle,
          label: "승인 대기",
        };
    }
  };

  const currentStyle = getStyle();
  const Icon = currentStyle.icon;

  return (
    <View
      className={`w-full flex-row items-center justify-center py-3 rounded-2xl ${currentStyle.bg}`}
    >
      <Icon size={16} color={currentStyle.hexColor} />
      <Text className={`ml-2 font-medium text-[14px] ${currentStyle.text}`}>
        {currentStyle.label}
      </Text>
    </View>
  );
}
