/**
 * 基于 js-cookie处理
 * ps: nextJS自带的cookie仅允许在app目录下处理，限制颇多
 */
import Cookies from 'js-cookie';

export default class {
  /**
   * 获取 cookies
   * @param key
   */
  static get(key) {
    const data = Cookies.get(key);
    return data ?? null;
  }

  /**
   * 设置 cookies
   * @param key
   * @param value
   */
  static set(key, value) {
    Cookies.set(key, value);
  }

  /**
   * 删除 cookies
   * @param key
   */
  static delete(key) {
    Cookies.remove(key);
  }
}
