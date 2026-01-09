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
import AuthApi from "@/api/AuthApi.ts"
import useToken from "@/hooks/useToken.ts"



const Form = (() => {
  const showOrHiddenPsd = () => {
    s.showPassword = !s.showPassword
  }

  const login = async () => {
    await useToken().login(s.model)

  }

  const s = reactive({
    model: {
      username: "",
      password: "",
    },
    showPassword: false,
    showOrHiddenPsd,
    login
  })
  return s
})()
</script>
<style lang="less" scoped>
.form {
  height: 300px;
  flex-direction: column;
  gap: 10px;
}

</style>
