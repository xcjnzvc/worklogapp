"use client";

import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Plus, Calendar, PieChart, List } from "lucide-react-native";
import { useRouter } from "expo-router";

import PageTabs from "@/components/PageTabs";
import ListPageLayout from "@/components/ListPageLayout";
import StatCard from "@/components/StatCard";
import Pagination from "@/components/Pagination";
import VacationTable from "../_components/VacationTable";

import { useVacation } from "@/hooks/useVacation";

export default function UserVacationPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");

  const { useVacationList } = useVacation();
  const { data, isLoading, isError } = useVacationList(currentPage);

  const filteredData = useMemo(() => {
    if (!data?.list) return [];
    return data.list.map((item: any, index: number) => ({
      ...item,
      displayId: String(index + 1).padStart(3, "0"),
      formattedPeriod:
        item.startDate === item.endDate
          ? item.startDate
          : `${item.startDate} - ${item.endDate.split(".").slice(2).join(".")}`,
    }));
  }, [data, searchKeyword]);

  if (isLoading) return <ActivityIndicator size="large" className="flex-1" />;
  if (isError || !data)
    return <Text className="p-10 text-red-500">에러 발생</Text>;

  return (
    <View className="flex-1 bg-gray-50">
      <ListPageLayout
        title="휴가 관리"
        description="나의 휴가 현황을 확인하세요."
        noBackground={true}
        stats={
          <View className="flex-col gap-3">
            <StatCard
              label="총 연차"
              value={`${data.summary.total}일`}
              color="text-[#1B254B]"
              icon={<Calendar size={20} />}
            />
            <StatCard
              label="사용한 연차"
              value={`${data.summary.used}일`}
              color="text-[#4318FF]"
              icon={<PieChart size={20} />}
            />
            <StatCard
              label="잔여 연차"
              value={`${data.summary.remaining}일`}
              color="text-[#00B050]"
              icon={<List size={20} />}
            />
          </View>
        }
        tabs={
          <PageTabs
            tabs={[{ value: "MY", label: "휴가 내역 목록" }]}
            activeTab="MY"
            onTabChange={() => {}}
            searchKeyword={searchKeyword}
            onSearchChange={setSearchKeyword}
            searchPlaceholder="검색..."
          />
        }
      >
        <VacationTable
          data={filteredData}
          onItemClick={(item: any) => console.log(item)}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={data.metadata?.totalPages || 1}
          onPageChange={setCurrentPage}
        />
      </ListPageLayout>

      {/* 모바일 플로팅 버튼 (Floating Action Button) */}
      <TouchableOpacity
        onPress={() => router.push("/vacation/create")}
        className="absolute bottom-6 right-6 bg-[#0029C0] w-14 h-14 rounded-full items-center justify-center shadow-lg"
      >
        <Plus size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}
