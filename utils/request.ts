/**
 * 基于axios实现的通用请求
 */
import axios from 'axios';
import qs from 'qs';
import { hostname, LOGIN_TOKEN_KEY } from '@/utils/constance';
import { Message as arcoToast } from '@arco-design/web-react';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function updateToken(res) {
  const token = res?.data?.access_token;

  if ('bearer' === res?.data?.token_type && token) {
    localStorage.setItem(LOGIN_TOKEN_KEY, `Bearer ${token}`);
    // $.ajaxSetup({
    //     headers: {
    //         token
    //     }
    // })
  }

  return res;
}

function parseJSON(response) {
  return response.data;
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} payload   params
 * @param  {boolean} needLoginToken the request we need to login or not
 *
 * @return {object}           An object containing either "data" or "err"
 */
function request(type) {
  return (
    url = '',
    payload = {},
    needLoginToken = true,
    config = {},
    needStopRepeat = true
  ) => {
    if (!url.startsWith('http')) {
      url = `${hostname}${url}`;
    }
    if (typeof config === 'boolean') {
      needStopRepeat = config;
      config = {};
    }
    // 支持任意返回类型
    if (payload && payload['__responseType']) {
      config['responseType'] = payload['__responseType'];
    }

    if (!url) {
      console.warn('url不存在');
      return new Promise((r) => {});
    }

    let params = {};
    if ('get' === type) {
      const getParams = qs.stringify(payload);
      if (url.indexOf('?') > -1) {
        url += '&=' + getParams;
      } else {
        url += '?' + getParams;
      }
      params = config;
    } else if ('post' === type) {
      if (payload instanceof FormData) {
        params = payload;
        config = Object.assign(
          {},
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
          config
        );
      } else {
        params = payload;
        console.log('===', params);

        config = Object.assign(
          {},
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
          config
        );
      }
    }

    const token = localStorage.getItem(LOGIN_TOKEN_KEY);

    if (token) {
      config.headers = Object.assign({}, config.headers, {
        Authorization: token,
      });
    }

    return (
      axios[type](url, params, config)
        .then(updateToken)
        .then(checkStatus)
        .then(parseJSON)
        // .then(checkFlag.bind(this, url))
        .then((data) => {
          return data;
        })
        .catch((err) => {
          const response = err.response;
          console.log('=====啥意思', err, response);
          if (
            response &&
            [401, 403].includes(+response.status) &&
            ['Unauthorized', 'Forbidden'].includes(response.statusText)
          ) {
            response?.data?.detail?.message &&
              arcoToast.error(response?.data?.detail?.message);
            if (window.location.pathname.replace(/\//g, '') !== 'login') {
              window.location.pathname = '/login';
            }
          }
          throw err;
        })
        .finally((res) => {})
    );
  };
}
/**
 * 注册全局异步请求api
 */
// export default () => {
//   Object.defineProperty(window, 'request', {
//     value: {
//       get: request('get'),
//       post: request('post'),
//     },
//     writable: false,
//     enumerable: false,
//     configurable: false,
//   });
// };

export default request;
