import QiniuDriver from "@/utils/oss/drivers/Qiniu.ts";
import type { OssDriver } from "@/types/upload.ts"
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