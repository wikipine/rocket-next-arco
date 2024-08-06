import React, { useEffect, useMemo, useRef, useState } from 'react';
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

function SliderMenu({ paddingTop, onMenuWidth }) {
  const { setting, routePermission } = useSelector((state: RootState) => state);
  const locale = useLocale();
  // 样式相关
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const menuWidth = collapsed ? 48 : setting?.menuWidth;
  // 菜单内容 & 路由
  const router = useRouter();
  const pathname = router.pathname;
  const currentComponent = qs.parseUrl(pathname).url.slice(1);
  const defaultSelectedKeys = [currentComponent];
  const paths = currentComponent.split('/');
  const defaultOpenKeys = paths.slice(0, paths.length - 1);
  const [selectedKeys, setSelectedKeys] =
    useState<string[]>(defaultSelectedKeys);
  const [openKeys, setOpenKeys] = useState<string[]>(defaultOpenKeys);
  const menuMap = useRef<
    Map<string, { menuItem?: boolean; subMenu?: boolean }>
  >(new Map());

  // 渲染菜单路由
  const renderedRoutes = useMemo(() => {
    const travel = (_routes: IRoute[], level, parentNode = []) => {
      return _routes.map((route) => {
        const { ignore } = route;
        const iconDom = getIconFromKey(route.key);
        const titleDom = (
          <>
            {iconDom} {locale[route.name] || route.name}
          </>
        );
        const visibleChildren = (route.children || []).filter((child) => {
          const { ignore } = child;
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
    menuMap.current.clear();
    return travel(routePermission.routeList, 1);
  }, [routePermission.routeList, locale]);

  // 菜单点击
  function onClickMenuItem(key) {
    setSelectedKeys([key]);
  }
  // 更新菜单状态
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
    if (menuMap.current.size > 0) {
      updateMenuStatus();
    }
  }, [pathname, renderedRoutes]);

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
          {renderedRoutes}
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
