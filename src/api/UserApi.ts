import { madokaGet } from '@/utils/request.ts'

export default {
  getProfile: (userId: number) => madokaGet(`/user/${userId}`),
  getMessages: (userId: number, params?: { from?: number; size?: number }) =>
    madokaGet(`/user/${userId}/messages`, params),
}
