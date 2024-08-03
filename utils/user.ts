/**
 * 用户管理
 */
import { CACHE_NAME } from '@/config/cache';
import cache from '@/utils/cache';

/**
 * 设置Token
 * @param token
 */
export const setLoginToken = (token: string) => {
  cache.set(CACHE_NAME.LOGIN_TOKEN, `Bearer ${token}`);
};

/**
 * 获取Token
 */
export const getLoginToken = () => {
  const token = cache.get(CACHE_NAME.LOGIN_TOKEN);
  return token ?? null;
};

/**
 * 退出登录
 */
export const loginOut = () => {
  cache.remove(CACHE_NAME.LOGIN_TOKEN);
  window.location.href = '/public/login';
};
