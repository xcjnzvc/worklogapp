// import { View, Text, Image } from "react-native";
// import MenuIcon from "@/assets/icon/menu.svg";
// import AlarmIcon from "@/assets/icon/alarm-bell.svg";
// import SettingIcon from "@/assets/icon/setting.svg";

// export default function Header() {
//   return (
//     <View className="w-full pt-[50px] pb-[20px]  flex-row items-center justify-between px-4 rounded-bl-[12px] rounded-br-[12px]">
//       <Text className=" font-extrabold text-[18px]">WorkLog</Text>
//       <View className="flex-row gap-[14px]">
//         <AlarmIcon width={22} height={22} />
//         <SettingIcon width={22} height={22} />
//       </View>
//     </View>
//   );
// }

// import React from "react";
// import { View, Text } from "react-native";
// import { useSegments } from "expo-router";
// import AlarmIcon from "@/assets/icon/alarm-bell.svg";
// import SettingIcon from "@/assets/icon/setting.svg";

// export default function Header() {
//   const segments = useSegments();

//   // segments는 경로 배열입니다. 예: ["(protected)", "(tabs)", "main"]
//   // 현재 활성화된 탭 이름을 가져옵니다.
//   const currentTab = segments[segments.length - 1];

//   // 더보기(more) 탭일 때는 헤더를 아예 렌더링하지 않음
//   // if (currentTab === "more") return null;

//   // 탭 이름에 따른 한글 타이틀 매핑
//   const getTitle = (tab: string) => {
//     switch (tab) {
//       case "main":
//         return "홈";
//       case "vacation":
//         return "휴가 관리";
//       case "calendar":
//         return "일정";
//       case "attendance":
//         return "근태 관리";
//       case "more":
//         return "더보기";
//       default:
//         return "WorkLog";
//     }
//   };

//   return (
//     <View className="w-full pt-[50px] pb-[20px]  flex-row items-center justify-between px-4 rounded-bl-[12px] rounded-br-[12px]">
//       <Text className="text-[22px] font-bold text-gray-900">
//         {getTitle(currentTab)}
//       </Text>
//       <View className="flex-row gap-[14px]">
//         <AlarmIcon width={22} height={22} />
//         <SettingIcon width={22} height={22} />
//       </View>
//     </View>
//   );
// }

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

  return (
    <View className="w-full pt-[60px] pb-[20px] bg-[#F8F9FA] flex-row items-center justify-between px-4">
      {/* 왼쪽: 로고 또는 뒤로가기 버튼 */}
      <View>
        {showBackButton ? (
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
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
