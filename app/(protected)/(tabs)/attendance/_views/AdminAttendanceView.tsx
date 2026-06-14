"use client";

import React, { useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Clock, AlertCircle, CheckCircle } from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

import ListPageLayout from "@/components/ListPageLayout";
import StatCard from "@/components/StatCard";
import AttendanceTable from "../_components/AttendanceTable";
import Pagination from "@/components/Pagination";

import {
  useFixLogList,
  useWorkLogList,
  useWorkLogDashboard,
} from "@/hooks/useAttendance";
import PageTabs from "@/components/PageTabs";

export default function AdminAttendancePage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const activeTab = (params.tab as string) || "MY";

  const [searchKeyword, setSearchKeyword] = useState("");
  const [myPage, setMyPage] = useState(1);
  const [approvalPage, setApprovalPage] = useState(1);

  const { data: dashboardData } = useWorkLogDashboard();
  const { data: myData, isLoading: isMyLoading } = useWorkLogList(myPage);
  const { data: approvalData, isLoading: isApprovalLoading } =
    useFixLogList(approvalPage);

  const isMyTab = activeTab === "MY";
  const displayData = isMyTab
    ? myData?.result || []
    : approvalData?.result || [];
  const isLoading = isMyTab ? isMyLoading : isApprovalLoading;
  const meta = isMyTab ? myData?.metadata : approvalData?.metadata;
  const currentPage = isMyTab ? myPage : approvalPage;
  const setCurrentPage = isMyTab ? setMyPage : setApprovalPage;

  const pendingCount = approvalData?.metadata?.totalCount || 0;
  const ADMIN_TABS = [
    { value: "MY", label: "근무 기록 내역" },
    { value: "APPROVALS", label: `정정 승인 목록 (${pendingCount})` },
  ];

  return (
    <ListPageLayout
      title="근태 정정 관리"
      description={
        isMyTab ? "본인의 근무 기록입니다." : "팀원들의 요청을 관리합니다."
      }
      noBackground={true}
      stats={
        <View className="flex-col gap-3">
          <StatCard
            label="정정 요청중"
            value={`${pendingCount}건`}
            color="text-[#FFA800]"
            icon={<AlertCircle size={24} color="#FFA800" />}
          />
          <StatCard
            label="정정 완료"
            value={`${dashboardData?.approvedCount || 0}건`}
            color="text-[#05CD99]"
            icon={<CheckCircle size={24} color="#05CD99" />}
          />
          <StatCard
            label="이번 달 총 근무"
            value={`${dashboardData?.totalWorkHours || 0}h`}
            color="text-[#4318FF]"
            icon={<Clock size={24} color="#4318FF" />}
          />
        </View>
      }
      tabs={
        <PageTabs
          tabs={ADMIN_TABS}
          activeTab={activeTab}
          onTabChange={(tab) => router.setParams({ tab })}
          searchKeyword={searchKeyword}
          onSearchChange={setSearchKeyword}
          searchPlaceholder={
            isMyTab ? "날짜 검색..." : "이름 또는 사유 검색..."
          }
        />
      }
    >
      <View className="items-end mb-4">
        <Text className="text-sm text-[#A3AED0]">
          총 {meta?.totalCount || 0}건
        </Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#4318FF" className="py-20" />
      ) : (
        <>
          <AttendanceTable
            data={displayData}
            type={isMyTab ? "view" : "correction"}
            onItemClick={(item: any) => {
              if (isMyTab && item.status !== "NORMAL" && !item.isFix) {
                router.push({
                  pathname: "/attendance/correction/create",
                  params: { id: item.id },
                });
              }
            }}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={meta?.totalPages || 1}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </ListPageLayout>
  );
}
