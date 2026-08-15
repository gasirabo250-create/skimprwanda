import api from './axios';

export const submitViewingRequest = async (payload: Record<string, unknown>) => {
  const { data } = await api.post('/viewing-requests', payload);
  return data;
};

export const submitSellerRequest = async (payload: Record<string, unknown>) => {
  const { data } = await api.post('/seller-requests', payload);
  return data;
};

export const submitContact = async (payload: Record<string, unknown>) => {
  const { data } = await api.post('/contact', payload);
  return data;
};
