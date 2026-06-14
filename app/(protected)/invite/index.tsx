"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
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

import ListPageLayout from "@/components/ListPageLayout";
import StatCard from "@/components/StatCard";
import PageTabs from "@/components/PageTabs";
import Input from "@/components/Input";
import Button from "@/components/Button";
import InviteTable from "./_components/InviteTable";
import InviteLinkCard from "./_components/InviteLinkCard";
import UpgradeModal from "./_components/UpgradeModal";
import { inviteAPI, getInviteHistoryAPI, resendInviteAPI } from "@/api/invite";
import { inviteSchema, InviteForm } from "@/types/auth";

export default function AdminInvitePage() {
  const [activeTab, setActiveTab] = useState<"CREATE" | "HISTORY">("CREATE");
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [inviteResult, setInviteResult] = useState<any>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

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

  const fetchHistory = useCallback(async () => {
    try {
      const data = await getInviteHistoryAPI();
      setHistoryList(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "HISTORY") fetchHistory();
  }, [activeTab]);

  const onSubmit = async (data: InviteForm) => {
    try {
      const res = await inviteAPI(data);
      setInviteResult(res);
      fetchHistory();
    } catch (err: any) {
      if (err?.response?.data?.message?.includes("최대 인원"))
        setShowUpgradeModal(true);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ListPageLayout
        title="조직 구성원 초대 관리"
        description="새로운 팀원을 초대하고 전사 시스템 권한을 설정합니다."
        noBackground={true}
        stats={
          <View className="flex-col gap-3">
            <StatCard
              label="총 발송"
              value={`${historyList.length}건`}
              color="text-[#0029C0]"
              icon={<Mail size={20} />}
            />
            <StatCard
              label="가입 대기"
              value={`${historyList.filter((i) => i.status === "PENDING").length}건`}
              color="text-[#FFA800]"
              icon={<Clock size={20} />}
            />
            <StatCard
              label="가입 완료"
              value={`${historyList.filter((i) => i.status === "ACCEPTED").length}건`}
              color="text-[#05CD99]"
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
          />
        }
      >
        <ScrollView
          className="px-5 pt-4 pb-10"
          showsVerticalScrollIndicator={false}
        >
          {activeTab === "CREATE" ? (
            inviteResult ? (
              <InviteLinkCard
                inviteLink={inviteResult.inviteLink}
                expiresAt={inviteResult.expiresAt}
                onReset={() => {
                  setInviteResult(null);
                  reset();
                }}
              />
            ) : (
              <View className="gap-6">
                <View className="bg-white p-6 rounded-3xl border border-gray-100">
                  <Text className="text-xs font-black text-[#4318FF] uppercase mb-2">
                    WORKSPACE CONTROL
                  </Text>
                  <Text className="text-[22px] font-black text-[#1B254B] mb-4">
                    이메일 초대장 생성
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
                        value={value}
                        onChangeText={onChange}
                        error={error?.message}
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    )}
                  />

                  <Text className="text-xs font-black uppercase text-[#1B254B] mt-6 mb-3">
                    시스템 권한 그룹
                  </Text>
                  <View className="flex-row gap-4">
                    {["USER", "ADMIN"].map((r) => (
                      <TouchableOpacity
                        key={r}
                        onPress={() => setValue("role", r as any)}
                        className={`flex-1 p-5 rounded-[22px] border ${roleValue === r ? "border-[#0029C0] bg-blue-50" : "border-gray-100 bg-white"}`}
                      >
                        {r === "USER" ? (
                          <User
                            size={20}
                            color={roleValue === r ? "#0029C0" : "#666"}
                          />
                        ) : (
                          <Shield
                            size={20}
                            color={roleValue === r ? "#9333ea" : "#666"}
                          />
                        )}
                        <Text className="font-bold mt-2 text-sm text-[#1B254B]">
                          {r === "USER" ? "일반 직원" : "관리자"}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Button
                    text="초대 링크 생성"
                    onPress={handleSubmit(onSubmit)}
                    disabled={!isValid}
                  />
                </View>

                {/* 가이드 카드 섹션 */}
                <View className="bg-[#F7F9FF] p-6 rounded-[28px] border border-blue-50">
                  <View className="flex-row items-center gap-2 mb-2">
                    <Clock size={16} color="#4318FF" />
                    <Text className="font-bold text-[#1B254B]">
                      유효 기간 안내
                    </Text>
                  </View>
                  <Text className="text-xs text-[#707EAE] leading-5">
                    발행 후 72시간 동안만 유효합니다.
                  </Text>
                </View>
              </View>
            )
          ) : (
            <InviteTable
              data={historyList}
              onResend={(email: string) =>
                resendInviteAPI(email).then(fetchHistory)
              }
            />
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
