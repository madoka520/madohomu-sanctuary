<template>
  <div class="madoka__input login" @mousedown="Form.login" ref="ref_login_button">
    <div>登录/注册</div>
  </div>
</template>
<script setup lang="ts">
import { generateRact } from "@/utils/ParticleUtils.ts"
import particleStarUrl from "@/assets/particle/star.png"
import particleStarPlainUrl from "@/assets/particle/star_plain.png"
import particleHeartUrl from "@/assets/particle/heart.png"
import particleHeartPlainUrl from "@/assets/particle/heart_plain.png"

const ref_login_button = useTemplateRef("ref_login_button")
const Form = (() => {
  const showOrHiddenPsd = () => {
    s.showPassword = !s.showPassword
    if (!s.showPassword) {
      window.removeEventListener("mousemove", createMouseMoveAnimationInLoginButton)
    }
  }
  const createParticle = (x: number, y: number, w: number, h: number, count: number) => {
    for (let i = 0; i < count; i++) {
      const imageMap = {
        0: particleStar,
        1: particleHeart,
        2: particleHeartPlain,
        3: particleStarPlain,
      }
      const image = imageMap[Math.floor(Math.random() * 4)]
      generateRact(image, x, y, w, h, 0.8, 20)
    }
  }
  const login = () => {
    const rect = ref_login_button.value!.getBoundingClientRect()
    createParticle(rect.x - 15, rect.y - 15, rect.width, rect.height, 5)
  }

  const createMouseMoveAnimationInLoginButton = () => {
    window.addEventListener("mousemove", (e) => {
      if (!ref_login_button.value) return
      if (frame < 30) {
        frame++
      } else {
        frame = 0
        const rect = ref_login_button.value!.getBoundingClientRect()
        // 判断鼠标是否在按钮上
        if (e.clientX >= rect.x && e.clientX <= rect.x + rect.width && e.clientY >= rect.y && e.clientY <= rect.y + rect.height) {
          // 生成一个粒子
          createParticle(e.clientX - 15, e.clientY - 15, 1, 1, 1)
        }
      }
    })
  }
  const s = reactive({
    model: {
      username: "",
      password: "",
    },
    showPassword: false,
    showOrHiddenPsd,
    login,
  })
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
  return s
})()

</script>
<style scoped>.login {
  position: relative;
  display: flex;
  align-items: center;
  width: 252px;
  height: 60px;
  padding: 0 14px;
  margin-top: 20px;
  justify-content: center;
  user-select: none;
  background: #ff93d2;
  color: #fff;
  border-radius: 12px;
  transition: all 0.3s;

  &:hover {
    background: #ff7ec9;
    animation: fr_btn_hover 0.4s;
    box-shadow:
      0 0 4px #ff7ec9bb,
      0 0 8px #ff7ec999,
      0 0 12px #ff7ec999;
  }
  &:active {
    background: #e45dab;
  }
}
@keyframes fr_btn_hover {
  0% {
    transform: scale(1);
  }
  20% {
    transform: scale(1.04);
  }
  100% {
    transform: scale(1);
  }
}</style>
