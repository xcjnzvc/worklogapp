import { axiosInstance } from "@/lib/axios";
import { AttendanceData, CreateFixRequestPayload } from "@/types/attendance";

export const getTodayAttendanceAPI = async (): Promise<AttendanceData> => {
  try {
    console.log("🚀 GET 요청 시도: /attendance/live");
    const res = await axiosInstance.get("/attendance/live");
    return res.data;
  } catch (error: any) {
    console.error("🚨 getTodayAttendanceAPI 에러:", error.message);
    throw error;
  }
};

export const recordAttendanceAPI = async (
  action: "CLOCK_IN" | "CLOCK_OUT",
): Promise<AttendanceData> => {
  const endpoint =
    action === "CLOCK_IN" ? "/attendance/clock-in" : "/attendance/clock-out";

  try {
    const res = await axiosInstance.post(endpoint);
    console.log("✅ 응답 데이터:", res.data);
    return res.data;
  } catch (error: any) {
    // 💡 여기서 에러 내용을 상세히 출력해 보세요
    if (error.response) {
      console.error(
        "❌ 서버 에러 응답:",
        error.response.status,
        error.response.data,
      );
    } else {
      console.error("❌ 네트워크/요청 에러:", error.message);
    }
    throw error; // 다시 던져야 useMutation의 onError가 동작합니다.
  }
};

export const getWeeklyAttendanceAPI = async () => {
  const res = await axiosInstance.get("/attendance/weekly");
  return res.data;
};

export const getWorkLogListAPI = async (page: number = 1) => {
  const res = await axiosInstance.get("/attendance/work-log", {
    params: {
      page: page,
      limit: 10,
    },
  });
  console.log(`workLogListAPI (page: ${page})`, res.data);
  return res.data;
};

// 👤 일반 유저 본인의 정정 신청 내역 조회 (STATISTICS 탭용)
export const getFixWorkLogAPI = async (page: number = 1) => {
  const res = await axiosInstance.get("/attendance/work-log/fix/own", {
    params: {
      page: page,
      limit: 10,
    },
  });
  console.log("getFixWorkLogAPI", res.data);
  return res.data;
};

export const postFixWorkLogAPI = async (
  id: string,
  data: CreateFixRequestPayload,
) => {
  const res = await axiosInstance.post(`/attendance/work-log/fix/${id}`, data);
  return res.data;
};

export const getWorkLogDashboardAPI = async () => {
  const res = await axiosInstance.get("/attendance/work-log/own/dashboard");
  return res.data;
};

// -------------------------------------------------------------
// 👑 [관리자/대표 전용 API 영역] - 백엔드 새로운 엔드포인트 주소와 매핑
// -------------------------------------------------------------

// 💡 1. 팀원들이 보낸 전체 정정 요청 목록 조회
export const getFixWorkLogListMgmtAPI = async (page: number = 1) => {
  try {
    console.log(
      `🚀 GET 요청 시도: /attendance/work-log/mgmt/list?page=${page}`,
    );
    const res = await axiosInstance.get("/attendance/work-log/mgmt/list", {
      params: { page: page, limit: 10 },
    });
    return res.data;
  } catch (error: any) {
    // 💡 에러 상세 출력 (응답이 있는지 없는지 구분)
    if (error.response) {
      console.error(
        "❌ [서버 응답 오류]",
        error.response.status,
        error.response.data,
      );
    } else if (error.request) {
      console.error("❌ [네트워크 오류 - 응답 없음]", error.request);
    } else {
      console.error("❌ [요청 설정 오류]", error.message);
    }
    throw error;
  }
};

// 2. 정정 최종 승인 (PATCH /attendance/work-log/mgmt/:id/approve)
export const approveAttendanceAPI = async (id: string) => {
  const res = await axiosInstance.patch(
    `/attendance/work-log/mgmt/${id}/approve`,
  );
  return res.data;
};

// 3. 정정 신청 반려 (PATCH /attendance/work-log/mgmt/:id/r
export const rejectAttendanceAPI = (
  id: string,
  data: { rejectReason: string },
) => {
  return axiosInstance.patch(`/attendance/fix/${id}/reject`, data);
};
