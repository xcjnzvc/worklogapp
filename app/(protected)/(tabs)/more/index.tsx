import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import {
  Briefcase,
  FileText,
  Calendar,
  Award,
  CreditCard,
  Gift,
  ChevronRight,
  User,
  LogOut,
} from "lucide-react-native";
import { router } from "expo-router";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";

export default function MoreScreen() {
  const { logout } = useAuthStore();
  const { user } = useUserStore();

  // 준비 중인 기능 알림
  const handleNotReady = (label: string) => {
    Alert.alert("알림", `${label} 기능은 현재 준비 중입니다.`);
  };

  const handleLogout = () => {
    Alert.alert("로그아웃", "정말 로그아웃 하시겠어요?", [
      { text: "취소", style: "cancel" },
      {
        text: "로그아웃",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)");
        },
      },
    ]);
  };

  const MENU_SECTIONS = [
    {
      title: "업무",
      data: [
        {
          label: "내 프로젝트",
          icon: Briefcase,
          bgColor: "#EEF2FF",
          iconColor: "#6366F1",
        },
        {
          label: "업무 일지",
          icon: FileText,
          bgColor: "#F0FDF4",
          iconColor: "#22C55E",
        },
      ],
    },
    {
      title: "근태 관리",
      data: [
        {
          label: "연차 내역",
          icon: Calendar,
          bgColor: "#FFF7ED",
          iconColor: "#F97316",
        },
        {
          label: "증명서 발급",
          icon: Award,
          bgColor: "#FAF5FF",
          iconColor: "#A855F7",
        },
      ],
    },
    {
      title: "금융",
      data: [
        {
          label: "급여 명세서",
          icon: CreditCard,
          bgColor: "#ECFEFF",
          iconColor: "#06B6D4",
        },
        {
          label: "복지 포인트",
          icon: Gift,
          bgColor: "#FFF1F2",
          iconColor: "#F43F5E",
        },
      ],
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FA]">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10 }}
      >
        {/* 프로필 섹션 - 실제 유저 데이터 바인딩 */}
        <TouchableOpacity
          activeOpacity={0.9}
          className="bg-white rounded-[32px] p-6 mb-10 flex-row items-center"
        >
          <View className="w-16 h-16 rounded-full bg-[#2357E5] items-center justify-center">
            <User size={30} color="white" />
          </View>

          <View className="ml-5 flex-1">
            <View className="bg-blue-100 self-start px-2 py-0.5 rounded-md mb-1">
              <Text className="text-[10px] font-bold text-[#2357E5]">
                {user?.role || "직원"}
              </Text>
            </View>
            <Text className="text-xl font-bold text-gray-900 leading-tight">
              {user?.name || "사용자"}
            </Text>
            <Text className="text-sm text-gray-500 font-medium">
              {user?.companyName || "소속 정보 없음"}
            </Text>
          </View>
          <ChevronRight size={18} color="#D1D5DB" />
        </TouchableOpacity>

        {/* 그리드 메뉴 섹션 */}
        <View className="space-y-10">
          {MENU_SECTIONS.map((section, idx) => (
            <View key={idx} className="mb-2">
              <Text className="text-[14px] font-bold text-gray-400 mb-5 ml-1">
                {section.title}
              </Text>
              <View className="flex-row flex-wrap justify-between">
                {section.data.map((item) => (
                  <TouchableOpacity
                    key={item.label}
                    activeOpacity={0.7}
                    style={{ width: "48%" }}
                    className="p-5 bg-white border border-gray-100 rounded-[28px] mb-4 shadow-sm"
                    onPress={() => handleNotReady(item.label)}
                  >
                    <View
                      className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: item.bgColor }}
                    >
                      <item.icon
                        size={20}
                        color={item.iconColor}
                        strokeWidth={2.5}
                      />
                    </View>
                    <Text className="text-[15px] font-bold text-gray-800">
                      {item.label}
                    </Text>
                    <Text className="text-[11px] text-gray-400 mt-1 font-medium">
                      준비 중
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* 로그아웃 */}
        <TouchableOpacity
          onPress={handleLogout}
          className="mt-4 mb-10 pt-6 border-t border-gray-100 flex-row justify-center items-center"
        >
          <LogOut size={16} color="#9CA3AF" />
          <Text className="text-sm text-gray-400 font-semibold ml-2">
            로그아웃
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
