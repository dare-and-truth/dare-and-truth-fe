import axios from 'axios';

const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL!,
  headers: {
    'Content-Type': 'application/json', 
    Accept: 'application/json',
  },
  withCredentials: true,
});

httpClient.interceptors.response.use(
  function (response) {
    if (response.data?.status !== 'success') {
      return Promise.reject(response.data);
    }
    return response.data; 
  },
  function (error) {

    return Promise.reject(error.response?.data || error);
  },
);

export default httpClient;
