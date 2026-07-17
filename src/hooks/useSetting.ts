import { defineStore } from "pinia"
import { getImgUrl, getVideoUrl } from "@/utils/resource.ts"
import type { IThemeType } from "@/components/project/pre-home-theme/types.ts"
export default defineStore("setting", () => {
  const toAsyncComponent = <T extends Component>(comp: () => Promise<T>) => markRaw(defineAsyncComponent(comp))
  const s = reactive({
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
        src: getVideoUrl('madoka-op-muted/playlist.m3u8'),
        song: 'コネクト',
        cover: getImgUrl(
          '/themes/covers/完整版「魔法少女小圆」OP【コネクト】.webp',
        ),
      },
    ] as IThemeType[],
  })

  return toRefs(s)
})