import React, {
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Layout, Menu } from '@arco-design/web-react';
import styles from '@/components/layout/style/layout.module.less';
import {
  IconDashboard,
  IconMenuFold,
  IconMenuUnfold,
  IconTag,
} from '@arco-design/web-react/icon';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import qs from 'query-string';
import { useRouter } from 'next/router';
import useRoute from '@/hooks/useRoute';
import type { IRoute } from '@/config/routes';
import Link from 'next/link';
import useLocale from '@/utils/useLocale';

const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;

function getIconFromKey(key) {
  switch (key) {
    case 'dashboard':
      return <IconDashboard className={styles.icon} />;
    case 'example':
      return <IconTag className={styles.icon} />;
    default:
      return <div className={styles['icon-empty']} />;
  }
}

function SliderMenu({ paddingTop, onMenuWidth, onShowChild }) {
  const { auth, setting } = useSelector((state: RootState) => state);
  const locale = useLocale();
  // 样式相关
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const menuWidth = collapsed ? 48 : setting?.menuWidth;

  // 菜单内容 & 路由
  const router = useRouter();
  const pathname = router.pathname;
  const [routes, defaultRoute] = useRoute();
  const currentComponent = qs.parseUrl(pathname).url.slice(1);
  const defaultSelectedKeys = [currentComponent || defaultRoute];
  const paths = (currentComponent || defaultRoute).split('/');
  const defaultOpenKeys = paths.slice(0, paths.length - 1);
  const [selectedKeys, setSelectedKeys] =
    useState<string[]>(defaultSelectedKeys);
  const [openKeys, setOpenKeys] = useState<string[]>(defaultOpenKeys);

  const routeMap = useRef<Map<string, ReactNode[]>>(new Map());
  const menuMap = useRef<
    Map<string, { menuItem?: boolean; subMenu?: boolean }>
  >(new Map());

  // 渲染菜单路由
  function renderRoutes(locale) {
    routeMap.current.clear();
    return function travel(_routes: IRoute[], level, parentNode = []) {
      return _routes.map((route) => {
        const { breadcrumb = true, ignore } = route;
        const iconDom = getIconFromKey(route.key);
        const titleDom = (
          <>
            {iconDom} {locale[route.name] || route.name}
          </>
        );

        routeMap.current.set(
          `/${route.key}`,
          breadcrumb ? [...parentNode, route.name] : []
        );

        const visibleChildren = (route.children || []).filter((child) => {
          const { ignore, breadcrumb = true } = child;
          if (ignore || route.ignore) {
            routeMap.current.set(
              `/${child.key}`,
              breadcrumb ? [...parentNode, route.name, child.name] : []
            );
          }

          return !ignore;
        });

        if (ignore) {
          return '';
        }
        if (visibleChildren.length) {
          menuMap.current.set(route.key, { subMenu: true });
          return (
            <SubMenu key={route.key} title={titleDom}>
              {travel(visibleChildren, level + 1, [...parentNode, route.name])}
            </SubMenu>
          );
        }
        menuMap.current.set(route.key, { menuItem: true });
        return (
          <MenuItem key={route.key}>
            <Link href={`/${route.key}`}>
              <a>{titleDom}</a>
            </Link>
          </MenuItem>
        );
      });
    };
  }

  // 菜单点击
  function onClickMenuItem(key) {
    setSelectedKeys([key]);
  }

  function updateMenuStatus() {
    const pathKeys = pathname.split('/');
    const newSelectedKeys: string[] = [];
    const newOpenKeys: string[] = [...openKeys];
    while (pathKeys.length > 0) {
      const currentRouteKey = pathKeys.join('/');
      const menuKey = currentRouteKey.replace(/^\//, '');
      const menuType = menuMap.current.get(menuKey);
      if (menuType && menuType.menuItem) {
        newSelectedKeys.push(menuKey);
      }
      if (menuType && menuType.subMenu && !openKeys.includes(menuKey)) {
        newOpenKeys.push(menuKey);
      }
      pathKeys.pop();
    }
    setSelectedKeys(newSelectedKeys);
    setOpenKeys(newOpenKeys);
  }

  useEffect(() => {
    const routeConfig = routeMap.current.get(pathname);
    // setBreadCrumb(routeConfig || []);
    updateMenuStatus();
    onShowChild(routeMap.current.has(pathname));
  }, [pathname]);

  useEffect(() => {
    onMenuWidth(menuWidth);
  }, [collapsed]);

  return (
    <Layout.Sider
      className={styles['layout-sider']}
      width={menuWidth}
      collapsed={collapsed}
      onCollapse={setCollapsed}
      trigger={null}
      collapsible
      breakpoint="xl"
      style={{
        paddingTop,
      }}
    >
      <div className={styles['menu-wrapper']}>
        <Menu
          collapse={collapsed}
          onClickMenuItem={onClickMenuItem}
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          onClickSubMenu={(_, openKeys) => {
            setOpenKeys(openKeys);
          }}
        >
          {renderRoutes(locale)(routes, 1)}
        </Menu>
      </div>
      <div
        className={styles['collapse-btn']}
        onClick={() => setCollapsed((collapsed) => !collapsed)}
      >
        {collapsed ? <IconMenuUnfold /> : <IconMenuFold />}
      </div>
    </Layout.Sider>
  );
}

export default SliderMenu;
