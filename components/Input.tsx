import { useState } from "react";
import { View, Text, TextInput, Pressable, TextInputProps } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  success?: boolean;
}

const Input = ({
  label,
  error,
  success,
  secureTextEntry,
  ...rest
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  // 비밀번호 가시성 토글 로직
  const isPassword = secureTextEntry;
  const isVisible = showPassword;

  // 스타일 클래스 조건부 할당
  const borderColor = error
    ? "border-red-500"
    : success
      ? "border-[#0029C0]"
      : "border-[#DDDDDD]";
  const labelColor = error
    ? "text-red-500"
    : success
      ? "text-[#0029C0]"
      : "text-[#666]";

  return (
    <View className="w-full">
      <Text className={`text-[16px] ${labelColor}`}>{label}</Text>

      <View className="relative w-full mt-[6px]">
        <TextInput
          secureTextEntry={isPassword && !isVisible}
          placeholder={`${label}을 입력해주세요`}
          placeholderTextColor="#999999"
          className={`pl-[10px] pr-[40px] w-full h-[46px] border ${borderColor} rounded-[12px] text-[14px]`}
          {...rest}
        />

        {isPassword && (
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            className="absolute right-[12px] top-3"
          >
            {isVisible ? (
              <EyeOff size={20} color="#999999" />
            ) : (
              <Eye size={20} color="#999999" />
            )}
          </Pressable>
        )}
      </View>

      {error && <Text className="mt-1 text-sm text-red-500">{error}</Text>}
    </View>
  );
};

export default Input;
