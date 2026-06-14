import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { X } from "lucide-react-native";

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rejectReason: string) => void;
}

export function RejectModal({ isOpen, onClose, onSubmit }: RejectModalProps) {
  const [rejectReason, setRejectReason] = useState("");

  const handleSubmitClick = () => {
    onSubmit(rejectReason.trim());
    setRejectReason("");
  };

  const handleCloseClick = () => {
    setRejectReason("");
    onClose();
  };

  return (
    <Modal visible={isOpen} transparent animationType="fade">
      {/* 배경 어둡게 처리 */}
      <View className="flex-1 bg-black/40 items-center justify-center p-4">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="w-full"
        >
          <View className="bg-white w-full rounded-[24px] p-6 shadow-xl">
            {/* 헤더 */}
            <View className="flex-row justify-between items-center border-b border-gray-100 pb-3 mb-4">
              <Text className="text-lg font-black text-[#1B254B]">
                휴가 신청 반려
              </Text>
              <TouchableOpacity onPress={handleCloseClick}>
                <X size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* 입력 영역 */}
            <View className="mb-4">
              <Text className="text-xs font-bold text-[#707EAE] mb-2">
                반려 사유 입력 (선택)
              </Text>
              <TextInput
                value={rejectReason}
                onChangeText={setRejectReason}
                placeholder="반려 사유를 입력하세요."
                maxLength={200}
                multiline
                className="w-full h-[100px] p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-[#1B254B] text-top"
                textAlignVertical="top"
              />
              <Text className="text-right text-[11px] font-medium text-gray-400 mt-1">
                {rejectReason.length} / 200자
              </Text>
            </View>

            {/* 버튼 영역 */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={handleCloseClick}
                className="flex-1 py-4 bg-gray-100 rounded-2xl items-center"
              >
                <Text className="font-bold text-sm text-gray-600">취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmitClick}
                className="flex-1 py-4 bg-[#EE5D50] rounded-2xl items-center"
              >
                <Text className="font-bold text-sm text-white">반려 확정</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
