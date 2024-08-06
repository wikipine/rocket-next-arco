/**
 * 路由权限数据处理
 */
import { IRoute } from '@/config/routes';
import store from '@/store';

/**
 * 获取首次加载的路由
 */
export function getInitialPath(): string {
  const state = store.getState();
  const routes: IRoute[] = state.routePermission.routeList;
  // 递归函数找到第一个有效路径
  function findFirstValidRoute(routes: IRoute[]): string | null {
    for (const route of routes) {
      if (!route.ignore) {
        if (route.children && route.children.length > 0) {
          return findFirstValidRoute(route.children);
        } else {
          return route.key;
        }
      }
    }
    return '';
  }
  const initialPath = findFirstValidRoute(routes);
  return `/${initialPath}`;
}

/**
 * 获取 breadcrumbList
 */
export function getBreadcrumbList(routeKey: string) {
  const state = store.getState();
  const { routeList, routeMap } = state.routePermission;
  const routeIndex = routeMap[routeKey];
  if (!routeIndex) {
    return [];
  }
  const keys = routeIndex.split('_').map((key) => parseInt(key, 10));
  const traverse = (routes: IRoute[], keys: number[]) => {
    if (keys.length === 0) {
      return [];
    }
    const currentIndex = keys[0];
    const currentRoute = routes[currentIndex];
    if (!currentRoute) {
      return [];
    }
    const result = [{ name: currentRoute.name, key: currentRoute.key }];
    if (keys.length === 1) {
      return result;
    }
    if (currentRoute.children) {
      const childResult = traverse(currentRoute.children, keys.slice(1));
      if (childResult) {
        return result.concat(childResult);
      }
    }
    return [];
  };
  return traverse(routeList, keys);
}
