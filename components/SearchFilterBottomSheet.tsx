import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  StyleSheet,
  Dimensions,
} from "react-native";
import { RotateCcw, X } from "lucide-react-native";
import { Calendar, LocaleConfig, DateData } from "react-native-calendars";
import Button from "@/components/Button";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const TODAY = new Date().toISOString().split("T")[0];
const DAY_WIDTH = 38;
const DAY_HEIGHT = 34;

export type FilterData = {
  sortOrder: string;
  status: string;
  categoryValue: string; // 휴가 종류 혹은 근태 종류가 담길 곳
  startDate: string;
  endDate: string;
};

type SearchFilterProps = {
  isVisible: boolean;
  onClose: () => void;
  onApply: (data: FilterData) => void;
  categoryTitle: string; // 예: "휴가 종류" 또는 "근태 종류"
  categoryOptions: string[]; // 예: ["전체보기", "연차", "반차"] 또는 ["전체보기", "지각", "병결"]
};

export default function SearchFilterBottomSheet({
  isVisible,
  onClose,
  onApply,
  categoryTitle,
  categoryOptions,
}: SearchFilterProps) {
  const [sortOrder, setSortOrder] = useState("최신순");
  const [status, setStatus] = useState("전체");

  //  3. 초기값을 카테고리 옵션의 첫 번째 원소(보통 '전체보기' 혹은 '전체')로 유연하게 설정
  const [categoryValue, setCategoryValue] = useState(
    categoryOptions[0] || "전체보기",
  );

  const [startDate, setStartDate] = useState("2026-05-01");
  const [endDate, setEndDate] = useState("2026-05-31");
  const [selecting, setSelecting] = useState<"start" | "end">("start");

  const markedDates = useMemo(() => {
    const marked: Record<string, any> = {};
    if (!startDate || !endDate) return marked;

    if (startDate === endDate) {
      marked[startDate] = {
        startingDay: true,
        endingDay: true,
        color: "#0025C3",
        textColor: "#fff",
      };
      return marked;
    }

    marked[startDate] = {
      startingDay: true,
      color: "#0025C3",
      textColor: "#fff",
    };

    const start = new Date(startDate);
    const end = new Date(endDate);
    let current = new Date(start);
    current.setDate(current.getDate() + 1);
    while (current < end) {
      const dateStr = current.toISOString().split("T")[0];
      marked[dateStr] = { color: "#EEF2FF", textColor: "#0025C3" };
      current.setDate(current.getDate() + 1);
    }

    marked[endDate] = { endingDay: true, color: "#0025C3", textColor: "#fff" };
    return marked;
  }, [startDate, endDate]);

  const handleDayPress = (dateStr: string) => {
    if (selecting === "start") {
      setStartDate(dateStr);
      setSelecting("end");
    } else {
      if (dateStr < startDate) {
        setEndDate(startDate);
        setStartDate(dateStr);
      } else {
        setEndDate(dateStr);
      }
    }
  };

  const handleReset = () => {
    setSortOrder("최신순");
    setStatus("전체");
    setCategoryValue(categoryOptions[0] || "전체보기");
    setStartDate("2026-05-01");
    setEndDate("2026-05-31");
    setSelecting("start");
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.topDismissArea} onPress={onClose} />

        <View
          style={styles.sheetContainer}
          className="bg-white rounded-t-[40px] px-6 pt-2 pb-10 w-full"
        >
          <View className="py-4 items-center">
            <View className="w-12 h-1.5 bg-gray-200 rounded-full" />
          </View>

          <View className="flex-row justify-between items-center mb-6">
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
            >
              <X size={16} color="#6B7280" />
            </TouchableOpacity>
            <Text className="text-[18px] font-bold text-[#111]">상세 검색</Text>
            <TouchableOpacity onPress={handleReset} className="p-1">
              <RotateCcw size={14} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            className="flex-1"
            nestedScrollEnabled
          >
            <FilterSection title="정렬 기준">
              {["최신순", "오래된순", "사용일수순"].map((item) => (
                <FilterChip
                  key={item}
                  label={item}
                  isActive={sortOrder === item}
                  onPress={() => setSortOrder(item)}
                />
              ))}
            </FilterSection>

            <FilterSection title={categoryTitle}>
              {categoryOptions.map((item) => (
                <FilterChip
                  key={item}
                  label={item}
                  isActive={categoryValue === item}
                  onPress={() => setCategoryValue(item)}
                />
              ))}
            </FilterSection>

            <FilterSection title="결재 상태">
              {["전체", "승인대기", "승인완료", "반려"].map((item) => (
                <FilterChip
                  key={item}
                  label={item}
                  isActive={status === item}
                  onPress={() => setStatus(item)}
                />
              ))}
            </FilterSection>

            <Text className="text-[14px] font-bold text-gray-800 mb-4">
              조회 기간 설정
            </Text>

            <View className="flex-row bg-gray-50 rounded-2xl p-2 mb-4">
              <TouchableOpacity
                onPress={() => setSelecting("start")}
                className={`flex-1 py-3 rounded-xl items-center ${selecting === "start" ? "bg-white" : ""}`}
                style={selecting === "start" ? { elevation: 2 } : undefined}
              >
                <Text
                  className={`text-xs font-bold ${selecting === "start" ? "text-[#0025C3]" : "text-gray-400"}`}
                >
                  시작일
                </Text>
                <Text
                  className={`text-sm font-black ${selecting === "start" ? "text-black" : "text-gray-500"}`}
                >
                  {startDate.replace(/-/g, ".")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSelecting("end")}
                className={`flex-1 py-3 rounded-xl items-center ${selecting === "end" ? "bg-white" : ""}`}
                style={selecting === "end" ? { elevation: 2 } : undefined}
              >
                <Text
                  className={`text-xs font-bold ${selecting === "end" ? "text-[#0025C3]" : "text-gray-400"}`}
                >
                  종료일
                </Text>
                <Text
                  className={`text-sm font-black ${selecting === "end" ? "text-black" : "text-gray-500"}`}
                >
                  {endDate.replace(/-/g, ".")}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="mt-4 border-t border-gray-100 pt-4">
              <View style={{ height: 350 }}>
                <Calendar
                  current={selecting === "start" ? startDate : endDate}
                  markingType="period"
                  markedDates={markedDates}
                  onDayPress={(day) => handleDayPress(day.dateString)}
                  theme={{
                    todayTextColor: "#111",
                    arrowColor: "#0029C0",
                    textDayFontWeight: "500",
                    textMonthFontWeight: "700",
                    textDayHeaderFontWeight: "600",
                    dotColor: "#0029C0",
                    selectedDotColor: "#ffffff",
                    textDayFontSize: 14,
                    textMonthFontSize: 16,
                  }}
                  renderArrow={(direction) => (
                    <Text style={{ color: "#0029C0", fontSize: 16 }}>
                      {direction === "left" ? "‹" : "›"}
                    </Text>
                  )}
                  enableSwipeMonths
                  showSixWeeks
                  hideExtraDays={false}
                />
              </View>
            </View>
          </ScrollView>

          <Button
            text="필터 적용하기"
            onPress={() =>
              onApply({ sortOrder, status, categoryValue, startDate, endDate })
            }
          />
        </View>
      </View>
    </Modal>
  );
}

