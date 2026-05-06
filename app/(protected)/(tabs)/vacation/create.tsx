import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { ChevronDown, Calendar as CalendarIcon } from "lucide-react-native";
import { Calendar } from "react-native-calendars";

export default function VacationCreateScreen() {
  const scrollViewRef = useRef<ScrollView>(null);

  const [leaveType, setLeaveType] = useState("연차");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const leaveTypes = ["연차", "반차", "병가", "경조사"];

  const [showCalendar, setShowCalendar] = useState(false);
  const [rangeStart, setRangeStart] = useState<string | null>(null);
  const [rangeEnd, setRangeEnd] = useState<string | null>(null);
  const [selectingMode, setSelectingMode] = useState<"start" | "end">("start");

  const displayDate = (dateString: string | null) => {
    if (!dateString) return "YYYY.MM.DD";
    return dateString.replace(/-/g, ".");
  };

  const handleDayPress = (day: any) => {
    if (selectingMode === "start") {
      setRangeStart(day.dateString);
      if (rangeEnd && day.dateString > rangeEnd) setRangeEnd(null);
      setSelectingMode("end");
    } else {
      if (rangeStart && day.dateString >= rangeStart) {
        setRangeEnd(day.dateString);
        setShowCalendar(false);
        setSelectingMode("start");
      }
    }
  };

  const getMarkedDates = () => {
    const marked: any = {};
    const today = new Date().toISOString().split("T")[0];
    marked[today] = { marked: true, dotColor: "#0029C0" };
    if (rangeStart)
      marked[rangeStart] = {
        ...marked[rangeStart],
        startingDay: true,
        color: "#0029C0",
        textColor: "white",
      };
    if (!rangeStart || !rangeEnd) return marked;
    marked[rangeEnd] = {
      ...marked[rangeEnd],
      endingDay: true,
      color: "#0029C0",
      textColor: "white",
    };
    let current = new Date(rangeStart);
    let end = new Date(rangeEnd);
    current.setDate(current.getDate() + 1);
    while (current < end) {
      const date = current.toISOString().split("T")[0];
      marked[date] = { ...marked[date], color: "#DCE7FF", textColor: "#111" };
      current.setDate(current.getDate() + 1);
    }
    return marked;
  };

  return (
    <SafeAreaView
      className="flex-1 bg-[#F8F9FA]"
      edges={["left", "right", "bottom"]}
    >
      <Stack.Screen options={{ title: "휴가 신청" }} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 140 : 20}
      >
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 180 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center mt-2 mb-4">
            <Text className="text-[22px] font-bold text-[#111]">휴가 신청</Text>
          </View>

          <View className="items-end mb-4">
            <TouchableOpacity
              activeOpacity={0.7}
              className="bg-[#0025C3] px-6 py-2.5 rounded-xl shadow-md"
            >
              <Text className="text-white font-semibold text-[14px]">저장</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-white rounded-[10px] px-4 mb-3 shadow-sm shadow-gray-200">
            <TextInput
              placeholder="제목을 입력해주세요"
              placeholderTextColor="#BDBDBD"
              className="h-[50px] text-[14px] text-[#333]"
            />
          </View>

          <View className="flex-row gap-x-2.5 mb-3 z-50">
            <View className="flex-1">
              <TouchableOpacity
                onPress={() => setShowTypeDropdown(!showTypeDropdown)}
                activeOpacity={0.8}
                className="bg-white rounded-2xl px-4 py-4 flex-row justify-between items-center shadow-sm shadow-gray-200"
              >
                <Text className="text-[#333] font-medium">{leaveType}</Text>
                <ChevronDown size={16} color="#BDBDBD" />
              </TouchableOpacity>
              {showTypeDropdown && (
                <View className="absolute top-[60px] left-0 right-0 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[100]">
                  {leaveTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      className="px-4 py-3 border-b border-gray-50"
                      onPress={() => {
                        setLeaveType(type);
                        setShowTypeDropdown(false);
                      }}
                    >
                      <Text className="text-[#333]">{type}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            <TouchableOpacity className="flex-1 bg-white rounded-2xl px-4 py-4 flex-row justify-between items-center shadow-sm shadow-gray-200">
              <Text className="text-[#BDBDBD]">승인자</Text>
              <ChevronDown size={16} color="#BDBDBD" />
            </TouchableOpacity>
          </View>

          {leaveType === "반차" && (
            <View className="flex-row items-center gap-x-2.5 mb-3">
              <TouchableOpacity className="flex-1 bg-white rounded-2xl px-4 py-4 flex-row justify-between items-center shadow-sm shadow-gray-200">
                <Text className="text-[#333]">09:00</Text>
                <ChevronDown size={16} color="#BDBDBD" />
              </TouchableOpacity>
              <Text className="text-gray-400 font-bold">-</Text>
              <TouchableOpacity className="flex-1 bg-white rounded-2xl px-4 py-4 flex-row justify-between items-center shadow-sm shadow-gray-200">
                <Text className="text-[#333]">14:00</Text>
                <ChevronDown size={16} color="#BDBDBD" />
              </TouchableOpacity>
            </View>
          )}

          <View className="bg-white rounded-2xl px-4 py-4 mb-3 shadow-sm shadow-gray-200">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowCalendar(!showCalendar)}
              className="flex-row items-center"
            >
              <CalendarIcon size={18} color="#BDBDBD" />
              <View className="flex-row flex-1 ml-3 items-center">
                <Text
                  className={`${rangeStart ? "text-[#333]" : "text-[#BDBDBD]"}`}
                >
                  {displayDate(rangeStart)}
                </Text>
                <Text className="text-[#BDBDBD] mx-2">-</Text>
                <Text
                  className={`${rangeEnd ? "text-[#333]" : "text-[#BDBDBD]"}`}
                >
                  {displayDate(rangeEnd)}
                </Text>
              </View>
            </TouchableOpacity>
            {showCalendar && (
              <View className="mt-4 border-t border-gray-100 pt-4">
                <View style={{ height: 350 }}>
                  <Calendar
                    markingType="period"
                    markedDates={getMarkedDates()}
                    onDayPress={handleDayPress}
                    theme={{ todayTextColor: "#0029C0", arrowColor: "#0029C0" }}
                  />
                </View>
              </View>
            )}
          </View>

          {/* 내용 입력창 */}
          <View className="bg-white rounded-3xl p-5 shadow-sm shadow-gray-200">
            <TextInput
              placeholder="내용을 입력해주세요"
              placeholderTextColor="#BDBDBD"
              multiline
              textAlignVertical="top"
              className="text-[14px] text-[#333] leading-5"
              style={{ minHeight: 200 }}
              onFocus={() => {
                setTimeout(() => {
                  scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 300);
              }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
