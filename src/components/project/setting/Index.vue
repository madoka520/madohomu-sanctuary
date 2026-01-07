<template>
  <madoka-dialog :footer="false" v-model="Root.opened">
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
      <div class="form-item buttons" @click="Form.login">
        <div>登录</div>
      </div>
    </div>
  </madoka-dialog>
</template>

<script setup lang="ts">
import MadokaDialog from "@/components/MadokaDialog.vue"
defineOptions({
  name: "Setting",
})

const Form = (() => {
  const showOrHiddenPsd = () => {
    s.showPassword = !s.showPassword
  }
  const login = () => {

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
  return s
})()

const Root = (() => {
  const open = () => {
    s.opened = true
  }
  const s = reactive({
    opened: false,
    open,
  })
  return s
})()
defineExpose({
  open: Root.open,
})
</script>

<style scoped>
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

.buttons {
  display: flex;
  justify-content: center;
}
</style>
