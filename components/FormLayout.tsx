import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/components/Button";

interface FormLayoutProps {
  title: string;
  onSave: () => void;
  isSubmitting?: boolean;
  saveButtonText?: string;
  children: React.ReactNode;
}

export default function FormLayout({
  title,
  onSave,
  isSubmitting = false,
  saveButtonText = "저장",
  children,
}: FormLayoutProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hide = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return (
    <SafeAreaView
      className="flex-1 bg-[#F8F9FA]"
      edges={["left", "right", "bottom"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          className="px-6"
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="none"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: 10,
            // ✅ 키보드가 올라올 때만 paddingBottom 추가, 평소엔 20
            paddingBottom: keyboardHeight > 0 ? keyboardHeight + 20 : 20,
          }}
        >
          <View className="items-center mt-2 mb-[40px]">
            <Text className="text-[22px] font-bold text-[#111]">{title}</Text>
          </View>

          {children}

          <View className="mt-4">
            <Button
              text={isSubmitting ? "처리 중..." : saveButtonText}
              disabled={isSubmitting}
              onPress={onSave}
              fontSize={15}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
