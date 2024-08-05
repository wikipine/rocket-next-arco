/**
 * 登录表单
 */
export enum LoginMethod {
  Account = 'account',
}
export enum SystemScopeAlias {
  System = 'system',
}
export type LoginFormType = {
  loginMethod: LoginMethod;
  certificate: string;
  safePassword: string;
  systemScopeAlias: SystemScopeAlias;
};
