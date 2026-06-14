import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { Search } from "lucide-react-native";

// 1. 제네릭 T를 사용하여 탭 타입을 유연하게 받습니다.
interface TabOption<T extends string> {
  value: T;
  label: string;
}

interface PageTabsProps<T extends string> {
  tabs: TabOption<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  searchKeyword?: string;
  onSearchChange?: (value: string) => void; // 함수 타입을 명시합니다.
  searchPlaceholder?: string;
}

// 2. 컴포넌트에 타입을 지정합니다.
const PageTabs = <T extends string>({
  tabs,
  activeTab,
  onTabChange,
  searchKeyword,
  onSearchChange,
  searchPlaceholder = "검색어를 입력하세요...",
}: PageTabsProps<T>) => {
  return (
    <View className="pt-4 border-t border-gray-100">
      <View className="flex-row items-center gap-6 mb-4">
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
        <View className="flex-row items-center bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
          <Search size={18} color="#A3AED0" />
          <TextInput
            placeholder={searchPlaceholder}
            className="flex-1 ml-3 text-[14px]"
            value={searchKeyword}
            onChangeText={onSearchChange} // 이제 여기가 안전해집니다.
          />
        </View>
      )}
    </View>
  );
};

export default PageTabs;
