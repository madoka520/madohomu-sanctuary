<template>
  <div class="profile-page">
    <div class="card avatar-card">
      <div class="avatar-wrapper">
        <madoka-avatar
          v-if="Root.model.id"
          :user-id="Root.model.id"
          @click="Root.handleUpload"
          :avatar-update-time="Root.avatarUpdateTime"
          :width="120"
          uploadadble
        />
        <input type="file" accept="image/jpeg,image/png,image/webp" @change="Root.onSelectAvatar" style="display: none" ref="uploadRef" />
      </div>
    </div>

    <div class="card item" @click="Root.handleUpdateUsername">
      <span class="label">昵称</span>
      <span class="value">{{ Root.model.username }}</span>
    </div>

    <div class="card item" @click="Root.handleUpdatePassword">
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

<script setup lang="tsx">
import { reactive } from "vue"
import MadokaBtn from "@/components/button/Index.vue"
import useToken, { type UserInfo } from "@/hooks/useToken.ts"
import AuthApi from "@/api/AuthApi.ts"
import { message } from "@/components/message.tsx"
import MadokaAvatar from "@/components/MadokaAvatar.vue"
import useModal from "@/components/useModal.tsx"
import MadokaInput from "@/components/MadokaInput.vue"
import { fileToSHA1 } from "@/utils/shaUtils.ts"
import SHA1 from "crypto-js/sha1"

const uploadRef = useTemplateRef("uploadRef")
const tokenHook = useToken()
const Root = (() => {
  const logout = () => {
    tokenHook.logout()
  }

  onMounted(() => {
    s.model = tokenHook.userInfo
  })

  const handleUpdateUsername = () => {
    const value = ref(s.model.username)
    useModal.confirm({
      title: "修改昵称",
      //@ts-ignore
      content: () => <MadokaInput placeholder="请输入用户名" v-model={value.value} />,
      onOk: async () => {
        await AuthApi.updateUsername(value.value)
        s.model.username = value.value
      },
    })
  }

  const handleUpdatePassword = () => {
    const value = ref("")
    const valueAgain = ref("")
    const equal = ref(true)
    useModal.confirm({
      title: "修改密码",
      //@ts-ignore
      content: () => (
        <div style="width: 100%;display: flex;gap: 10px;flex-direction: column">
          <MadokaInput type="password" placeholder="请输入新密码" v-model={value.value} />
          <MadokaInput type="password" placeholder="请再次输入新密码" v-model={valueAgain.value} />
          <div v-if={!equal.value} style="color: red;font-size: 13px">
            两次输入密码不一致!
          </div>
        </div>
      ),
      onOk: async () => {
        if (value.value !== valueAgain.value) {
          equal.value = false
          throw new Error("密码输入不一致!")
        }
        await AuthApi.updatePassword(value.value)
      },
    })
  }

  const handleUpload = () => {
    uploadRef.value?.click()
  }

  const onSelectAvatar = async (e: Event) => {
    const input = e.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return

    const { name, size } = file

    if (!file.type.startsWith("image/")) {
      message.error("请选择图片文件")
      input.value = ""
      return
    }

    if (size > 10 * 1024 * 1024) {
      message.error("文件大小不能超过10MB！")
      input.value = ""
      return
    }

    const hash = await fileToSHA1(file)

    await AuthApi.upload({ filename: name, size, hash: SHA1(hash).toString() }, file)
    s.avatarUpdateTime = Date.now()
    message.success("头像上传成功!")
  }

  const s = reactive({
    model: {} as UserInfo,
    avatarUpdateTime: 0,
    logout,
    onSelectAvatar,
    handleUpload,
    handleUpdateUsername,
    handleUpdatePassword,
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
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 6px;

  background:
    radial-gradient(120% 120% at 20% 0%, rgba(255, 183, 213, 0.12), transparent 40%),
    radial-gradient(120% 120% at 100% 100%, rgba(255, 133, 178, 0.1), transparent 40%);
}

.card {
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(255, 183, 213, 0.6);
  border-radius: 22px;
  padding: 18px 22px;

  backdrop-filter: blur(12px);
  box-shadow:
    0 8px 24px rgba(255, 183, 213, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    background 0.25s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow:
      0 12px 32px rgba(255, 183, 213, 0.28),
      inset 0 1px 0 rgba(255, 255, 255, 0.7);
  }

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
    font-size: 14px;

    .label {
      color: @text-color;
      font-weight: 600;
      margin-left: 10px;
      user-select: none;
    }

    .value {
      color: @dark-pink;
    }

    .btn {
    }
  }
}

.avatar-card {
  padding: 36px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 228, 239, 0.85));

  .avatar-wrapper {
    cursor: pointer;
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.04);
    }
  }
}

.action-area {
  & > div {
    border-radius: 22px;
  }
}
</style>
