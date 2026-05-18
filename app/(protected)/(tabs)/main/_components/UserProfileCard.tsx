import React from "react";
import { View, Text } from "react-native";
import { useUserStore } from "@/store/useUserStore";

export default function UserProfileCard() {
  const user = useUserStore((state) => state.user);
  const isRestoring = useUserStore((state) => state.isRestoring);

  // ─── 데이터 복원 중(앱이 켜지면서 SecureStore 읽는 중)일 때 예외 처리 ───
  if (isRestoring) {
    return (
      <View className="bg-[#0023A1] rounded-2xl px-[20px] py-[14px] flex-row items-center w-full justify-center">
        <Text className="text-white opacity-60 text-sm">
          사용자 정보 로딩 중...
        </Text>
      </View>
    );
  }

  // ─── 혹시 유저 정보가 없을 때를 대비한 방어 코드 ───
  if (!user) {
    return (
      <View className="bg-[#0023A1] rounded-2xl px-[20px] py-[14px] flex-row items-center w-full justify-center">
        <Text className="text-white opacity-60 text-sm">
          로그인이 필요합니다.
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-[#0023A1] rounded-2xl px-[20px] py-[14px] flex-row items-center w-full">
      {/* 왼쪽 흰색 원 (프로필 이미지 자리) */}
      <View className="w-[46px] h-[46px] bg-white rounded-full mr-4 shadow-md" />

      {/* 오른쪽 텍스트 영역 */}
      <View>
        {/* 💡 실제 회사 이름 바인딩 */}
        <Text className="text-white text-[13px] font-bold mb-1 opacity-90">
          {user.companyName}
        </Text>

        {/* 이름과 직급/부서 (가로 배치) */}
        <View className="flex-row items-center font-medium">
          {/* 💡 실제 사용자 이름 바인딩 */}
          <Text className="text-white text-[16px] font-bold">{user.name}</Text>
          <Text className="text-gray-300 mx-2 text-[16px]">|</Text>
          {/* 💡 실제 사용자 권한/부서 바인딩 (예시로 role 또는 고정 부서명 사용) */}
          <Text className="text-gray-300 text-[14px]">
            {user.role === "OWNER"
              ? "대표"
              : user.role === "ADMIN"
                ? "관리자"
                : "개발팀"}
          </Text>
        </View>
      </View>
    </View>
  );
}
