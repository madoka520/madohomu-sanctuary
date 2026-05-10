class SmoothCorner {
  static get inputProperties() {
    return ['--smooth-level']
  }

  paint(ctx, size, properties) {
    const mRaw = parseFloat(properties.get('--smooth-level'))
    const m = Math.min(Math.max(mRaw || 2, 0.1), 100)

    const w = size.width / 2
    const h = size.height / 2
    // 不再使用统一的 r = Math.min(w, h)

    ctx.fillStyle = '#000'
    ctx.beginPath()

    const steps = 360

    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * Math.PI * 2
      const cos = Math.cos(t)
      const sin = Math.sin(t)

      // 分别在 x 轴乘 w，y 轴乘 h，这样就能铺满长方形了
      const x = Math.sign(cos) * Math.pow(Math.abs(cos), 2 / m) * w + w
      const y = Math.sign(sin) * Math.pow(Math.abs(sin), 2 / m) * h + h

      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }

    ctx.closePath()
    ctx.fill()
  }
}

registerPaint('smooth-corners', SmoothCorner)