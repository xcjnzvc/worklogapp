import { axiosInstance } from "@/lib/axios";
import { AttendanceData } from "@/types/attendance";

export const getTodayAttendanceAPI = async (): Promise<AttendanceData> => {
  const res = await axiosInstance.get("/attendance/live");
  return res.data;
};

export const recordAttendanceAPI = async (
  action: "CLOCK_IN" | "CLOCK_OUT",
): Promise<AttendanceData> => {
  const endpoint =
    action === "CLOCK_IN" ? "/attendance/clock-in" : "/attendance/clock-out";

  const res = await axiosInstance.post(endpoint); // 이제 body에 { action }을 담을 필요도 없겠네요!
  return res.data;
};

// export const getWeeklyAttendanceAPI = async () => {
//   const res = await axiosInstance.get("/attendance/weekly");
//   console.log("🔍 주간 출석 요약 응답 데이터:", res.data);
//   return res.data;
// };

export const getWeeklyAttendanceAPI = async () => {
  try {
    console.log("📡 API 요청 시작...");
    const res = await axiosInstance.get("/attendance/weekly");
    console.log("✅ API 응답 성공:", res.data);
    return res.data;
  } catch (err: any) {
    console.error("❌ API 내부 에러 발생:", err.message);
    // 여기서 err.config를 찍어보면 실제 어떤 주소로 요청을 보냈는지 알 수 있습니다.
    console.log("🔗 요청 주소 확인:", err.config?.url);
    throw err; // React Query가 에러를 감지할 수 있게 다시 던져줘야 합니다.
  }
};
