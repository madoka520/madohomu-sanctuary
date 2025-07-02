function getRGB(colorStr: string): [number, number, number] | null {
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = 1
  const ctx = canvas.getContext("2d")
  if (!ctx) return null

  ctx.fillStyle = "#000" // 初始化一下
  ctx.fillStyle = colorStr // 尝试设置用户颜色
  const computed = ctx.fillStyle

  // 检查无效颜色
  if (computed === "#000000" && colorStr.toLowerCase() !== "black" && !colorStr.startsWith("#000")) {
    return null
  }

  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return [r, g, b]
}

export default {
  getRGB
}