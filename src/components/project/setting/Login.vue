<template>
  <div class="form flex-center">
    <div class="form-item">
      <span class="icon">
        <i class="mdi mdi-account-outline"></i>
      </span>
      <input v-model="Form.model.username" />
      <span class="icon">
        <i class="mdi mdi-blank" />
      </span>
    </div>

    <div class="form-item">
      <span class="icon">
        <i class="mdi mdi-lock-outline"></i>
      </span>
      <input :type="Form.showPassword ? 'text' : 'password'" v-model="Form.model.password" />
      <span class="icon">
        <i class="show-or-hidden-psd mdi mdi-eye-outline" v-if="Form.showPassword" @click="Form.showOrHiddenPsd" />
        <i class="show-or-hidden-psd mdi mdi-eye-off-outline" v-else @click="Form.showOrHiddenPsd" />
      </span>
    </div>
    <div class="login" @mousedown="Form.login" ref="ref_login_button">
      <div>登录/注册</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { generateRact } from "@/utils/ParticleUtils"
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
    createParticle(rect.x - 15, rect.y - 15, rect.width, rect.height, 80)
  }

  const createMouseMoveAnimationInLoginButton = () => {
    window.addEventListener("mousemove", (e) => {
      if (!ref_login_button.value) return
      if (frame < 10) {
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
<style lang="less" scoped>
.form {
  height: 100%;
  flex-direction: column;
  gap: 10px;
}
.form-item {
  position: relative;
  display: flex;
  align-items: center;

  width: 240px;
  height: 44px;
  padding: 0 14px;

  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;

  transition:
    border-color 0.25s ease,
    background 0.25s ease,
    box-shadow 0.25s ease;

  /* 微弱浮起感 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);

  .icon {
    width: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition:
      color 0.25s ease,
      transform 0.25s ease;
  }

  .mdi {
    font-size: 18px;
    color: #999;
  }

  input {
    flex: 1;
    margin: 0 8px;

    border: none;
    background: transparent;

    font-size: 14px;
    color: #333;

    height: 0;
    padding: 1.2em 0.5em;
    background-clip: content-box;

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: #bbb;
    }
  }

  /* hover：轻微亮起来 */
  &:hover {
    background: rgba(255, 255, 255, 0.75);
  }

  /* focus：核心状态 */
  &:focus-within {
    background: rgba(255, 255, 255, 0.95);
    border-color: rgba(242, 166, 200, 0.8);
    box-shadow:
      0 0 0 2px rgba(242, 166, 200, 0.25),
      0 6px 20px rgba(242, 166, 200, 0.15);

    .mdi {
      color: #f2a6c8;
      transform: scale(1.05);
    }
  }

  .show-or-hidden-psd {
    transition:
      color 0.2s ease,
      transform 0.2s ease;

    &:hover {
      color: #666;
      transform: scale(1.1);
    }
  }
}

.login {
  position: relative;
  display: flex;
  align-items: center;

  width: 240px;
  height: 44px;
  padding: 0 14px;
  display: flex;
  justify-content: center;
  cursor: pointer;
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
}
</style>
