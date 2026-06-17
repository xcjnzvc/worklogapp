import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const InviteMobileCard = ({ data, getStatusStyle, onResend }: any) => (
  <View className="gap-4">
    {data.map((item: any) => (
      <View
        key={item.id}
        className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm"
      >
        <View className="flex-row justify-between mb-3">
          <Text className="text-[12px] font-bold text-[#A3AED0] tracking-wider uppercase">
            NO. {item.displayId}
          </Text>
          <View
            className={`px-3 py-1 rounded-full ${getStatusStyle(item.status)}`}
          >
            <Text className="text-[11px] font-black">{item.status}</Text>
          </View>
        </View>
        <Text className="text-xs text-gray-400">초대 대상 이메일</Text>
        <Text className="text-sm font-bold text-gray-900 mb-3">
          {item.email}
        </Text>

        {item.status === "EXPIRED" && (
          <TouchableOpacity
            onPress={() => onResend(item.email)}
            className="bg-blue-600 p-3 rounded-xl items-center"
          >
            <Text className="text-white font-bold">재발송</Text>
          </TouchableOpacity>
        )}
      </View>
    ))}
  </View>
);

export default InviteMobileCard;
