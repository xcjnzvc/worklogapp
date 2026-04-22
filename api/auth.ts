import { axiosInstance } from "@/lib/axios";
import {
  InvitedSignupForm,
  LoginForm,
  SignupForm,
  InviteForm,
} from "@/types/auth";

export const loginAPI = async (data: LoginForm) => {
  // 모바일에서 네트워크 요청 실패 시 오류를 바로 확인하기 위해 try-catch를 밖에서 처리하거나 여기서 확인
  const res = await axiosInstance.post("/auth/login", data);
  console.log("로그인 응답 데이터:", JSON.stringify(res.data, null, 2));
  return res.data;
};

export const signupAPI = async (data: SignupForm) => {
  const res = await axiosInstance.post("/auth/company", data);
  return res.data;
};

export const inviteRegisterAPI = async (
  token: string,
  data: InvitedSignupForm,
) => {
  const res = await axiosInstance.post(`/invite/signup/${token}`, data);
  return res.data;
};

export const inviteAPI = async (data: InviteForm) => {
  const res = await axiosInstance.post("/invite", data);
  return res.data;
};

export const verifyInviteAPI = async (token: string) => {
  const res = await axiosInstance.get(`/invite/verify/${token}`);
  return res.data;
};
