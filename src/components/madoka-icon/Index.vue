<template>
  <component :is="Root.component" v-bind="$attrs">
    <slot v-for="(_, name) in $slots" :name="name" />
  </component>
</template>

<script setup lang="ts">
import { capitalize } from "lodash-unified"

const props = withDefaults(
  defineProps<{
    type: string
  }>(),
  {

  },
)
defineOptions({
  name: "madoka-base-component",
})

const components = import.meta.glob("/src/components/madoka-icon/*.vue")

const toAsyncComponent = <T extends Component>(comp: () => Promise<T>) => markRaw(defineAsyncComponent(comp))
const Root = (() => {
  const setWatcher = () => {
    watch(() => props.type, resolveComponent, { immediate: true })
  }

  const resolveComponent = () => {
    const basePath = "/src/components/madoka-icon"
    const compName = props.type
    const madokaComp = components[`${basePath}/MadokaIcon${capitalize(compName)}.vue`]

    if (madokaComp) {
      s.component = toAsyncComponent(madokaComp)
      return
    }
  }

  const s = reactive({
    component: "div" as string | Component,
  })
  setWatcher()
  return s
})()
</script>

<style scoped></style>
