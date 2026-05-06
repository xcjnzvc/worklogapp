// import React, { useRef, useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   Animated,
//   Platform,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import {
//   Plus,
//   Search,
//   SlidersHorizontal,
//   Calendar,
//   Clock,
//   CheckCircle2,
//   XCircle,
//   AlertCircle,
// } from "lucide-react-native";

// export default function VacationHistoryScreen() {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const animValue = useRef(new Animated.Value(0)).current;

//   // 버튼 위치 애니메이션 (0: 상단, 1: 하단)
//   const animateButton = (scrolled: boolean) => {
//     Animated.spring(animValue, {
//       toValue: scrolled ? 1 : 0,
//       useNativeDriver: false,
//       tension: 45,
//       friction: 8,
//     }).start();
//   };

//   // 하단 플로팅 시의 위치 값
//   const buttonBottom = animValue.interpolate({
//     inputRange: [0, 1],
//     outputRange: [-100, 32],
//   });

//   const historyData = [
//     {
//       id: "NO. 001",
//       type: "연차",
//       date: "2026.04.18 - 04.20",
//       days: "2.0",
//       status: "승인 완료",
//       statusType: "approved",
//       icon: Calendar,
//       iconBg: "#E0EDFF",
//       iconColor: "#2357E5",
//     },
//     {
//       id: "NO. 002",
//       type: "반차",
//       date: "2026.04.18 (오전)",
//       days: "0.5",
//       status: "승인 반려",
//       statusType: "rejected",
//       icon: Clock,
//       iconBg: "#FFF9E5",
//       iconColor: "#F59E0B",
//     },
//     {
//       id: "NO. 003",
//       type: "연차",
//       date: "2026.05.01 - 05.02",
//       days: "2.0",
//       status: "승인 대기",
//       statusType: "pending",
//       icon: Calendar,
//       iconBg: "#E0EDFF",
//       iconColor: "#2357E5",
//     },
//   ];

//   const getStatusStyle = (statusType: string) => {
//     switch (statusType) {
//       case "approved":
//         return {
//           bg: "bg-[#E6F8F1]",
//           text: "text-[#10B981]",
//           icon: CheckCircle2,
//         };
//       case "rejected":
//         return { bg: "bg-[#FFF1F2]", text: "text-[#F43F5E]", icon: XCircle };
//       case "pending":
//         return {
//           bg: "bg-[#FFF4E5]",
//           text: "text-[#EA580C]",
//           icon: AlertCircle,
//         };
//       default:
//         return { bg: "bg-gray-100", text: "text-gray-500", icon: AlertCircle };
//     }
//   };

//   return (
//     // edges를 비워 SafeAreaView의 강제 패딩을 없애고 타이틀을 위로 올립니다.
//     <SafeAreaView className="flex-1 bg-[#F8F9FA]" edges={[]}>
//       {/* [A] 스크롤 시 우측 하단에 나타나는 버튼 */}
//       {isScrolled && (
//         <Animated.View
//           style={{
//             position: "absolute",
//             right: 24,
//             bottom: buttonBottom,
//             zIndex: 999,
//           }}
//         >
//           <TouchableOpacity
//             activeOpacity={0.8}
//             className="w-14 h-14 bg-[#0029C0] rounded-2xl items-center justify-center shadow-lg shadow-blue-800"
//           >
//             <Plus size={28} color="white" />
//           </TouchableOpacity>
//         </Animated.View>
//       )}

//       <ScrollView
//         className="flex-1 px-5"
//         // paddingTop을 최소화(10)하여 헤더 바로 아래에 붙도록 설정
//         contentContainerStyle={{ paddingTop: 10, paddingBottom: 40 }}
//         showsVerticalScrollIndicator={false}
//         scrollEventThrottle={16}
//         onScroll={(e) => {
//           const y = e.nativeEvent.contentOffset.y;
//           const scrolled = y > 40;
//           if (scrolled !== isScrolled) {
//             setIsScrolled(scrolled);
//             animateButton(scrolled);
//           }
//         }}
//       >
//         {/* 1. 휴가 타이틀 (최상단) */}
//         <View className="mt-2">
//           <Text className="text-[22px] font-bold text-center text-[#111]">
//             휴가
//           </Text>
//         </View>

//         <View style={{ height: 20 }} />

