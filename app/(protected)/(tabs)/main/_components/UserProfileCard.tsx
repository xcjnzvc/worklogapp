import React from "react";
import { View, Text } from "react-native";

export default function UserProfileCard() {
  return (
    <View className="bg-[#0023A1] rounded-2xl px-[20px] py-[14px] flex-row items-center w-full">
      {/* 왼쪽 흰색 원 (프로필 이미지 자리) */}
      <View className="w-[46px] h-[46px] bg-white rounded-full mr-4 shadow-md" />

      {/* 오른쪽 텍스트 영역 */}
      <View>
        {/* 회사 이름 */}
        <Text className="text-white text-[13px] font-bold mb-1 opacity-90">
          회사이름
        </Text>

        {/* 이름과 부서명 (가로 배치) */}
        <View className="flex-row items-center font-medium">
          <Text className="text-white text-[16px] ">강수정</Text>
          <Text className="text-gray-300 mx-2 text-[16px]">|</Text>
          <Text className="text-gray-300 text-[14px]">개발팀</Text>
        </View>
      </View>
    </View>
  );
}
