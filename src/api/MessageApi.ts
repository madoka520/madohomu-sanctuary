import { madokaGet, madokaPost } from "@/utils/request.ts";

export default {
  send: (data) => madokaPost("/sanctuary/message/create", data ),
  list: params => madokaGet("/sanctuary/message/page", params ),
}