// import React from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   SectionList,
//   SafeAreaView,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";

// // 메뉴 데이터 구성
// const MENU_SECTIONS = [
//   {
//     id: "profile",
//     title: "",
//     data: [],
//   },
//   {
//     id: "work",
//     title: "업무 관리",
//     data: [
//       { label: "내 프로젝트", route: "projects", icon: "briefcase-outline" },
//       { label: "업무 일지", route: "work-log", icon: "document-text-outline" },
//     ],
//   },
//   {
//     id: "leave",
//     title: "근태 및 휴가",
//     data: [
//       {
//         label: "연차 내역 조회",
//         route: "vacation-history",
//         icon: "calendar-outline",
//       },
//       { label: "증명서 발급", route: "certificates", icon: "ribbon-outline" },
//     ],
//   },
//   {
//     id: "finance",
//     title: "급여 및 복지",
//     data: [
//       { label: "급여 명세서", route: "payslip", icon: "card-outline" },
//       { label: "복지 포인트", route: "points", icon: "gift-outline" },
//     ],
//   },
// ];

// export default function More() {
//   const router = useRouter();

//   // 사용자 정보
//   const userInfo = {
//     name: "김민수",
//     company: "(주)데브코리아",
//     team: "플랫폼 개발팀",
//     rank: "과장",
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <SectionList
//         sections={MENU_SECTIONS}
//         keyExtractor={(item) => item.route}
//         stickySectionHeadersEnabled={false}
//         renderSectionHeader={({ section }) => {
//           if (section.id === "profile") {
//             return (
//               <TouchableOpacity
//                 style={styles.profileContainer}
//                 onPress={() => router.push("/more/profile-edit")}
//                 activeOpacity={0.7}
//               >
//                 <View style={styles.avatar}>
//                   <Text style={styles.avatarText}>{userInfo.name[0]}</Text>
//                 </View>

//                 <View style={styles.userInfoTextContainer}>
//                   <View style={styles.nameRow}>
//                     <Text style={styles.userName}>{userInfo.name}</Text>
//                     <View style={styles.rankBadge}>
//                       <Text style={styles.rankText}>{userInfo.rank}</Text>
//                     </View>
//                   </View>
//                   <Text style={styles.userSubInfo}>
//                     {userInfo.company} · {userInfo.team}
//                   </Text>
//                 </View>

//                 <Ionicons name="chevron-forward" size={20} color="#ADB5BD" />
//               </TouchableOpacity>
//             );
//           }

//           return section.title ? (
//             <View style={styles.sectionHeader}>
//               <Text style={styles.sectionHeaderText}>{section.title}</Text>
//             </View>
//           ) : null;
//         }}
//         renderItem={({ item, section }) => {
//           if (section.id === "profile") return null;

