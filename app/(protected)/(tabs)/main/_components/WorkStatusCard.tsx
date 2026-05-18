// import React, { useMemo } from "react";
// import { View, Text, Pressable } from "react-native";
// import { Briefcase, Calendar } from "lucide-react-native"; // 모바일용 아이콘 사용
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { getTodayAttendanceAPI, recordAttendanceAPI } from "@/api/attendance";
// import { AttendanceData, AttendanceStatus } from "@/types/attendance";
// import Button from "@/components/Button";

// const STATUS_STYLE: Record<
//   AttendanceStatus,
//   { label: string; color: string; dot: string }
// > = {
//   NOT_STARTED: { label: "출근 전", color: "#9CA3AF", dot: "#D1D5DB" },
//   WORKING: { label: "근무 중", color: "#2357E5", dot: "#2357E5" },
//   NORMAL: { label: "정상 근무", color: "#22C55E", dot: "#22C55E" },
//   LATE: { label: "지각 출근", color: "#F97316", dot: "#F97316" },
//   EARLY_LEAVE: { label: "조기 퇴근", color: "#F87171", dot: "#F87171" },
//   LATE_EARLY: { label: "지각 & 조퇴", color: "#DC2626", dot: "#DC2626" },
//   INSUFFICIENT: { label: "시간 미달", color: "#A855F7", dot: "#A855F7" },
//   MISSING_OUT: { label: "퇴근 누락", color: "#4B5563", dot: "#4B5563" },
//   ABSENT: { label: "결근", color: "#B91C1C", dot: "#B91C1C" },
// };

// export default function WorkStatusCard() {
//   const queryClient = useQueryClient();

//   const {
//     data: attendance,
//     isLoading,
//     isError,
//   } = useQuery<AttendanceData>({
//     queryKey: ["todayAttendance"],
//     queryFn: getTodayAttendanceAPI,
//   });

//   const displayStatus = useMemo(() => {
//     if (!attendance) return "NOT_STARTED";
//     return attendance.isClockedIn ? "WORKING" : attendance.status;
//   }, [attendance]);

//   const config = STATUS_STYLE[displayStatus] ?? STATUS_STYLE.NORMAL;

//   const displayTime = useMemo(() => {
//     const totalMin = attendance?.workMinutes ?? 0;
//     const h = Math.floor(totalMin / 60);
//     const m = totalMin % 60;
//     return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
//   }, [attendance?.workMinutes]);

//   const mutation = useMutation({
//     mutationFn: recordAttendanceAPI,
//     onSuccess: () =>
//       queryClient.invalidateQueries({ queryKey: ["todayAttendance"] }),
//   });

//   // if (isLoading)
//   //   return <View className="h-[400px] w-full bg-gray-100 rounded-3xl" />;
//   // if (isLoading) return <View />;

//   return (
//     <View className="p-6 bg-white rounded-[32px] border border-gray-100 w-full shadow-sm">
//       {/* 상태 표시 */}
//       <View className="flex-row items-center gap-2 mb-3">
//         <View
//           style={{ backgroundColor: config.dot }}
//           className="w-3 h-3 rounded-full"
//         />
//         <Text style={{ color: config.color }} className="text-sm font-bold">
//           {config.label}
//         </Text>
//       </View>

//       {/* 시간 */}
//       <View className="mb-6">
//         <Text className="text-5xl font-black tracking-tighter text-gray-950 mb-2">
//           {displayTime}
//         </Text>
//         <View className="flex-row items-center gap-1.5">
//           <Calendar size={14} color="#999" />
//           <Text className="text-sm font-medium text-[#999]">
//             {new Date().toLocaleDateString("ko-KR", {
//               month: "long",
//               day: "numeric",
//               weekday: "long",
//             })}
//           </Text>
//         </View>
//       </View>

//       {/* 정책 카드 */}
//       <View className="flex-row items-center p-3 rounded-3xl bg-[#F5F8FF] border border-[#DDE7FF] mb-8">
//         <View className="w-11 h-11 rounded-2xl bg-white items-center justify-center mr-4 border border-gray-100">
//           <Briefcase size={20} color="#2357E5" />
//         </View>
//         <View>
//           <Text className="text-[10px] font-black text-[#2357E5] uppercase">
//             {attendance?.policy?.workType ?? "-"}
//           </Text>
//           <Text className="text-lg font-black text-gray-950">
//             {attendance?.policy?.workStartTime ?? "--:--"} -{" "}
//             {attendance?.policy?.workEndTime ?? "--:--"}
//           </Text>
//         </View>
//       </View>

