import React from "react";
import { View, Text } from "react-native";

export default function OwnerWeeklyScheduleCard({ scheduleData = [] }: any) {
  return (
    <View className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm">
      <Text className="font-bold text-lg text-gray-900 mb-5">이번 주 일정</Text>
      <View className="gap-3">
        {scheduleData.map((item: any) => (
          <View
            key={item.date}
            className="flex-row items-center gap-4 p-3 bg-gray-50/50 rounded-2xl"
          >
            <View className="w-12 items-center">
              <Text className="text-xs font-bold text-gray-400">
                {item.day}
              </Text>
              <Text className="text-base font-black text-gray-700">
                {item.date}
              </Text>
            </View>
            <View className="flex-1 flex-row flex-wrap gap-2">
              {item.events.map((ev: any, i: number) => (
                <View
                  key={i}
                  className="px-2 py-1 bg-white rounded-lg border border-gray-100"
                >
                  <Text className="text-xs font-bold">{ev.label}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
