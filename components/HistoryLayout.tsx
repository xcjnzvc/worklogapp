import React from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, SlidersHorizontal } from "lucide-react-native";

interface HistoryLayoutProps {
  title: string;
  placeholder?: string;
  searchOpacity?: number;
  searchQuery: string;
  onSearchQueryChange: (text: string) => void;
  onFilterPress: () => void;
  onSearchPress?: () => void;
  rightActionComponent?: React.ReactNode;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  children: React.ReactNode;

  // 💡공통 더보기 기능을 위한 Props 추가
  onLoadMore: () => void; // 버튼 클릭 시 실행할 액션 (fetchNextPage 또는 setPage)
  hasNextPage?: boolean; // 다음 페이지 존재 여부
  isFetchingNextPage?: boolean; // 로딩 상태 여부
  buttonText?: string; // 버튼에 표시할 커스텀 텍스트
}

export default function HistoryLayout({
  title,
  placeholder = "검색어를 입력하세요",
  searchQuery,
  onSearchQueryChange,
  onFilterPress,
  onSearchPress,
  rightActionComponent,
  onScroll,
  children,
  onLoadMore,
  hasNextPage = true,
  isFetchingNextPage = false,
  buttonText = "다음 기록 불러오기",
}: HistoryLayoutProps) {
  return (
    <SafeAreaView
      className="flex-1 bg-[#F8F9FA]"
      edges={["left", "right", "top"]}
    >
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
      >
        {/* 1. 헤더 타이틀 */}
        <View className="mt-6 mb-4 relative justify-center items-center">
          <Text className="text-[22px] font-bold text-[#111111]">{title}</Text>
        </View>

        {/* 2. 우측/상단 추가 액션 영역 */}
        {rightActionComponent && (
          <View className="items-end mb-4 pr-1">{rightActionComponent}</View>
        )}

        {/* 3. 공통 통합 검색 바 */}
        <View className="flex-row items-center bg-white rounded-xl px-4 py-1 mb-6 shadow-sm border border-gray-100">
          <TextInput
            className="flex-1 py-3 text-[13px] text-gray-700"
            placeholder={placeholder}
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={onSearchQueryChange}
          />
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={onFilterPress}>
              <SlidersHorizontal size={20} color="#999" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onSearchPress}>
              <Search size={22} color="#999" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 4. 리스트 내역 조각들 */}
        <View className="pb-4">{children}</View>

        {/* 5. 💡 공통 더보기 / 상태 제어 영역 통합 */}
        <View className="mb-10">
          {isFetchingNextPage ? (
            <View className="py-4 items-center">
              <ActivityIndicator size="small" color="#3B28FF" />
            </View>
          ) : !hasNextPage ? (
            <View className="w-full py-4 items-center">
              <Text className="text-gray-400 text-xs">마지막 기록입니다.</Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={onLoadMore}
              className="w-full py-4 bg-white border border-gray-100 rounded-2xl justify-center items-center"
            >
              <Text className="text-[#3B28FF] font-semibold text-[14px]">
                {buttonText}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
