"use client";

import React, { useState } from "react";
import { View, Text, ActivityIndicator, Modal } from "react-native";
import { Clock, CheckCircle, AlertCircle } from "lucide-react-native";

import PageTabs from "@/components/PageTabs";
import StatCard from "@/components/StatCard";
import Pagination from "@/components/Pagination";
import ListPageLayout from "@/components/ListPageLayout";
import { RejectModal } from "@/components/RejectModal";
import { useVacation } from "@/hooks/useVacation";
import VacationTable from "../_components/VacationTable";

export default function OwnerVacationPage() {
  const [approvalPage, setApprovalPage] = useState(1);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null,
  );

  const { useApprovalList, useApproveVacation, useRejectVacation } =
    useVacation();
  const { data, isLoading } = useApprovalList(approvalPage);

  const approveMutation = useApproveVacation();
  const rejectMutation = useRejectVacation();

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
        title="휴가 승인 관리"
        description="팀원의 휴가 신청을 최종 승인합니다."
        noBackground={true}
        stats={
          <View className="flex-col gap-3">
            <StatCard
              label="승인 대기"
              value={`${data?.summary?.pending || 0}건`}
              color="text-[#FFA800]"
              icon={<AlertCircle size={20} />}
            />
            <StatCard
              label="승인 완료"
              value={`${data?.summary?.approved || 0}건`}
              color="text-[#05CD99]"
              icon={<CheckCircle size={20} />}
            />
            <StatCard
              label="반려"
              value={`${data?.summary?.rejected || 0}건`}
              color="text-[#EE5D50]"
              icon={<Clock size={20} />}
            />
          </View>
        }
        tabs={
          <PageTabs
            tabs={[{ value: "APPROVALS", label: "휴가 승인 목록" }]}
            activeTab="APPROVALS"
            onTabChange={() => {}}
          />
        }
      >
        {isLoading ? (
          <ActivityIndicator size="large" className="py-20" />
        ) : (
          <>
            <VacationTable
              data={data?.data || []}
              onApprove={(id: string) => approveMutation.mutate(id)}
              onReject={handleRejectClick}
              onItemClick={(item) => console.log("상세보기:", item)} // 이제 필수값이 제공됨
            />
            <Pagination
              currentPage={approvalPage}
              totalPages={data?.meta?.totalPages || 1}
              onPageChange={setApprovalPage}
            />
          </>
        )}
      </ListPageLayout>

      {/* 모달은 리액트 네이티브의 Modal 컴포넌트를 사용 */}
      <RejectModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onSubmit={handleRejectSubmit}
      />
    </View>
  );
}
