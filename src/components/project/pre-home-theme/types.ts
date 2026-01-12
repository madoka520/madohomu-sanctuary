import type { ShallowRef } from "vue"

export type themeType = "video" | "singleImg" | "imgList" | "customer";

export type IThemeType = {
  name: string,
  type: themeType;
  src?: string;
  cover: string;
  component?: ShallowRef
};
