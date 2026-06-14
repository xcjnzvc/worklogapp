"use client";

import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Plus, Clock, CheckCircle, List } from "lucide-react-native";
import { useRouter } from "expo-router";

import PageTabs from "@/components/PageTabs";
import StatCard from "@/components/StatCard";
import Pagination from "@/components/Pagination";
import ListPageLayout from "@/components/ListPageLayout";
import VacationTable from "../_components/VacationTable";
import { RejectModal } from "@/components/RejectModal";
import { useVacation } from "@/hooks/useVacation";
import { VacationItem, VacationTableRow } from "@/types/vacation";

export default function AdminVacationPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"MY" | "APPROVALS">("MY");
  const [currentPage, setCurrentPage] = useState(1);
  const [approvalPage, setApprovalPage] = useState(1);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null,
  );

  const {
    useVacationList,
    useApprovalList,
    useApproveVacation,
    useRejectVacation,
  } = useVacation();

  const { data, isLoading } = useVacationList(currentPage);
  const { data: approvalData, isLoading: approvalLoading } = useApprovalList(
    approvalPage,
    "PENDING",
  );

  const approveMutation = useApproveVacation();
  const rejectMutation = useRejectVacation();

  // [데이터 가공 로직] VacationItem[] -> VacationTableRow[] 변환
  const tableData = useMemo((): VacationTableRow[] => {
    if (!data?.list) return [];
    return (data.list as VacationItem[]).map((item, index) => ({
      ...item,
      displayId: String(index + 1).padStart(3, "0"),
      formattedPeriod:
        item.startDate === item.endDate
          ? item.startDate
          : `${item.startDate} - ${item.endDate.split(".").slice(2).join(".")}`,
    }));
  }, [data]);

  const handleRejectClick = (id: string) => {
    setSelectedRequestId(id);
    setIsRejectModalOpen(true);
  };

  const handleRejectSubmit = (reason: string) => {
    if (!selectedRequestId) return;
    rejectMutation.mutate(
      { id: selectedRequestId, rejectReason: reason },
      {
        onSuccess: () => {
          setIsRejectModalOpen(false);
          setSelectedRequestId(null);
        },
      },
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ListPageLayout
        title="휴가 관리"
        description="팀원 휴가를 승인하고 나의 휴가를 신청할 수 있습니다."
        noBackground={true}
        stats={
          <View className="flex-col gap-3">
            <StatCard
              label="승인 대기"
              value={`${approvalData?.meta?.totalCount || 0}건`}
              color="text-[#FFA800]"
              icon={<Clock size={20} />}
            />
            <StatCard
              label="잔여 연차"
              value={`${data?.summary?.remaining || 0}일`}
              color="text-[#00B050]"
              icon={<List size={20} />}
            />
            <StatCard
              label="사용한 연차"
              value={`${data?.summary?.used || 0}일`}
              color="text-[#4318FF]"
              icon={<CheckCircle size={20} />}
            />
          </View>
        }
        tabs={
          <PageTabs
            tabs={[
              { value: "MY", label: "휴가 내역" },
              {
                value: "APPROVALS",
                label: `승인 목록(${approvalData?.meta?.totalCount || 0})`,
              },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        }
      >
        {isLoading || approvalLoading ? (
          <ActivityIndicator size="large" className="py-20" />
        ) : activeTab === "MY" ? (
          <>
            <VacationTable
              data={tableData}
              onItemClick={(item) => console.log("상세보기:", item)}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={data?.metadata?.totalPages || 1}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <>
            <VacationTable
              data={approvalData?.data || []}
              onApprove={(id: string) => approveMutation.mutate(id)}
              onReject={handleRejectClick}
              onItemClick={(item) => console.log("상세보기:", item)}
            />
            <Pagination
              currentPage={approvalPage}
              totalPages={approvalData?.meta?.totalPages || 1}
              onPageChange={setApprovalPage}
            />
          </>
        )}
      </ListPageLayout>

      <TouchableOpacity
        onPress={() => router.push("/vacation/create")}
        className="absolute bottom-6 right-6 bg-[#0029C0] w-14 h-14 rounded-full items-center justify-center shadow-lg"
      >
        <Plus size={28} color="white" />
      </TouchableOpacity>

      <RejectModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onSubmit={handleRejectSubmit}
      />
    </View>
  );
}
