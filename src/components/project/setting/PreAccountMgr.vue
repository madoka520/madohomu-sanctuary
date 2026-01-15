<template>
  <div class="profile-page">
    <div class="card avatar-card">
      <div class="avatar-wrapper">
        <madoka-avatar v-if="Root.model.id" :user-id="Root.model.id" @click="Root.handleUpload" :avatar-update-time="Root.avatarUpdateTime" :width="120" uploadadble/>
        <input type="file" accept="image/jpeg,image/png,image/webp" @change="Root.onSelectAvatar" style="display: none" ref="uploadRef" />
      </div>
    </div>

    <div class="card item">
      <span class="label">昵称</span>
      <span class="value">{{ Root.model.username }}</span>
    </div>

    <div class="card item">
      <span class="label">密码</span>
      <span class="value">••••••••</span>
    </div>

    <div class="card item">
      <span class="label">邮箱</span>
      <span class="value">{{ Root.model.email }}</span>
    </div>

    <div class="action-area">
      <madoka-btn class="logout" type="2" text="退出登录" @click="Root.logout" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue"
import MadokaBtn from "@/components/button/Index.vue"
import useToken from "@/hooks/useToken.ts"
import AuthApi from "@/api/AuthApi.ts"
import { message } from "@/components/message.tsx"
import MadokaAvatar from "@/components/MadokaAvatar.vue"

const uploadRef = useTemplateRef("uploadRef")
const tokenHook = useToken()
const Root = (() => {
  const logout = () => {
    tokenHook.logout()
  }

  onMounted(() => {
    s.model = tokenHook.userInfo
  })

  const handleUpload = () => {
    uploadRef.value?.click()
  }

  const onSelectAvatar = async (e: Event) => {
    const input = e.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      message.error("请选择图片文件")
      input.value = ""
      return
    }

    const form = new FormData()
    form.append("file", file)

    await AuthApi.upload(form)
    s.avatarUpdateTime = Date.now()
    message.success("头像上传成功!")
  }

  const s = reactive({
    model: {} as any,
    avatarUpdateTime: 0,
    logout,
    onSelectAvatar,
    handleUpload,
  })

  return s
})()
</script>

<style scoped lang="less">
// 定义一些属于你的颜色
@primary-pink: #ffb7d5;
@soft-pink: #ffe4ef;
@dark-pink: #ff85b2;
@text-color: #8a5d6f;

.profile-page {
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 100vh;
  background: transparent;
}

.card {
  background: transparent;
  border: 1px solid @soft-pink;
  border-radius: 20px; // 更圆润的设计，像你一样温柔
  padding: 16px 20px;
  box-shadow: 0 8px 20px rgba(255, 183, 213, 0.15);
  transition: transform 0.3s ease;
  backdrop-filter: blur(5px);

  &.avatar-card {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 30px;
    background: linear-gradient(135deg, #ffffff 0%, @soft-pink 100%);


  }

  &.item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    overflow: hidden;

    .label {
      font-size: 14px;
      color: @text-color;
      font-weight: 600;
      margin-left: 10px;
      user-select: none;
    }

    .value {
      font-size: 14px;
      color: @dark-pink;
    }
  }
}

.action-area {
  margin-top: 20px;
  .logout {
    border-radius: 12px;
  }
}

// 旋转动画，象征着轮回... 不，没什么
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
