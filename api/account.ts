import request from '@/utils/request';
import { LoginFormType } from '@/api/types/account';

/**
 * 登录接口
 */
export const loginApi = (data: LoginFormType) => {
  return request.post({
    url: '/uic/login/platform',
    data,
  });
};
