<template>
  <div class="profile-page">
    <div class="card avatar-card">
      <div class="avatar-wrapper">
        <madoka-avatar v-if="Root.model.id" :user-id="Root.model.id" @click="Root.handleUpload" :width="120" uploadadble />
        <input type="file" accept="image/jpeg,image/png,image/webp" @change="Root.onSelectAvatar" style="display: none" ref="uploadRef" />
      </div>
    </div>

    <!-- =========start========== 账号信息行改下划线样式:去掉卡片底,常驻细底线 + hover 强调线 -->
    <div class="item" @click="Root.handleUpdateUsername">
      <span class="label">{{ $t('account.username') }}</span>
      <span class="value">{{ Root.model.username }}</span>
    </div>

    <div class="item" @click="Root.handleUpdatePassword">
      <span class="label">{{ $t('account.password') }}</span>
      <span class="value">••••••••</span>
    </div>

    <div class="item" @click="Root.handleUpdateEmail">
      <span class="label">{{ $t('account.email') }}</span>
      <span class="value">{{ Root.model.email }}</span>
    </div>
    <!-- ========end======== -->

    <!-- =========start========== 退出登录:列表末行的危险操作——与信息行同构但居中 + 玫红文字,
         点击先弹确认框防误触,不再用全宽大按钮破坏列表语言 -->
    <div class="item logout" @click="Root.logout">
      <span class="label">{{ $t('account.logout') }}</span>
    </div>
    <!-- ========end======== -->

    <!-- 原代码 - 保留(卡片式信息行 + action-area 全宽按钮形态)
    <div class="card item" @click="Root.handleUpdateUsername">
      <span class="label">{{ $t('account.username') }}</span>
      <span class="value">{{ Root.model.username }}</span>
    </div>

    <div class="card item" @click="Root.handleUpdatePassword">
      <span class="label">{{ $t('account.password') }}</span>
      <span class="value">••••••••</span>
    </div>

    <div class="card item" @click="Root.handleUpdateEmail">
      <span class="label">{{ $t('account.email') }}</span>
      <span class="value">{{ Root.model.email }}</span>
    </div>

    <div class="action-area">
      <madoka-btn class="logout" type="2" :text="$t('account.logout')" @click="Root.logout" />
    </div>
    -->
  </div>
</template>

<script setup lang="tsx">
import { reactive } from "vue"
// 原代码 - 保留(退出登录改为列表行后不再用按钮组件)
// import { MadokaBtn } from "@madoka520/vue-ui"
import useToken, { type UserInfo } from "@/hooks/useToken.ts"
// =========start========== i18n：账号页文案
import i18n from "@/i18n"
// ========end========
import AuthApi from "@/api/AuthApi.ts"
import { message } from "@madoka520/vue-ui"
import MadokaAvatar from "@/components/MadokaAvatar.vue"
import { useModal } from "@madoka520/vue-ui"
import MadokaInput from "@/components/MadokaInput.vue"
import { fileToSHA1 } from "@/utils/shaUtils.ts"
import { imageToWebp } from "@/utils/imageUtils.ts"

