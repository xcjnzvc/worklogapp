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
        set({ token: res.token }); // persist가 자동으로 SecureStore에 저장해줌
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
