import { madokaGet, madokaPost, madokaPut } from "@/utils/request.ts"

export default {
  send: (data) => madokaPost("/message", data),
  list: (params) => madokaGet("/message", params),
  getMaxId: () => madokaGet("/message/get-max-id"),
  getMaxTime: () => madokaGet("/message/get-max-time"),
  random: () => madokaGet("/message/random"),
  count: () => madokaGet("/message/count"),
  like: (messageId: number) => madokaPut("/message/like", { messageId }, { showSuccessMessage: false }),
}
