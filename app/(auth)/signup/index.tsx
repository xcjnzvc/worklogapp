// import React, { useEffect } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   ActivityIndicator,
// } from "react-native";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import Input from "@/components/Input";
// import Button from "@/components/Button";
// import Title from "./_components/Title";
// import {
//   signupSchema,
//   SignupForm,
//   invitedSignupSchema,
//   InvitedSignupForm,
//   UnifiedSignupForm,
// } from "@/types/auth";
// import { signupAPI } from "@/api/auth";
// import { inviteRegisterAPI, verifyInviteAPI } from "@/api/invite";
// import { useRouter, useLocalSearchParams, Link } from "expo-router";
// import Toast from "react-native-toast-message";
// import { useQuery } from "@tanstack/react-query";

// export default function SignupScreen() {
//   const router = useRouter();
//   const params = useLocalSearchParams();
//   const token = params.token as string;
//   const isInvited = !!token;

//   // 1. 초대 토큰 검증
//   const {
//     isLoading,
//     isError,
//     data: inviteData,
//   } = useQuery({
//     queryKey: ["verifyInvite", token],
//     queryFn: () => verifyInviteAPI(token),
//     enabled: isInvited,
//     retry: false,
//   });

//   // 2. 검증 실패 처리
//   useEffect(() => {
//     if (isInvited && isError) {
//       Toast.show({ type: "error", text1: "유효하지 않은 초대 링크입니다." });
//       router.replace("/");
//     }
//   }, [isInvited, isError, router]);

//   const schema = isInvited ? invitedSignupSchema : signupSchema;

//   const {
//     control,
//     handleSubmit,
//     setValue,
//     formState: { errors, isValid },
//   } = useForm<UnifiedSignupForm>({
//     resolver: zodResolver(schema) as any,
//     mode: "onTouched",
//   });

//   // 3. 백엔드 데이터 자동 입력
//   useEffect(() => {
//     if (inviteData?.email) {
//       setValue("email", inviteData.email, { shouldValidate: true });
//     }
//   }, [inviteData, setValue]);

//   const onSubmit = async (data: UnifiedSignupForm) => {
//     try {
//       if (isInvited) {
//         // 초대받은 경우 companyName은 undefined일 수 있지만,
//         // inviteRegisterAPI가 기대하는 타입과 호환되도록 처리
//         await inviteRegisterAPI(token, data);
//       } else {
//         // 일반 회원가입인 경우 companyName이 반드시 존재해야 함
//         // data가 UnifiedSignupForm이므로 companyName이 있을 것을 보장함
//         await signupAPI(data as SignupForm);
//       }
//       Toast.show({ type: "success", text1: "회원가입이 완료되었습니다!" });
//       router.push("/");
//     } catch (error: any) {
//       Toast.show({
//         type: "error",
//         text1: "가입 실패",
//         text2: error.response?.data?.message || "오류가 발생했습니다.",
//       });
//     }
//   };

//   if (isInvited && isLoading) {
//     return (
//       <View className="flex-1 items-center justify-center">
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       className="flex-1 bg-white"
//     >
//       <ScrollView
//         contentContainerStyle={{ paddingVertical: 40, paddingHorizontal: 20 }}
//       >
//         <Link href="/" asChild>
//           <Title
//             describe={isInvited ? "초대받은 회원가입" : "관리자 회원가입"}
//           />
//         </Link>

//         <View className="mt-10 gap-5">
//           <Controller
//             control={control}
//             name="email"
//             render={({ field: { onChange, value } }) => (
//               <Input
//                 label="이메일"
//                 value={value}
//                 onChangeText={onChange}
//                 error={errors.email?.message}
//                 editable={!(isInvited && !!inviteData?.email)}
//               />
//             )}
//           />
//           <Controller
//             control={control}
//             name="password"
//             render={({ field: { onChange, value } }) => (
//               <Input
//                 label="비밀번호"
//                 secureTextEntry
//                 value={value}
//                 onChangeText={onChange}
//                 error={errors.password?.message}
//               />
//             )}
//           />
//           <Controller
//             control={control}
//             name="passwordConfirm"
//             render={({ field: { onChange, value } }) => (
//               <Input
//                 label="비밀번호 확인"
//                 secureTextEntry
//                 value={value}
//                 onChangeText={onChange}
//                 error={errors.passwordConfirm?.message}
//               />
//             )}
//           />
//           <Controller
//             control={control}
//             name="name"
//             render={({ field: { onChange, value } }) => (
//               <Input
//                 label="이름"
//                 value={value}
//                 onChangeText={onChange}
//                 error={errors.name?.message}
//               />
//             )}
//           />
//           <Controller
//             control={control}
//             name="phone"
//             render={({ field: { onChange, value } }) => (
//               <Input
//                 label="연락처"
//                 value={value}
//                 onChangeText={onChange}
//                 error={errors.phone?.message}
//                 keyboardType="phone-pad"
//               />
//             )}
//           />

