"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import {
  Mail,
  Clock,
  CheckCircle,
  Shield,
  User,
  Zap,
  ShieldCheck,
} from "lucide-react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "react-native-toast-message";

import ListPageLayout from "@/components/ListPageLayout";
import StatCard from "@/components/StatCard";
import PageTabs from "@/components/PageTabs";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Pagination from "@/components/Pagination";
import InviteTable from "./_components/InviteTable";
import InviteLinkCard from "./_components/InviteLinkCard";
import UpgradeModal from "./_components/UpgradeModal";
import { inviteAPI, getInviteHistoryAPI, resendInviteAPI } from "@/api/invite";
import { inviteSchema, InviteForm } from "@/types/auth";
import { InviteResponse, InviteHistoryItem } from "@/types/invite";

export default function AdminInvitePage() {
  const [activeTab, setActiveTab] = useState<"CREATE" | "HISTORY">("CREATE");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [inviteResult, setInviteResult] = useState<InviteResponse | null>(null);
  const [historyList, setHistoryList] = useState<InviteHistoryItem[]>([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isValid },
  } = useForm<InviteForm>({
    resolver: zodResolver(inviteSchema),
    mode: "onTouched",
  });

  const roleValue = watch("role");

  // 데이터 불러오기 함수
  const fetchHistory = useCallback(async () => {
    try {
      const data = await getInviteHistoryAPI();
      setHistoryList(data);
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "초대 내역을 불러오는 데 실패했습니다.",
      });
    }
  }, []);

  // 탭 변경 시 데이터 로드
  useEffect(() => {
    if (activeTab === "HISTORY") {
      fetchHistory();
    }
  }, [activeTab, fetchHistory]);

  const onSubmit = async (data: InviteForm) => {
    setIsSubmitting(true);
    try {
      const response = await inviteAPI(data);
      setInviteResult(response);
      Toast.show({ type: "success", text1: "초대 링크 발행 성공!" });
    } catch (err: any) {
      const msg = err?.response?.data?.message || "";
      if (msg.includes("최대 인원")) {
        setShowUpgradeModal(true);
      } else {
        Toast.show({
          type: "error",
          text1: msg || "초대에 실패했습니다.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async (email: string) => {
    try {
      await resendInviteAPI(email);
      Toast.show({ type: "success", text1: "성공적으로 재발송되었습니다!" });
      fetchHistory();
    } catch (error) {
      Toast.show({ type: "error", text1: "재발송에 실패했습니다." });
    }
  };

  const handleResetForm = () => {
    setInviteResult(null);
    reset();
  };

  const filteredHistory = useMemo(() => {
    return historyList
      .filter((item) =>
        item.email.toLowerCase().includes(searchKeyword.toLowerCase()),
      )
      .map((item, index) => ({
        ...item,
        displayId: String(index + 1).padStart(3, "0"),
      }));
  }, [historyList, searchKeyword]);

  const pendingCount = historyList.filter((i) => i.status === "PENDING").length;
  const acceptedCount = historyList.filter(
    (i) => i.status === "ACCEPTED",
  ).length;

  return (
    <View className="flex-1 bg-gray-50">
      <ListPageLayout
        title="조직 구성원 초대 관리"
        description="새로운 팀원을 서비스에 초대하고 전사 시스템 권한 및 발송 내역을 모니터링합니다."
        noBackground={true}
        stats={
          <View className="flex-col gap-3">
            <StatCard
              label="총 발송된 초대"
              value={`${historyList.length}건`}
              color="text-[#0029C0]"
              icon={<Mail size={20} />}
            />
            <StatCard
              label="가입 대기중"
              value={`${pendingCount}건`}
              color="text-[#FFA800]"
              icon={<Clock size={20} />}
            />
            <StatCard
              label="가입 완료"
              value={`${acceptedCount}건`}
              color="text-[#00B050]"
              icon={<CheckCircle size={20} />}
            />
          </View>
        }
        tabs={
          <PageTabs
            tabs={[
              { value: "CREATE", label: "신규 초대장 발송" },
              { value: "HISTORY", label: "초대 발령 내역" },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            searchKeyword={activeTab === "HISTORY" ? searchKeyword : undefined}
            onSearchChange={
              activeTab === "HISTORY" ? setSearchKeyword : undefined
            }
            searchPlaceholder="초대 이메일 검색..."
          />
        }
      >
        <ScrollView className="pt-4 pb-10" showsVerticalScrollIndicator={false}>
          {activeTab === "CREATE" ? (
            inviteResult ? (
              <View className="bg-white rounded-[32px] border border-gray-100 p-6">
                <InviteLinkCard
                  inviteLink={inviteResult.inviteLink}
                  expiresAt={inviteResult.expiresAt}
                  onReset={handleResetForm}
                />
              </View>
            ) : (
              <View className="gap-6">
                {/* 입력 폼 카드 */}
                <View className="bg-white rounded-[28px] p-6 border border-gray-100">
                  <View className="bg-[#F4F7FE] self-start px-3.5 py-1.5 rounded-full mb-3">
                    <Text className="text-xs font-black uppercase tracking-widest text-[#4318FF]">
                      WORKSPACE CONTROL
                    </Text>
                  </View>
                  <Text className="text-[22px] font-black text-[#1B254B] tracking-tight mb-2">
                    이메일 초대장 생성
                  </Text>
                  <Text className="text-sm font-semibold text-[#A3AED0] leading-relaxed mb-6">
                    조직의 가입 대상자에게 고유 가입 링크를 안전하게 발행하며,
                    역할 기반 접근 제어(RBAC)를 설정합니다.
                  </Text>

                  <Controller
                    control={control}
                    name="email"
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <Input
                        label="초대 대상 이메일 주소"
                        placeholder="name@company.com"
                        value={value}
                        onChangeText={onChange}
                        error={error?.message}
                        success={!error && !!value && value.length > 0}
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    )}
                  />

                  <Text className="text-xs font-black uppercase tracking-widest text-[#1B254B] mt-8 mb-3">
                    부여할 시스템 권한 그룹
                  </Text>

                  <View className="gap-4">
                    {/* USER */}
                    <TouchableOpacity
                      onPress={() =>
                        setValue("role", "USER", { shouldValidate: true })
                      }
                      className={`p-5 rounded-[22px] border ${
                        roleValue === "USER"
                          ? "bg-white border-[#0029C0]"
                          : "bg-white border-gray-100"
                      }`}
                    >
                      <View
                        className={`w-9 h-9 rounded-xl items-center justify-center mb-4 ${
                          roleValue === "USER" ? "bg-[#0029C0]/5" : "bg-gray-50"
                        }`}
                      >
                        <User
                          size={18}
                          color={roleValue === "USER" ? "#0029C0" : "#707EAE"}
                        />
                      </View>
                      <Text
                        className={`text-[15px] font-black mb-1.5 ${
                          roleValue === "USER"
                            ? "text-[#0029C0]"
                            : "text-[#1B254B]"
                        }`}
                      >
                        일반 직원 (USER)
                      </Text>
                      <Text className="text-[12px] text-[#A3AED0] font-semibold leading-relaxed">
                        출퇴근 로그 기록, 본인의 연차 신청 및 정정 대행용 기본
                        권한
                      </Text>
                    </TouchableOpacity>

                    {/* ADMIN */}
                    <TouchableOpacity
                      onPress={() =>
                        setValue("role", "ADMIN", { shouldValidate: true })
                      }
                      className={`p-5 rounded-[22px] border ${
                        roleValue === "ADMIN"
                          ? "bg-white border-[#0029C0]"
                          : "bg-white border-gray-100"
                      }`}
                    >
                      <View
                        className={`w-9 h-9 rounded-xl items-center justify-center mb-4 ${
                          roleValue === "ADMIN" ? "bg-purple-50" : "bg-gray-50"
                        }`}
                      >
                        <Shield
                          size={18}
                          color={roleValue === "ADMIN" ? "#9333ea" : "#707EAE"}
                        />
                      </View>
                      <Text
                        className={`text-[15px] font-black mb-1.5 ${
                          roleValue === "ADMIN"
                            ? "text-purple-600"
                            : "text-[#1B254B]"
                        }`}
                      >
                        관리자 (ADMIN)
                      </Text>
                      <Text className="text-[12px] text-[#A3AED0] font-semibold leading-relaxed">
                        전사 출퇴근 최종 결재 승인 및 근무 시간 규칙 설정 최상위
                        권한
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View className="mt-8">
                    <Button
                      text={
                        isSubmitting
                          ? "처리 중..."
                          : "초대 링크 생성 및 메일 발송"
                      }
                      onPress={handleSubmit(onSubmit)}
                      disabled={!isValid || isSubmitting}
                    />
                  </View>
                </View>

                {/* 가이드 카드 1: 링크 유효 기간 */}
                <View className="bg-[#F7F9FF] rounded-[28px] p-6 border border-blue-50 gap-4">
                  <View className="flex-row items-center gap-3.5 pb-4 border-b border-gray-100">
                    <View className="w-10 h-10 rounded-xl bg-white items-center justify-center">
                      <Clock size={18} color="#4318FF" />
                    </View>
                    <Text className="text-[16px] font-extrabold text-[#1B254B]">
                      초대장 유효 기간 안내
                    </Text>
                  </View>
                  <Text className="text-[13px] text-[#707EAE] font-semibold leading-relaxed">
                    조직 보안 정책에 따라, 생성된 가입 보안 토큰 링크는{" "}
                    <Text className="font-bold text-[#1B254B]">
                      발행 후 72시간 동안만
                    </Text>{" "}
                    활성화됩니다. 기간이 만료되면 해당 토큰은 자동으로
                    폐기되므로 `초대 발령 내역` 탭에서 재발송해야 합니다.
                  </Text>
                  <View className="flex-row bg-white items-center gap-2 p-3 rounded-lg border border-gray-100">
                    <ShieldCheck size={16} color="#05CD99" />
                    <Text className="text-xs text-[#707EAE] flex-1">
                      보안 서버를 통해 가입 토큰이 암호화됩니다.
                    </Text>
                  </View>
                </View>

                {/* 가이드 카드 2: 권한 부여 주의사항 */}
                <View className="bg-white rounded-[28px] p-6 border border-gray-100 gap-4 mb-[40px]">
                  <View className="flex-row items-center gap-3.5 pb-4 border-b border-gray-100">
                    <View className="w-10 h-10 rounded-xl bg-purple-50 items-center justify-center">
                      <Zap size={18} color="#9333ea" />
                    </View>
                    <Text className="text-[16px] font-extrabold text-[#1B254B]">
                      권한 그룹 부여 주의사항
                    </Text>
                  </View>

                  <View className="gap-1.5">
                    <View className="self-start px-2 py-0.5 rounded-md bg-purple-50">
                      <Text className="text-purple-600 text-[11px] font-black tracking-wider">
                        ADMIN (관리자)
                      </Text>
                    </View>
                    <Text className="text-[12px] text-[#707EAE] font-semibold leading-relaxed">
                      전사 근태 정정 최종 승인, 조직도 편집 및 연차 정책 설정을
                      제어할 수 있는 최상위 권한이 부여되므로, 발송 전 메일
                      주소가 정확한지 반드시 다시 한번 확인하시기 바랍니다.
                    </Text>
                  </View>

                  <View className="gap-1.5">
                    <View className="self-start px-2 py-0.5 rounded-md bg-blue-50">
                      <Text className="text-blue-600 text-[11px] font-black tracking-wider">
                        USER (일반 직원)
                      </Text>
                    </View>
                    <Text className="text-[12px] text-[#707EAE] font-semibold leading-relaxed">
                      개인 출퇴근 체크, 휴가 신청, 본인의 근태 기록 조회 등
                      기본적인 서비스 이용 권한만 부여받습니다.
                    </Text>
                  </View>
                </View>
              </View>
            )
          ) : (
            <View className="gap-6">
              <InviteTable data={filteredHistory} onResend={handleResend} />
              <Pagination
                currentPage={currentPage}
                totalPages={1}
                onPageChange={setCurrentPage}
              />
            </View>
          )}
        </ScrollView>
      </ListPageLayout>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </View>
  );
}
