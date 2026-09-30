import
// =========start========== i18n
import i18n from '@/i18n'
// ========end======== axios, { type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from "axios"
import { message } from "@madoka520/vue-ui"
import type { MyAxiosRequestConfig } from "@/types/IAxiosType.ts"
// import { useToken } from "@/hooks/useToken.ts";

// const authenticated = computed(() => !!useToken().getToken());
const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
})


service.interceptors.request.use(
  (cfg) => {
    const tokenRequired = (cfg.headers || {}).tokenRequired !== false
    if (tokenRequired && localStorage.getItem('token')) {
      cfg.headers.Authorization = `Bearer ${localStorage.getItem("token")}`
    }
    return cfg
  },
  (e) => {
    Promise.reject(e).then((r) => r)
  },
)

service.interceptors.response.use(
  (res) => {
    switch (res.config.method) {
      case "put":
      case "post": {
        if (res.status === 200 && res.config.showSuccessMessage) {
          message.success(res.data.message ?? i18n.global.t('request.success'))
        }
      }
    }

    return Promise.resolve(res.data)
  },
  (err) => {
    const cfg = err.config as MyAxiosRequestConfig
    const res = err.response?.data ?? {}
    const { error, message: msg } = res

    // 根据配置决定是否显示错误提示
    if (cfg?.showErrorMessage !== false && !["get", "GET"].includes(cfg.method!)) {
      message.error(error ?? i18n.global.t('request.error'))
    }

    return Promise.reject(msg ?? error ?? err)
  },
)
//参数类型
export type RequestParams = { params?: any; data?: any };

/**
 * GET请求
 * @param url
 * @param params
 * @param config
 */
export const madokaGet = (url: string, params: any = {}, config?: InternalAxiosRequestConfig) => {
  return service.get(url, { params, ...config });
};
/**
 * POST请求
 * @param url
 * @param data
 * @param config
 */
export const madokaPost = <T>(url: string, data: any, config?: MyAxiosRequestConfig): Promise<AxiosResponse<T>> => {
  return service.post(url, data, config)
}
/**
 * PUT请求
 @param url
 * @param data
 * @param config
 */
export const madokaPut = (url: string, data: any, config?: MyAxiosRequestConfig) => {
  return service.put(url, data, config)
}
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
