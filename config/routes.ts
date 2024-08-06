// 角色权限
export type RolePermission = 'admin' | 'manager' | 'user';

export type IRoute = {
  name: string;
  key: string;
  // 当前路由是否渲染菜单项，为 true 的话不会在菜单中显示，但可通过路由地址访问。
  ignore?: boolean;
  role?: RolePermission;
  children?: IRoute[];
};

/**
 * 路由权限权重, 越小权重越大，权重大的拥有所有权限
 * 1 admin 2 manager 3 user
 */
export const RoutePermissionWeight: Record<RolePermission, number> = {
  admin: 1,
  manager: 2,
  user: 3,
};

export const routes: IRoute[] = [
  {
    name: 'menu.dashboard',
    key: 'dashboard',
    role: 'manager',
    children: [
      {
        name: 'menu.dashboard.workplace',
        key: 'dashboard/workplace',
      },
    ],
  },
  {
    name: 'Example',
    key: 'example',
  },
  {
    name: 'Example2',
    key: 'example3',
    ignore: true,
    // role: 'manager'
  },
];
