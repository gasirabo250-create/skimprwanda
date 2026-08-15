import axios from 'axios';

const localApiUrl = 'http://localhost:5000/api';
const productionApiUrl = 'https://skimprwanda-backend.vercel.app/api';

const getApiUrl = () => {
  // Prioritize environment variable
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Use production API for Vercel deployments, local for dev
  const isProduction = window.location.hostname.includes('vercel.app');
  const url = isProduction ? productionApiUrl : localApiUrl;
  
  if (typeof window !== 'undefined') {
    console.log('[API] Using endpoint:', url, 'Hostname:', window.location.hostname);
  }
  
  return url;
};

const api = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true, // send the httpOnly auth cookie
});

export default api;
