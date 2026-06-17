import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { loginAPI } from "@/api/auth";
import { LoginForm } from "@/types/auth";
import { useUserStore } from "./useUserStore";

interface AuthStore {
  token: string | null;
  login: (data: LoginForm) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()((set) => ({
  token: null,
  login: async (data: LoginForm) => {
    const res = await loginAPI(data);
    await SecureStore.setItemAsync("accessToken", res.token);
    set({ token: res.token });
    useUserStore.getState().setUser(res.user);
  },
  logout: async () => {
    set({ token: null });
    await SecureStore.deleteItemAsync("accessToken");
    useUserStore.getState().clearUser();
  },
}));
