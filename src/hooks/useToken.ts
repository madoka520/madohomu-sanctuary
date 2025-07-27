// useToken.ts
import { cloneDeep } from "lodash-unified";

export type UserInfo = {
  username: string;
  nickname: string;
}
export function useToken() {
  // 使用 `ref` 来存储 token 状态，初始化时从 localStorage 中获取 token
  const globalToken = useLocalStorage("token", "")
  const globalUserInfo = useLocalStorage("userInfo", {} as UserInfo)
  // 设置 token
  const setToken = (newToken: string, ttl: number) => {
    globalToken.value = newToken
  }

  // 获取 token
  const getToken = () => {
    return globalToken.value
  }

  // 清除 token
  const clearToken = () => {
    globalToken.value = null
    globalUserInfo.value = {} as UserInfo
  }

  const setUserInfo = (userInfo: UserInfo) => {
    globalUserInfo.value = cloneDeep(userInfo)
  }
  const getUserInfo = () => globalUserInfo.value
  return {
    token: globalToken,
    setToken,
    getToken,
    clearToken,
    setUserInfo,
    getUserInfo,
  }
}
