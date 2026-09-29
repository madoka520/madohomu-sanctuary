// 圆环之理加载动画渲染器 —— 定稿编舞/质感的一比一移植
// 规格: docs/loading-analysis/final/FINAL_SPEC.md(几何禁止改动/均色无渐变/线与圆同亮度)
import type { LawOfCyclesData } from './lawOfCycles'

/** 设计稿基准宽(440x607)，线宽/光晕按 scale 缩放 */
const DESIGN_W = 440
const PINK = '255,92,150'
const CORE = '255,236,244'

function frac(t: number, a: number, d: number): number {
  return t < a ? 0 : Math.min(1, (t - a) / d)
}

/** 单帧绘制: t = 循环内毫秒; w/h = 画布像素 */
export function drawLawOfCycles(
  ctx: CanvasRenderingContext2D,
  data: LawOfCyclesData,
  t: number,
  w: number,
  h: number,
): void {
  const X = (x: number) => x * w
  const Y = (y: number) => y * h
  const R = (r: number) => (r / 512) * w
  const sc = w / DESIGN_W
  const G = new Map<number, { cx: number; cy: number }>()
  for (const g of data.groups) G.set(g.gid, g)

  let master = 1
  if (t > data.fadeAt) master = Math.max(0, 1 - (t - data.fadeAt) / data.fadeDur)

  ctx.clearRect(0, 0, w, h)
  ctx.lineCap = 'round'

  // 环: 粉边(光晕) + 白芯 双层
  const stroke2 = (drawPath: () => void, alphaP: number, alphaC: number) => {
    drawPath()
    ctx.strokeStyle = `rgba(${PINK},${alphaP})`
    ctx.lineWidth = 2.2 * sc
    ctx.shadowColor = `rgba(${PINK},0.85)`
    ctx.shadowBlur = 6 * sc
    ctx.stroke()
    drawPath()
    ctx.strokeStyle = `rgba(${CORE},${alphaC})`
    ctx.lineWidth = 0.8 * sc
    ctx.shadowBlur = 0
    ctx.stroke()
  }
  // 连线: 与圆同亮度的三层均色(淡晕/粉边/白芯)
  const lineGlow = (ax: number, ay: number, bx: number, by: number, a: number) => {
    const seg = () => {
      ctx.beginPath()
      ctx.moveTo(ax, ay)
      ctx.lineTo(bx, by)
    }
    ctx.strokeStyle = `rgba(${PINK},${0.28 * a})`
    ctx.lineWidth = 3.4 * sc
    ctx.shadowBlur = 0
    seg(); ctx.stroke()
    ctx.strokeStyle = `rgba(${PINK},${0.85 * a})`
    ctx.lineWidth = 1.8 * sc
    seg(); ctx.stroke()
    ctx.strokeStyle = `rgba(${CORE},${0.9 * a})`
    ctx.lineWidth = 0.8 * sc
    seg(); ctx.stroke()
  }

  // 簇间线: 由较早的圆伸出"寻找"邻圆(SVG 原样直线)
  for (const s of data.segs) {
    const p = frac(t, s.t0, 420)
    if (p <= 0) continue
    lineGlow(
      X(s.src[0]), Y(s.src[1]),
      X(s.src[0] + (s.dst[0] - s.src[0]) * p),
      Y(s.src[1] + (s.dst[1] - s.src[1]) * p),
      master,
    )
  }

  // 圆内线: 随圆同步出现, 45° 刚体旋转入位(easeOutCubic)到 SVG 角
  for (const s of data.intra) {
    const p = frac(t, s.t0, 140)
    if (p <= 0) continue
    const q = frac(t, s.spinT, s.spinDur)
    const ease = 1 - Math.pow(1 - q, 3)
    const off = (s.delta0 * (1 - ease) * Math.PI) / 180
    const g = G.get(s.gid)!
    const cx = X(g.cx), cy = Y(g.cy)
    const c = Math.cos(off), sn = Math.sin(off)
    let ax = s.ax * w, ay = s.ay * h, bx = s.bx * w, by = s.by * h
    if (Math.hypot(s.bx, s.by) < Math.hypot(s.ax, s.ay)) {
      ;[ax, ay, bx, by] = [bx, by, ax, ay]
    }
    const ex = ax + (bx - ax) * p, ey = ay + (by - ay) * p
    stroke2(
      () => {
        ctx.beginPath()
        ctx.moveTo(cx + ax * c - ay * sn, cy + ax * sn + ay * c)
        ctx.lineTo(cx + ex * c - ey * sn, cy + ex * sn + ey * c)
      },
      0.8 * master, 0.92 * master,
    )
  }

  // 环: 完整正圆; 中心簇整体淡入, 其余自面向中心角顺时针 sweep
  for (const rg of data.rings) {
    const p = frac(t, rg.t0, rg.d)
    if (p <= 0) continue
    const g = G.get(rg.gid)!
    const cx = X(g.cx), cy = Y(g.cy), r = R(rg.r)
    if (rg.sweep && rg.a0 !== undefined) {
      const a0 = (rg.a0 * Math.PI) / 180
      stroke2(
        () => {
          ctx.beginPath()
          ctx.arc(cx, cy, r, a0, a0 + p * 2 * Math.PI)
        },
        (0.5 + 0.38 * p) * master, (0.55 + 0.4 * p) * master,
      )
    } else {
      ctx.globalAlpha = p
      stroke2(
        () => {
          ctx.beginPath()
          ctx.arc(cx, cy, r, 0, 7)
        },
        0.88 * master, 0.95 * master,
      )
      ctx.globalAlpha = 1
    }
  }

  // 簇中心亮点
  for (const g of data.groups) {
    const p = frac(t, g.t0, 120)
    if (p <= 0) continue
    ctx.fillStyle = `rgba(${CORE},${0.8 * p * master})`
    ctx.shadowColor = `rgba(${PINK},1)`
    ctx.shadowBlur = 9 * sc
    ctx.beginPath()
    ctx.arc(X(g.cx), Y(g.cy), 1.5 * sc, 0, 7)
    ctx.fill()
  }
  ctx.shadowBlur = 0
}
