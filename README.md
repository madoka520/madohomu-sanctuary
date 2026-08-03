# 圆焰之庭 (Madohomu Sanctuary)

> 要是别人说怀有希望是错误的事 不管几次我都一定会否定这句话 不管到什么时候

《魔法少女小圆》主题粉丝社区站点。集成 Live2D 角色、音乐播放器、横向时间线留言板、视频主题背景等功能。

---

## ✨ 特性

- 🎨 **主题背景系统** — 支持视频背景（Gitee API → 本地缓存 → Blob 播放）与自定义组件背景切换
- 🎵 **音乐播放器** — 内置 34 首魔法少女小圆相关曲目，支持随机播放、Media Session 控制、桌面逐字歌词
- 💬 **横向时间线留言板** — 多来源留言聚合、嵌套回复、年/月/日导航、无限滚动、点赞
- 🧸 **Live2D 角色** — PixiJS + Live2D 渲染可交互角色模型
- ✨ **粒子特效** — 全屏 Canvas 粒子系统（心形/星形）
- 👤 **用户系统** — 登录/注册、头像上传、个人资料卡
- 🔗 **友链展示** — 友情链接卡片
- 🎬 **丰富的微交互** — 画册卡片跳跃、弹窗鼠标位展开、水波纹、钟摆动画、流星背景

---

## 🛠 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3.5 (Composition API + `<script setup>`) |
| 语言 | TypeScript + TSX |
| 构建 | Vite 6 |
| 状态管理 | Pinia 3 |
| CSS | Less + Scoped CSS |
| 动画 | anime.js + CSS @keyframes |
| Canvas | PixiJS 6 + 原生 Canvas 2D |
| 视频 | hls.js + 自研 Gitee API 管线 |
| 存储 | IndexedDB (idb) + localStorage |
| HTTP | Axios |
| 工具 | dayjs / lodash-unified / @vueuse/core / mitt |

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 8

### 安装与运行

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 类型检查
pnpm type-check
```

开发服务器默认运行在 `http://localhost:5173`，API 请求代理到 `http://localhost:3000`。

### 环境变量

| 变量 | 说明 | 开发默认值 |
|------|------|-----------|
| `VITE_API_URL` | 后端 API 地址 | `http://localhost:3000` |
| `VITE_CDN_URL` | 静态资源 CDN 路径 | `/dev-cdn/` |

---

## 📁 项目结构

```
src/
├── api/                  # API 接口层
│   ├── AuthApi.ts        # 认证（登录/注册/头像上传）
│   ├── MessageApi.ts     # 留言 CRUD
│   └── UserApi.ts        # 用户资料
├── assets/               # 静态资源
│   ├── fonts/            # 自定义字体
│   ├── images/           # 场景图片
│   ├── particle/         # 粒子纹理
│   └── styles/           # 全局样式
├── components/           # 组件库（全部自研）
│   ├── button/           # 按钮系统
│   ├── madoka-icon/      # 图标组件
│   ├── project/          # 项目功能模块
│   │   ├── pre-home-theme/   # 主题系统
│   │   ├── pre-audio-player-ui/ # 完整播放器
│   │   ├── setting/      # 设置面板
│   │   └── tips/         # 提示组件
│   ├── GiteeVideoPlayer.vue    # Gitee 视频播放器
│   ├── MadokaLive2d.vue        # Live2D 角色
│   ├── MadokaMsgCard.vue       # 留言卡片
│   ├── MadokaTimeline.vue      # 时间线选择器
│   ├── MadokaDeskLrc.vue       # 桌面歌词
│   └── ...                     # 其他通用组件
├── directives/           # 自定义指令
│   └── lazy.ts           # 视口懒加载
├── hooks/                # Pinia Stores
│   ├── useAudioPlayer.ts # 音频播放器
│   ├── useSetting.ts     # 主题/设置
│   ├── useToken.ts       # 用户认证
│   └── useVideoPreload.ts # 视频预加载状态
├── types/                # TypeScript 类型定义
├── utils/                # 工具模块
│   ├── giteeApi.ts       # Gitee API v5 客户端
│   ├── videoCache.ts     # 视频缓存管线 (L1→L2→API→Blob)
│   ├── indexedDB.ts      # IndexedDB 封装
│   ├── request.ts        # Axios 封装
│   ├── resource.ts       # CDN 资源路径
│   ├── ParticleUtils.ts  # 粒子物理系统
│   └── oss/              # OSS 上传驱动
├── views/                # 视图层
│   ├── view-home/        # 主页（照片墙 + 留言板）
│   ├── ViewScene.vue     # 场景背景
│   ├── ViewPlayer.vue    # 音频播放器
│   └── ViewParticle.vue  # 粒子画布
├── App.vue               # 根组件
└── main.ts               # 入口文件
```

---

## 🎯 核心系统

### 视频管线

```
用户请求播放
  → L1 内存缓存 (Map) ──命中→ 直接返回
  → L2 IndexedDB ──命中→ 写入L1 → 返回
  → Gitee API v5 ──未命中→ base64解码 → 写缓存
  → 分片加载: Promise.allSettled + 多轮重试
  → M3U8重写(TS→Blob URL) → <video>播放
```

### 音频系统

- 34 首内置歌曲（梶浦由記 / ClariS / Kalafina / 角色歌）
- Fisher-Yates 洗牌随机播放
- Media Session API 集成（浏览器媒体控制 + 键盘快捷键）
- 逐字歌词渐变动画（CSS `background-clip: text` + 星尘特效）
- 纯音乐自动识别

### 留言板

- **多来源聚合**：本站 / madohomu.love / kami.im
- **横向时间线**：纵向滚轮 → 横向平移 + 惯性
- **日期导航**：年/月/日三级悬浮选择器
- **嵌套回复** + 点赞 + 用户资料卡

---

## 🎨 设计语言

统一的**魔法少女粉色系**视觉：

- **主色**：`#ffb7c5` / `#ff85a2`（樱花粉）
- **辅色**：`#b388eb`（晓美焰紫）
- **玻璃态**：大量 `backdrop-filter: blur()` + 半透明背景
- **圆角体系**：12-29px 大圆角 + `corner-shape: superellipse`
- **动画**：钟摆摆动 / 粒子飘落 / 流星划过 / 逐字浮现 / 水波纹

---

## 🖥 浏览器支持

- Chrome / Edge 90+
- Safari 需 `-webkit-backdrop-filter` 前缀（已处理）
- Media Session API 仅 Chrome/Edge 完整支持
- `corner-shape` 为 Chrome 实验性特性

---

## 📄 License

Private project. All rights reserved.

---

> 圆与焰的庭院，永远盛开着希望之花 🌸