//           return (
//             <TouchableOpacity
//               style={styles.menuItem}
//               onPress={() => router.push(`/more/${item.route}`)}
//               activeOpacity={0.6}
//             >
//               <View style={styles.menuLabelContainer}>
//                 <View style={styles.iconWrapper}>
//                   <Ionicons name={item.icon as any} size={18} color="#0029C0" />
//                 </View>
//                 <Text style={styles.menuLabel}>{item.label}</Text>
//               </View>
//               <Ionicons name="chevron-forward" size={16} color="#C4C4C4" />
//             </TouchableOpacity>
//           );
//         }}
//         contentContainerStyle={styles.scrollContent}
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F8F9FA",
//   },
//   scrollContent: {
//     paddingBottom: 40,
//   },
//   // --- 프로필 섹션 수정된 스타일 ---
//   profileContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     marginHorizontal: 16,
//     marginTop: 20,
//     padding: 20,
//     borderRadius: 24,
//     borderWidth: 1,
//     borderColor: "#EEF0F2",
//     // 약간의 그림자 추가
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.03,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   avatar: {
//     width: 60,
//     height: 60,
//     borderRadius: 18,
//     backgroundColor: "#0029C0",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   avatarText: {
//     color: "#fff",
//     fontSize: 24,
//     fontWeight: "bold",
//   },
//   userInfoTextContainer: {
//     flex: 1,
//     marginLeft: 16,
//   },
//   nameRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 4,
//   },
//   userName: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#111",
//     marginRight: 8,
//   },
//   rankBadge: {
//     backgroundColor: "#F0F4FF",
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 6,
//   },
//   rankText: {
//     fontSize: 11,
//     color: "#0029C0",
//     fontWeight: "700",
//   },
//   userSubInfo: {
//     fontSize: 13,
//     color: "#6C757D",
//   },
//   // ---------------------------
//   sectionHeader: {
//     paddingHorizontal: 24,
//     paddingTop: 24,
//     paddingBottom: 10,
//   },
//   sectionHeaderText: {
//     fontSize: 13,
//     color: "#A0A0A0",
//     fontWeight: "bold",
//     letterSpacing: 0.5,
//   },
//   menuItem: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 24,
//     paddingVertical: 18,
//     backgroundColor: "#fff",
//     borderBottomWidth: 1,
//     borderBottomColor: "#F1F3F5",
//   },
//   menuLabelContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   iconWrapper: {
//     width: 32,
//     height: 32,
//     borderRadius: 10,
//     backgroundColor: "#F5F8FF",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 14,
//   },
//   menuLabel: {
//     fontSize: 16,
//     color: "#333",
//     fontWeight: "500",
//   },
// });

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

export default function MoreScreen() {
  const { logout } = useAuthStore();

  const userInfo = {
    name: "강수정",
    company: "테크이노베이션 (주)",
    team: "개발팀",
    rank: "선임 연구원",
  };

  const MENU_SECTIONS = [
    {
      title: "업무",
      data: [
        {
          label: "내 프로젝트",
          route: "projects",
          icon: Briefcase,
          bgColor: "#EEF2FF",
          iconColor: "#6366F1",
        },
        {
          label: "업무 일지",
          route: "work-log",
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
          route: "vacation-history",
          icon: Calendar,
          bgColor: "#FFF7ED",
          iconColor: "#F97316",
        },
        {
          label: "증명서 발급",
          route: "certificates",
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
          route: "payslip",
          icon: CreditCard,
          bgColor: "#ECFEFF",
          iconColor: "#06B6D4",
        },
        {
          label: "복지 포인트",
          route: "points",
          icon: Gift,
          bgColor: "#FFF1F2",
          iconColor: "#F43F5E",
        },
      ],
    },
  ];

  const handleLogout = () => {
    Alert.alert("로그아웃", "정말 로그아웃 하시겠어요?", [
      {
        text: "취소",
        style: "cancel",
      },
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

  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 프로필 섹션 */}
        <TouchableOpacity
          activeOpacity={0.9}
          className="bg-white rounded-[32px] p-6 mb-10 flex-row items-center"
        >
          <View className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm overflow-hidden border-2 border-white">
            <View className="w-full h-full bg-[#2357E5] items-center justify-center">
              <User size={30} color="white" />
            </View>
          </View>

          <View className="ml-5 flex-1">
            <View className="bg-blue-100 self-start px-2 py-0.5 rounded-md mb-1">
              <Text className="text-[10px] font-bold text-[#2357E5]">
                {userInfo.rank}
              </Text>
            </View>
            <Text className="text-xl font-bold text-gray-900 leading-tight">
              {userInfo.name}
            </Text>
            <Text className="text-sm text-gray-500 font-medium">
              {userInfo.team}
            </Text>
          </View>
          <ChevronRight size={18} color="#D1D5DB" />
        </TouchableOpacity>

        {/* 그리드 메뉴 섹션 */}
        <View className="space-y-10">
          {MENU_SECTIONS.map((section, idx) => (
            <View key={idx} className="mb-8">
              <Text className="text-[14px] font-bold text-gray-400 mb-5 ml-1">
                {section.title}
              </Text>
              <View className="flex-row flex-wrap justify-between">
                {section.data.map((item) => (
                  <TouchableOpacity
                    key={item.route}
                    activeOpacity={0.7}
                    style={{ width: "48%" }}
                    className="p-5 bg-white border border-gray-100 rounded-[28px] mb-4 shadow-sm"
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
                      바로가기
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
