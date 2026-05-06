import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ReadyComponentProps {
  iconName?: keyof typeof Ionicons.glyphMap;
  title?: string;
  description?: string;
}

export default function ReadyComponent({
  iconName = "construct-outline", // 기본 아이콘: 건설/수리 중
  title = "서비스 준비 중입니다",
  description = "더 나은 서비스를 위해 열심히 만들고 있어요.\n잠시만 기다려주세요!",
}: ReadyComponentProps) {
  return (
    <View className="flex-1 items-center justify-center p-10">
      {/* 배경 원형 장식 */}
      <View className="w-24 h-24 bg-gray-50 rounded-full items-center justify-center mb-6">
        <Ionicons name={iconName} size={48} color="#0029C0" />
      </View>

      {/* 텍스트 영역 */}
      <Text className="text-2xl font-black text-gray-900 mb-3 text-center">
        {title}
      </Text>
      <Text className="text-base text-gray-400 text-center leading-6">
        {description}
      </Text>

      {/* 하단 데코레이션 (선택 사항) */}
      <View className="mt-10 px-6 py-2 bg-gray-100 rounded-full">
        <Text className="text-xs font-bold text-gray-500">COMING SOON</Text>
      </View>
    </View>
  );
}
