// components/Header.tsx
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import AlarmIcon from "@/assets/icon/alarm-bell.svg";
import SettingIcon from "@/assets/icon/setting.svg";

interface HeaderProps {
  showBackButton?: boolean;
}

export default function Header({ showBackButton }: HeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    // 뒤로 갈 곳이 있는지 확인하고 처리
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/main"); // 뒤로 갈 곳이 없으면 메인으로 이동
    }
  };

  return (
    <View className="w-full pt-[60px] pb-[20px] bg-[#F8F9FA] flex-row items-center justify-between px-4">
      {/* 왼쪽: 로고 또는 뒤로가기 버튼 */}
      <View>
        {showBackButton ? (
          <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
            <ChevronLeft size={28} color="#000" />
          </TouchableOpacity>
        ) : (
          <Text className="font-extrabold text-[20px]">WorkLog</Text>
        )}
      </View>

      {/* 오른쪽: 알림 및 설정 아이콘 */}
      <View className="flex-row gap-[14px]">
        <AlarmIcon width={22} height={22} />
        <SettingIcon width={22} height={22} />
      </View>
    </View>
  );
}
