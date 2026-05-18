import React, { useMemo, useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Briefcase, Calendar } from "lucide-react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTodayAttendanceAPI, recordAttendanceAPI } from "@/api/attendance";
import { AttendanceData, AttendanceStatus } from "@/types/attendance";
import Button from "@/components/Button";

const STATUS_STYLE: Record<
  AttendanceStatus,
  { label: string; color: string; dot: string }
> = {
  NOT_STARTED: { label: "출근 전", color: "#9CA3AF", dot: "#D1D5DB" },
  WORKING: { label: "근무 중", color: "#2357E5", dot: "#2357E5" },
  NORMAL: { label: "정상 근무", color: "#22C55E", dot: "#22C55E" },
  LATE: { label: "지각 출근", color: "#F97316", dot: "#F97316" },
  EARLY_LEAVE: { label: "조기 퇴근", color: "#F87171", dot: "#F87171" },
  LATE_EARLY: { label: "지각 & 조퇴", color: "#DC2626", dot: "#DC2626" },
  INSUFFICIENT: { label: "시간 미달", color: "#A855F7", dot: "#A855F7" },
  MISSING_OUT: { label: "퇴근 누락", color: "#4B5563", dot: "#4B5563" },
  ABSENT: { label: "결근", color: "#B91C1C", dot: "#B91C1C" },
};

export default function WorkStatusCard() {
  const queryClient = useQueryClient();

  const { data: attendance } = useQuery<AttendanceData>({
    queryKey: ["todayAttendance"],
    queryFn: getTodayAttendanceAPI,
  });

  // 💡 수정된 formatTime: 하이픈(-) 구분자 포맷 완벽 대처
  const formatTime = (isoString: string | null | undefined) => {
    if (!isoString) return "-- : --";
    try {
      const date = new Date(isoString);
      if (!isNaN(date.getTime())) {
        return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
      }

      // ✅ "2026-05-19-00:31:15" 포맷 대응 (match[4]=시, match[5]=분)
      const match = isoString.match(/(\d{4})-(\d{2})-(\d{2})-(\d{2}):(\d{2})/);
      if (match) {
        return `${match[4]}:${match[5]}`;
      }

      return "-- : --";
    } catch {
      return "-- : --";
    }
  };

  const displayStatus = useMemo(() => {
    if (!attendance) return "NOT_STARTED";
    return attendance.isClockedIn ? "WORKING" : attendance.status;
  }, [attendance]);

  const config = STATUS_STYLE[displayStatus] ?? STATUS_STYLE.NORMAL;

  // ✅ 실시간 경과 시간
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  useEffect(() => {
    if (!attendance?.clockIn || !attendance?.isClockedIn) {
      setElapsedMinutes(attendance?.workMinutes ?? 0);
      return;
    }

    let clockInTime = new Date(attendance.clockIn).getTime();

    // 💡 수정된 useEffect: "2026-05-19-00:31:15" 포맷 강제 파싱 및 수동 Date 객체 생성
    if (isNaN(clockInTime)) {
      const match = attendance.clockIn.match(
        /(\d{4})-(\d{2})-(\d{2})-(\d{2}):(\d{2})/,
      );
      if (match) {
        const [_, year, month, day, hour, minute] = match;
        clockInTime = new Date(
          Number(year),
          Number(month) - 1, // 월은 0부터 시작하므로 -1 필수
          Number(day),
          Number(hour),
          Number(minute),
        ).getTime();
      }
    }

    // 보정 후에도 예외가 발생할 경우를 위한 최종 디펜스
    if (isNaN(clockInTime)) {
      clockInTime = Date.now();
    }

    const tick = () => {
      const diffMinutes = Math.floor((Date.now() - clockInTime) / 1000 / 60);
      setElapsedMinutes(diffMinutes < 0 ? 0 : diffMinutes);
    };

    tick();
    const interval = setInterval(tick, 60000);
    return () => clearInterval(interval);
  }, [attendance?.clockIn, attendance?.isClockedIn, attendance?.workMinutes]);

  const displayTime = useMemo(() => {
    const h = Math.floor(elapsedMinutes / 60);
    const m = elapsedMinutes % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }, [elapsedMinutes]);

  const mutation = useMutation({
    mutationFn: recordAttendanceAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todayAttendance"] });
      queryClient.invalidateQueries({ queryKey: ["attendanceSummary"] });
    },
  });

  return (
    <View className="p-6 bg-white rounded-[32px] border border-gray-100 w-full shadow-sm">
      {/* 상태 표시 */}
      <View className="flex-row items-center gap-2 mb-3">
        <View
          style={{ backgroundColor: config.dot }}
          className="w-3 h-3 rounded-full"
        />
        <Text style={{ color: config.color }} className="text-sm font-bold">
          {config.label}
        </Text>
      </View>

      {/* 시간 */}
      <View className="mb-6">
        <Text className="text-5xl font-black tracking-tighter text-gray-950 mb-2">
          {displayTime}
        </Text>
        <View className="flex-row items-center gap-1.5">
          <Calendar size={14} color="#999" />
          <Text className="text-sm font-medium text-[#999]">
            {new Date().toLocaleDateString("ko-KR", {
              month: "long",
              day: "numeric",
              weekday: "long",
            })}
          </Text>
        </View>
      </View>

      {/* 정책 카드 */}
      <View className="flex-row items-center p-3 rounded-3xl bg-[#F5F8FF] border border-[#DDE7FF] mb-8">
        <View className="w-11 h-11 rounded-2xl bg-white items-center justify-center mr-4 border border-gray-100">
          <Briefcase size={20} color="#2357E5" />
        </View>
        <View>
          <Text className="text-[10px] font-black text-[#2357E5] uppercase">
            {attendance?.policy?.workType ?? "-"}
          </Text>
          <Text className="text-lg font-black text-gray-950">
            {attendance?.policy?.workStartTime ?? "--:--"} -{" "}
            {attendance?.policy?.workEndTime ?? "--:--"}
          </Text>
        </View>
      </View>

      {/* 출퇴근 라인 */}
      <View className="mb-8 pl-2">
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center">
            <View
              className={`w-4 h-4 rounded-full border-4 ${
                attendance?.clockIn ? "border-[#2357E5]" : "border-gray-200"
              }`}
            />
            <View className="ml-4">
              <Text className="text-[10px] font-extrabold text-gray-300 uppercase">
                Check-In
              </Text>
              <Text
                className={`text-lg font-black ${attendance?.clockIn ? "text-gray-900" : "text-gray-300"}`}
              >
                {formatTime(attendance?.clockIn)}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View
              className={`w-4 h-4 rounded-full border-4 ${
                attendance?.clockOut ? "border-red-500" : "border-gray-200"
              }`}
            />
            <View className="ml-4">
              <Text className="text-[10px] font-extrabold text-gray-300 uppercase">
                Check-Out
              </Text>
              <Text
                className={`text-lg font-black ${attendance?.clockOut ? "text-gray-900" : "text-gray-300"}`}
              >
                {formatTime(attendance?.clockOut)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <Button
        text={
          !attendance?.clockIn
            ? "출근하기"
            : attendance.isClockedIn
              ? "퇴근하기"
              : "업무 종료"
        }
        disabled={
          (!attendance?.isClockedIn && !!attendance?.clockIn) ||
          mutation.isPending
        }
        onPress={() =>
          mutation.mutate(!attendance?.clockIn ? "CLOCK_IN" : "CLOCK_OUT")
        }
      />
    </View>
  );
}
