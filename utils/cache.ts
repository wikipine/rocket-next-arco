/**
 * 基于 localStorage 实现的缓存方法
 */
import { isSSR } from "@/utils/is";
const CACHE_KEY = process.env.NEXT_PUBLIC_CLIENT_CACHE_NAME ?? 'rkt-next';

export default class {

    /**
     * 将数据保存到缓存中
     * @param {string} key - 数据的子键
     * @param {any} value - 要保存的数据
     */
    static set(key, value) {
        if(isSSR) {
            return;
        }
        let cache = this.getAll();
        cache[key] = value;
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    }

    /**
     * 从缓存中获取数据
     * @param {string} key - 数据的子键
     * @returns {any} - 返回对应的缓存数据，如果不存在则返回 null
     */
    static get(key) {
        if(isSSR) {
            return null;
        }
        let cache = this.getAll();
        return cache[key] || null;
    }

    /**
     * 从缓存中删除指定的数据
     * @param {string} key - 数据的子键
     */
    static remove(key) {
        if(isSSR) {
            return;
        }
        let cache = this.getAll();
        delete cache[key];
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    }

    /**
     * 清除所有缓存数据
     */
    static clearAll() {
        if(isSSR) {
            return;
        }
        localStorage.removeItem(CACHE_KEY);
    }

    /**
     * 获取所有缓存数据
     * @returns {object} - 返回所有缓存数据
     */
    static getAll() {
        if(isSSR) {
            return {};
        }
        const cache = localStorage.getItem(CACHE_KEY);
        return cache ? JSON.parse(cache) : {};
    }
}
