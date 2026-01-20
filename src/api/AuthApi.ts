import { madokaPost, madokaPut } from "@/utils/request.ts"
import type { SignedPath, UploadCallback } from "@/types/upload.ts"
import DriverManager from "@/utils/oss/DriverManager.ts"
import axios from "axios"

export default {
  login: (data) => madokaPost("/login", data, { showErrorMessage: false }),
  // upload: (data) => madokaPost("/avatar", data),
  upload: async (data, file: File) => {
    // 重新请求 token
    const res = await madokaPost("/avatar", data)
    // const res = await axios.post("/oss-api", data)
    const d = res.data as SignedPath
    if (!d) return

    const backData: UploadCallback = await DriverManager.getDriver(d.driver).upload(file, d)
    return backData
  },
  updateUsername: (username) => madokaPut("/username", { username }),
  updatePassword: (password) => madokaPut("/password", { password }),
}