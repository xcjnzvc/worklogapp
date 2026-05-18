import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  getFixWorkLogAPI,
  getWeeklyAttendanceAPI,
  getWorkLogDashboardAPI,
  getWorkLogListAPI,
  postFixWorkLogAPI,
} from "@/api/attendance";
import {
  WeeklyAttendanceResponse,
  AttendanceResponse,
  CreateFixRequestPayload,
  WorkLogDashboardResponseDto,
} from "@/types/attendance";

export const useAttendanceSummary = () => {
  return useQuery<WeeklyAttendanceResponse>({
    queryKey: ["summaryAttendance"],
    queryFn: getWeeklyAttendanceAPI,
    staleTime: 1000 * 60 * 5, // 5분 동안은 신선한 데이터로 간주
  });
};

//  근무 기록 목록 조회 (LIST 탭용)
export const useWorkLogList = () => {
  return useInfiniteQuery<AttendanceResponse>({
    queryKey: ["workLogList"], //  page 변수는 키에서 제외합니다.
    initialPageParam: 1, //  처음 시작할 페이지 번호
    queryFn: ({ pageParam }) => getWorkLogListAPI(pageParam as number), // 파라미터 주입
    getNextPageParam: (lastPage, allPages) => {
      // 만약 마지막 페이지의 결과 데이터(result)가 비어있다면 undefined를 반환하여 끝임을 알림
      if (!lastPage.result || lastPage.result.length === 0) return undefined;

      // 다음 불러올 페이지 번호 (지금까지 쌓인 페이지 수 + 1)
      return allPages.length + 1;
    },
  });
};

//  내 정정 신청 내역 조회 (STATISTICS 탭용)
export const useFixLogList = (page: number) => {
  return useQuery({
    queryKey: ["fixLogList", page], // 쿼리키에도 page 추가
    queryFn: () => getFixWorkLogAPI(page), // API 함수에도 page 전달
  });
};

// 대시보드 통계 조회 (정정 요청/완료 건수 및 총 근무시간)
export const useWorkLogDashboard = () => {
  return useQuery<WorkLogDashboardResponseDto>({
    queryKey: ["workLogDashboard"],
    queryFn: getWorkLogDashboardAPI,
    staleTime: 1000 * 60 * 5, // 5분 캐싱
  });
};

// 근무 기록 수정 요청 (onSuccess 부분 업데이트)
export const useCreateFixRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateFixRequestPayload }) =>
      postFixWorkLogAPI(id, data),

    onSuccess: () => {
      //  정정 요청이 성공하면 대시보드의 '요청 중' 개수도 변해야 하므로 추가
      queryClient.invalidateQueries({ queryKey: ["workLogDashboard"] });
      queryClient.invalidateQueries({ queryKey: ["fixLogList"] });
      queryClient.invalidateQueries({ queryKey: ["workLogList"] });
    },
  });
};
