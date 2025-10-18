import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
// import { useToken } from "@/hooks/useToken.ts";

// const authenticated = computed(() => !!useToken().getToken());
const service = axios.create({
  baseURL: '/madoka-api',
  timeout: 10000,
});

service.interceptors.request.use(
  (cfg) => {
    const tokenRequired = (cfg.headers || {}).tokenRequired === false;
    if (tokenRequired) {
      cfg.headers.Authorization = `Bearer ${tokenRequired}`;
    }
    return cfg;
  },
  (e) => {
    Promise.reject(e).then((r) => r);
  },
);

service.interceptors.response.use(
  (res) => {
    return Promise.resolve(res.data);
  },
  (err) => {
    console.log("Error: ", err);
    const res = err.response?.data ?? {};
    let { message } = res;
    return Promise.reject(message);
  },
);
//参数类型
export type RequestParams = { params?: any; data?: any };

/**
 * GET请求
 * @param url
 * @param params
 * @param config
 */
export const madokaGet = (url: string, params: any, config?: InternalAxiosRequestConfig) => {
  return service.get(url, { params, ...config });
};
/**
 * POST请求
 * @param url
 * @param data
 * @param config
 */
export const madokaPost = <T>(url: string, data: any, config?: InternalAxiosRequestConfig): Promise<AxiosResponse<T>> => {
  return service.post(url, data, config);
};
/**
 * PUT请求
 @param url
 * @param data
 * @param config
 */
export const madokaPut = (url: string, data: any, config?: InternalAxiosRequestConfig) => {
  return service.put(url, data, config);
};
/**
 * DELETE请求
 @param url
 * @param id
 * @param config
 */
export const madokaDelete = (url: string, id: string | number,  config?: InternalAxiosRequestConfig) => {
  if (id) {
    url = `${url}/${id}`;
  }
  return service.delete(url, config);
};