const dayStyles = StyleSheet.create({
  wrapper: {
    width: DAY_WIDTH,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  rangeFull: {
    position: "absolute",
    top: 9,
    left: 0,
    right: 0,
    height: DAY_HEIGHT,
  },
  rangeHalfRight: {
    position: "absolute",
    top: 9,
    left: DAY_WIDTH / 2,
    right: 0,
    height: DAY_HEIGHT,
  },
  rangeHalfLeft: {
    position: "absolute",
    top: 9,
    left: 0,
    right: DAY_WIDTH / 2,
    height: DAY_HEIGHT,
  },
  dayCircle: {
    width: DAY_HEIGHT,
    height: DAY_HEIGHT,
    borderRadius: DAY_HEIGHT / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  dayText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#0025C3",
    marginTop: 2,
  },
});

const FilterSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View className="mb-8">
    <Text className="text-[14px] font-bold text-gray-800 mb-4">{title}</Text>
    <View className="flex-row flex-wrap">{children}</View>
  </View>
);

const FilterChip = ({
  label,
  isActive,
  onPress,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.6}
    className={`px-4 py-2.5 rounded-xl mr-2 mb-2 border ${isActive ? "bg-[#EEF2FF] border-[#0025C3]" : "bg-gray-100 border-transparent"}`}
  >
    <Text
      className={`text-[13px] font-medium ${isActive ? "text-[#0025C3]" : "text-gray-400"}`}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  topDismissArea: { flex: 1 },
  sheetContainer: { height: SCREEN_HEIGHT * 0.85 },
});
