<template>
  <component :is="Root.component" v-bind="$attrs">
    <template v-for="(name, index) in Object.keys($slots)" v-slot:[name]>
      <slot :name="name" />
    </template>
  </component>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    componentName: string;
  }>(),
  {
    componentName: "div",
  },
);
defineOptions({
  name: "madoka-base-component",
});

const components = import.meta.glob("/src/components/**/*.vue");

const elDict = {
  btn: "button",
};

const toAsyncComponent = <T extends Component>(comp: () => Promise<T>) => markRaw(defineAsyncComponent(comp));
const Root = (() => {
  const setWatcher = () => {
    watch(() => props.componentName, resolveComponent, { immediate: true });
  };

  const resolveComponent = () => {
    const basePath = "/src/components";
    const compName = props.componentName;
    const madokaComp = components[`${basePath}/madoka-${compName}/Index.vue`];

    if (madokaComp) {
      s.component = toAsyncComponent(madokaComp);
      return;
    }

    s.component = `el-${elDict[compName] ?? compName}`;
  };

  const s = reactive({
    component: "div" as string | Component,
  });
  setWatcher();
  return s;
})();
</script>

<style scoped></style>
