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

      // Nếu không có refresh token, logout ngay
      if (!refreshToken) {
        localStorage.removeItem('accessToken');
        toast.error('Session expired. Please log in again.');
        window.location.href = '/auth/login';
        return Promise.reject(error);
      }

      // Nếu lỗi 401 đến từ chính /auth/refresh-token, logout ngay
      if (originalRequest.url.includes('/auth/refresh-token')) {
        isRefreshing = false;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/auth/login';
        return Promise.reject(error);
      }

      // Nếu chưa refresh, thực hiện refresh token
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          // Gọi trực tiếp httpClient thay vì request
          const refreshResponse = await httpClient.post('/auth/refresh-token', {
            refreshToken,
          });

          // Điều chỉnh theo cấu trúc response thực tế của bạn (ví dụ: data.access_token)
          const newAccessToken =
            refreshResponse?.data?.data?.access_token ||
            refreshResponse?.data?.access_token;
          if (!newAccessToken) {
            throw new Error('No access token in refresh response');
          }

          localStorage.setItem('accessToken', newAccessToken);
          isRefreshing = false;
          onRefreshed(newAccessToken);

          // Thử lại request ban đầu với token mới
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return httpClient(originalRequest);
        } catch (refreshError) {
          // Nếu refresh token thất bại, logout
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
    } else if (error.response?.status === 403) {
      toast.error('Session expired. Please log in again.');
      window.location.href = '/auth/login';
    }
    console.log(error)

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
  params?: Record<string, any>; // Add support for query parameters
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

const request = async ({
  method,
  url,
  data,
  params, // New parameter for query params
  onSuccess = () => {},
  onError = () => {},
}: RequestOptions) => {
  try {
    const response = await httpClient({
      method,
      url,
      data,
      params, // Pass query parameters to the request
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
