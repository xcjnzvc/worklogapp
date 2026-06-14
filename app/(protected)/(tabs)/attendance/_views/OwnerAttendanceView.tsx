"use client";

import React, { useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Clock, AlertCircle, CheckCircle } from "lucide-react-native";

import {
  useFixLogListMgmt,
  useWorkLogDashboard,
  useApproveAttendance,
  useRejectAttendance,
} from "@/hooks/useAttendance";

import ListPageLayout from "@/components/ListPageLayout";
import StatCard from "@/components/StatCard";
import AttendanceTable from "../_components/AttendanceTable";
import Pagination from "@/components/Pagination";

function OwnerAttendanceContent() {
  const [approvalPage, setApprovalPage] = useState(1);
  const [rejectModal, setRejectModal] = useState<{ id: string } | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const { data: dashboardData } = useWorkLogDashboard();
  const { data: approvalData, isLoading } = useFixLogListMgmt(approvalPage);

  const approveMutation = useApproveAttendance();
  const rejectMutation = useRejectAttendance();

  const displayData = approvalData?.result || [];
  const meta = approvalData?.metadata;
  const pendingCount = meta?.totalCount || 0;

  return (
    <ListPageLayout
      title="근태 정정 최종 승인"
      description="팀원의 근태 정정 기록을 승인/반려합니다."
      noBackground={true}
      stats={
        <View className="flex-col gap-3">
          <StatCard
            label="승인 대기 건수"
            value={`${pendingCount}건`}
            color="text-[#FFA800]"
            icon={<AlertCircle size={24} color="#FFA800" />}
          />
          <StatCard
            label="이번 달 승인 완료"
            value={`${dashboardData?.approvedCount || 0}건`}
            color="text-[#05CD99]"
            icon={<CheckCircle size={24} color="#05CD99" />}
          />
          <StatCard
            label="이번 달 전체 정정 대상"
            value={`${(dashboardData?.pendingCount || 0) + (dashboardData?.approvedCount || 0)}건`}
            color="text-[#4318FF]"
            icon={<Clock size={24} color="#4318FF" />}
          />
        </View>
      }
      tabs={<View />} // 탭이 하나면 간단한 헤더로 대체해도 좋습니다.
    >
      <AttendanceTable
        data={displayData}
        type="correction"
        onApprove={(id: string) => approveMutation.mutate(id)}
        onReject={(id: string) => setRejectModal({ id })}
      />
      <Pagination
        currentPage={approvalPage}
        totalPages={meta?.totalPages || 1}
        onPageChange={setApprovalPage}
      />

      {/* 반려 모달 (React Native Modal 컴포넌트) */}
      <Modal visible={!!rejectModal} transparent animationType="fade">
        <View className="flex-1 bg-black/40 items-center justify-center p-4">
          <View className="bg-white rounded-[24px] p-6 w-full max-w-[400px]">
            <Text className="text-lg font-black text-[#1B254B] mb-4">
              반려 사유
            </Text>
            <TextInput
              placeholder="반려 사유를 입력하세요."
              className="border border-gray-200 rounded-xl p-4 h-[100px] mb-2"
              multiline
              value={rejectReason}
              onChangeText={setRejectReason}
            />
            <View className="flex-row gap-2 mt-4">
              <TouchableOpacity
                onPress={() => setRejectModal(null)}
                className="flex-1 py-3 bg-gray-100 rounded-xl items-center"
              >
                <Text className="font-bold text-[#707EAE]">취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  rejectMutation.mutate({
                    id: rejectModal!.id,
                    reason: rejectReason,
                  });
                  setRejectModal(null);
                  setRejectReason("");
                }}
                className="flex-1 py-3 bg-[#EE5D50] rounded-xl items-center"
              >
                <Text className="font-bold text-white">반려 확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ListPageLayout>
  );
}

export default OwnerAttendanceContent;
