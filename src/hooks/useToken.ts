// useToken.ts
import { cloneDeep } from "lodash-unified";
import { defineStore } from "pinia";

export type UserInfo = {
  username: string;
  nickname: string;
}
export default defineStore("user", () => {
  const logout = () => {
    s.token = ""
    s.userInfo = {} as UserInfo
  }
  const s = reactive({
    token: useLocalStorage("token", ""),
    userInfo:  useLocalStorage("userInfo", {} as UserInfo),
    logout
  })

  return toRefs(s)
})
