import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,

  // Set auth data after successful login/signup
  loginSuccess: (user, token) => {
    localStorage.setItem('token', token);
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  // Clear memory and storage on logout
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));