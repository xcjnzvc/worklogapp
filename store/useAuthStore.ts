import * as SecureStore from "expo-secure-store"; // 👈 추가
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware"; // 👈 추가
import { loginAPI } from "@/api/auth";
import { LoginForm } from "@/types/auth";
import { useUserStore } from "./useUserStore";

interface AuthStore {
  token: string | null;
  login: (data: LoginForm) => Promise<void>;
  logout: () => void;
}

// SecureStore를 Zustand가 사용할 수 있도록 어댑터 생성
const secureStorage = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      login: async (data: LoginForm) => {
        const res = await loginAPI(data);

        // 1. 상태 및 암호화 저장소에 토큰 저장
        set({ token: res.token });
        await SecureStore.setItemAsync("accessToken", res.token);

        // 2. 유저 정보 저장
        useUserStore.getState().setUser(res.user);
      },
      logout: async () => {
        set({ token: null });
        await SecureStore.deleteItemAsync("accessToken"); // 쿠키 대신 SecureStore 삭제
        useUserStore.getState().clearUser();
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => secureStorage), // 👈 SecureStore 연결
    },
  ),
);
