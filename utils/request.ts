/**
 * 基于NextJS Fetch 打造的通用请求方法
 */
import { hash } from 'ohash'
import qs from 'qs'
import { Message as message } from '@arco-design/web-react';
import store from '@/store/store';

interface RequestParams {
    url: string;
    headers?: Record<string, string>;
    params?: Record<string, any>;
    data?: Record<string, any>;
}

// 基本请求链接
const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

const request = (type, {method, url, headers, params, data})  => {
    let options = {
        method,
        params: params ? params : {}
    }
    if(data) {
        options['body'] = data;
    }
    if(headers) {
        options['headers'] = headers;
    }
    if (method === 'post'
        && options['headers']
        && options['headers']['Content-Type'] === 'application/x-www-form-urlencoded'
        && options['body']
    ) {
        options['body'] = qs.stringify(options['body']);
    }
    // 设置token
    const state = store.getState();
    const token = state.account.token;

    if(options['headers']) {
        options['headers']['access-token'] = token
    } else {
        options['headers'] = {
            'access-token': token
        }
    }
    // 设置浏览器指纹
    // if(rktFingerprint) {
    //     options['headers']['rkt-fingerprint'] = rktFingerprint;
    // }
    // 链接处理
    let reqUrl = baseUrl;
    if(url) {
        reqUrl += url;
    }
    // 不设置key，始终拿到的都是第一个请求的值，参数一样则不会进行第二次请求
    // const key = hash(JSON.stringify(options));
    // if(options['params']){
    //     options['params']['t'] = new Date().getTime();
    // } else {
    //     options['params'] = {
    //         t: new Date().getTime()
    //     }
    // }
    return new Promise((resolve, reject) => {
        fetch(reqUrl, { ...options }).then((res: any) => {
            // 错误交由指定业务处理
            if(!res.success) {
                let errorMsg = res.remark ?? res.errorInfo;
                if(!errorMsg) {
                    errorMsg = '未知的系统错误';
                }
                message.error(errorMsg);
                // todo 通用鉴权可在此处理
                if(res.errorCode === 10011002 && token) {
                    // 执行退出登录
                    // authStore.loginOut();
                }
            }
            resolve(res);
        }).catch((err) => {
            message.error(err.message);
            reject(err)
        })
    })
}

export default new class Http {
    get({url, headers, params, data}: RequestParams) {
        return request('client', {method: 'get', url, headers, params, data})
    }
    post({url, headers, params, data}: RequestParams)  {
        return request('client', {method: 'post', url, headers, params, data})
    }
    serverGet({url, headers, params, data}: RequestParams) {
        return request('server', {method: 'get', url, headers, params, data})
    }
    serverPost({url, headers, params, data}: RequestParams) {
        return request('server', {method: 'post', url, headers, params, data})
    }
}