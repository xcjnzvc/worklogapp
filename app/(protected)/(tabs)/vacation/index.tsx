"use client";

import React from "react";
import { View, ActivityIndicator } from "react-native";
import { useUserStore } from "@/store/useUserStore";
import UserVacationPage from "./_views/UserVacationPage";
import AdminVacationPage from "./_views/AdminVacationPage";
import OwnerVacationPage from "./_views/OwnerVacationPage";

export default function VacationPage() {
  const { user, isLoading } = useUserStore();

  // 1. 로딩 중일 때 (앱에서는 로딩 인디케이터가 필수입니다)
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#0029C0" />
      </View>
    );
  }

  // 2. 유저 정보가 없을 때
  if (!user) return null;

  // 3. 역할별 뷰 분기
  switch (user.role) {
    case "OWNER":
      return <OwnerVacationPage />;
    case "ADMIN":
      return <AdminVacationPage />;
    default:
      return <UserVacationPage />;
  }
}
