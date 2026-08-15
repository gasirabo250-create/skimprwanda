import api from './axios';
import type { Brand, ModelItem } from '../types';

export const getBrands = async () => {
  const { data } = await api.get<{ success: boolean; data: Brand[] }>('/brands');
  return data.data;
};

export const getModels = async (brandId?: string) => {
  const { data } = await api.get<{ success: boolean; data: ModelItem[] }>('/models', {
    params: brandId ? { brandId } : {},
  });
  return data.data;
};
