// =========start========== 站点 i18n：vue-i18n 实例 + 语言切换/持久化
import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN.ts'
import jaJP from './ja-JP.ts'
import enUS from './en-US.ts'

export const LOCALES = [
  { value: 'zh-CN', label: '简体中文' },
  { value: 'ja-JP', label: '日本語' },
  { value: 'en-US', label: 'English' },
  // 魔女文：witch runes 字体只有拉丁字形，因此复用英文文案；
  // 标签按「各自语言显示自己」的惯例用拉丁文本，由语言页对该项套魔女文字体渲染成 runes
  { value: 'runes', label: 'Madoka Runes' },
] as const

export type LocaleValue = (typeof LOCALES)[number]['value']

const STORAGE_KEY = 'madokami_locale'

const isLocale = (v: string | null): v is LocaleValue =>
  !!v && LOCALES.some((l) => l.value === v)

const getInitialLocale = (): LocaleValue => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (isLocale(saved)) return saved
  // 无历史选择时跟随浏览器，认识就采用（中日英），否则中文
  const nav = navigator.language
  if (isLocale(nav)) return nav
  if (nav?.startsWith('ja')) return 'ja-JP'
  if (nav?.startsWith('en')) return 'en-US'
  return 'zh-CN'
}

const i18n = createI18n({
  legacy: false,
  globalInjection: true, // 模板里直接用 $t
  locale: getInitialLocale(),
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'ja-JP': jaJP,
    'en-US': enUS,
    runes: enUS,
  },
})

// =========start========== 魔女文：html 挂 runes-mode 触发全局字体切换（见 font.less）
const applyRunesMode = (locale: LocaleValue) => {
  document.documentElement.classList.toggle('runes-mode', locale === 'runes')
}

/** 切换语言：更新实例 + 持久化。
 * 注意：不要动 <html lang>——浏览器会按 lang 重选字体（如 ja 用日文字体），
 * 拉丁字形宽度随之变化，首屏英文引言的字距会在切换语言后漂移 */
export const setLocale = (locale: LocaleValue) => {
  i18n.global.locale.value = locale
  localStorage.setItem(STORAGE_KEY, locale)
  applyRunesMode(locale)
}

applyRunesMode(i18n.global.locale.value as LocaleValue)
// ========end========

export default i18n
// ========end========
