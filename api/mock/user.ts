import Mock from 'mockjs';
import { isSSR } from '@/utils/is';
import setupMock from '@/utils/setupMock';

if (!isSSR) {
  Mock.XHR.prototype.withCredentials = true;

  setupMock({
    setup: () => {
      Mock.mock(new RegExp('/api/user/userInfo'), () => {
        return Mock.mock({
          success: true,
          data: {
            name: 'admin',
            avatar:
              'https://lf1-xgcdn-tos.pstatp.com/obj/vcloud/vadmin/start.8e0e4855ee346a46ccff8ff3e24db27b.png',
            email: 'wangliqun@email.com',
            role: 'admin',
            job: 'frontend',
            jobName: '前端开发工程师',
            organization: 'Frontend',
            organizationName: '前端',
            location: 'beijing',
            locationName: '北京',
            introduction: '王力群并非是一个真实存在的人。',
            personalWebsite: 'https://www.arco.design',
            verified: true,
            phoneNumber: /177[*]{6}[0-9]{2}/,
            accountId: /[a-z]{4}[-][0-9]{8}/,
            registrationTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
          },
        });
      });

      // 登录
      Mock.mock(new RegExp('/api/user/login'), (params) => {
        const { username, password } = JSON.parse(params.body);
        if (!username) {
          return {
            success: false,
            remark: '用户名不能为空',
          };
        }
        if (!password) {
          return {
            success: false,
            remark: '密码不能为空',
          };
        }
        if (username === 'admin' && password === 'admin') {
          return {
            success: true,
            data: {
              name: username,
              avatar:
                'https://lf1-xgcdn-tos.pstatp.com/obj/vcloud/vadmin/start.8e0e4855ee346a46ccff8ff3e24db27b.png',
              role: 'admin',
              token: 'token-' + Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
            },
          };
        }
        return {
          success: false,
          remark: '账号或者密码错误',
        };
      });
    },
  });
}
