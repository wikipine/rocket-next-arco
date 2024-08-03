/**
 * 基于axios实现的通用请求
 */
import axios from 'axios';
import qs from 'qs';
import { Message } from '@arco-design/web-react';
import { getLoginToken } from '@/utils/user';

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL, // 使用环境变量作为基础 URL
  timeout: 60000, // 设置超时时间
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 存在 token 则添加
    const token = getLoginToken();
    if (token) {
      config.headers['Authorization'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 处理响应错误
    if (error.response) {
      // 服务器返回了错误响应
      Message.error(`Response error: ${error.response.data}`);
    } else if (error.request) {
      // 请求已经发送但是没有响应
      Message.error(`Request error: ${error.request}`);
    } else {
      // 其他错误
      Message.error(`Error: ${error.message}`);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
