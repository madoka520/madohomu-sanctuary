import { defineStore } from "pinia"
import { getVideoUrl } from "@/utils/resource.ts"
import type { IThemeType } from "@/components/project/pre-home-theme/types.ts"
export default defineStore("setting", () => {
  const toAsyncComponent = <T extends Component>(comp: () => Promise<T>) => markRaw(defineAsyncComponent(comp))
  const s = reactive({
    theme: "op",
    themeList: {
      op: {
        type: "video",
        src: getVideoUrl("madoka-op-muted.webm"),
      },
      kami: {
        type: "customer",
        component: toAsyncComponent(() => import("@/components/project/pre-home-theme/components/kami/Index.vue")),
      },
    } as Record<string, IThemeType>,
  })

  return toRefs(s)
})