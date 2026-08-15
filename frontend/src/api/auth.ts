import api from './axios';
import type { Admin } from '../types';

export const login = async (email: string, password: string) => {
  const { data } = await api.post<{ success: boolean; admin: Admin }>('/admin/login', {
    email,
    password,
  });
  return data.admin;
};

export const logout = async () => {
  await api.post('/admin/logout');
};

export const verify = async () => {
  const { data } = await api.get<{ success: boolean; admin: Admin }>('/admin/verify');
  return data.admin;
};
