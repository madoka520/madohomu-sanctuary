export const imageToWebp = (
  file: File,
  quality = 0.8,
  maxSize?: number
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
      // 原代码 - Codex 保留
      // canvas.width = img.width
      // canvas.height = img.height
      // Codex 新增开始 —— maxSize：直传模式下压缩由前端完成，居中 cover 裁剪到 maxSize（对齐后端原 sharp 256x256 行为）
      let dx = 0
      let dy = 0
      let dw = img.width
      let dh = img.height
      if (maxSize) {
        const scale = Math.max(maxSize / img.width, maxSize / img.height)
        dw = Math.round(img.width * scale)
        dh = Math.round(img.height * scale)
        dx = Math.round((maxSize - dw) / 2)
        dy = Math.round((maxSize - dh) / 2)
        canvas.width = maxSize
        canvas.height = maxSize
      } else {
        canvas.width = img.width
        canvas.height = img.height
      }
      // Codex 新增结束

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Canvas 不可用"))
        return
      }

      // 原代码 - Codex 保留
      // ctx.drawImage(img, 0, 0)
      // Codex 新增开始
      ctx.drawImage(img, dx, dy, dw, dh)
      // Codex 新增结束

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
