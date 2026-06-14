"use client";

import React, { useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Clock, AlertCircle, CheckCircle } from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

import ListPageLayout from "@/components/ListPageLayout";
import StatCard from "@/components/StatCard";
import AttendanceTable from "../_components/AttendanceTable";
import Pagination from "@/components/Pagination";

// 로직 훅은 웹과 완벽하게 동일합니다.
import {
  useFixLogList,
  useWorkLogList,
  useWorkLogDashboard,
} from "@/hooks/useAttendance";
import { AttendanceTabType } from "@/types/attendance";
import PageTabs from "@/components/PageTabs";

export default function UserAttendancePage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const activeTab = (params.tab as AttendanceTabType) || "LIST";

  const [searchKeyword, setSearchKeyword] = useState("");
  const [workLogPage, setWorkLogPage] = useState(1);
  const [fixLogPage, setFixLogPage] = useState(1);

  const { data: dashboardData } = useWorkLogDashboard();
  const { data: workLogData, isLoading: isLoadingList } =
    useWorkLogList(workLogPage);
  const { data: fixLogData, isLoading: isLoadingFix } =
    useFixLogList(fixLogPage);

  const isListView = activeTab === "LIST";
  const displayData = isListView
    ? workLogData?.result || []
    : fixLogData?.result || [];
  const isLoading = isListView ? isLoadingList : isLoadingFix;
  const meta = isListView ? workLogData?.metadata : fixLogData?.metadata;
  const currentPage = isListView ? workLogPage : fixLogPage;
  const setCurrentPage = isListView ? setWorkLogPage : setFixLogPage;

  const ATTENDANCE_TABS = [
    { value: "LIST", label: "근무 기록 내역" },
    { value: "STATISTICS", label: "정정 신청 내역" },
  ];

  return (
    <ListPageLayout
      title="근태 정정 관리"
      description="근무 기록을 확인하고 잘못된 기록은 정정을 요청할 수 있습니다."
      noBackground={true}
      stats={
        <View className="flex-col gap-4">
          <StatCard
            label="정정 요청중"
            value={`${dashboardData?.pendingCount || 0}건`}
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
          tabs={ATTENDANCE_TABS}
          activeTab={activeTab}
          onTabChange={(tab) => router.setParams({ tab })}
          searchKeyword={searchKeyword}
          onSearchChange={setSearchKeyword}
          searchPlaceholder={isListView ? "날짜 검색..." : "사유 검색..."}
        />
      }
    >
      <View className="items-end mb-4">
        <Text className="text-sm text-[#A3AED0] font-medium">
          총 {meta?.totalCount || 0}건
        </Text>
      </View>

      {isLoading ? (
        <View className="py-20 items-center justify-center">
          <ActivityIndicator size="large" color="#4318FF" />
        </View>
      ) : (
        <>
          <AttendanceTable
            data={displayData}
            type={isListView ? "view" : "correction"}
            onItemClick={(item: any) => {
              const isAlreadyFixing =
                item.isFix || item.apprStatus === "PENDING";
              const isNormal = item.status === "NORMAL";

              if (isListView && !isAlreadyFixing && !isNormal) {
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
