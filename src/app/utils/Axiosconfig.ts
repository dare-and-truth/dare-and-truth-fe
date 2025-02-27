import axios, { AxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';

const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
  timeout: 60000,
});

httpClient.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    console.log('interceptors.request.error', error);
    return Promise.reject(error);
  },
);

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

function onRefreshed(newToken: string) {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
}

httpClient.interceptors.response.use(
  (response) => {
    if (response.data?.status === 'success') {
      return response.data;
    } else {
      return Promise.reject({
        code: response.data?.code,
        message: response.data?.message || 'An error occurred',
      });
    }
  },
  async (error) => {
    const originalRequest = error.config;

    // Nếu gặp lỗi 401 (token hết hạn hoặc không hợp lệ)
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        // Không có refresh token, chuyển hướng về login ngay lập tức
        localStorage.removeItem('accessToken');
        toast.error('Session expired. Please log in again.');
        window.location.href = '/auth/login';
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          // Gọi API refresh token
          const refreshResponse = await request({
            method: 'post',
            url: '/auth/refresh-token',
            data: { refreshToken },
          });

          const newAccessToken = refreshResponse?.data.access_token;
          localStorage.setItem('accessToken', newAccessToken);
          isRefreshing = false;
          onRefreshed(newAccessToken);

          // Thử lại request ban đầu với token mới
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return httpClient(originalRequest);
        } catch (refreshError) {
          // Nếu refresh token thất bại (hết hạn hoặc không hợp lệ), chuyển hướng về login
          isRefreshing = false;
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          toast.error('Session expired. Please log in again.');
          window.location.href = '/auth/login';
          return Promise.reject(refreshError);
        }
      } else {
        // Nếu đang refresh, đợi token mới
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(httpClient(originalRequest));
          });
        });
      }
    }

    // Xử lý các lỗi khác ngoài 401
    return Promise.reject({
      code: error.response?.status || 500,
      message: error.response?.data?.message || 'Network error occurred',
    });
  },
);

interface RequestOptions {
  method: AxiosRequestConfig['method'];
  url: string;
  data?: any;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

const request = async ({
  method,
  url,
  data,
  onSuccess = () => {},
  onError = () => {},
}: RequestOptions) => {
  try {
    const response = await httpClient({
      method,
      url,
      data,
    });
    onSuccess(response?.data);
    return response;
  } catch (error: any) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      onError(error.response?.data);
    } else {
      onError(error);
      toast.error(error.message);
    }
    throw error; // Ném lỗi để caller có thể xử lý nếu cần
  }
};

export default request;