//         {/* 2. 상단 플러스 버튼 (휴가 글씨 20px 아래) */}
//         <View className="items-end pr-1">
//           {!isScrolled ? (
//             <TouchableOpacity
//               activeOpacity={0.8}
//               className="w-14 h-14 bg-[#0029C0] rounded-2xl items-center justify-center shadow-lg shadow-blue-800"
//             >
//               <Plus size={28} color="white" />
//             </TouchableOpacity>
//           ) : (
//             // 버튼이 하단으로 이동해도 간격 유지를 위해 투명한 공간 확보
//             <View style={{ height: 56 }} />
//           )}
//         </View>

//         <View style={{ height: 20 }} />

//         {/* 3. 검색 바 (버튼 20px 아래) */}
//         <View className="flex-row items-center bg-white rounded-[16px] px-4 py-1 mb-8 shadow-sm border border-gray-100">
//           <TextInput
//             className="flex-1 h-[50px] text-[15px] font-medium text-gray-700"
//             placeholder="내역을 검색하세요"
//             placeholderTextColor="#999"
//           />
//           <View className="flex-row items-center space-x-3 gap-3">
//             <TouchableOpacity>
//               <SlidersHorizontal size={20} color="#999" />
//             </TouchableOpacity>
//             <TouchableOpacity>
//               <Search size={22} color="#999" />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* 4. 리스트 내역 */}
//         <View className="space-y-6">
//           {historyData.map((item, index) => {
//             const style = getStatusStyle(item.statusType);
//             const StatusIcon = style.icon;
//             return (
//               <View
//                 key={index}
//                 className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50 mb-5"
//               >
//                 <Text className="text-gray-400 font-bold text-[13px] mb-4">
//                   {item.id}
//                 </Text>

//                 <View className="flex-row items-center justify-between mb-6">
//                   <View className="flex-row items-center">
//                     <View
//                       style={{ backgroundColor: item.iconBg }}
//                       className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
//                     >
//                       <item.icon size={26} color={item.iconColor} />
//                     </View>
//                     <View>
//                       <Text className="text-gray-400 font-bold text-[14px] mb-1">
//                         {item.type}
//                       </Text>
//                       <Text className="text-gray-900 font-black text-[17px]">
//                         {item.date}
//                       </Text>
//                     </View>
//                   </View>
//                   <View className="items-end">
//                     <Text className="text-gray-900 font-black text-[22px]">
//                       {item.days}
//                     </Text>
//                     <Text className="text-gray-300 font-black text-[10px] tracking-widest">
//                       DAYS
//                     </Text>
//                   </View>
//                 </View>

//                 {/* 상태 배지 */}
//                 <View
//                   className={`flex-row items-center justify-center py-3 rounded-2xl ${style.bg}`}
//                 >
//                   <StatusIcon
//                     size={18}
//                     color={
//                       item.statusType === "pending"
//                         ? "#EA580C"
//                         : item.statusType === "approved"
//                           ? "#10B981"
//                           : "#F43F5E"
//                     }
//                   />
//                   <Text className={`ml-2 font-bold text-[15px] ${style.text}`}>
//                     {item.status}
//                   </Text>
//                 </View>
//               </View>
//             );
//           })}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// 2번
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Plus,
  Search,
  SlidersHorizontal,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import SearchFilterBottomSheet from "./_components/SearchFilterBottomSheet";

