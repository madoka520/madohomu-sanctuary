<template>
  <div class="form flex-center">
    <madoka-input v-model="Form.model.username" left-icon="mdi mdi-account-outline" right-icon="mdi-blank" placeholder="用户名" />
    <!-- 密码输入 -->
    <madoka-input
      v-model="Form.model.password"
      left-icon="mdi-lock-outline"
      type="password"
      :show-password="Form.showPassword"
      :right-icon="`mdi-${Form.showPassword ? 'eye' : 'eye-off'}-outline`"
      placeholder="密码"
      @toggle="Form.showOrHiddenPsd"
    />
    <madoka-btn type="2" @click="Form.login"> 登录/注册 </madoka-btn>
  </div>
</template>
<script setup lang="ts">
import MadokaInput from "@/components/MadokaInput.vue"
import MadokaBtn from "@/components/button/Index.vue"

const Form = (() => {
  const showOrHiddenPsd = () => {
    s.showPassword = !s.showPassword
  }
  const login = () => {}
  const s = reactive({
    model: {
      username: "",
      password: "",
    },
    showPassword: false,
    showOrHiddenPsd,
    login,
  })
  return s
})()
</script>
<style scoped>
.form {
  height: 300px;
  flex-direction: column;
  gap: 10px;
}

.login {
  display: flex;
  justify-content: center;

  user-select: none;
  &:hover {
    box-shadow: 0 4px 12px rgba(242, 166, 200, 0.8);
  }
}
</style>
