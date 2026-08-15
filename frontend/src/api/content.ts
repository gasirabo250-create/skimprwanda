import api from './axios';
import type { Article, Review, Settings } from '../types';

export const getArticles = async (category?: string) => {
  const { data } = await api.get<{ success: boolean; data: Article[] }>('/articles', {
    params: category ? { category } : {},
  });
  return data.data;
};

export const getArticleBySlug = async (slug: string) => {
  const { data } = await api.get<{ success: boolean; data: Article }>(`/articles/${slug}`);
  return data.data;
};

export const getReviews = async () => {
  const { data } = await api.get<{ success: boolean; data: Review[] }>('/reviews');
  return data.data;
};

export const getSettings = async () => {
  const { data } = await api.get<{ success: boolean; data: Settings }>('/settings');
  return data.data;
};
