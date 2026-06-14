import React from "react";
import { Modal, View, Text, TouchableOpacity, TextInput } from "react-native";
import { X } from "lucide-react-native";

export default function InviteModal({ isOpen, onClose }: any) {
  return (
    <Modal visible={isOpen} animationType="fade" transparent={true}>
      <View className="flex-1 bg-black/50 justify-center p-5">
        <View className="bg-white rounded-[32px] p-6 shadow-2xl">
          <TouchableOpacity
            onPress={onClose}
            className="absolute top-5 right-5 p-2"
          >
            <X size={24} color="#9ca3af" />
          </TouchableOpacity>

          <Text className="text-[20px] font-bold text-center mb-6">
            직원 초대하기
          </Text>

          <Text className="text-xs font-medium text-gray-500 mb-2">이메일</Text>
          <TextInput
            className="bg-gray-50 h-12 rounded-2xl px-4 mb-6 border border-gray-200"
            placeholder="이메일 입력"
          />

          <Text className="text-xs font-medium text-gray-500 mb-2">직위</Text>
          <View className="flex-row gap-3 mb-8">
            <TouchableOpacity className="flex-1 h-12 bg-blue-50 rounded-2xl items-center justify-center border border-blue-600">
              <Text className="font-bold text-blue-700">관리자</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 h-12 bg-white rounded-2xl items-center justify-center border border-gray-200">
              <Text className="font-bold text-gray-600">직원</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity className="bg-[#0029C0] h-14 rounded-2xl items-center justify-center">
            <Text className="text-white font-bold text-base">
              초대 링크 발행
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
