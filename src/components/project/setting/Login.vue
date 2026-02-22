<template>
  <div class="form-container flex-center">
    <div class="form-body">
      <div class="form-item">
        <madoka-input v-model="Form.model.username" left-icon="mdi mdi-account-outline" placeholder="请输入昵称" @keyup.enter="Form.login" />
      </div>

      <Transition name="slide-fade">
        <div class="form-item" v-if="Form.model.usePassword">
          <madoka-input
            v-model="Form.model.password"
            left-icon="mdi mdi-lock-outline"
            :type="Form.showPassword ? 'text' : `password`"
            :show-password="Form.showPassword"
            :right-icon="`mdi-${Form.showPassword ? 'eye' : 'eye-off'}-outline`"
            placeholder="请输入密码"
            @right-icon-click="Form.showOrHiddenPsd"
            @keyup.enter="Form.login"
          />
        </div>
      </Transition>
      <div class="form__error" :class="{ 'is-active': Form.error }">
        <span v-if="Form.error"><span class="mdi mdi-alert-circle-outline"></span> {{ Form.error }}</span>
      </div>
      <div class="form-options">
        <madoka-checkbox v-model="Form.model.usePassword" label="使用密码登录" />
      </div>

      <div class="form-actions">
        <madoka-btn type="2" @click="Form.login"> 登录 / 注册 </madoka-btn>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import MadokaInput from "@/components/MadokaInput.vue"
import MadokaBtn from "@/components/button/Index.vue"
import useToken from "@/hooks/useToken.ts"
import MadokaCheckbox from "@/components/MadokaCheckbox.vue"

const Form = (() => {
  const showOrHiddenPsd = () => {
    s.showPassword = !s.showPassword
  }

  const login = async () => {
    try {
      if (!s.model.usePassword) {
        s.model.password = ""
      }
      await useToken().login(s.model as any)
      s.error = ""
    } catch (e: any) {
      s.error = e
    }
  }

  const s = reactive({
    model: {
      username: useLocalStorage("username", ''),
      password: useLocalStorage("password", ''),
      usePassword: useLocalStorage("usePassword", false),
    },
    error: "",
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
  width: 500px;
  margin: 0 auto;
  padding: 10px 10px;
}

.form-body {
  width: 100%;
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
  :deep(.madoka-btn) {
    width: 100%; // 让按钮充满宽度
    height: 45px;
    font-size: 16px;
    letter-spacing: 2px;
  }
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
  margin-bottom: -73px; // 抵消输入框的高度，防止下方元素瞬间跳动
}
</style>
