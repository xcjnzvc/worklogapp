import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft, User } from "lucide-react-native";
import Toast from "react-native-toast-message";
import Dropdown from "@/components/Dropdown";
import ApproverModal from "@/components/ApproverModal";
import ListPageLayout from "@/components/ListPageLayout";
import { useCreateFixRequest } from "@/hooks/useAttendance";
import { useVacation } from "@/hooks/useVacation";
import { Approver } from "@/types/user";

const FIX_TYPES = [
  { value: "LATE", label: "지각 정정" },
  { value: "ABSENT", label: "결근/미인식 정정" },
  { value: "EARLY", label: "조퇴 정정" },
  { value: "OTHER", label: "기타 (직접 입력)" },
];

export default function AttendanceCorrectionCreatePage() {
  const router = useRouter();
  const { id: targetId } = useLocalSearchParams<{ id: string }>();

  const { useApprovers } = useVacation();
  const { data: approvers = [] } = useApprovers();
  const { mutate: createFixRequest, isPending: isSubmitting } =
    useCreateFixRequest();

  const [fixType, setFixType] = useState("LATE");
  const [fixClockIn, setFixClockIn] = useState("09:00");
  const [fixClockOut, setFixClockOut] = useState("18:00");
  const [reason, setReason] = useState("");
  const [selectedApprover, setSelectedApprover] = useState<Approver | null>(
    null,
  );
  const [isApproverModalOpen, setIsApproverModalOpen] = useState(false);

  useEffect(() => {
    if (approvers.length > 0 && !selectedApprover) {
      setSelectedApprover(
        approvers.find((a: any) => a.role === "OWNER") || approvers[0],
      );
    }
  }, [approvers, selectedApprover]);

  const handleSubmit = () => {
    if (!targetId) {
      Toast.show({ type: "error", text1: "대상을 찾을 수 없습니다." });
      return;
    }
    if (!selectedApprover) {
      Toast.show({ type: "error", text1: "결재권자를 선택해주세요." });
      return;
    }

    const requestData = {
      type: fixType,
      reason: reason || FIX_TYPES.find((t) => t.value === fixType)?.label || "",
      fixClockIn: new Date().toISOString().split("T")[0] + `T${fixClockIn}:00Z`,
      fixClockOut:
        new Date().toISOString().split("T")[0] + `T${fixClockOut}:00Z`,
      approverId: selectedApprover.id,
    };

    createFixRequest(
      { id: targetId as string, data: requestData },
      {
        onSuccess: () => {
          Toast.show({ type: "success", text1: "정정 신청 완료" });
          router.push("/attendance?tab=STATISTICS");
        },
      },
    );
  };

  return (
    <ListPageLayout title="근태 정정 신청">
      <View className="">
        {/* 1. 정정 정보 입력 */}
        <View className="p-2 rounded-[32px] gap-6 mb-6">
          <View className="gap-2">
            <Text className="text-xs font-bold text-[#A3AED0] uppercase ml-1">
              정정 분류
            </Text>
            <Dropdown
              className="h-14 bg-[#F4F7FE] rounded-2xl px-4 border-0"
              value={FIX_TYPES.find((t) => t.value === fixType)?.label || ""}
              options={FIX_TYPES.map((t) => t.label)}
              onSelect={(label) => {
                const val =
                  FIX_TYPES.find((t) => t.label === label)?.value || "LATE";
                setFixType(val);
              }}
            />
          </View>

          <View className="flex-row gap-4">
            <View className="flex-1 gap-2">
              <Text className="text-xs font-bold text-[#A3AED0] uppercase ml-1">
                출근 시간 변경
              </Text>
              <TextInput
                className="bg-[#F4F7FE] h-14 rounded-2xl px-4 text-center font-bold text-[#4318FF]"
                value={fixClockIn}
                onChangeText={setFixClockIn}
              />
            </View>
            <View className="flex-1 gap-2">
              <Text className="text-xs font-bold text-[#A3AED0] uppercase ml-1">
                퇴근 시간 변경
              </Text>
              <TextInput
                className="bg-[#F4F7FE] h-14 rounded-2xl px-4 text-center font-bold text-[#4318FF]"
                value={fixClockOut}
                onChangeText={setFixClockOut}
              />
            </View>
          </View>
        </View>

        {/* 2. 정정 사유 */}
        <View className="p-2 rounded-[32px] gap-2 mb-6">
          <Text className="text-xs font-bold text-[#A3AED0] uppercase ml-1">
            정정 사유
          </Text>
          <TextInput
            className="bg-[#F4F7FE] p-5 rounded-[24px] h-32 text-base font-medium"
            placeholder="구체적인 사유를 작성해주세요."
            multiline
            textAlignVertical="top"
            value={reason}
            onChangeText={setReason}
          />
        </View>

        {/* 3. 결재권자 */}
        <View className="p-6 rounded-[32px] flex-row items-center justify-between mb-8">
          <View className="flex-row items-center gap-4">
            <View className="w-14 h-14 rounded-2xl bg-[#F4F7FE] items-center justify-center">
              <User size={24} color="#4318FF" />
            </View>
            <View>
              <Text className="text-[10px] font-bold text-[#A3AED0] uppercase">
                Final Approver
              </Text>
              <Text className="text-lg font-black text-[#1B254B]">
                {selectedApprover?.name || "로딩 중..."}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setIsApproverModalOpen(true)}
            className="px-5 py-3 bg-[#F4F7FE] rounded-xl"
          >
            <Text className="text-xs font-bold text-[#4318FF]">변경</Text>
          </TouchableOpacity>
        </View>

        {/* 정정 요청 버튼 */}
        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-[#4318FF] py-4 rounded-[20px] items-center mb-10 shadow-lg shadow-indigo-200"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base">
              정정 요청하기
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <ApproverModal
        isOpen={isApproverModalOpen}
        onClose={() => setIsApproverModalOpen(false)}
        approvers={approvers}
        onSelect={(approver: Approver) => setSelectedApprover(approver)}
        selectedId={selectedApprover?.id}
      />
    </ListPageLayout>
  );
}
