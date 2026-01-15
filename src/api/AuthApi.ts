import { madokaPost } from "@/utils/request.ts"

export default {
  login: (data) => madokaPost("/login", data, { showErrorMessage: false }),
  upload: (data) => madokaPost("/avatar", data),
}