//       {/* 출퇴근 라인 */}
//       <View className="mb-8 pl-2">
//         {/* Check-In */}
//         <View className="flex-row items-center justify-between mb-6">
//           <View className="flex-row items-center">
//             <View
//               className={`w-4 h-4 rounded-full border-4 ${attendance?.clockIn ? "border-[#2357E5]" : "border-gray-200"}`}
//             />
//             <View className="ml-4">
//               <Text className="text-[10px] font-extrabold text-gray-300 uppercase">
//                 Check-In
//               </Text>
//               <Text
//                 className={`text-lg font-black ${attendance?.clockIn ? "text-gray-900" : "text-gray-300"}`}
//               >
//                 {attendance?.clockIn
//                   ? attendance.clockIn.substring(11, 16)
//                   : "-- : --"}
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* Check-Out */}
//         <View className="flex-row items-center justify-between">
//           <View className="flex-row items-center">
//             <View
//               className={`w-4 h-4 rounded-full border-4 ${attendance?.clockOut ? "border-red-500" : "border-gray-200"}`}
//             />
//             <View className="ml-4">
//               <Text className="text-[10px] font-extrabold text-gray-300 uppercase">
//                 Check-Out
//               </Text>
//               <Text className="text-lg font-black text-gray-900">
//                 {attendance?.clockOut
//                   ? attendance.clockOut.substring(11, 16)
//                   : "-- : --"}
//               </Text>
//             </View>
//           </View>
//         </View>
//       </View>

//       <Button
//         text={
//           !attendance?.clockIn
//             ? "출근하기"
//             : attendance.isClockedIn
//               ? "퇴근하기"
//               : "업무 종료"
//         }
//         disabled={
//           (!attendance?.isClockedIn && !!attendance?.clockIn) ||
//           mutation.isPending
//         }
//         onPress={() =>
//           mutation.mutate(!attendance?.clockIn ? "CLOCK_IN" : "CLOCK_OUT")
//         }
//       />
//     </View>
//   );
// }

import React, { useMemo } from "react";
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

  // 💡 안전한 9시간 시차 극복용 로컬 시간 추출 헬퍼 함수
  // 💡 어떤 날짜 포맷이 들어와도 'HH:MM'을 안전하게 뽑아내는 헬퍼 함수
  const formatTime = (isoString: string | null | undefined) => {
    if (!isoString) return "-- : --";

    try {
      // 1. 만약 표준 Date 객체로 파싱이 정상적으로 가능한 경우
      const date = new Date(isoString);
      if (!isNaN(date.getTime())) {
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${hours}:${minutes}`;
      }

      // 2. new Date()가 NaN을 뱉는 특수 포맷인 경우 (문자열 직접 파싱 방어 코드)
      // 예: "2026-05-19T09:30:00" 또는 "2026.05.19 09:30" 등에서 시간 패턴 추출
      const timeMatch = isoString.match(/(\d{2}):(\d{2})/);
      if (timeMatch) {
        return `${timeMatch[1]}:${timeMatch[2]}`;
      }

      // 3. 기존에 사용하시던 안전 보장 substring 레이아웃 복원 코드
      if (isoString.length >= 16) {
        // T가 포함된 ISO 스트링 분기 ("2026-05-19T18:30:00")
        if (isoString.includes("T")) {
          return isoString.substring(11, 16);
        }
        // 공백으로 구분된 분기 ("2026-05-19 18:30:00")
        const spaceIndex = isoString.indexOf(" ");
        if (spaceIndex !== -1) {
          return isoString.substring(spaceIndex + 1, spaceIndex + 6);
        }
      }

      return "-- : --";
    } catch (e) {
      return "-- : --";
    }
  };

  const displayStatus = useMemo(() => {
    if (!attendance) return "NOT_STARTED";
    return attendance.isClockedIn ? "WORKING" : attendance.status;
  }, [attendance]);

  const config = STATUS_STYLE[displayStatus] ?? STATUS_STYLE.NORMAL;

  const displayTime = useMemo(() => {
    const totalMin = attendance?.workMinutes ?? 0;
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }, [attendance?.workMinutes]);

  // 💡 리프레시 범위를 전역으로 넓혀 MainScreen의 다른 카드들과 완벽 동기화 트리거
  const mutation = useMutation({
    mutationFn: recordAttendanceAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todayAttendance"] });
      // 다른 요약 카드들과 싱크를 맞추기 위해 전체 근태 키셋 리프레시 가동
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
        {/* Check-In */}
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
                className={`text-lg font-black ${
                  attendance?.clockIn ? "text-gray-900" : "text-gray-300"
                }`}
              >
                {formatTime(attendance?.clockIn)}
              </Text>
            </View>
          </View>
        </View>

        {/* Check-Out */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            {/* 💡 데이터 유무에 따라 링 색상 동적 매핑 보정 */}
            <View
              className={`w-4 h-4 rounded-full border-4 ${
                attendance?.clockOut ? "border-red-500" : "border-gray-200"
              }`}
            />
            <View className="ml-4">
              <Text className="text-[10px] font-extrabold text-gray-300 uppercase">
                Check-Out
              </Text>
              {/* 💡 데이터 유무에 따라 폰트 칼라 흐림/선명 분기 스펙 가동 */}
              <Text
                className={`text-lg font-black ${
                  attendance?.clockOut ? "text-gray-900" : "text-gray-300"
                }`}
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
