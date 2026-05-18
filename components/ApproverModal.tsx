import React from "react";
import { View, Text, Modal, TouchableOpacity, ScrollView } from "react-native";
import { User, X } from "lucide-react-native";
import { Approver } from "@/types/user";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  approvers: Approver[];
  onSelect: (approver: Approver) => void;
  selectedId?: string;
}

export default function ApproverModal({
  isOpen,
  onClose,
  approvers,
  onSelect,
  selectedId,
}: Props) {
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade" // 모바일에서 자연스러운 페이드 오버레이 효과
      onRequestClose={onClose} // 안드로이드 백버튼 대응
    >
      {/* 바깥 어두운 배경 영역 터치 시 닫힘 */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        className="flex-1 bg-[#1B254B]/40 justify-center items-center px-6"
      >
        {/* 모달 컨텐츠 바디 (안쪽 터치 시 이벤트 전파 방지를 위해 activeOpacity={1}) */}
        <TouchableOpacity
          activeOpacity={1}
          className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl p-6 overflow-hidden"
        >
          {/* 타이틀 및 닫기 버튼 탭 */}
          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-[18px] font-black text-[#1B254B]">
              결재권자 선택
            </Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <X size={22} color="#A3AED0" />
            </TouchableOpacity>
          </View>

          {/* 명단 리스트 영역 (최대 높이를 주고 스크롤 가능하게 커스텀) */}
          <View className="max-h-[350px]">
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="gap-2.5 pb-2">
                {approvers.map((person) => {
                  const isSelected = selectedId === person.id;

                  return (
                    <TouchableOpacity
                      key={person.id}
                      activeOpacity={0.8}
                      onPress={() => {
                        onSelect(person);
                        onClose();
                      }}
                      // 💡 모바일 환경에서 에러를 유발하던 'transition-all'을 제거했습니다!
                      className={`w-full flex-row items-center gap-4 p-4 rounded-2xl border-2 ${
                        isSelected
                          ? "border-[#0029C0] bg-[#F4F7FE]"
                          : "border-transparent bg-[#F8F9FA]"
                      }`}
                    >
                      {/* 아바타 아이콘 링 */}
                      <View className="w-10 h-10 rounded-xl bg-white items-center justify-center text-[#0029C0] shadow-sm shadow-gray-200">
                        <User size={18} color="#0029C0" />
                      </View>

                      {/* 텍스트 디테일 */}
                      <View className="flex-1 items-start">
                        <Text className="font-bold text-[15px] text-[#1B254B]">
                          {person.name}
                        </Text>
                        <Text className="text-[11px] text-[#A3AED0] font-medium uppercase tracking-wider mt-0.5">
                          {person.role === "OWNER" ? "대표" : "팀장"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
