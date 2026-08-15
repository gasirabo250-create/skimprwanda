import axios from 'axios';

const localApiUrl = 'http://localhost:5000/api';
const productionApiUrl = 'https://skimprwanda-backend.vercel.app/api';

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    (window.location.hostname.includes('vercel.app') ? productionApiUrl : localApiUrl),
  withCredentials: true, // send the httpOnly auth cookie
});

export default api;
