import React from "react";
import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";

interface InviteLinkCardProps {
  inviteLink: string;
  expiresAt: string;
  onReset: () => void;
}

export default function InviteLinkCard({
  inviteLink,
  expiresAt,
  onReset,
}: InviteLinkCardProps) {
  const handleCopy = async () => {
    await Clipboard.setStringAsync(inviteLink);
    Alert.alert("알림", "링크가 복사되었습니다!");
  };

  return (
    <View className="w-full bg-white border border-gray-100 rounded-[20px] p-8 shadow-sm items-center">
      <View className="w-16 h-16 bg-blue-50 rounded-full items-center justify-center mb-6">
        <Text className="text-3xl">✉️</Text>
      </View>
      <Text className="text-xl font-bold text-gray-900 mb-3">
        초대 링크 생성 완료
      </Text>
      <Text className="text-gray-500 text-center mb-8 leading-6">
        팀원에게 링크를 전달해 주세요.
      </Text>

      <View className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 mb-4">
        <Text className="text-xs font-bold text-blue-600 mb-2 uppercase">
          Invite Link
        </Text>
        <View className="flex-row items-center justify-between">
          <TextInput
            value={inviteLink}
            editable={false}
            className="flex-1 text-sm text-gray-700"
          />
          <TouchableOpacity onPress={handleCopy}>
            <Text className="text-sm font-bold text-blue-700">복사</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={onReset} className="mt-4">
        <Text className="text-gray-400 font-bold">새로 만들기</Text>
      </TouchableOpacity>
    </View>
  );
}
