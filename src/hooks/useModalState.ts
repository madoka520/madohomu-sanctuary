import { defineStore } from "pinia"

export default defineStore("useModalState", () => {
  const s = reactive({
    zIndex: 999999,
  })
  return toRefs(s)
})