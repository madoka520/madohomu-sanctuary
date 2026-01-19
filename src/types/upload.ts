/**
 * 后端返回的签名对象
 */
export type SignedPath = {
  accessKey: string,
  driver: string,
  expiredAt: number,
  host: string,
  path: string,
  filename: string,
  fileExtension: string,
  signature: string,
  policy: string,
  objectSignatureId: number,
}

/**
* 驱动管理器
*/
export type OssDriverManager = {
  getDriver(driver :string) : OssDriver
}

/**
* oss驱动
*/
export type OssDriver = {
  upload: (file: File, signed: SignedPath) => Promise<UploadCallback>;
}

/**
* 上传回调返回值
*/
export type UploadCallback = {
  id: number
}
