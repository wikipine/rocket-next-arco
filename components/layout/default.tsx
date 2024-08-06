import React, { useState, ReactNode, useEffect } from 'react';
import { Layout, Breadcrumb, Spin } from '@arco-design/web-react';
import cs from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import LayoutNavbar from '@/components/layout/navbar';
import LayoutFooter from '@/components/layout/footer/index';
import LayoutMenu from '@/components/layout/menu';
import useLocale from '@/utils/useLocale';
import { RootState } from '@/store';
import getUrlParams from '@/utils/getUrlParams';
import styles from './style/layout.module.less';
import NoAccess from '@/components/exception/403';
import { getLoginToken, getLoginUserInfo, loginOut } from '@/utils/auth';
import { initRoutePermission } from '@/store/slice/routePermissionSlice';
import { useRouter } from 'next/router';
import { getBreadcrumbList } from '@/utils/routes';

function PageLayout({ children }: { children: ReactNode }) {
  const urlParams = getUrlParams();
  const locale = useLocale();
  const router = useRouter();
  const pathname = router.pathname;
  const { auth, setting, routePermission } = useSelector(
    (state: RootState) => state
  );
  const dispatch = useDispatch();

  const showMenu = setting?.menu && urlParams.menu !== false;
  const showNavbar = setting?.navbar && urlParams.navbar !== false;
  const showFooter = setting?.footer && urlParams.footer !== false;

  const paddingTop = showNavbar ? setting.navbarHeight : 0;
  const [paddingLeft, setPaddingLeft] = useState(
    showMenu ? setting?.menuWidth : 0
  );
  const [hasPermission, setHasPermission] = useState(false);
  const [permissionLoading, setPermissionLoading] = useState(true);
  const [breadcrumbList, setBreadcrumbList] = useState([]);

  // 初始化权限处理
  useEffect(() => {
    (async () => {
      // 尝试从缓存中获取
      const token = getLoginToken();
      if (!token) {
        loginOut();
        return;
      }
      // 获取用户的信息
      const userInfo = await getLoginUserInfo();
      // 加载权限
      dispatch(initRoutePermission(userInfo.role));
    })();
  }, []);

  useEffect(() => {
    if (routePermission.hasSet) {
      // 权限校验处理
      const routeKey = pathname.slice(1);
      if (routePermission.routeMap.hasOwnProperty(routeKey)) {
        setHasPermission(true);
        setBreadcrumbList(getBreadcrumbList(routeKey));
      } else {
        setHasPermission(false);
      }
      setPermissionLoading(false);
    }
  }, [pathname, routePermission.hasSet]);

  return (
    <Layout className={styles.layout}>
      <div
        className={cs(styles['layout-navbar'], {
          [styles['layout-navbar-hidden']]: !showNavbar,
        })}
      >
        <LayoutNavbar show={showNavbar} />
      </div>
      <Layout>
        {showMenu && auth.userInfo.role ? (
          <LayoutMenu
            paddingTop={paddingTop}
            onMenuWidth={(width) => {
              setPaddingLeft(width);
            }}
          ></LayoutMenu>
        ) : null}
        <Layout
          className={styles['layout-content']}
          style={{
            paddingLeft,
            paddingTop,
          }}
        >
          <div className={styles['layout-content-wrapper']}>
            {!!breadcrumbList.length && (
              <div className={styles['layout-breadcrumb']}>
                <Breadcrumb>
                  {breadcrumbList.map((node, index) => (
                    <Breadcrumb.Item key={index}>
                      {node.name ? locale[node.name] || node.name : node.name}
                    </Breadcrumb.Item>
                  ))}
                </Breadcrumb>
              </div>
            )}
            <Layout.Content>
              {permissionLoading ? (
                <Spin className={styles['spin']} />
              ) : hasPermission ? (
                children
              ) : (
                <NoAccess />
              )}
            </Layout.Content>
          </div>
          {showFooter && <LayoutFooter />}
        </Layout>
      </Layout>
    </Layout>
  );
}

export default PageLayout;
