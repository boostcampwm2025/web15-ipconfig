import axios from 'axios';

const getApiUrl = () => {
  return import.meta.env.MODE === 'production'
    ? window.location.origin
    : 'http://localhost:3000';
};

export const apiClient = axios.create({
  baseURL: getApiUrl() + '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 기본적인 에러 처리 하기
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);
