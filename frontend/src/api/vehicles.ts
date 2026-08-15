import api from './axios';
import type { Vehicle, VehicleFilters, Paginated } from '../types';

export const getVehicles = async (filters: VehicleFilters = {}) => {
  const { data } = await api.get<Paginated<Vehicle>>('/vehicles', { params: filters });
  return data;
};

export const getFeaturedVehicles = async () => {
  const { data } = await api.get<{ success: boolean; data: Vehicle[] }>('/vehicles/featured');
  return data.data;
};

export const getRecentVehicles = async () => {
  const { data } = await api.get<{ success: boolean; data: Vehicle[] }>('/vehicles/recent');
  return data.data;
};

export const getVehicleById = async (idOrSlug: string) => {
  const { data } = await api.get<{ success: boolean; data: Vehicle }>(`/vehicles/${idOrSlug}`);
  return data.data;
};

export const createVehicle = async (payload: Partial<Vehicle>) => {
  const { data } = await api.post('/vehicles', payload);
  return data.data;
};

export const updateVehicle = async (id: string, payload: Partial<Vehicle>) => {
  const { data } = await api.put(`/vehicles/${id}`, payload);
  return data.data;
};

export const deleteVehicle = async (id: string) => {
  await api.delete(`/vehicles/${id}`);
};
