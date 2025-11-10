import { create } from "zustand";
import { authService } from "../services/auth";

const useAuthStore = create((set) => ({
  user: authService.getCurrentUser(),
  isAuthenticated: authService.isAuthenticated(),
  loading: false,
  error: null,

  login: async (userData) => {
    set({ loading: true, error: null });
    try {
      const data = await authService.login(userData);
      set({
        user: data.user,
        isAuthenticated: true,
        loading: false,
      });
      return data;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Login failed",
      });
      throw err;
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const data = await authService.register(userData);
      set({
        loading: false,
      });
      return data;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Registration failed",
      });
      throw err;
    }
  },

  logout: () => {
    authService.logout();
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  setAuth: (authData) => set(authData),

  sendEmail: async (email) => {
    set({ loading: true, error: null });
    try {
      const data = await authService.sendEmail(email);
      set({
        loading: false,
      });
      return data;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "sendEmail failed",
      });
      throw err;
    }
  },

  verifyEmail: async (code, email) => {
    set({ loading: true, error: null });
    try {
      const data = await authService.verifyEmail(code, email);
      set({
        loading: false,
      });
      return data;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "verifyEmail failed",
      });
      throw err;
    }
  },

  PasswordResetCode: async (code, email) => {
    set({ loading: true, error: null });
    try {
      const data = await authService.PasswordResetCode(code, email);
      set({
        loading: false,
      });
      return data;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "PasswordResetCode failed",
      });
      throw err;
    }
  },

  resetPassword: async (formData) => {
    set({ loading: true, error: null });
    try {
      const data = await authService.resetPassword(formData);
      set({
        loading: false,
      });
      return data;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "resetPassword failed",
      });
      throw err;
    }
  },
}));

export default useAuthStore;