//           {!isInvited && (
//             <Controller
//               control={control}
//               name="companyName"
//               render={({ field: { onChange, value } }) => (
//                 <Input
//                   label="회사명"
//                   value={value}
//                   onChangeText={onChange}
//                   error={errors.companyName?.message}
//                 />
//               )}
//             />
//           )}
//         </View>

//         <View className="mt-10">
//           <Button
//             text="가입하기"
//             onPress={handleSubmit(onSubmit)}
//             disabled={!isValid}
//           />
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

import React, { useEffect } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Title from "./_components/Title";
import {
  signupSchema,
  SignupForm,
  invitedSignupSchema,
  UnifiedSignupForm,
} from "@/types/auth";
import { signupAPI } from "@/api/auth";
import { inviteRegisterAPI, verifyInviteAPI } from "@/api/invite";
import { useRouter, useLocalSearchParams, Link } from "expo-router";
import Toast from "react-native-toast-message";
import { useQuery } from "@tanstack/react-query";

export default function SignupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const token = params.token as string;
  const isInvited = !!token;

  // 1. 초대 토큰 검증
  const {
    isLoading,
    isError,
    data: inviteData,
  } = useQuery({
    queryKey: ["verifyInvite", token],
    queryFn: () => verifyInviteAPI(token),
    enabled: isInvited,
    retry: false,
  });

  // 2. 검증 실패 처리
  useEffect(() => {
    if (isInvited && isError) {
      Toast.show({ type: "error", text1: "유효하지 않은 초대 링크입니다." });
      router.replace("/");
    }
  }, [isInvited, isError, router]);

  const schema = isInvited ? invitedSignupSchema : signupSchema;

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<UnifiedSignupForm>({
    resolver: zodResolver(schema) as any,
    mode: "onTouched",
  });

  // 3. 백엔드 데이터 자동 입력
  useEffect(() => {
    if (inviteData?.email) {
      setValue("email", inviteData.email, { shouldValidate: true });
    }
  }, [inviteData, setValue]);

  const onSubmit = async (data: UnifiedSignupForm) => {
    try {
      if (isInvited) {
        await inviteRegisterAPI(token, data);
      } else {
        await signupAPI(data as SignupForm);
      }
      Toast.show({ type: "success", text1: "회원가입이 완료되었습니다!" });
      router.push("/");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "가입 실패",
        text2: error.response?.data?.message || "오류가 발생했습니다.",
      });
    }
  };

  if (isInvited && isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        // flexGrow: 1을 사용하여 ScrollView가 화면 전체를 채우게 하고,
        // justifyContent: 'center'를 통해 내부 콘텐츠를 수직 중앙 정렬합니다.
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 20,
        }}
      >
        <Link href="/" asChild>
          <Title
            describe={isInvited ? "초대받은 회원가입" : "관리자 회원가입"}
          />
        </Link>

        <View className="mt-10 gap-5">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                label="이메일"
                value={value}
                onChangeText={onChange}
                error={errors.email?.message}
                editable={!(isInvited && !!inviteData?.email)}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                label="비밀번호"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                error={errors.password?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="passwordConfirm"
            render={({ field: { onChange, value } }) => (
              <Input
                label="비밀번호 확인"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                error={errors.passwordConfirm?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                label="이름"
                value={value}
                onChangeText={onChange}
                error={errors.name?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <Input
                label="연락처"
                value={value}
                onChangeText={onChange}
                error={errors.phone?.message}
                keyboardType="phone-pad"
              />
            )}
          />

          {!isInvited && (
            <Controller
              control={control}
              name="companyName"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="회사명"
                  value={value}
                  onChangeText={onChange}
                  error={errors.companyName?.message}
                />
              )}
            />
          )}
        </View>

        <View className="mt-10">
          <Button
            text="가입하기"
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
