// axiosInstance.js
import axios from 'axios';
import { useAuth } from './AuthContext';
import {BASE_API_URL} from "../config.ts";
import {jwtDecode} from "jwt-decode";

const useApi = () => {
  const { token } = useAuth();

  if (token) {
    const decodedToken = jwtDecode(token!);
    const now = new Date().getTime() / 1000;
    if (decodedToken.exp! < now) {
      console.error('Token expired');
      localStorage.clear();
      window.location.href = '/login';
    }
  }

  const axiosInstance = axios.create({
    baseURL: BASE_API_URL,
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default useApi;
