import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react-native";
import { Calendar } from "react-native-calendars";
import FormLayout from "@/components/FormLayout";
import ApproverModal from "@/components/ApproverModal";
import Dropdown from "@/components/Dropdown";
import { useVacation } from "@/hooks/useVacation";
import { Approver } from "@/types/user";

// 이 화면에서만 쓰는 옵션 목록은 화면 파일에서 직접 정의
const LEAVE_TYPES = [
  "연차",
  "오전 반차",
  "오후 반차",
  "병가",
  "경조사",
  "기타",
];

const LEAVE_TYPE_TO_ENUM = {
  연차: "ANNUAL",
  "오전 반차": "HALF",
  "오후 반차": "HALF",
  병가: "SICK",
  경조사: "EVENT",
  기타: "OTHER",
} as const;

export default function VacationCreateScreen() {
  const router = useRouter();

  const { useCreateVacation, useApprovers } = useVacation();
  const { data: approvers = [] } = useApprovers();
  const { mutate: createVacation, isPending } = useCreateVacation();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [leaveType, setLeaveType] = useState("연차");

  const [selectedApprover, setSelectedApprover] = useState<Approver | null>(
    null,
  );
  const [isApproverModalOpen, setIsApproverModalOpen] = useState(false);

  const [showCalendar, setShowCalendar] = useState(false);
  const [rangeStart, setRangeStart] = useState<string | null>(null);
  const [rangeEnd, setRangeEnd] = useState<string | null>(null);
  const [selectingMode, setSelectingMode] = useState<"start" | "end">("start");

  useEffect(() => {
    if (approvers.length > 0 && !selectedApprover) {
      const defaultApprover =
        approvers.find((a) => a.role === "OWNER") || approvers[0];
      setSelectedApprover(defaultApprover);
    }
  }, [approvers, selectedApprover]);

  const displayDate = (dateString: string | null) => {
    if (!dateString) return "YYYY.MM.DD";
    return dateString.replace(/-/g, ".");
  };

  const handleDayPress = (day: any) => {
    if (selectingMode === "start") {
      setRangeStart(day.dateString);
      setRangeEnd(null);
      setSelectingMode("end");
    } else {
      if (rangeStart && day.dateString >= rangeStart) {
        setRangeEnd(day.dateString);
        setShowCalendar(false);
        setSelectingMode("start");
      } else {
        setRangeStart(day.dateString);
        setSelectingMode("end");
      }
    }
  };

  const getMarkedDates = () => {
    const marked: any = {};
    const today = new Date().toISOString().split("T")[0];
    marked[today] = { marked: true, dotColor: "#0029C0" };

    if (rangeStart)
      marked[rangeStart] = {
        ...marked[rangeStart],
        startingDay: true,
        color: "#0029C0",
        textColor: "white",
      };
    if (!rangeStart || !rangeEnd) return marked;

    marked[rangeEnd] = {
      ...marked[rangeEnd],
      endingDay: true,
      color: "#0029C0",
      textColor: "white",
    };

    let current = new Date(rangeStart);
    let end = new Date(rangeEnd);
    current.setDate(current.getDate() + 1);
    while (current < end) {
      const date = current.toISOString().split("T")[0];
      marked[date] = { ...marked[date], color: "#DCE7FF", textColor: "#111" };
      current.setDate(current.getDate() + 1);
    }
    return marked;
  };

  const handleSave = () => {
    if (!title.trim()) return Alert.alert("확인", "제목을 입력해주세요.");
    if (!rangeStart || !rangeEnd)
      return Alert.alert("확인", "휴가 기간을 선택해주세요.");
    if (!content.trim())
      return Alert.alert("확인", "신청 사유를 입력해주세요.");
    if (!selectedApprover)
      return Alert.alert("확인", "결재권자를 선택해주세요.");

    const isHalfLeave = leaveType.includes("반차");
    const timeDetail = isHalfLeave
      ? leaveType.includes("오전")
        ? "AM"
        : "PM"
      : null;

    const payload = {
      title: title.trim(),
      type:
        LEAVE_TYPE_TO_ENUM[leaveType as keyof typeof LEAVE_TYPE_TO_ENUM] ||
        "ANNUAL",
      startDate: rangeStart,
      endDate: rangeEnd,
      reason: content.trim(),
      timeDetail: timeDetail,
      approverId: selectedApprover.id,
    };

    createVacation(payload as any, {
      onSuccess: () => {
        Alert.alert("성공", "휴가 신청이 완료되었습니다.", [
          { text: "확인", onPress: () => router.back() },
        ]);
      },
      onError: (error: any) => {
        Alert.alert(
          "오류",
          error.message || "휴가 신청 중 문제가 발생했습니다.",
        );
      },
    });
  };

  return (
    <FormLayout
      title="휴가 신청"
      onSave={handleSave}
      isSubmitting={isPending}
      saveButtonText="신청하기"
    >
      <Stack.Screen options={{ title: "휴가 신청" }} />

      {/* 1. 제목 입력창 */}
      <View className="bg-white rounded-[10px] px-4 mb-3 shadow-sm shadow-gray-200">
        <TextInput
          placeholder="제목을 입력해주세요"
          placeholderTextColor="#BDBDBD"
          value={title}
          onChangeText={setTitle}
          className="h-[50px] text-[14px] text-[#333]"
        />
      </View>

      {/* 2. 휴가 종류 및 승인자 선택 단락 */}
      <View className="flex-row gap-x-2.5 mb-3">
        <Dropdown
          value={leaveType}
          options={LEAVE_TYPES}
          onSelect={setLeaveType}
        />

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setIsApproverModalOpen(true)}
          className="flex-1 bg-white h-14 rounded-2xl px-4 flex-row justify-between items-center shadow-sm shadow-gray-200"
        >
          <View className="flex-row items-center gap-1.5">
            <Text className="text-[#333] font-semibold text-[15px]">
              {selectedApprover?.name || "로딩 중..."}
            </Text>
            {selectedApprover && (
              <View className="px-2 py-0.5 bg-gray-100 rounded-full">
                <Text className="text-[10px] font-bold text-gray-500">
                  {selectedApprover.role === "OWNER" ? "대표" : "팀장"}
                </Text>
              </View>
            )}
          </View>
          <ChevronDown size={16} color="#BDBDBD" />
        </TouchableOpacity>
      </View>

      {/* 3. 날짜 및 달력 선택 단락 */}
      <View className="bg-white rounded-2xl px-4 py-4 mb-3 shadow-sm shadow-gray-200">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setShowCalendar(!showCalendar)}
          className="flex-row items-center"
        >
          <CalendarIcon size={18} color="#BDBDBD" />
          <View className="flex-row flex-1 ml-3 items-center">
            <Text
              className={`${rangeStart ? "text-[#333]" : "text-[#BDBDBD]"}`}
            >
              {displayDate(rangeStart)}
            </Text>
            <Text className="text-[#BDBDBD] mx-2">-</Text>
            <Text className={`${rangeEnd ? "text-[#333]" : "text-[#BDBDBD]"}`}>
              {displayDate(rangeEnd)}
            </Text>
          </View>
        </TouchableOpacity>
        {showCalendar && (
          <View className="mt-4 border-t border-gray-100 pt-4">
            <View className="w-full">
              <Calendar
                markingType="period"
                markedDates={getMarkedDates()}
                onDayPress={handleDayPress}
                theme={{ todayTextColor: "#0029C0", arrowColor: "#0029C0" }}
              />
            </View>
          </View>
        )}
      </View>

      {/* 4. 내용 입력창 (사유) */}
      <View className="bg-white rounded-3xl p-5 shadow-sm shadow-gray-200 mb-4">
        <TextInput
          placeholder="내용을 입력해주세요 (신청 사유)"
          placeholderTextColor="#BDBDBD"
          multiline
          value={content}
          onChangeText={setContent}
          textAlignVertical="top"
          className="text-[14px] text-[#333] leading-5"
          style={{ minHeight: 180, maxHeight: 250 }}
        />
      </View>

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
