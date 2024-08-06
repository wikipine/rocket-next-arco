/**
 * 路由权限管理
 * ps: 后期可能需要支持按钮级别的权限管理，故放在此进行管理
 */
import { createSlice } from '@reduxjs/toolkit';
import { routes, RoutePermissionWeight } from '@/config/routes';
import type { IRoute, RolePermission } from '@/config/routes';

const routePermissionSlice = createSlice({
  name: 'routePermission',
  initialState: {
    hasSet: false,
    routeMap: {},
    routeList: [],
  },
  reducers: {
    // 初始化仅需要执行一下
    initRoutePermission: (state, action) => {
      const role = action.payload;
      if (state.hasSet || !role || !RoutePermissionWeight[role]) {
        return;
      }
      // 生成当前
      const permissionRoutes: IRoute[] = [];
      const permissionMap: Map<string, string> = new Map();

      function filterRoutes(
        routes: IRoute[],
        currentRole: RolePermission,
        path = ''
      ): IRoute[] {
        const currentRoleWeight = RoutePermissionWeight[currentRole];
        return routes
          .filter((route) => {
            if (
              route.role &&
              RoutePermissionWeight[route.role] < currentRoleWeight
            ) {
              return false;
            }
            return true;
          })
          .map((route, index) => {
            const newPath = path ? `${path}_${index}` : `${index}`;
            const newRoute = { ...route };
            permissionMap.set(newRoute.key, newPath);

            if (newRoute.children) {
              newRoute.children = filterRoutes(
                newRoute.children,
                currentRole,
                newPath
              );
            }

            return newRoute;
          });
      }

      permissionRoutes.push(...filterRoutes(routes, role));

      state.routeList = permissionRoutes;
      state.routeMap = Object.fromEntries(permissionMap.entries());
      state.hasSet = true;
    },
  },
});

export const { initRoutePermission } = routePermissionSlice.actions;

export default routePermissionSlice.reducer;