export default function VacationHistoryScreen() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const animValue = useRef(new Animated.Value(0)).current;

  // 버튼 위치 애니메이션 (0: 상단, 1: 하단)
  const animateButton = (scrolled: boolean) => {
    Animated.spring(animValue, {
      toValue: scrolled ? 1 : 0,
      useNativeDriver: false,
      tension: 45,
      friction: 8,
    }).start();
  };

  // 하단 플로팅 시의 위치 값
  const buttonBottom = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 32],
  });

  const historyData = [
    {
      id: "NO. 001",
      type: "연차",
      date: "2026.04.18 - 04.20",
      days: "2.0",
      status: "승인 완료",
      statusType: "approved",
      icon: Calendar,
      iconBg: "#E0EDFF",
      iconColor: "#2357E5",
    },
    {
      id: "NO. 002",
      type: "반차",
      date: "2026.04.18 (오전)",
      days: "0.5",
      status: "승인 반려",
      statusType: "rejected",
      icon: Clock,
      iconBg: "#FFF9E5",
      iconColor: "#F59E0B",
    },
    {
      id: "NO. 003",
      type: "연차",
      date: "2026.05.01 - 05.02",
      days: "2.0",
      status: "승인 대기",
      statusType: "pending",
      icon: Calendar,
      iconBg: "#E0EDFF",
      iconColor: "#2357E5",
    },
  ];

  const getStatusStyle = (statusType: string) => {
    switch (statusType) {
      case "approved":
        return {
          bg: "bg-[#E6F8F1]",
          text: "text-[#10B981]",
          icon: CheckCircle2,
        };
      case "rejected":
        return { bg: "bg-[#FFF1F2]", text: "text-[#F43F5E]", icon: XCircle };
      case "pending":
        return {
          bg: "bg-[#FFF4E5]",
          text: "text-[#EA580C]",
          icon: AlertCircle,
        };
      default:
        return { bg: "bg-gray-100", text: "text-gray-500", icon: AlertCircle };
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FA]" edges={[]}>
      {/* 1. 스크롤 시 우측 하단에 나타나는 버튼 */}
      {isScrolled && (
        <Animated.View
          style={{
            position: "absolute",
            right: 24,
            bottom: buttonBottom,
            zIndex: 999,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            className="w-14 h-14 bg-[#0029C0] rounded-2xl items-center justify-center shadow-lg shadow-blue-800"
          >
            <Plus size={28} color="white" />
          </TouchableOpacity>
        </Animated.View>
      )}

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(e) => {
          const y = e.nativeEvent.contentOffset.y;
          const scrolled = y > 40;
          if (scrolled !== isScrolled) {
            setIsScrolled(scrolled);
            animateButton(scrolled);
          }
        }}
      >
        {/* 휴가 타이틀 */}
        <View className="mt-2">
          <Text className="text-[22px] font-bold text-center text-[#111]">
            휴가
          </Text>
        </View>

        <View style={{ height: 20 }} />

        {/* 상단 플러스 버튼 */}
        <View className="items-end pr-1">
          {!isScrolled ? (
            <TouchableOpacity
              activeOpacity={0.8}
              className="w-14 h-14 bg-[#0029C0] rounded-2xl items-center justify-center shadow-lg shadow-blue-800"
              onPress={() => router.push("/vacation/create")}
            >
              <Plus size={28} color="white" />
            </TouchableOpacity>
          ) : (
            <View style={{ height: 56 }} />
          )}
        </View>

        <View style={{ height: 20 }} />

        {/* 검색 바 */}
        <View className="flex-row items-center bg-white rounded-[10px] px-4 py-1 mb-8 shadow-sm border border-gray-100">
          <TextInput
            className="flex-1 py-[8px] text-[13px]  text-gray-700"
            placeholder="내역을 검색하세요"
            placeholderTextColor="#999"
          />
          <View className="flex-row items-center space-x-3 gap-3">
            <TouchableOpacity onPress={() => setIsFilterVisible(true)}>
              <SlidersHorizontal size={20} color="#999" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Search size={22} color="#999" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 리스트 내역 */}
        <View className="space-y-6">
          {historyData.map((item, index) => {
            const style = getStatusStyle(item.statusType);
            const StatusIcon = style.icon;
            return (
              <View
                key={index}
                className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50 mb-5"
              >
                <Text className="text-gray-400 font-bold text-[13px] mb-4">
                  {item.id}
                </Text>

                <View className="flex-row items-center justify-between mb-6">
                  <View className="flex-row items-center">
                    <View
                      style={{ backgroundColor: item.iconBg }}
                      className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
                    >
                      <item.icon size={26} color={item.iconColor} />
                    </View>
                    <View>
                      <Text className="text-gray-400 font-bold text-[14px] mb-1">
                        {item.type}
                      </Text>
                      <Text className="text-gray-900 font-black text-[17px]">
                        {item.date}
                      </Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="text-gray-900 font-black text-[22px]">
                      {item.days}
                    </Text>
                    <Text className="text-gray-300 font-black text-[10px] tracking-widest">
                      DAYS
                    </Text>
                  </View>
                </View>

                {/* 상태 배지 */}
                <View
                  className={`flex-row items-center justify-center py-3 rounded-2xl ${style.bg}`}
                >
                  <StatusIcon
                    size={18}
                    color={
                      item.statusType === "pending"
                        ? "#EA580C"
                        : item.statusType === "approved"
                          ? "#10B981"
                          : "#F43F5E"
                    }
                  />
                  <Text className={`ml-2 font-bold text-[15px] ${style.text}`}>
                    {item.status}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* 필터 바텀 시트 */}
      <SearchFilterBottomSheet
        isVisible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onApply={(data) => {
          console.log("필터 적용:", data);
          setIsFilterVisible(false);
          // 여기서 data(날짜, 상태 등)를 이용해 historyData를 서버에서 다시 불러오거나 필터링하면 됩니다.
        }}
      />
    </SafeAreaView>
  );
}
