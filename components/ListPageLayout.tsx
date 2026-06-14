import React from "react";
import { View, Text, ScrollView, SafeAreaView } from "react-native";

interface ListPageLayoutProps {
  title: string;
  description?: string;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  stats?: React.ReactNode;
  tabs?: React.ReactNode;
  children: React.ReactNode;
  noBackground?: boolean;
}

const ListPageLayout = ({
  title,
  description,
  headerLeft,
  headerRight,
  stats,
  tabs,
  children,
  noBackground = false,
}: ListPageLayoutProps) => (
  <SafeAreaView className="flex-1 bg-[#F8F9FA]">
    <ScrollView className="px-4 py-6" showsVerticalScrollIndicator={false}>
      <View className="mb-6">
        <View className="flex-row justify-between items-center mb-2">
          <View className="flex-row items-center gap-3">
            {headerLeft}
            <Text className="text-[26px] font-black text-[#1B254B]">
              {title}
            </Text>
          </View>
          {headerRight}
        </View>
        {description ? (
          <Text className="text-sm text-[#A3AED0]">{description}</Text>
        ) : null}
      </View>

      {stats && <View className="mb-6">{stats}</View>}
      {tabs && <View className="mb-6">{tabs}</View>}

      <View
        className={noBackground ? "" : "bg-white p-4 rounded-[32px] shadow-sm"}
      >
        {children}
      </View>
    </ScrollView>
  </SafeAreaView>
);

export default ListPageLayout;
