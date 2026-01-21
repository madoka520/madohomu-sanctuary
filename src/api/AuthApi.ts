import { madokaPost, madokaPut } from "@/utils/request.ts"

export default {
  login: (data) => madokaPost("/login", data, { showErrorMessage: false }),
  // upload: (data) => madokaPost("/avatar", data),
  upload: async (data, file: File) => {
    // 重新请求 token
    const formData = new FormData();
    formData.append("file", file);
    const res = await madokaPost("/avatar", formData)
    /*    // const res = await axios.post("/oss-api", data)
    const d = res as unknown as SignedPath
    console.log(d)
    if (!d) return

    const backData: UploadCallback = await DriverManager.getDriver(d.driver).upload(file, d)
    return backData*/
  },
  updateUsername: (username) => madokaPut("/username", { username }),
  updatePassword: (password) => madokaPut("/password", { password }),
}