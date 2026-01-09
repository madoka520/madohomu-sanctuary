<template>
  <madoka-dialog :footer="false" v-model="Root.opened">
    <login v-if="!tokenStore.token"/>

    <div v-else class="content">
      <div class="slider">
        <div v-for="(item, index) in Setting.list" :class="{ 'slider__active': index === Setting.current }" @click="() => Setting.current = index">
          <div>
            {{item}}
          </div>
        </div>
      </div>
      <div class="main" >

      </div>
    </div>
  </madoka-dialog>
</template>

<script setup lang="ts">
import MadokaDialog from "@/components/MadokaDialog.vue"
import Login from "@/components/project/setting/Login.vue"
import useToken from "@/hooks/useToken.ts"
const tokenStore = useToken()
defineOptions({
  name: "Setting",
})

const Setting = (() => {
  const s = reactive({
    current: 0,
    list: ["主题", "隐私和安全"]
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

<style scoped lang="less">
.content {
  display: flex;

  width: 800px;
  height: 600px;
  .slider {
    width: 200px;

    user-select:none;

    &__active {
      background: pink;
      color: white;
    }
  }

  .main {
    flex:  1;
  }
}
</style>
