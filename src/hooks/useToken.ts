// useToken.ts
import { cloneDeep } from "lodash-unified";
import { defineStore } from "pinia";

export type UserInfo = {
  username: string;
  nickname: string;
}
export default defineStore("user", {
  state: () => ({
    _token: useLocalStorage("token", ""),
    userInfo:  useLocalStorage("userInfo", {} as UserInfo)
  }),
  getters: {
    token: state => state._token
  },
  actions: {
    setToken(newToken: string) {
      this._token = newToken
    },

    // 清除 token
    clearToken() {
      this._token = ""
      this.userInfo = {} as UserInfo
    },

    setUserInfo(userInfo: UserInfo) {
      this.userInfo = cloneDeep(userInfo)
    },

  }
})
