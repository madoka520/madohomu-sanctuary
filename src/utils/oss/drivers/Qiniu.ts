import { createDirectUploadTask, type FileData } from "qiniu-js";
import type { TokenProvider } from "qiniu-js/output/@internal";
import type { OssDriver, SignedPath, UploadCallback } from "@/types/upload.ts"

const QiniuDriver: OssDriver = {
  upload(file: File, signed: SignedPath): Promise<UploadCallback> {
    return new Promise((resolve, reject) => {
      // 创建上传数据
      const fileData: FileData = { type: "file", data: file, key: signed.path };

      const token: string = `${signed.accessKey}:${signed.signature}:${signed.policy}`;

      const tokenProvider: TokenProvider = () => Promise.resolve(token);

      // 创建直传任务
      const uploadTask = createDirectUploadTask(fileData, {
        tokenProvider,
      });
      // 设置进度回调函数
      uploadTask.onProgress((progress, context) => {
        // 处理进度回调
        // console.log(progress, context, "测试111");
      });

      // 设置完成回调函数
      uploadTask.onComplete((result, context) => {
        resolve(JSON.parse(result!).data);
      });

      // 设置错误回调函数
      uploadTask.onError((error, context) => {
        // 处理错误回调
        reject(error);
      });

      uploadTask.start().then((res) => {
        console.log(res, "开始");
      });
    })
  },
};

export default QiniuDriver;
