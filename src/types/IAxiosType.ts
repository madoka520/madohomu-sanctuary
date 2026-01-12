import type { AxiosRequestConfig } from "axios"
// 扩展 Axios 配置类型，增加 showErrorMessage
export interface MyAxiosRequestConfig extends AxiosRequestConfig {
  showErrorMessage?: boolean
}