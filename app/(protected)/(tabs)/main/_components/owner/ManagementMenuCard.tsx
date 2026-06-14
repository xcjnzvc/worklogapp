import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronRight } from "lucide-react-native";

export default function ManagementMenuCard({
  title,
  icon,
  items,
  onItemClick,
}: any) {
  return (
    <View className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm">
      <View className="flex-row items-center gap-3 mb-5">
        <View className="p-3 bg-blue-50 rounded-2xl">{icon}</View>
        <Text className="font-bold text-base text-gray-900">{title}</Text>
      </View>
      <View className="gap-3">
        {items.map((item: any, i: number) => (
          <TouchableOpacity
            key={i}
            onPress={() => onItemClick(item.label)}
            className="flex-row items-center justify-between p-4 bg-gray-50 rounded-2xl"
          >
            <Text className="font-medium text-sm text-gray-800">
              {item.label}
            </Text>
            <ChevronRight size={16} color="#d1d5db" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
