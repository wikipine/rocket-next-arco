/**
 * 用户管理
 */
import { CACHE_NAME } from '@/config/cache';
import cache from '@/utils/cache';
import to from 'await-to-js';
import { getUserInfoApi } from '@/api/account';
import store from '@/store';
import { setUserInfo, setToken } from '@/store/slice/authSlice';

/**
 * 设置Token
 * @param token
 */
export const setLoginToken = (token: string) => {
  cache.set(CACHE_NAME.LOGIN_TOKEN, `${token}`);
};

/**
 * 获取Token
 */
export const getLoginToken = () => {
  const token = cache.get(CACHE_NAME.LOGIN_TOKEN);
  if (token) {
    // 加载到store中
    store.dispatch(setToken(token));
    return token;
  } else {
    return null;
  }
};

/**
 * 退出登录
 */
export const loginOut = () => {
  cache.remove(CACHE_NAME.LOGIN_TOKEN);
  cache.remove(CACHE_NAME.USER_INFO);
  window.location.href = '/public/login';
};

/**
 * 设置用户信息进缓存
 * @param data
 */
export const setLoginUserInfo = (data: any) => {
  cache.set(CACHE_NAME.USER_INFO, data);
};

/**
 * 获取用户信息
 */
export const getLoginUserInfo = async () => {
  let userInfo = cache.get(CACHE_NAME.USER_INFO);
  if (!userInfo) {
    const [err, res] = await to(getUserInfoApi());
    if (err) {
      return null;
    }
    userInfo = {
      name: res.data.name,
      avatar: res.data.avatar,
      role: res.data.role,
    };
  }
  // 加载到 store 中
  store.dispatch(setUserInfo(userInfo));
  return userInfo ?? null;
};
