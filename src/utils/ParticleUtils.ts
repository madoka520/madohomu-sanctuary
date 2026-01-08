export let particle_list: I.Particle[] = []

const move = () => {
  particle_list.forEach((particle: I.Particle) => {
    particle.x += particle.vx
    particle.y += particle.vy
    particle.vy += particle.gravity
    particle.opacity += particle.opacitySpeed
    particle.rotate += particle.rotateSpeed
    particle.rotate = particle.rotate % 360
    particle.x = particle.x % window.innerWidth

    if (particle.x < -1e5) particle.is_deleted = true
    if (particle.y < -1e5) particle.is_deleted = true
    if (particle.x > window.innerWidth + 1e5) particle.is_deleted = true
    if (particle.y > window.innerHeight + 1e5) particle.is_deleted = true
    if (particle.opacity < 0) particle.is_deleted = true
  })

  particle_list = particle_list.filter((o) => !o.is_deleted)
  requestAnimationFrame(() => move())
}

const generateId = () => {
  return Math.random().toString().replace("0.", "")
}

export const generateRact = (img: HTMLImageElement, x: number, y: number, w: number, h: number, speed: number, size: number) => {
  const px = x + Math.random() * w
  const py = y + Math.random() * h
  const vx = speed * Math.cos(Math.random() * Math.PI * 2)
  const vy = speed * Math.sin(Math.random() * Math.PI * 2)
  const opacity = Math.random() * 0.5 + 0.5
  const opacitySpeed = -Math.random() * 0.005 - 0.0025
  const rotate = Math.random() * 360
  const rotateSpeed = Math.random() * 0.2 - 0.1
  particle_list.push({
    id: generateId(),
    img,
    x: px,
    y: py,
    vx,
    vy,
    w: size,
    h: size,
    gravity: 0.003,
    opacity,
    opacitySpeed,
    rotate,
    rotateSpeed,
    is_deleted: false,
  })
}

move()

export namespace I {
  export interface Particle {
    id: string
    img: HTMLImageElement
    x: number
    y: number
    vx: number
    vy: number
    w: number
    h: number
    gravity: number
    rotate: number
    rotateSpeed: number
    opacity: number
    opacitySpeed: number
    is_deleted: boolean
  }
}
