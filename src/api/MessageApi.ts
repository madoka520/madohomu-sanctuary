import { madokaGet, madokaPost } from "@/utils/request.ts";

export default {
  send: (data) => madokaPost("/sanctuary/message/create", data),
  list: (params) => madokaGet("/message", params),
  getMaxId: () => madokaGet("/message/get-max-id", {}),
  getMaxTime: () => madokaGet("/message/get-max-time", {}),
}