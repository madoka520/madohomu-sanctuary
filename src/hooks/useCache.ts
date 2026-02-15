import { defineStore } from 'pinia'
export default defineStore("useCache", () => {
  const s = reactive({
    madohomuUserAvatar: useSessionStorage('madohomuUserAvatar', {}),
  })
  return toRefs(s)
})