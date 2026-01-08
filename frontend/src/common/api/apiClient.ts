import axios from 'axios';

const getApiUrl = () => {
  return import.meta.env.MODE === 'production'
    ? window.location.origin
    : 'http://localhost:3000';
};

export const apiClient = axios.create({
  baseURL: getApiUrl(),
  // 일단 10초로 설정
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
    // 에러 처리 로직
    if (error.response) {
      // 서버 응답 에러
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못함
      console.error('Network Error:', error.request);
    } else {
      // 요청 설정 중 에러
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  },
);
