import { create } from "zustand";
export interface Role {
  role: "user" | "admin";
}

export interface IUser {
  id: string;
  name: string;
  role?: Role;
}

export interface AuthState {
  user: IUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (data: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,

  login: (data: any) =>
    set({
      user: data.user,
      accessToken: data.accessToken,
      isAuthenticated: true,
    }),

  logout: () =>
    set(() => ({
      user: null,
      accessToken: null,
      isauthenticated: false,
    })),
}));
