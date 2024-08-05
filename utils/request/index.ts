import service, { RequestOptionType, RequestResponseType } from './service';

const request = <T = any>(
  option: RequestOptionType
): Promise<RequestResponseType<T>> => {
  const { url, method, params, data, headers } = option;
  return service({
    url,
    method,
    params,
    data,
    headers,
  }).then((response) => response as unknown as RequestResponseType<T>);
};

export default {
  get: <T = any>(
    option: Omit<RequestOptionType, 'method'>
  ): Promise<RequestResponseType<T>> => {
    return request<T>({ method: 'get', ...option });
  },
  post: <T = any>(
    option: Omit<RequestOptionType, 'method'>
  ): Promise<RequestResponseType<T>> => {
    return request<T>({ method: 'post', ...option });
  },
};
