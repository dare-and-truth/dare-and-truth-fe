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
    // Do something before request is sent
    // console.log('interceptors.request', config);
    // config.headers.Authorization = `Bearer ${localStorage.getItem("accessToken")}`;
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Set the Authorization header with the token
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
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
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('refresh');
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            // Gọi API refresh token
            const refreshResponse = await axios({
              method: 'post',
              url:
                process.env.NEXT_PUBLIC_BASE_SERVER_URL + '/auth/refresh-token',
              data: { refreshToken },
              headers: { 'Content-Type': 'application/json' },
              withCredentials: true,
            });
            const newAccessToken = refreshResponse.data.data.access_token;
            localStorage.setItem('accessToken', newAccessToken);
            isRefreshing = false;
            onRefreshed(newAccessToken);
            // Retry request ban đầu với token mới
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            isRefreshing = false;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            toast.error('Session expired. Please log in again.');
            window.location.href = '/auth/login';
            return Promise.reject(refreshError);
          }
        } else {
          // Nếu đang refresh, đợi token mới được cung cấp
          return new Promise((resolve) => {
            subscribeTokenRefresh((newToken) => {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              resolve(axios(originalRequest));
            });
          });
        }
      } else {
        localStorage.removeItem('accessToken');
        toast.error('Session expired. Please log in again.');
        window.location.href = '/auth/login';
        return new Promise(() => {});
      }
    }
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
    // Xử lý hiển thị popup thành công
    // Code here
    onSuccess(response?.data);

    return response;
  } catch (error: any) {
    console.log(error);
    // Xử lý hiển thị popup lỗi
    // Code here
    if (axios.isAxiosError(error)) {
      // Nếu là lỗi từ Axios, sử dụng error.response.data
      onError(error.response?.data);
    } else {
      // Nếu không phải lỗi từ Axios, xử lý một cách phù hợp
      onError(error);
      toast.error(error.message);
    }
  }
};

export default request;
