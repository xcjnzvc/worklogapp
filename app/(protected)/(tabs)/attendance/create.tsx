import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, Modal } from "react-native";
import {
  ArrowLeft,
  Clock,
  User,
  ChevronDown,
  Check,
} from "lucide-react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";

import { useCreateFixRequest } from "@/hooks/useAttendance";
import { useVacation } from "@/hooks/useVacation";
import ApproverModal from "@/components/ApproverModal";
import FormLayout from "@/components/FormLayout";
import { Approver } from "@/types/user";

export default function AttendanceCorrectionCreateScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const targetId = (params.id as string) || "NO_DATA_ID";
  const targetDate = (params.date as string) || new Date().toISOString();

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
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);

  const FIX_TYPES = [
    { value: "LATE", label: "지각 정정" },
    { value: "ABSENT", label: "결근/미인식 정정" },
    { value: "EARLY", label: "조퇴 정정" },
    { value: "OTHER", label: "기타 (직접 입력)" },
  ];

  useEffect(() => {
    if (approvers.length > 0 && !selectedApprover) {
      const defaultApprover =
        approvers.find((a) => a.role === "OWNER") || approvers[0];
      setSelectedApprover(defaultApprover);
    }
  }, [approvers, selectedApprover]);

  const handleSubmit = () => {
    if (!targetId || targetId === "NO_DATA_ID")
      return alert("대상을 찾을 수 없습니다.");
    if (fixType === "OTHER" && !reason)
      return alert("기타 사유를 구체적으로 입력해주세요.");
    if (!selectedApprover) return alert("결재권자를 선택해주세요.");
    if (
      !/^\d{2}:\d{2}$/.test(fixClockIn) ||
      !/^\d{2}:\d{2}$/.test(fixClockOut)
    ) {
      return alert("시간 형식은 HH:MM (예: 09:00) 형태로 입력해주세요.");
    }

    const today = new Date().toISOString().split("T")[0];
    const fallbackReason =
      FIX_TYPES.find((t) => t.value === fixType)?.label || "근태 정정 신청";

    const recordDateStr = targetDate.split("T")[0]; // 원래 기록의 날짜(YYYY-MM-DD) 추출

    const requestData = {
      type: fixType,
      reason: reason || fallbackReason,
      fixClockIn: new Date(`${recordDateStr}T${fixClockIn}:00`).toISOString(), // 💡 원래 날짜 유지
      fixClockOut: new Date(`${recordDateStr}T${fixClockOut}:00`).toISOString(), // 💡 원래 날짜 유지
      approverId: selectedApprover.id,
    };

    createFixRequest(
      { id: targetId, data: requestData },
      {
        onSuccess: () => {
          alert("정정 신청이 완료되었습니다.");
          router.replace("/attendance");
        },
        onError: (err: Error) =>
          alert(err.message || "신청 중 오류가 발생했습니다."),
      },
    );
  };

  return (
    <FormLayout
      title="근태 정정 신청"
      onSave={handleSubmit}
      isSubmitting={isSubmitting}
      saveButtonText="요청하기"
    >
      <Stack.Screen options={{ title: "근태 정정 신청" }} />

      {/* 뒤로가기 전용 미니 바 (필요시 노출) */}
      {/* <View className="flex-row items-center gap-4 mb-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-11 h-11 items-center justify-center bg-white rounded-xl border border-gray-100 shadow-sm shadow-gray-200"
        >
          <ArrowLeft size={20} color="#A3AED0" />
        </TouchableOpacity>
        <Text className="text-gray-400 font-medium text-[12px]">
          대상 ID: {targetId.slice(0, 12)}...
        </Text>
      </View> */}

      {/* 1. 정정 정보 입력 섹션 */}
      <View className="bg-white p-5 rounded-2xl shadow-sm shadow-gray-200 mb-3">
        <View className="mb-4">
          <Text className="text-[12px] font-bold text-gray-400 mb-2 uppercase tracking-wider ml-1">
            정정 분류
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setIsTypeDropdownOpen(true)}
            className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-4 flex-row items-center justify-between"
          >
            <Text className="text-[15px] font-semibold text-[#333]">
              {FIX_TYPES.find((t) => t.value === fixType)?.label}
            </Text>
            <ChevronDown size={16} color="#BDBDBD" />
          </TouchableOpacity>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1">
            <Text className="text-[12px] font-bold text-gray-400 mb-2 uppercase tracking-wider ml-1">
              출근 시간 변경
            </Text>
            <View className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-4 flex-row items-center gap-2">
              <Clock size={16} color="#BDBDBD" />
              <TextInput
                value={fixClockIn}
                onChangeText={setFixClockIn}
                placeholder="09:00"
                placeholderTextColor="#BDBDBD"
                className="flex-1 text-[15px] font-semibold text-[#333] py-0"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View className="flex-1">
            <Text className="text-[12px] font-bold text-gray-400 mb-2 uppercase tracking-wider ml-1">
              퇴근 시간 변경
            </Text>
            <View className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-4 flex-row items-center gap-2">
              <Clock size={16} color="#BDBDBD" />
              <TextInput
                value={fixClockOut}
                onChangeText={setFixClockOut}
                placeholder="18:00"
                placeholderTextColor="#BDBDBD"
                className="flex-1 text-[15px] font-semibold text-[#333] py-0"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
      </View>

      {/* 2. 정정 사유 섹션 */}
      <View className="bg-white p-5 rounded-2xl shadow-sm shadow-gray-200 mb-3">
        <View className="flex-row justify-between items-center mb-2 px-1">
          <Text className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">
            정정 사유{" "}
            {fixType === "OTHER" && <Text className="text-red-500">*</Text>}
          </Text>
        </View>
        <TextInput
          multiline
          value={reason}
          onChangeText={setReason}
          placeholder={
            fixType === "OTHER"
              ? "구체적인 사유를 작성해주세요\n(예: 단말기 고장으로 인한 기록 누락)"
              : "추가 전달 사항이 있다면 입력하세요."
          }
          placeholderTextColor="#BDBDBD"
          textAlignVertical="top"
          className="w-full h-24 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-[14px] text-[#333]"
        />
      </View>

      {/* 3. 결재권자 지정 섹션 */}
      <View className="bg-white p-5 rounded-2xl shadow-sm shadow-gray-200 flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-3">
          <View className="w-12 h-12 rounded-xl bg-gray-50 items-center justify-center border border-gray-100">
            <User size={20} color="#0025C3" />
          </View>
          <View>
            <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              승인자
            </Text>
            <View className="flex-row items-center gap-1.5 mt-0.5">
              <Text className="text-[16px] font-semibold text-[#333]">
                {selectedApprover?.name || "로딩 중..."}
              </Text>
              <View className="px-2 py-0.5 bg-gray-100 rounded-full">
                <Text className="text-[10px] font-bold text-gray-500">
                  {selectedApprover?.role === "OWNER" ? "대표" : "팀장"}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => setIsApproverModalOpen(true)}
          className="px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-100"
        >
          <Text className="text-xs font-bold text-[#0025C3]">변경</Text>
        </TouchableOpacity>
      </View>

      {/* 정정 분류 바텀 팝업 */}
      <Modal
        visible={isTypeDropdownOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsTypeDropdownOpen(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setIsTypeDropdownOpen(false)}
          className="flex-1 bg-black/40 justify-end"
        >
          <View className="bg-white rounded-t-[32px] p-6 pb-8">
            <View className="items-center mb-4">
              <View className="w-10 h-1 bg-gray-200 rounded-full" />
            </View>
            <Text className="text-lg font-bold text-[#111] mb-4 ml-1">
              정정 분류 선택
            </Text>

            {FIX_TYPES.map((type) => {
              const isSelected = fixType === type.value;
              return (
                <TouchableOpacity
                  key={type.value}
                  onPress={() => {
                    setFixType(type.value);
                    setIsTypeDropdownOpen(false);
                  }}
                  className={`w-full py-4 px-4 rounded-xl flex-row items-center justify-between mb-1.5 ${
                    isSelected ? "bg-gray-50" : ""
                  }`}
                >
                  <Text
                    className={`text-[15px] font-medium ${isSelected ? "text-[#0025C3] font-bold" : "text-[#333]"}`}
                  >
                    {type.label}
                  </Text>
                  {isSelected && <Check size={18} color="#0025C3" />}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>

      <ApproverModal
        isOpen={isApproverModalOpen}
        onClose={() => setIsApproverModalOpen(false)}
        approvers={approvers}
        onSelect={(approver) => setSelectedApprover(approver)}
        selectedId={selectedApprover?.id}
      />
    </FormLayout>
  );
}
