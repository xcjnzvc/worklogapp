import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  getVacationAPI,
  getApproversAPI,
  createVacationAPI,
} from "@/api/vacation";
import { VacationResponse } from "@/types/vacation";
import { Approver, CreateVacationPayload } from "@/types/user";

export const useVacation = () => {
  const queryClient = useQueryClient();

  //  휴가 내역 목록 조회
  const useVacationList = () =>
    useInfiniteQuery({
      queryKey: ["vacations"],
      initialPageParam: 1,
      queryFn: ({ pageParam }) => getVacationAPI(pageParam as number),
      getNextPageParam: (lastPage, allPages) => {
        // 백엔드 명세에 따라 데이터 배열(data)이 비어있는지 체크
        if (!lastPage.data || lastPage.data.length === 0) return undefined;
        return allPages.length + 1;
      },
      staleTime: 1000 * 60 * 5,
      //  인피니트 쿼리에서는 select 사용 시 pages 내부 구조를 유지해 주어야 합니다.
      select: (response) => ({
        pages: response.pages.map((page: VacationResponse) => ({
          list: page.data,
          metadata: page.meta,
        })),
        pageParams: response.pageParams,
        // 첫 페이지의 summary 데이터만 활용할 수 있도록 가공
        summary: response.pages[0]?.summary,
      }),
    });

  //  결재권자 목록 조회
  const useApprovers = () =>
    useQuery<Approver[]>({
      queryKey: ["approvers"],
      queryFn: getApproversAPI,
    });

  // 휴가 신청하기 (Mutation)
  const useCreateVacation = () =>
    useMutation<unknown, Error, CreateVacationPayload>({
      mutationFn: createVacationAPI,
      onSuccess: () => {
        // 성공 시 휴가 목록과 요약 데이터를 무효화하여 새로고침
        queryClient.invalidateQueries({ queryKey: ["vacations"] });
      },
    });

  return { useVacationList, useApprovers, useCreateVacation };
};
