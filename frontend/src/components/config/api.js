const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  auth: {
    login: `${BASE_URL}/auth/login`,
    register: `${BASE_URL}/auth/register`,
  },
  todos: {
    base: `${BASE_URL}/todos`,
  },
  categories: {
    base: `${BASE_URL}/categories`,
  }
};