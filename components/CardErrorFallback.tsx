import { View, Text, Pressable } from "react-native";

interface Props {
  message?: string;
  onRetry: () => void;
}

export default function CardErrorFallback({
  message = "데이터를 불러오지 못했어요",
  onRetry,
}: Props) {
  return (
    <View className="p-6 bg-white rounded-[32px] border border-gray-100 shadow-sm w-full items-center gap-3 py-10">
      <Text className="text-gray-400 font-medium">{message}</Text>
      <Pressable
        onPress={onRetry}
        className="px-5 py-2.5 bg-[#F0F4FF] rounded-2xl"
      >
        <Text className="text-[#0029C0] font-bold">다시 시도</Text>
      </Pressable>
    </View>
  );
}
