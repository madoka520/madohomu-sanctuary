<template>
  <div class="madoka-button flex-center" :class="{ [`variant-${variant}`]: true }" tabindex="0">
    <span>
      <slot>
        {{ text }}
      </slot>
    </span>
  </div>
</template>

<script setup lang="ts">
import type { Variant } from "@/components/button/button.ts";
import ColorUtils from "@/utils/ColorUtils.ts";

defineOptions({
  name: "MadokaButton",
});
const props = withDefaults(
  defineProps<{
    text?: string;
    color?: string;
    variant?: Variant;
    radius?: number;
  }>(),
  {
    color: "black",
    radius: 4,
  },
);

function isLightColor(colorStr: string): boolean {
  const rgb = ColorUtils.getRGB(colorStr);
  if (!rgb) return true; // fallback：亮色
  const [r, g, b] = rgb;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128;
}

const textColor = computed(() => {
  return isLightColor(props.color) ? "black" : "white";
});
</script>

<style scoped lang="less">
.madoka-button {
  --primary-color: v-bind(color);
  --text-color: v-bind(textColor);
  padding: 5px 16px;
  border-radius: v-bind("radius + 'px'");
  gap: 6px;
  user-select: none;
}

.variant-text {
  background: transparent;
  border: none;
  color: var(--primary-color);

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
}

.variant-outlined {
  background: transparent;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
}

.variant-plain {
  background: var(--primary-color);
  color: var(--text-color);
  border: none;

  &:hover {
    opacity: 0.9;
  }
}
</style>
