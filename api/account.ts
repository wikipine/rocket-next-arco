import request from '@/utils/request';
import { LoginFormType } from '@/types/request/account';
import { UserInfoResponseData } from '@/types/response/account';

/**
 * 登录接口
 */
export const loginApi = (data: LoginFormType) => {
  return request.post({
    url: '/uic/login/platform',
    data,
  });
};

/**
 * 加载用户信息&权限
 */
export const getUserInfoApi = () => {
  return request.get<UserInfoResponseData>({
    url: '/api/user/userInfo',
  });
};
