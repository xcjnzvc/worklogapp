import React from "react";
import { Pressable, Text, View } from "react-native";

interface ButtonProps {
  text: string;
  width?: number;
  fontSize?: number;
  disabled?: boolean;
  onPress?: () => void;
}

export default function Button({
  text,
  width,
  fontSize = 16,
  disabled,
  onPress,
}: ButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={width ? { width } : undefined}
      className={`h-[48px] rounded-[12px] justify-center items-center 
        ${!width ? "w-full" : ""}
        ${disabled ? "bg-[#CCCCCC]" : "bg-[#0029C0]"}`}
    >
      <Text
        style={{ fontSize }} // 인라인 스타일로 동적 폰트 크기 적용
        className={`font-medium 
          ${disabled ? "text-[#999999]" : "text-[#fff]"}`}
      >
        {text}
      </Text>
    </Pressable>
  );
}
