import
// =========start========== i18n
import i18n from '@/i18n'
// ========end======== { madokaPost, madokaPut } from "@/utils/request.ts"
import DriverManager from "@/utils/oss/DriverManager.ts"
import type { SignedPath } from "@/types/upload.ts"
import { message } from "@madoka520/vue-ui"

export default {
  login: (data) => madokaPost("/login", data, { showErrorMessage: false }),
  // upload: (data) => madokaPost("/avatar", data),
  upload: async (data, file: File) => {
    // 重新请求 token
    // 原代码 - Codex 保留（后端代理上传，文件走后端流量）
    // const formData = new FormData();
    // formData.append("file", file);
    // return await madokaPost("/avatar", formData) as any
    /*    // const res = await axios.post("/oss-api", data)
    const d = res as unknown as SignedPath
    console.log(d)
    if (!d) return

    const backData: UploadCallback = await DriverManager.getDriver(d.driver).upload(file, d)
    return backData*/
    // =========start========== 前端直传：后端只签发凭证（POST /avatar/sign），文件由浏览器直传七牛
    const signed = await madokaPost("/avatar/sign", {}, { showSuccessMessage: false }) as unknown as (
      SignedPath & { message: string; updateTime: number }
    )

    if (!signed) {
      message.error(i18n.global.t('auth.signFail'))
      throw new Error("获取上传签名失败")
    }

    try {
      await DriverManager.getDriver(signed.driver).upload(file, signed)
    } catch (e) {
      message.error(i18n.global.t('auth.uploadFail'))
      throw e
    }

    return { message: "上传成功!", updateTime: signed.updateTime }
    // ========end========
  },
  updateUsername: (username) => madokaPut("/username", { username }),
  updatePassword: (password) => madokaPut("/password", { password }),
}