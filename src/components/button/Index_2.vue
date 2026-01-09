<template>
  <div :class="['submit-btn', { loading: loading }]" ref="ref_button">
    <span v-show="!loading">
      <slot>
        {{ text }}
      </slot>
    </span>
    <span v-show="loading">正在重构宇宙...</span>
  </div>
</template>
<script setup lang="ts">
import { generateRact } from "@/utils/ParticleUtils.ts"
import particleStarUrl from "@/assets/particle/star.png"
import particleStarPlainUrl from "@/assets/particle/star_plain.png"
import particleHeartUrl from "@/assets/particle/heart.png"
import particleHeartPlainUrl from "@/assets/particle/heart_plain.png"
import { animate } from "animejs"
const props = withDefaults(
  defineProps<{
    text?: string
  }>(),
  {},
)
const loading = defineModel("loading", {
  default: false,
})

const ref_button = useTemplateRef("ref_button")

const Particle = (() => {
  const createParticle = (x: number, y: number, w: number, h: number, count: number) => {
    for (let i = 0; i < count; i++) {
      const imageMap = {
        0: particleStar,
        1: particleHeart,
        2: particleHeartPlain,
        3: particleStarPlain,
      }
      const image = imageMap[Math.floor(Math.random() * 4)]
      generateRact(image, x, y, w, h, 0.4, 20)
    }
  }
  const createMouseMoveAnimationInLoginButton = () => {
    const renderParticle = () => {
      const rect = ref_button.value!.getBoundingClientRect()
      createParticle(rect.x - 15, rect.y - 15, rect.width, rect.height, 6)
    }
    const onMouseMove = (e: MouseEvent) => {
      if (!ref_button.value) return
      const rect = ref_button.value!.getBoundingClientRect()
      // 判断鼠标是否在按钮上
      if (e.clientX >= rect.x && e.clientX <= rect.x + rect.width && e.clientY >= rect.y && e.clientY <= rect.y + rect.height) {
        s.is_hover = true
      } else {
        s.is_hover = false
      }
    }
    const enterFrame = () => {
      if (s.is_destroy) return
      if (s.is_hover) {
        if (frame < 1e6) {
          frame++
        } else {
          frame = 0
        }
        if (frame % 300 === 0) {
          renderParticle()
        }
      } else {
        frame = -1
      }
      requestAnimationFrame(() => enterFrame())
    }
    window.addEventListener("mousemove", onMouseMove)
    onMounted(() => {
      enterFrame()
    })
    onUnmounted(() => {
      s.is_destroy = true
      window.removeEventListener("mousemove", onMouseMove)
    })
  }
  let frame = 0
  const particleStar = new Image()
  const particleStarPlain = new Image()
  const particleHeart = new Image()
  const particleHeartPlain = new Image()
  particleStar.src = particleStarUrl
  particleStarPlain.src = particleStarPlainUrl
  particleHeart.src = particleHeartUrl
  particleHeartPlain.src = particleHeartPlainUrl
  createMouseMoveAnimationInLoginButton()
  const s = reactive({
    is_hover: false,
    is_destroy: false,
  })
})()
</script>
<style scoped>
/* 提交按钮 */
.submit-btn {
  width: 100%;
  padding: 15px;
  background: linear-gradient(90deg, rgba(255, 142, 178, 0.1), rgba(255, 142, 178, 0.3), rgba(255, 142, 178, 0.1));
  border: 1px solid #ff8eb2;
  color: #ff8eb2;
  font-family: "Cinzel", serif;
  font-weight: bold;
  font-size: 1.1rem;
  position: relative;
  user-select: none;
  overflow: hidden;
  transition: all 0.5s;
  text-shadow: 0 0 5px #ff8eb2;
  text-align: center;
}

.submit-btn:hover {
  background: #ff8eb2;
  color: white;
  box-shadow: 0 0 20px #ff8eb2;
}

.submit-btn.loading {
  background: #333;
  color: #777;
  cursor: not-allowed;
  border-color: #555;
  box-shadow: none;
}
</style>
