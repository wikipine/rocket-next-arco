import React, { useState, ReactNode, useRef, useEffect } from 'react';
import { Layout, Breadcrumb, Spin } from '@arco-design/web-react';
import cs from 'classnames';
import { useSelector } from 'react-redux';
import LayoutNavbar from '@/components/layout/navbar';
import LayoutFooter from '@/components/layout/footer/index';
import LayoutMenu from '@/components/layout/menu';
import useLocale from '@/utils/useLocale';
import store, { RootState } from '@/store';
import getUrlParams from '@/utils/getUrlParams';
import styles from './style/layout.module.less';
import NoAccess from '@/pages/public/exception/403';

function PageLayout({ children }: { children: ReactNode }) {
  const urlParams = getUrlParams();
  const locale = useLocale();
  const { auth, setting } = useSelector((state: RootState) => state);

  const showMenu = setting?.menu && urlParams.menu !== false;
  const showNavbar = setting?.navbar && urlParams.navbar !== false;
  const showFooter = setting?.footer && urlParams.footer !== false;

  const [breadcrumb, setBreadCrumb] = useState([]);
  const paddingTop = showNavbar ? setting.navbarHeight : 0;
  const [paddingLeft, setPaddingLeft] = useState(
    showMenu ? setting?.menuWidth : 0
  );
  const [showChild, setShowChild] = useState(false);

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
        {showMenu ? (
          <LayoutMenu
            paddingTop={paddingTop}
            onMenuWidth={(width) => {
              setPaddingLeft(width);
            }}
            onShowChild={setShowChild}
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
            {!!breadcrumb.length && (
              <div className={styles['layout-breadcrumb']}>
                <Breadcrumb>
                  {breadcrumb.map((node, index) => (
                    <Breadcrumb.Item key={index}>
                      {typeof node === 'string' ? locale[node] || node : node}
                    </Breadcrumb.Item>
                  ))}
                </Breadcrumb>
              </div>
            )}
            <Layout.Content>
              {showChild ? children : <NoAccess />}
            </Layout.Content>
          </div>
          {showFooter && <LayoutFooter />}
        </Layout>
      </Layout>
    </Layout>
  );
}

export default PageLayout;
