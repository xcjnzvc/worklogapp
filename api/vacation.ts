import { axiosInstance } from "@/lib/axios";

export const getVacationAPI = async () => {
  const res = await axiosInstance.get("/vacation");
  return res.data;
};
