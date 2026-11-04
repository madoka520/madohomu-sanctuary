<template>
  <div class="profile-page">
    <div class="card avatar-card">
      <div class="avatar-wrapper">
        <madoka-avatar v-if="Root.model.id" :user-id="Root.model.id" @click="Root.handleUpload" :width="120" uploadadble />
        <input type="file" accept="image/jpeg,image/png,image/webp" @change="Root.onSelectAvatar" style="display: none" ref="uploadRef" />
      </div>
    </div>

    <!-- =========start========== ◆ 宝石饰件分隔线:签名图形语言,线—菱—线 -->
    <div class="gem-divider">
      <span class="line"></span>
      <span class="gem"></span>
      <span class="line line--rev"></span>
    </div>
    <!-- ========end======== -->

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
// 原代码 - 保留(本地下划线输入框,登录页仍在用)
// import MadokaInput from "@/components/MadokaInput.vue"
// 原代码 - 保留(库版输入框是边框盒形态,破坏弹窗的下划线语言,改回项目内直角下划线版)
// import { MadokaInput } from "@madoka520/vue-ui"
import MadokaLineInput from "@/components/MadokaLineInput.vue"
import { fileToSHA1 } from "@/utils/shaUtils.ts"
import { imageToWebp } from "@/utils/imageUtils.ts"

