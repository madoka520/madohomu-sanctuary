export const html = String.raw
export const sleep = async (timeout: number) =>
  new Promise((resolve, reject) => setTimeout(resolve, timeout))
export const isMobile = () =>
  /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
  !window.matchMedia('(pointer: fine)').matches