import axios from 'axios';
import useAuthStore from '../store/authStore';

const instance = axios.create({
  baseURL: 'http://localhost:3000/api',
});

instance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;