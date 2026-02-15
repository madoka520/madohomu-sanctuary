type origin = 'madokami' | 'kami.im' | string
type Message = {
  id: number
  likes: number
  liked: number
  content: string
  createTime: number
  userId: number
  externalUsername: string
  externalUserId: number
  username: string
  externalId: number
  origin: string
  updateTime: number
  userUpdateTime: number
  avatar?: string
  image?: string
  replies: any[]
}
export type { origin, Message }