const uploadRef = useTemplateRef("uploadRef")
const tokenHook = useToken()
const Root = (() => {
  const logout = () => {
    // =========start========== 退出不可逆且整行可点,先确认再登出(文案走 i18n)
    useModal.confirm({
      radius: 12,
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
      // 12px 是库 CSS 里注释保留的历史圆角值(稍微圆润一点更适合粉色主题)
      radius: 12,
      title: i18n.global.t('account.changeUsername'),
      //@ts-ignore
      content: () => <MadokaLineInput placeholder={i18n.global.t('account.usernamePlaceholder')} v-model={value.value} />,
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
      radius: 12,
      title: i18n.global.t('account.changePassword'),
      //@ts-ignore
      content: () => (
        <div style="width: 100%;display: flex;gap: 10px;flex-direction: column">
          <MadokaLineInput type="password" placeholder={i18n.global.t('account.newPasswordPlaceholder')} v-model={value.value} />
          <MadokaLineInput type="password" placeholder={i18n.global.t('account.confirmPasswordPlaceholder')} v-model={valueAgain.value} />
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
    // 原代码 - 保留(此复合选择器 0,2,0 会压过独立 .avatar-card 的同名属性,
    // 白渐变与 30px padding 与新美术语言冲突,让位给下方的独立块)
    // padding: 30px;
    // background: linear-gradient(135deg, #ffffff 0%, @soft-pink 100%);
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
  /* 原代码 - 保留(hover 光扫,用户验收不好看,撤下——高光掠过与柔和羽化线的气质打架)
  background-image: linear-gradient(60deg, transparent 35%, rgba(255, 255, 255, 0.22) 50%, transparent 65%);
  background-size: 220% 100%;
  background-position: 130% 0;
  background-repeat: no-repeat;
  */
  // 原代码 - 保留
  // transition: background 0.25s ease;
  // 与强调线同一支慢曲线,底色和线一起落定
  // transition: background 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  // transition:
  //   background-color 0.4s cubic-bezier(0.16, 1, 0.3, 1),
  //   background-position 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  transition: background-color 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  .label {
    color: @text-color;
    font-weight: 600;
    // =========start========== 美术字:宋体系衬线 + 3px 字距,标签从「控件文字」升格为「刻字」
    font-family: 'Source Han Serif SC', 'Noto Serif SC', 'STZhongsong', 'SimSun', serif;
    letter-spacing: 3px;
    // ========end========
    margin-left: 10px;
    user-select: none;
  }

  .value {
    color: @dark-pink;
  }

  // 原代码 - 保留(实色满铺 + 0.3s 机械展开,偏硬)
  // &::after {
  //   content: '';
  //   position: absolute;
  //   left: 0;
  //   right: 0;
  //   bottom: -1.5px;
  //   height: 1.5px;
  //   background: @dark-pink;
  //   transform: scaleX(0);
  //   transform-origin: center;
  //   transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  // }

  // =========start========== hover 强调线柔化:两端透明渐变羽化 + 透明度淡入,慢一点的重力曲线,
  // 内缩 12px 与行内边距对齐不满铺——从「扫出」变成「晕开」
  &::after {
    content: '';
    position: absolute;
    left: 12px;
    right: 12px;
    bottom: -1.5px;
    height: 1.5px;
    background: linear-gradient(90deg, transparent, rgba(255, 133, 178, 0.7), transparent);
    opacity: 0;
    transform: scaleX(0.5);
    transform-origin: center;
    transition:
      transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
      opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }
  // ========end========

  &:hover {
    // 原代码 - 保留
    // background: rgba(255, 183, 206, 0.08);
    // 只改色,保住光扫渐变层;位置从 130% 滑到 -30%,高光掠过整行
    // background-position: -30% 0;
    background-color: rgba(255, 183, 206, 0.08);

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

    // 原代码 - 保留(实色玫红)
    // &::after {
    //   background: #fb7185;
    // }

    // 玫红版同步羽化淡入,过渡属性继承基础 ::after
    &::after {
      background: linear-gradient(90deg, transparent, rgba(251, 113, 133, 0.75), transparent);
    }

    &:hover {
      // 原代码 - 保留
      // background: rgba(244, 63, 94, 0.06);
      background-color: rgba(244, 63, 94, 0.06);
    }
  }
}
// ========end========

.avatar-card {
  padding: 36px;
  // 原代码 - 保留(白色渐变卡,与直角刻面/粉乳玻璃语言冲突)
  // background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 228, 239, 0.85));
  // =========start========== 回归默认形态:直角 + 极淡粉乳玻璃底 + 1.5px 细粉边
  // (与信息行底线/弹窗描边同一道律;全卡唯一圆形语言只留给头像本身)
  border-radius: 0;
  border: 1.5px solid rgba(255, 183, 197, 0.45);
  background: rgba(255, 240, 245, 0.28);
  // ========end========

  // =========start========== 头像白圈改粉律:仅本页作用域(:deep),全局 MadokaAvatar 不动
  :deep(.avatar) {
    border: 2.5px solid rgba(255, 143, 171, 0.6);
    box-shadow: 0 0 14px rgba(255, 143, 171, 0.3);
  }
  // ========end========

  // =========start========== 灵魂宝石卡:右上 18px 斜切角(刻面签名剪影,顺带回归直角默认形态)
  // ⚠️ clip-path 会连同裁掉矩形 box-shadow,外阴影改走 filter:drop-shadow 才能跟随切角轮廓;
  // 内侧顶部高光(inset)不受影响,保留——光源永远在左上
  clip-path: polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%);
  filter: drop-shadow(0 8px 24px rgba(255, 183, 213, 0.35));

  // 悬浮时刻面光晕增强(跟随切角轮廓);transform 交给基类 hover 的 -1px 上浮
  transition:
    filter 0.3s ease,
    transform 0.25s ease;

  &:hover {
    filter: drop-shadow(0 12px 30px rgba(255, 183, 213, 0.5));
  }

  // 材质噪点:SVG feTurbulence 细颗粒叠层,杀掉平涂感(5% 透明度,不挡交互)
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
    opacity: 0.05;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E");
  }
  // ========end========

  .avatar-wrapper {
    // =========start========== isolation 让 z-index:-1 的光环留在本层之内,
    // 不会被卡片底色盖住(魔法少女的光环,呼吸的)
    position: relative;
    isolation: isolate;
    // ========end========
    transition: transform 0.2s ease;

    &::before {
      content: '';
      position: absolute;
      inset: -14px;
      z-index: -1;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255, 143, 171, 0.28) 0%, transparent 68%);
      animation: halo-breathe 3.2s ease-in-out infinite;
    }

    &:hover {
      transform: scale(1.04);
    }
  }
}

// ✨ 光环呼吸:透明度与半径的缓慢律动,「页面活着」的氛围层
@keyframes halo-breathe {
  0%,
  100% {
    opacity: 0.7;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.06);
  }
}

// =========start========== ◆ 宝石饰件分隔线:渐隐细线夹一颗旋转 45° 的刻面菱
.gem-divider {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 14px 2px;
  user-select: none;

  .line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 143, 171, 0.45));

    &--rev {
      background: linear-gradient(90deg, rgba(255, 143, 171, 0.45), transparent);
    }
  }

  .gem {
    width: 7px;
    height: 7px;
    background: #ff8fab;
    transform: rotate(45deg);
    // 刻面高光永远朝左上(光源纪律);光晕缓慢明灭
    box-shadow:
      0 0 6px rgba(255, 105, 180, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.7);
    animation: gem-twinkle 2.4s ease-in-out infinite;
  }
}

@keyframes gem-twinkle {
  0%,
  100% {
    box-shadow:
      0 0 4px rgba(255, 105, 180, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.7);
  }
  50% {
    box-shadow:
      0 0 10px rgba(255, 105, 180, 0.75),
      inset 0 1px 0 rgba(255, 255, 255, 0.7);
  }
}
// ========end========

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
