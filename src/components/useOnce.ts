const map = useLocalStorage<Record<string, boolean>>("once", () => ({}))

export default (key: string, fn: () => void, timeout?: number) => {
  if (map.value[key]) return

  const run = () => {
    try {
      fn()
      map.value[key] = true
    } catch (e) {
      throw e
    }
  }

  timeout ? setTimeout(run, timeout) : run()
}
