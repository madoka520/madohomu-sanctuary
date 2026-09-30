<!-- =========start========== 语言设置页：三语言切换，立即生效并持久化 -->
<template>
  <div class="language">
    <p class="language__desc">{{ $t('settings.languageDesc') }}</p>
    <div class="language__list">
      <button
        v-for="l in LOCALES"
        :key="l.value"
        class="language__item"
        :class="{ 'is-active': current === l.value, 'is-runes': l.value === 'runes' }"
        @click="setLocale(l.value)"
      >
        <i
          class="mdi"
          :class="current === l.value ? 'mdi-check-circle' : 'mdi-circle-outline'"
        />
        <span>{{ l.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import i18n, { LOCALES, setLocale } from '@/i18n'

defineOptions({ name: 'pre-language-setting' })

const current = computed(() => i18n.global.locale.value)
</script>

<style scoped lang="less">
@pink-dark: #ff85a2;
@rose-sub: rgba(102, 90, 92, 0.65);

.language {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__desc {
    font-size: 12.5px;
    color: @rose-sub;
    line-height: 1.7;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  // 魔女文项用自己的字形展示自己（拉丁文本 + runes 字体）
  &__item.is-runes span {
    font-family: 'MadokaRunes';
    letter-spacing: 1px;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    font-size: 14px;
    color: @rose-sub;
    text-align: left;
    background: transparent;
    border: 1px solid rgba(255, 183, 197, 0.35);
    transition: all 0.25s ease;

    .mdi {
      font-size: 18px;
    }

    &:hover {
      color: @pink-dark;
      border-color: rgba(255, 133, 162, 0.55);
    }

    &.is-active {
      color: @pink-dark;
      border-color: rgba(255, 133, 162, 0.75);
      background: rgba(255, 240, 245, 0.5);
    }
  }
}
</style>
<!-- ========end======== -->
