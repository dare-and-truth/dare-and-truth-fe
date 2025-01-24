import axios from 'axios';
const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL!,
  headers: {
    'Content-Type': 'application/json', // Định dạng dữ liệu gửi lên server là JSON.
    Accept: 'application/json', // Backend sẽ trả về dữ liệu JSON.
  },
  withCredentials: true, // Cần bật nếu backend sử dụng cookie để quản lý xác thực
});
httpClient.interceptors.response.use(
  function (response) {
    if (response.data?.status !== 'success') {
      throw new Error('Invalid data format or API response.');
    }
    return response || {};
  },
  function (error) {
    return Promise.reject(error);
  },
);

export default httpClient;
