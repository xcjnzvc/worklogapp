// import React, { useRef, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Animated,
//   ActivityIndicator,
// } from "react-native";
// import { Plus, Calendar, Clock } from "lucide-react-native";
// import { useRouter } from "expo-router";
// import HistoryLayout from "@/components/HistoryLayout";
// import StatusBadge from "@/components/StatusBadge";
// import { useVacation } from "@/hooks/useVacation";
// import SearchFilterBottomSheet, {
//   FilterData,
// } from "../../../../components/SearchFilterBottomSheet";

// const VACATION_TYPE_MAP: Record<string, string> = {
//   ANNUAL: "연차",
//   HALF_AM: "반차 (오전)",
//   HALF_PM: "반차 (오후)",
//   SICK: "병가",
//   EVENT: "경조사",
//   OTHER: "기타",
// };

// export default function VacationHistoryScreen() {
//   const router = useRouter();
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isFilterVisible, setIsFilterVisible] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

//   const { useVacationList } = useVacation();
//   const {
//     data,
//     isLoading,
//     isError,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//   } = useVacationList();

//   const vacationList = data?.pages.flatMap((page) => page.list || []) || [];

//   const animValue = useRef(new Animated.Value(0)).current;

//   const animateButton = (scrolled: boolean) => {
//     Animated.spring(animValue, {
//       toValue: scrolled ? 1 : 0,
//       useNativeDriver: false,
//       tension: 45,
//       friction: 8,
//     }).start();
//   };

//   const buttonBottom = animValue.interpolate({
//     inputRange: [0, 1],
//     outputRange: [-100, 32],
//   });

//   const getVacationIcon = (type: string) => {
//     if (type === "HALF_AM" || type === "HALF_PM" || type?.includes("반차")) {
//       return { icon: Clock, iconBg: "#FFF9E5", iconColor: "#F59E0B" };
//     }
//     return { icon: Calendar, iconBg: "#E0EDFF", iconColor: "#2357E5" };
//   };

//   const formatDuration = (durationText: string) => {
//     if (!durationText) return "0.0";
//     return durationText.replace(/일/g, "").trim();
//   };

//   const formatVacationDate = (startDate: string, endDate: string) => {
//     if (!startDate) return "--.--.--";
//     if (startDate === endDate) return startDate;

//     const cleanEndDate = endDate?.startsWith("2026.")
//       ? endDate.replace("2026.", "")
//       : endDate;
//     return `${startDate} - ${cleanEndDate}`;
//   };

//   return (
//     <View className="flex-1">
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
//             onPress={() => router.push("/vacation/create")}
//             className="w-14 h-14 bg-[#0029C0] rounded-2xl items-center justify-center shadow-lg shadow-blue-800"
//           >
//             <Plus size={28} color="white" />
//           </TouchableOpacity>
//         </Animated.View>
//       )}

//       <HistoryLayout
//         title="휴가"
//         placeholder="내역을 검색하세요"
//         searchQuery={searchQuery}
//         onSearchQueryChange={setSearchQuery}
//         onFilterPress={() => setIsFilterVisible(true)}
//         onScroll={(e) => {
//           const y = e.nativeEvent.contentOffset.y;
//           const scrolled = y > 40;
//           if (scrolled !== isScrolled) {
//             setIsScrolled(scrolled);
//             animateButton(scrolled);
//           }
//         }}
//         rightActionComponent={
//           !isScrolled ? (
//             <TouchableOpacity
//               activeOpacity={0.8}
//               className="w-14 h-14 bg-[#0029C0] rounded-2xl items-center justify-center shadow-lg shadow-blue-800"
//               onPress={() => router.push("/vacation/create")}
//             >
//               <Plus size={28} color="white" />
//             </TouchableOpacity>
//           ) : (
//             <View style={{ height: 56 }} />
//           )
//         }
//         onLoadMore={() => fetchNextPage()}
//         hasNextPage={hasNextPage}
//         isFetchingNextPage={isFetchingNextPage}
//         buttonText="더보기 내역 가져오기"
//       >
//         {isLoading ? (
//           <View className="py-20 items-center justify-center">
//             <ActivityIndicator size="large" color="#0029C0" />
//           </View>
//         ) : isError ? (
//           <View className="py-20 items-center justify-center">
//             <Text className="text-red-500 text-sm font-bold">
//               데이터를 가져오지 못했습니다.
//             </Text>
//           </View>
//         ) : vacationList.length === 0 ? (
//           <View className="py-20 items-center justify-center bg-white rounded-[32px] border border-gray-100 p-6">
//             <Text className="text-gray-400 text-sm font-medium">
//               조회된 휴가 내역이 없습니다.
//             </Text>
//           </View>
//         ) : (
//           vacationList.map((item: any, index: number) => {
//             const iconConfig = getVacationIcon(item.type);
//             const RenderIcon = iconConfig.icon;
//             const currentNo = String(vacationList.length - index).padStart(
//               3,
//               "0",
//             );

//             return (
//               <View
//                 key={item.id || index}
//                 className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50 mb-5"
//               >
//                 <Text className="text-gray-400 font-bold text-[13px] mb-4">
//                   NO. {currentNo}
//                 </Text>

//                 <View className="flex-row items-center justify-between mb-6">
//                   <View className="flex-row items-center flex-1">
//                     <View
//                       style={{ backgroundColor: iconConfig.iconBg }}
//                       className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
//                     >
//                       <RenderIcon size={26} color={iconConfig.iconColor} />
//                     </View>
//                     <View className="flex-1 pr-2">
//                       <Text className="text-gray-400 font-bold text-[14px] mb-1">
//                         {VACATION_TYPE_MAP[item.type] || item.type || "휴가"}
//                       </Text>
//                       <Text
//                         className="text-gray-900 font-black text-[16px]"
//                         numberOfLines={1}
//                       >
//                         {formatVacationDate(item.startDate, item.endDate)}
//                       </Text>
//                     </View>
//                   </View>

//                   <View className="items-end min-w-[60px]">
//                     <Text className="text-gray-900 font-black text-[22px]">
//                       {formatDuration(item.durationText)}
//                     </Text>
//                     <Text className="text-gray-300 font-black text-[10px] tracking-widest">
//                       DAYS
//                     </Text>
//                   </View>
//                 </View>

//                 {/* 💡 기존 인라인 스타일 분기를 제거하고, 전역 StatusBadge로 통일하여 사용합니다. */}
//                 <StatusBadge status={item.status} />
//               </View>
//             );
//           })
//         )}
//       </HistoryLayout>

//       <SearchFilterBottomSheet
//         isVisible={isFilterVisible}
//         onClose={() => setIsFilterVisible(false)}
//         categoryTitle="휴가 종류"
//         categoryOptions={["전체보기", "연차", "반차", "경조사"]}
//         onApply={(filterData: FilterData) => {
//           setIsFilterVisible(false);
//         }}
//       />
//     </View>
//   );
// }
