//获取视频链接
export const getVideoUrl = (path:string) => `${import.meta.env.VITE_CDN_URL}videos/${path}`
//获取音频链接
export const getAudioUrl = (path:string) => `${import.meta.env.VITE_CDN_URL}music/${path}`
//获取图片链接
export const getImgUrl = (path: string) => `${import.meta.env.VITE_CDN_URL}images/${path}`

export const getAssetUrl = (path:string) => `${import.meta.env.VITE_CDN_URL}/${path}`