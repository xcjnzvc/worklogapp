import React, { ReactNode } from "react";
import { View, Text } from "react-native";

interface StatCardProps {
  label: string;
  value: string;
  color: string;
  icon: ReactNode;
}

const StatCard = ({ label, value, color, icon }: StatCardProps) => (
  <View className="bg-white p-5 rounded-[24px] shadow-sm flex-row items-center gap-4 mb-3">
    <View className="w-12 h-12 rounded-2xl bg-[#F4F7FE] items-center justify-center">
      {icon}
    </View>
    <View>
      <Text className="text-xs font-bold text-[#A3AED0]">{label}</Text>
      <Text className={`text-xl font-black ${color}`}>{value}</Text>
    </View>
  </View>
);

export default StatCard;
