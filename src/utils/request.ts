import axios, { type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from "axios"
// =========start========== i18n
import i18n from '@/i18n'
// ========end========
import { message } from "@madoka520/vue-ui"
import type { MyAxiosRequestConfig } from "@/types/IAxiosType.ts"

// =========start========== 后端消息本地化：后端只返回中文文案，
// 这里按「去掉尾部标点后的原文」映射到 i18n 键；未收录的消息原样透出
const SERVER_MESSAGE_KEYS: Record<string, string> = {
  登录成功: 'server.loginSuccess',
  注册成功: 'server.registerSuccess',
  上传成功: 'server.uploadSuccess',
  修改成功: 'server.updateSuccess',
  用户名不能为空: 'server.usernameRequired',
  用户名或密码错误: 'server.wrongCredentials',
  用户名非法: 'server.invalidUsername',
  用户名已存在: 'server.usernameExists',
  未上传文件: 'server.noFile',
  仅支持图片格式: 'server.imageOnly',
  非法图片文件: 'server.invalidImage',
  服务器内部错误: 'server.serverError',
  留言不能为空: 'server.messageEmpty',
  留言发送成功: 'server.messageSent',
  操作成功: 'server.opSuccess',
}

const localizeServerMessage = (msg?: string) => {
  if (!msg) return undefined
  const key = msg.replace(/[!！。~～\s]+$/g, '')
  const i18nKey = SERVER_MESSAGE_KEYS[key]
  return i18nKey ? i18n.global.t(i18nKey) : msg
}
// ========end========
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
          message.success(localizeServerMessage(res.data.message) ?? i18n.global.t('request.success'))
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
      message.error(localizeServerMessage(error) ?? i18n.global.t('request.error'))
    }

    return Promise.reject(localizeServerMessage(msg) ?? localizeServerMessage(error) ?? err)
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
