import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

const Pagination = ({ currentPage, totalPages, onPageChange }: any) => {
  if (totalPages <= 1) return <View className="mb-10" />;

  return (
    <View className="flex-row items-center justify-center gap-2 mt-6 mb-10">
      <TouchableOpacity
        disabled={currentPage === 1}
        onPress={() => onPageChange(currentPage - 1)}
        className="p-2 rounded-xl bg-white border border-gray-100 disabled:opacity-30"
      >
        <ChevronLeft size={20} color="#707EAE" />
      </TouchableOpacity>

      {/* 모바일은 공간이 좁으므로 너무 많은 페이지 번호보다 현재 페이지 중심으로 보여주는 게 좋습니다 */}
      <Text className="text-sm font-bold text-[#1B254B]">
        {currentPage} / {totalPages}
      </Text>

      <TouchableOpacity
        disabled={currentPage === totalPages}
        onPress={() => onPageChange(currentPage + 1)}
        className="p-2 rounded-xl bg-white border border-gray-100 disabled:opacity-30"
      >
        <ChevronRight size={20} color="#707EAE" />
      </TouchableOpacity>
    </View>
  );
};

export default Pagination;
