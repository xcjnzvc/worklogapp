import { View, Text } from "react-native";

export default function Title({ describe }: { describe?: string }) {
  return (
    <View className="flex flex-col items-center gap-[10px]">
      <Text className="text-[40px] font-bold text-[#0023A1]">WorkLog</Text>
      {describe && <Text className="text-[#666] text-[18px]">{describe}</Text>}
    </View>
  );
}
