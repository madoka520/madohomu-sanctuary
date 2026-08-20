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
        type: 'video',
        src: getGiteeVideoUrl('madoka-op-muted/playlist.m3u8'),
        song: 'コネクト',
        cover: getImgUrl(
          '/themes/covers/完整版「魔法少女小圆」OP【コネクト】.webp',
        ),
      },
    ] as IThemeType[],
    open,
  })

  return toRefs(s)
})