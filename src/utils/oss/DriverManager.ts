import type { OssDriverManager, OssDriver, SignedPath } from "@/typings/upload.ts";

import QiniuDriver from "@/utils/oss/drivers/Qiniu.ts";
const DriverManager = {
  getDriver : (driver :string) : OssDriver =>  {
    switch(driver) {
      case "qiniu" :
        return QiniuDriver
    }
    throw Error
  }
}

export default DriverManager