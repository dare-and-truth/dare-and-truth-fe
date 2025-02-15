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
    // config.headers.Authorization = `Bearer ${localStorage.getItem("TOKEN")}`;
    return config;
  },
  function (error) {
    // Do something with request error
    // console.log("interceptors.request.error", error);
    return Promise.reject(error);
  },
);

httpClient.interceptors.response.use(
  function (response) {
    if (response.data?.status === 'success') {
      return response.data;
    } else {
      return Promise.reject({
        code: response.data?.code,
        message: response.data?.message || 'An error occurred',
      });
    }
  },
  function (error) {
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
    onSuccess(response.data);

    return response;
  } catch (error: any) {
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