const uploadRef = useTemplateRef("uploadRef")
const tokenHook = useToken()
const Root = (() => {
  const logout = () => {
    // =========start========== 退出不可逆且整行可点,先确认再登出(文案走 i18n)
    useModal.confirm({
      title: i18n.global.t('account.logout'),
      content: i18n.global.t('account.logoutConfirm'),
      onOk: () => {
        tokenHook.logout()
      },
    })
    // 原代码 - 保留(直接登出)
    // tokenHook.logout()
  }

  onMounted(() => {
    s.model = tokenHook.userInfo
  })

  const handleUpdateUsername = () => {
    const value = ref(s.model.username)
    useModal.confirm({
      title: i18n.global.t('account.changeUsername'),
      //@ts-ignore
      content: () => <MadokaInput placeholder={i18n.global.t('account.usernamePlaceholder')} v-model={value.value} />,
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
      title: i18n.global.t('account.changePassword'),
      //@ts-ignore
      content: () => (
        <div style="width: 100%;display: flex;gap: 10px;flex-direction: column">
          <MadokaInput type="password" placeholder={i18n.global.t('account.newPasswordPlaceholder')} v-model={value.value} />
          <MadokaInput type="password" placeholder={i18n.global.t('account.confirmPasswordPlaceholder')} v-model={valueAgain.value} />
          {!equal.value && <div style="color: red;font-size: 13px">{i18n.global.t('account.passwordMismatch')}</div>}
        </div>
      ),
      onOk: async () => {
        if (value.value !== valueAgain.value) {
          equal.value = false
          return
        }
        await AuthApi.updatePassword(value.value)
      },
    })
  }

  const handleUpdateEmail = () => {
    message.info(i18n.global.t('account.notImplemented'))
  }
  const handleUpload = () => {
    uploadRef.value?.click()
  }

  const onSelectAvatar = async (e: Event) => {
    const input = e.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return

    const { size } = file

    if (!file.type.startsWith("image/")) {
      message.error(i18n.global.t('account.selectImage'))
      input.value = ""
      return
    }

    if (size > 10 * 1024 * 1024) {
      message.error(i18n.global.t('account.fileTooLarge'))
      input.value = ""
      return
    }
    // 原代码 - Codex 保留（后端 sharp 负责压缩，前端不裁剪）
    // const newFile = await imageToWebp(file)
    // =========start========== 直传后压缩由前端负责，传 maxSize=256 对齐后端原 sharp 256x256 cover 行为
    const newFile = await imageToWebp(file, 0.8, 256)
    // ========end========

    const hash = await fileToSHA1(newFile)

    const res = await AuthApi.upload({ filename: `${useToken().userInfo.id}.webp`, size: newFile.size, hash }, newFile)
    useToken().userInfo.updateTime = res.updateTime
    message.success(i18n.global.t('account.avatarSuccess'))
  }

  const s = reactive({
    model: {} as UserInfo,
    logout,
    onSelectAvatar,
    handleUpload,
    handleUpdateUsername,
    handleUpdatePassword,
    handleUpdateEmail,
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

  // 原代码 - 保留(卡片式信息行样式,信息行已改为独立 .item 下划线行)
  // &.item {
  //   display: flex;
  //   justify-content: space-between;
  //   align-items: center;
  //   position: relative;
  //   overflow: hidden;
  //   font-size: 14px;
  //
  //   .label {
  //     color: @text-color;
  //     font-weight: 600;
  //     margin-left: 10px;
  //     user-select: none;
  //   }
  //
  //   .value {
  //     color: @dark-pink;
  //   }
  //
  //   .btn {
  //   }
  // }
}

// =========start========== 账号信息下划线行:透明底 + 常驻细粉底线,hover 时强调线从中扫开
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding: 14px 12px;
  font-size: 14px;
  // 常驻细底线:默认形态的「细边框成形」,直角无背景
  border-bottom: 1.5px solid rgba(255, 183, 213, 0.45);
  transition: background 0.25s ease;

  .label {
    color: @text-color;
    font-weight: 600;
    margin-left: 10px;
    user-select: none;
  }

  .value {
    color: @dark-pink;
  }

  // hover 强调线:中线向两端展开,用动效表达「可点」而非 cursor
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1.5px;
    height: 1.5px;
    background: @dark-pink;
    transform: scaleX(0);
    transform-origin: center;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover {
    background: rgba(255, 183, 206, 0.08);

    &::after {
      transform: scaleX(1);
    }
  }

  // 退出登录行:与信息行同构,但居中 + 玫红示意危险操作
  &.logout {
    justify-content: center;

    .label {
      margin: 0;
      color: #f43f5e;
    }

    &::after {
      background: #fb7185;
    }

    &:hover {
      background: rgba(244, 63, 94, 0.06);
    }
  }
}
// ========end========

.avatar-card {
  padding: 36px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 228, 239, 0.85));

  .avatar-wrapper {
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.04);
    }
  }
}

// 原代码 - 保留(退出登录全宽按钮形态,已改为 .item.logout 危险行)
// .action-area {
//   & > div {
//     border-radius: 22px;
//     color: white;
//     /* =========start========== 库基类 madoka-btn-base 的 width: fit-content
//        会让按钮缩成文字宽；块级场景下恢复旧的占满宽度行为 */
//     width: 100%;
//     /* ========end======== */
//   }
// }
</style>
