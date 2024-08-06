import { Form, Input, Button, Space } from '@arco-design/web-react';
import { FormInstance } from '@arco-design/web-react/es/Form';
import { IconLock, IconUser } from '@arco-design/web-react/icon';
import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import useLocale from '@/utils/useLocale';
import { setUserInfo, setToken } from '@/store/slice/authSlice';
import locale from './locale';
import styles from './style/index.module.less';
import to from 'await-to-js';
import {
  LoginFormType,
  LoginMethod,
  SystemScopeAlias,
} from '@/types/request/account';
import { loginApi } from '@/api/account';

import { useRouter } from 'next/router';

export default function LoginForm() {
  const formRef = useRef<FormInstance>();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const t = useLocale(locale);

  const onSubmitClick = async () => {
    const [_err, formData] = await to(formRef.current.validate());
    if (_err) {
      return;
    }
    setErrorMessage('');
    setLoading(true);
    const params: LoginFormType = {
      loginMethod: LoginMethod.Account,
      certificate: formData.userName,
      safePassword: formData.password,
      systemScopeAlias: SystemScopeAlias.System,
    };
    const [err, res] = await to(loginApi(params));
    setLoading(false);
    if (err || !res.success) {
      return;
    }
    // 设置 token 和 用户基本信息
    dispatch(setToken(`Bearer ${res.data.token}`));
    // 设置用户基本信息
    dispatch(
      setUserInfo({
        name: res.data.username,
        avatar: res.data.avatar,
        role: 'admin',
      })
    );
    // 前往首页
    router.push('/');
  };

  return (
    <div className={styles['login-form-wrapper']}>
      <div className={styles['login-form-title']}>{t['login.form.title']}</div>
      <div className={styles['login-form-sub-title']}>
        {t['login.form.title']}
      </div>
      <div className={styles['login-form-error-msg']}>{errorMessage}</div>
      <Form
        className={styles['login-form']}
        layout="vertical"
        ref={formRef}
        initialValues={{ userName: 'admin', password: 'admin' }}
      >
        <Form.Item
          field="userName"
          rules={[{ required: true, message: t['login.form.userName.errMsg'] }]}
        >
          <Input
            prefix={<IconUser />}
            placeholder={t['login.form.userName.placeholder']}
            onPressEnter={onSubmitClick}
          />
        </Form.Item>
        <Form.Item
          field="password"
          rules={[{ required: true, message: t['login.form.password.errMsg'] }]}
        >
          <Input.Password
            prefix={<IconLock />}
            placeholder={t['login.form.password.placeholder']}
            onPressEnter={onSubmitClick}
          />
        </Form.Item>
        <Space size={16} direction="vertical">
          <Button type="primary" long onClick={onSubmitClick} loading={loading}>
            {t['login.form.login']}
          </Button>
          <Button
            type="text"
            long
            className={styles['login-form-register-btn']}
          >
            {t['login.form.register']}
          </Button>
        </Space>
      </Form>
    </div>
  );
}
