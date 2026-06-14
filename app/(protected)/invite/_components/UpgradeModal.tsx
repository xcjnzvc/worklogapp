import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { X, Zap } from "lucide-react-native";

export default function UpgradeModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal visible={isOpen} transparent animationType="fade">
      <View className="flex-1 bg-black/50 justify-center items-center p-6">
        <View className="bg-white w-full rounded-3xl p-6">
          <TouchableOpacity onPress={onClose} className="self-end">
            <X size={24} color="#666" />
          </TouchableOpacity>
          <View className="items-center py-4">
            <View className="w-12 h-12 bg-blue-50 rounded-2xl items-center justify-center mb-4">
              <Zap size={24} color="#0029C0" />
            </View>
            <Text className="text-lg font-black mb-2">
              플랜 업그레이드 필요
            </Text>
            <Text className="text-gray-500 text-center">
              더 많은 팀원을 초대하려면 플랜을 업그레이드해주세요.
            </Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            className="bg-blue-600 p-4 rounded-2xl mt-4"
          >
            <Text className="text-white font-bold text-center">확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
