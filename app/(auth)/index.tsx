import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "@/store/useAuthStore";
import { loginSchema, LoginForm } from "@/types/auth";
import Title from "./_components/Title";
import Input from "./_components/Input";

type ServerStatus = "checking" | "ok" | "fail";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [saveEmail, setSaveEmail] = useState(false);
  const [serverStatus, setServerStatus] = useState<ServerStatus>("checking");
  const scrollViewRef = useRef<ScrollView>(null);
  const formRef = useRef<View>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    loadSavedEmail();
    pingServer();
  }, []);

  const handleInputFocus = () => {
    setTimeout(() => {
      formRef.current?.measureLayout(
        scrollViewRef.current as any,
        (_x, y) => {
          scrollViewRef.current?.scrollTo({
            y: y - 200,
            animated: true,
          });
        },
        () => {},
      );
    }, 300);
  };

  const loadSavedEmail = async () => {
    const saved = await AsyncStorage.getItem("savedEmail");
    if (saved) {
      setValue("email", saved);
      setSaveEmail(true);
    }
  };

  // const pingServer = async () => {
  //   setServerStatus("checking");
  //   try {
  //     const url = `${process.env.EXPO_PUBLIC_API_URL}/health`;
  //     console.log("요청 주소:", url);
  //     const res = await axios.get(url, { timeout: 15000 });
  //     console.log("서버 응답 성공:", res.data);
  //     setServerStatus("ok");
  //   } catch (error: any) {
  //     if (error.response) {
  //       console.log("서버가 응답함 (에러):", error.response.status);
  //     } else if (error.request) {
  //       console.log("서버 응답 없음 (네트워크 에러):", error.request);
  //     } else {
  //       console.log("설정 에러:", error.message);
  //     }
  //     setServerStatus("fail");
  //   }
  // };

  const pingServer = async (retries = 3) => {
    setServerStatus("checking");

    for (let i = 0; i < retries; i++) {
      try {
        console.log(`${i + 1}번째 서버 연결 시도 중...`);
        const res = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/health`,
          {
            timeout: 15000,
            headers: {
              "User-Agent":
                "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)", // 브라우저인 척
              Accept: "application/json",
            },
          },
        );

        console.log("서버 응답 성공:", res.data);
        setServerStatus("ok");
        return;
      } catch (error: any) {
        console.log(`시도 ${i + 1} 실패: ${error.message}`);

        // 마지막 시도까지 실패했다면 반복문 탈출
        if (i === retries - 1) break;

        // 대기 시간을 5초로 늘려보세요
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }

    setServerStatus("fail");
    console.log("모든 재시도 실패. 서버 상태 확인 필요.");
  };

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data);
      if (saveEmail) {
        await AsyncStorage.setItem("savedEmail", data.email);
      } else {
        await AsyncStorage.removeItem("savedEmail");
      }
      setTimeout(() => {
        router.push("/main");
      }, 100); // 100ms 딜레이
    } catch (error: any) {
      console.log("로그인 에러 상세:", error.response?.data);
      Alert.alert(
        "로그인 실패",
        error.response?.data?.message || "오류가 발생했습니다.",
      );
    }
  };

  const bannerStyle = {
    checking: { dot: "bg-amber-400", text: "서버 연결 확인 중..." },
    ok: { dot: "bg-green-500", text: "서버가 준비됐어요. 로그인해주세요" },
    fail: { dot: "bg-red-500", text: "서버 연결에 실패했어요." },
  }[serverStatus];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      className="flex-1 bg-white"
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ minHeight: SCREEN_HEIGHT + keyboardHeight }}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            className="flex-1 px-5"
            style={{ paddingTop: SCREEN_HEIGHT * 0.2 }}
          >
            <View className="w-full gap-10">
              <Title />

              {/* 서버 상태 배너 */}
              <View
                className={`flex-row items-center gap-3 px-4 py-3 rounded-lg border ${serverStatus === "fail" ? "border-red-500" : "border-gray-300"}`}
              >
                <View className={`w-3 h-3 rounded-full ${bannerStyle.dot}`} />
                <Text className="flex-1 text-sm text-gray-600">
                  {bannerStyle.text}
                </Text>
                {serverStatus === "fail" && (
                  <Pressable
                    onPress={() => pingServer()}
                    className="border border-blue-800 rounded px-2 py-1"
                  >
                    <Text className="text-xs text-blue-800">재요청</Text>
                  </Pressable>
                )}
              </View>

              {/* 폼 */}
              <View ref={formRef} className="gap-6">
                <Controller
                  control={control}
                  name="email"
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <Input
                      label="이메일"
                      value={value}
                      onChangeText={onChange}
                      error={error?.message}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      returnKeyType="next"
                      onFocus={handleInputFocus}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="password"
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <Input
                      label="비밀번호"
                      value={value}
                      onChangeText={onChange}
                      error={error?.message}
                      secureTextEntry
                      returnKeyType="done"
                      onFocus={handleInputFocus}
                    />
                  )}
                />

                {/* 이메일 저장 */}
                <Pressable
                  className="flex-row items-center gap-2"
                  onPress={() => setSaveEmail(!saveEmail)}
                >
                  <View
                    className={`w-5 h-5 rounded border ${saveEmail ? "bg-blue-800 border-blue-800" : "border-gray-400"}`}
                  />
                  <Text className="text-gray-600">이메일 저장</Text>
                </Pressable>

                {/* 로그인 버튼 */}
                <Pressable
                  className={`p-4 rounded-lg items-center ${isValid && serverStatus === "ok" ? "bg-blue-800" : "bg-gray-400"}`}
                  onPress={handleSubmit(onSubmit)}
                  disabled={!isValid || serverStatus !== "ok"}
                >
                  <Text className="text-white font-bold text-lg">로그인</Text>
                </Pressable>

                {/* 회원가입 링크 */}
                <View className="flex-row justify-center items-center gap-4">
                  <Text className="text-gray-400">
                    아직 WorkLog 회원이 아니신가요?
                  </Text>
                  <Pressable onPress={() => router.push("/signup")}>
                    <Text className="text-blue-800 font-bold">회원가입</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
