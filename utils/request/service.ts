/**
 * 基于axios实现的通用请求
 */
import axios, { AxiosResponse } from 'axios';
import qs from 'qs';
import { Message } from '@arco-design/web-react';
import { getLoginToken, loginOut } from '@/utils/auth';

export type RequestResponseType<T = any> = {
  success: boolean;
  remark?: string;
  errorInfo?: string;
  errorCode?: number;
  data: T;
};

export type RequestOptionType = {
  url: string;
  method?: 'get' | 'post';
  params?: Record<string, any>;
  data?: Record<string, any>;
  headers?: Record<string, any>;
};

// 创建 axios 实例
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL, // 使用环境变量作为基础 URL
  method: 'get',
  timeout: 60000, // 设置超时时间
});
// 鉴权的Token名称
const HEADER_TOKEN_NAME = 'access-token';

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 默认塞application/json
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }
    // post 预处理
    if (
      config.method === 'post' &&
      config.headers['Content-Type'] === 'application/x-www-form-urlencoded'
    ) {
      config.data = qs.stringify(config.data);
    }
    // get参数编码
    if (config.method === 'get' && config.params) {
      let url = config.url;
      url += '?';
      const keys = Object.keys(config.params);
      for (const key of keys) {
        if (config.params[key] !== void 0 && config.params[key] !== null) {
          url += `${key}=${encodeURIComponent(config.params[key])}&`;
        }
      }
      url = url.substring(0, url.length - 1);
      config.params = {};
      config.url = url;
    }
    // headers token 增加
    const token = getLoginToken();
    if (typeof token !== 'undefined' && token) {
      config.headers[HEADER_TOKEN_NAME] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse<RequestResponseType>) => {
    const data = response.data;
    if (data.success === false) {
      const errorMsg = data.remark ? data.remark : data.errorInfo;
      Message.error(errorMsg);
      // 未登录处理
      if (403 === data.errorCode) {
        loginOut();
      }
    }
    return data;
  },
  (error) => {
    // 处理响应错误
    Message.error(`Error: ${error.message}`);
    return Promise.reject(error);
  }
);

export default instance;
