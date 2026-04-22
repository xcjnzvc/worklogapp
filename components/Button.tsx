import React from "react";
import { Pressable, Text, View } from "react-native";

interface ButtonProps {
  text: string;
  width?: number;
  disabled?: boolean;
  onPress?: () => void; // RN에서는 onClick 대신 onPress를 주로 사용합니다.
}

export default function Button({
  text,
  width,
  disabled,
  onPress,
}: ButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      // 스타일 직접 주입 (width)
      style={width ? { width } : undefined}
      // Tailwind 클래스
      className={`h-[48px] rounded-[12px] justify-center items-center 
        ${!width ? "w-full" : ""}
        ${disabled ? "bg-[#CCCCCC]" : "bg-[#0029C0]"}`}
    >
      <Text
        className={`text-[18px] font-medium 
          ${disabled ? "text-[#999999]" : "text-[#fff]"}`}
      >
        {text}
      </Text>
    </Pressable>
  );
}
