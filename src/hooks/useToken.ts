// useToken.ts
import { cloneDeep } from "lodash-unified";
import { defineStore } from "pinia";
import AuthApi from "@/api/AuthApi.ts"

export type UserInfo = {
  username: string;
  password: string;
}
export default defineStore("user", () => {
  const login = async (data: UserInfo) => {
    const res = await AuthApi.login(data)
    s.token = res.token
    s.userInfo = res as any
  }
  const logout = () => {
    s.token = ""
    s.userInfo = {} as UserInfo
  }
  const s = reactive({
    token: useLocalStorage("token", ""),
    userInfo:  useLocalStorage("userInfo", {} as UserInfo),
    logout,
    login
  })

  return toRefs(s)
})
