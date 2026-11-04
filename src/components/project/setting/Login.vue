<template>
  <div class="form-container flex-center">
    <div class="form-body">
      <!-- =========start========== 输入框换 MadokaLineInput:与账号弹窗同一直角下划线语言
           (旧 madoka-input 的 18px 圆角聚焦底衬是旧气质) -->
      <div class="form-item">
        <madoka-line-input
          v-model="Form.model.username"
          left-icon="mdi mdi-account-outline"
          :placeholder="$t('login.usernamePlaceholder')"
          @keyup.enter="Form.login"
        />
      </div>

      <Transition name="slide-fade">
        <div class="form-item" v-if="Form.model.usePassword">
          <madoka-line-input
            v-model="Form.model.password"
            left-icon="mdi mdi-lock-outline"
            :type="Form.showPassword ? 'text' : `password`"
            :show-password="Form.showPassword"
            :right-icon="`mdi-${Form.showPassword ? 'eye' : 'eye-off'}-outline`"
            :placeholder="$t('login.passwordPlaceholder')"
            @right-icon-click="Form.showOrHiddenPsd"
            @keyup.enter="Form.login"
          />
        </div>
      </Transition>
      <!-- ========end======== -->

      <!-- 原代码 - 保留(旧圆角底衬输入框)
      <div class="form-item">
        <madoka-input
          v-model="Form.model.username"
          left-icon="mdi mdi-account-outline"
          :placeholder="$t('login.usernamePlaceholder')"
          @keyup.enter="Form.login"
        />
      </div>

      <Transition name="slide-fade">
        <div class="form-item" v-if="Form.model.usePassword">
          <madoka-input
            v-model="Form.model.password"
            left-icon="mdi mdi-lock-outline"
            :type="Form.showPassword ? 'text' : `password`"
            :show-password="Form.showPassword"
            :right-icon="`mdi-${Form.showPassword ? 'eye' : 'eye-off'}-outline`"
            :placeholder="$t('login.passwordPlaceholder')"
            @right-icon-click="Form.showOrHiddenPsd"
            @keyup.enter="Form.login"
          />
        </div>
      </Transition>
      -->
      <div class="form__error" :class="{ 'is-active': Form.error }">
        <span v-if="Form.error">
          <span class="mdi mdi-alert-circle-outline"></span>
          {{ Form.error }}
        </span>
      </div>
      <div class="form-options">
        <madoka-checkbox
          v-model="Form.model.usePassword"
          :label="$t('login.usePassword')"
        />
      </div>

      <div class="form-actions">
        <madoka-btn type="2" @click="Form.login">{{ $t('login.submit') }}</madoka-btn>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
// 原代码 - 保留(旧圆角底衬输入框,已换 MadokaLineInput)
// import MadokaInput from '@/components/MadokaInput.vue'
import MadokaLineInput from '@/components/MadokaLineInput.vue'
import { MadokaBtn } from '@madoka520/vue-ui'
import useToken from '@/hooks/useToken.ts'
import MadokaCheckbox from '@/components/MadokaCheckbox.vue'

const Form = (() => {
  const showOrHiddenPsd = () => {
    s.showPassword = !s.showPassword
  }

  const login = async () => {
    try {
      if (!s.model.usePassword) {
        s.model.password = ''
      }
      await useToken().login(s.model as any)
      s.error = ''
    } catch (e: any) {
      s.error = e
    }
  }

  const s = reactive({
    model: {
      username: useLocalStorage('username', ''),
      password: useLocalStorage('password', ''),
      usePassword: useLocalStorage('usePassword', false),
    },
    error: '',
    showPassword: false,
    showOrHiddenPsd,
    login,
  })
  return s
})()
</script>
<style lang="less" scoped>
@pink-light: #fff5f7;
@pink-primary: #ffb7c5;
@error-red: #ff7875;

.form-container {
  margin: 0 auto;
  width: clamp(120px, 20vw, 500px);
  padding-top: clamp(10px, 10vh, 50px);
  padding-bottom: clamp(10px, 10vh, 50px);
}

.form-body {
  width: 500px;
  display: flex;
  flex-direction: column;
}

.form-item {
  width: 100%;
  transition: all 0.3s ease;
  padding: 5px;
}

.form__error {
  color: @error-red;
  font-size: 13px;
  min-height: 24px; // 预留固定高度
  display: flex;
  align-items: center;
  opacity: 0;
  transform: translateY(-5px);
  transition: all 0.3s;

  &.is-active {
    opacity: 1;
    transform: translateY(0);
  }

  .mdi {
    margin-right: 4px;
  }
}

.form-options {
  padding: 4px 0 10px 0;
  display: flex;
  justify-content: flex-start;
}

.form-actions {
  color: white;
  margin-top: 10px;
  /* =========start========== 原 :deep(.madoka-btn) 从未命中（库按钮根类是 submit-btn，
     之前 100% 宽全靠旧本地组件的块级布局），迁移后库基类 fit-content 使其缩窄。
     改为命中库根类，让这几条样式真正生效 */
  :deep(.submit-btn) {
    width: 100%; // 让按钮充满宽度
    height: 45px;
    font-size: 16px;
    letter-spacing: 2px;
  }
  // ========end========
}

/* 密码框显示隐藏的动画 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
  /* 原代码 - 保留(旧输入框 36+30px 巨型内边距时代的高度) */
  /* margin-bottom: -73px; // 抵消输入框的高度，防止下方元素瞬间跳动 */
  // 抵消输入框外高(MadokaLineInput 约 45px + form-item 上下 padding 10px),防止下方元素瞬间跳动
  margin-bottom: -55px;
}
</style>
