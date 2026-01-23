export const imageToWebp = (
  file: File,
  quality = 0.8
) =>
  new Promise<File>((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("不是图片文件"))
      return
    }

    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Canvas 不可用"))
        return
      }

      ctx.drawImage(img, 0, 0)

      canvas.toBlob(
        blob => {
          if (!blob) {
            reject(new Error("WebP 转换失败"))
            return
          }

          resolve(
            new File([blob], file.name.replace(/\.\w+$/, ".webp"), {
              type: "image/webp"
            })
          )
        },
        "image/webp",
        quality
      )

      URL.revokeObjectURL(url)
    }

    img.onerror = () => reject(new Error("图片加载失败"))

    img.src = url
  })
