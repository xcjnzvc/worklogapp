import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { Search } from "lucide-react-native";
// 1. 라이브러리 추가 임포트
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TabOption<T extends string> {
  value: T;
  label: string;
}

interface PageTabsProps<T extends string> {
  tabs: TabOption<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  searchKeyword?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
}

const PageTabs = <T extends string>({
  tabs,
  activeTab,
  onTabChange,
  searchKeyword,
  onSearchChange,
  searchPlaceholder = "검색어를 입력하세요...",
}: PageTabsProps<T>) => {
  // 2. 훅을 사용하여 기기 하단의 안전 영역(Safe Area) 높이를 가져옵니다.
  const insets = useSafeAreaInsets();

  return (
    // 3. style 속성에 paddingBottom을 동적으로 추가합니다.
    <View
      className="pt-4 border-t border-gray-100 bg-white"
      style={{ paddingBottom: insets.bottom }}
    >
      <View className="flex-row items-center gap-6 mb-4 px-4">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.value}
            onPress={() => onTabChange(tab.value)}
          >
            <Text
              className={`font-bold ${
                activeTab === tab.value
                  ? "text-[18px] text-[#1B254B]"
                  : "text-[16px] text-[#A3AED0]"
              }`}
            >
              {tab.label}
            </Text>
            {activeTab === tab.value && (
              <View className="h-1 bg-[#4318FF] rounded-full mt-1" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {onSearchChange && (
        <View className="flex-row items-center bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm mx-4">
          <Search size={18} color="#A3AED0" />
          <TextInput
            placeholder={searchPlaceholder}
            className="flex-1 ml-3 text-[14px]"
            value={searchKeyword}
            onChangeText={onSearchChange}
          />
        </View>
      )}
    </View>
  );
};

export default PageTabs;
