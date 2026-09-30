import { defineStore } from "pinia"
import { getGiteeVideoUrl, getImgUrl, getVideoUrl } from "@/utils/resource.ts"
import type { IThemeType } from "@/components/project/pre-home-theme/types.ts"
export default defineStore("setting", () => {
  const toAsyncComponent = <T extends Component>(comp: () => Promise<T>) => markRaw(defineAsyncComponent(comp))
  const open = () => {
    s.opened = true
  }
  const s = reactive({
    //setting弹窗开启状态
    opened: false,
    theme: useLocalStorage('madokami_theme', 0),
    themeList: [
      {
        name: 'kami',
        i18n: 'theme.kami',
        type: 'customer',
        component: toAsyncComponent(
          () =>
            import(
              '@/components/project/pre-home-theme/components/kami/Index.vue'
            ),
        ),
        cover: getImgUrl('/kami/kami_1.webp'),
      },
      {
        name: '「魔法少女小圆」OP【コネクト】',
        i18n: 'theme.op',
        type: 'video',
        src: getGiteeVideoUrl('madoka-op-muted/playlist.m3u8'),
        song: 'コネクト',
        cover: getImgUrl(
          '/themes/covers/完整版「魔法少女小圆」OP【コネクト】.webp',
        ),
      },
      // =========start========== 小圆生日主题（10/3）：纯 CSS 夜空生日场景，封面用内联 SVG（无图片素材依赖）
      {
        name: '圆诞',
        i18n: 'theme.birthday',
        type: 'customer',
        component: toAsyncComponent(
          () =>
            import(
              '@/components/project/pre-home-theme/components/madoka-birthday/Index.vue'
            ),
        ),
        cover: getImgUrl('/themes/birthday/mainbg1.jpg'),
        song: 'また あした',
      },
      // ========end========
    ] as IThemeType[],
    open,
  })

  // =========start========== 生日自动主题（参考 madohomu.love）：10/3 00:00 ~ 10/4 06:00 期间，
  // 仅对未手动选择过主题（仍为默认 0）的访客自动切到生日主题；窗口过后自动还原，不打扰手动选择
  {
    const now = new Date()
    const y = now.getFullYear()
    const AUTO_FLAG = 'madokami_auto_birthday'
    const inWindow = now >= new Date(y, 9, 3, 0, 0) && now < new Date(y, 9, 4, 6, 0)
    if (inWindow && s.theme === 0) {
      s.theme = 2
      localStorage.setItem(AUTO_FLAG, String(y))
    } else if (!inWindow && localStorage.getItem(AUTO_FLAG)) {
      if (s.theme === 2) s.theme = 0
      localStorage.removeItem(AUTO_FLAG)
    }
  }
  // ========end========

  return toRefs(s)
})