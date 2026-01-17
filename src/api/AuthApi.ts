import { madokaPost, madokaPut } from "@/utils/request.ts"

export default {
  login: (data) => madokaPost("/login", data, { showErrorMessage: false }),
  upload: (data) => madokaPost("/avatar", data),
  updateUsername: (username) => madokaPut("/username", { username }),
  updatePassword: (password) => madokaPut("/password", { password }),
}