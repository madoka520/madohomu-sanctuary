# 圆焰之庭 (Madohomu Sanctuary) — 项目详细评估报告

> 评估日期：2026-08-04

---

## 目录

1. [项目概览](#1-项目概览)
2. [技术架构](#2-技术架构)
3. [目录结构与模块分析](#3-目录结构与模块分析)
4. [核心功能模块](#4-核心功能模块)
5. [组件体系](#5-组件体系)
6. [数据流与状态管理](#6-数据流与状态管理)
7. [API 与后端交互](#7-api-与后端交互)
8. [视频/音频系统](#8-视频音频系统)
9. [UI/UX 设计](#9-uiux-设计)
10. [工程质量评估](#10-工程质量评估)
11. [优点总结](#11-优点总结)
12. [问题与改进建议](#12-问题与改进建议)
13. [风险与债务](#13-风险与债务)
14. [改进路线图建议](#14-改进路线图建议)

---

## 1. 项目概览

| 属性 | 值 |
|------|-----|
| **项目名称** | madohomu-sanctuary (圆焰之庭) |
| **项目类型** | 单页 Web 应用 (SPA) |
| **主题** | 《魔法少女小圆》粉丝主题个人站 |
| **框架** | Vue 3.5 + TypeScript + Vite 6 |
| **包管理器** | pnpm (存在残留的 package-lock.json) |
| **私有项目** | 是 |
| **版本** | 0.0.0 (早期开发阶段) |
| **页面标题** | 圆焰之庭 |
| **部署平台** | ESA 静态托管 (esa.jsonc) |
| **源文件总数** | ~75 个源文件 (不含 node_modules/public/dist) |

### 产品定位

"圆焰之庭"是一个以《魔法少女小圆》(Puella Magi Madoka Magica) 为主题的个人网站/粉丝社区平台。核心体验包含：

- **主页场景**：两阶段页面 — 第一阶段为照片墙（画册卡片），第二阶段为横向滚动时间线留言板
- **Live2D 角色**：集成 PixiJS + Live2D 展示可交互角色模型（kami/神）
- **背景音乐系统**：内置 34 首魔法少女小圆相关歌曲（含纯音乐），支持随机播放
- **主题系统**：支持视频背景和自定义组件背景切换
- **留言系统**：多来源留言聚合（madokami / madohomu.love / kami.im），支持回复、点赞
- **用户系统**：登录/注册、头像上传（七牛云）、个人资料查看
- **友链系统**：展示友情链接

---

## 2. 技术架构

### 2.1 技术栈总览

| 层级 | 技术选型 | 版本 |
|------|---------|------|
| **前端框架** | Vue 3 (Composition API + `<script setup>`) | ^3.5.13 |
| **构建工具** | Vite | ^6.3.5 |
| **语言** | TypeScript + TSX (JSX) | ~5.7.2 |
| **状态管理** | Pinia | 3.0.3 |
| **路由** | 无 (单页，手动 Tab 切换) | — |
| **HTTP 客户端** | Axios | 1.12.0 |
| **CSS 方案** | Less + Scoped CSS + CSS v-bind | 4.3.0 |
| **UI 组件** | 全部自研（无第三方 UI 库） | — |
| **动画** | anime.js | 4.1.1 |
| **Canvas/2D** | PixiJS (Live2D) + 原生 Canvas (粒子) | 6.x |
| **Live2D** | pixi-live2d-display | ^0.4.0 |
| **视频** | hls.js + 自研 Gitee API 管线 | ^1.6.16 |
| **轮播** | Swiper | ^12.0.3 |
| **音视频** | 原生 `<audio>` / `<video>` + Media Session API | — |
| **本地存储** | IndexedDB (idb) + localStorage + sessionStorage | ^8.0.3 |
| **加密** | crypto-js (SHA1) | ^4.2.0 |
| **工具库** | dayjs, lodash-unified, @vueuse/core, mitt | — |
| **OSS** | qiniu-js (七牛云直传) | 4.0.0-beta.6 |
| **代码规范** | Prettier (无 ESLint) | 3.5.3 |

### 2.2 架构模式

```
┌─────────────────────────────────────────────────────────┐
│                     App.vue (根组件)                      │
│  初始化：音频播放器 / 视频预加载 / 设置 / 屏幕提示         │
├─────────────────────────────────────────────────────────┤
│                   ViewHome (主视图)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ PreWindowFirst│  │PreWindowSecond│  │  HomeHeader  │   │
│  │  (画册卡片页) │  │ (横向留言板)  │  │  (顶部导航)  │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  ViewPlayer  │  │ ViewParticle │  │   Setting    │   │
│  │  (音频播放)  │  │  (粒子特效)  │  │  (设置弹窗)  │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
├─────────────────────────────────────────────────────────┤
│                  Pinia Stores (状态层)                    │
│  setting │ videoPreload │ madokaAudioPlayer │ user      │
│  useCache │ useModalState                                │
├─────────────────────────────────────────────────────────┤
│                  Utils (工具层)                           │
│  giteeApi │ indexedDB │ videoCache │ request │ resource │
│  ParticleUtils │ ColorUtils │ imageUtils │ shaUtils    │
│  oss/DriverManager │ oss/drivers/Qiniu                  │
├─────────────────────────────────────────────────────────┤
│                  API Layer (接口层)                       │
│  AuthApi │ UserApi │ MessageApi                          │
└─────────────────────────────────────────────────────────┘
```

**显著特点：无 Vue Router。** 整个应用是单视图，通过响应式变量 `Tab.current` 在 Phase 0（照片墙）和 Phase 1（留言板）之间切换。这简化了路由但限制了 URL 可分享性。

---

## 3. 目录结构与模块分析

```
madohomu-sanctuary/
├── index.html                        # 入口 HTML，含 Live2D 脚本加载、移动端全屏逻辑
├── vite.config.ts                    # Vite 配置：插件/代理/别名/MIME
├── tsconfig.json                     # 解决方案级 TS 配置
├── tsconfig.app.json                 # 应用 TS 配置（noImplicitAny: false）
├── tsconfig.node.json                # Node 端 TS 配置（Vite 配置用）
├── .prettierrc                       # Prettier 配置（无分号、单引号）
├── .env.development                  # 开发环境变量（API 指向 localhost:3000）
├── .env.production                   # 生产环境变量（API→api.madohomu.madokami.cn）
├── esa.jsonc                         # ESA 部署配置（SPA 模式）
├── pnpm-workspace.yaml               # pnpm 配置（允许 esbuild/vue-demi 构建）
├── package.json
├── public/
│   └── dev-cdn/                      # 本地 CDN 资源
│       ├── js/live2d/                # Live2D 核心 JS
│       └── live2d-model/kami/        # Live2D 模型文件（.moc3/.json/纹理/动作）
└── src/
    ├── main.ts                       # 应用入口：创建 App → Pinia → 指令 → 挂载
    ├── App.vue                       # 根组件：组装所有子系统
    ├── vite-env.d.ts                 # Vite 类型声明
    ├── api/                          # API 接口层
    │   ├── AuthApi.ts                # 登录/注册/头像上传/修改用户名密码
    │   ├── UserApi.ts                # 用户资料/留言查询
    │   └── MessageApi.ts             # 留言 CRUD/点赞/随机/计数
    ├── assets/                       # 静态资源
    │   ├── fonts/                    # 自定义字体（AaWoyoudianfangLite.ttf）
    │   ├── images/                   # 场景图片、粒子素材（心形/星形 PNG）
    │   ├── particle/                 # 粒子纹理
    │   └── styles/                   # 全局样式
    │       ├── layout.less           # 主布局样式
    │       └── font.less             # 字体定义
    ├── components/                   # 组件库（全部自研）
    │   ├── button/                   # 按钮系统（动态组件路由）
    │   │   ├── Index.vue             # 按钮容器（根据 type prop 动态加载变体）
    │   │   ├── Index_1.vue ~ Index_3.vue  # 按钮变体
    │   │   ├── Index_Youmi.vue       # 特殊按钮
    │   │   └── button.ts             # 按钮类型定义
    │   ├── madoka-icon/              # 图标组件
    │   ├── madoka-mini-player-controls/  # 迷你播放器控制
    │   ├── madoka-base-component/    # 基础组件
    │   ├── project/                  # 项目级功能组件
    │   │   ├── pre-home-theme/       # 主题系统
    │   │   │   ├── Index.vue         # 主题容器（视频/自定义组件切换）
    │   │   │   ├── types.ts          # 主题类型定义
    │   │   │   └── components/kami/Index.vue  # "神"主题（Swiper 轮播+文字动画）
    │   │   ├── setting/              # 设置面板
    │   │   │   ├── Index.vue         # 设置主面板（登录态分支）
    │   │   │   ├── Login.vue         # 登录/注册表单
    │   │   │   ├── PreThemeSetting.vue  # 主题设置（视频缓存状态展示）
    │   │   │   ├── PreAccountMgr.vue # 账号管理（改昵称/密码/头像/邮箱）
    │   │   │   └── PreAbout.vue      # 关于页（空壳）
    │   │   ├── pre-audio-player-ui/  # 完整音频播放器 UI
    │   │   └── tips/                 # 提示组件（screenTip.tsx）
    │   ├── GiteeVideoPlayer.vue      # Gitee 视频播放器（核心）
    │   ├── MadokaHlsPlayer.vue       # HLS 播放器（hls.js 封装）
    │   ├── MadokaLive2d.vue          # Live2D 角色渲染
    │   ├── MadokaMsgCard.vue         # 留言卡片（含回复嵌套/点赞/头像懒加载）
    │   ├── MadokaSideDrawer.vue      # 侧滑抽屉面板（拖拽滚动）
    │   ├── MadokaTimeline.vue        # 时间线选择器（年-月-日悬浮卡片）
    │   ├── MadokaDialog.vue          # 通用弹窗（鼠标位置弹出动画）
    │   ├── MadokaMask.vue            # 遮罩层（Teleport + Transition）
    │   ├── MadokaSlidebar.vue        # 侧边导航栏（果冻指示器动画）
    │   ├── MadokaImg.vue             # 图片组件（预览+拖拽）
    │   ├── MadokaPictureAlbumCard.vue # 画册卡片（随机动画+跳跃效果）
    │   ├── MadokaAvatar.vue          # 头像组件（自动获取/错误回退/上传）
    │   ├── MadokaDeskLrc.vue         # 桌面歌词（逐字渐变动画+星尘特效）
    │   ├── MadokaMagicCard.vue       # 友链卡片（赛博朋克风）
    │   ├── MadokaMeteorShower.vue    # 流星背景
    │   ├── MadokaRipple.vue          # 水波纹点击效果
    │   ├── MadokaCheckbox.vue        # 复选框
    │   ├── MadokaInput.vue           # 输入框（粉色下划线动画）
    │   ├── MadokaUnderlineBtn.vue    # 下划线按钮
    │   ├── MadokaProgressBar.vue     # 进度条
    │   ├── UserProfileDialog.vue     # 用户资料弹窗
    │   ├── FormDemo.vue              # 表单 Demo（丘比契约主题，独立页面）
    │   ├── useModal.tsx              # 命令式弹窗（函数调用）
    │   ├── useOnce.ts                # 一次性执行工具
    │   └── message.tsx               # 全局消息提示（Toast）
    ├── directives/
    │   └── lazy.ts                   # v-lazy 指令（IntersectionObserver）
    ├── hooks/                        # Pinia Stores
    │   ├── useSetting.ts             # 设置 Store（主题/弹窗）
    │   ├── useVideoPreload.ts        # 视频预加载 Store（缓存状态追踪）
    │   ├── useAudioPlayer.ts         # 音频播放器 Store（34首歌单）
    │   ├── useToken.ts               # 用户认证 Store（token/userInfo）
    │   ├── useCache.ts               # 缓存 Store（用户头像缓存）
    │   ├── useModalState.ts          # 弹窗层级管理
    │   └── useMadokaScroll.ts        # 自定义滚动逻辑（wheel→横向滚动）
    ├── types/                        # TypeScript 类型
    │   ├── Message.ts                # 留言/来源类型
    │   ├── IAxiosType.ts             # Axios 配置扩展
    │   └── upload.ts                 # OSS 上传相关类型
    ├── utils/                        # 工具模块
    │   ├── global/global.ts          # 全局工具（html模板/sleep/isMobile）
    │   ├── emitter.ts                # 事件总线（mitt）
    │   ├── request.ts                # Axios 封装（拦截器/Token/错误处理）
    │   ├── giteeApi.ts               # Gitee API 客户端（v5/base64解码/重试）
    │   ├── indexedDB.ts              # IndexedDB 封装（idb/自动降级重建）
    │   ├── videoCache.ts             # 视频缓存管线（L1内存→L2 IDB→API→Blob）
    │   ├── resource.ts               # 资源 URL 工具（CDN 路径拼接）
    │   ├── ParticleUtils.ts          # 粒子系统（Canvas 物理引擎）
    │   ├── ColorUtils.ts             # 颜色解析（Canvas 取色法）
    │   ├── imageUtils.ts             # 图片转 WebP
    │   ├── shaUtils.ts               # SHA1 哈希
    │   └── oss/                      # OSS 上传
    │       ├── DriverManager.ts       # 驱动管理器（工厂模式）
    │       └── drivers/Qiniu.ts      # 七牛云驱动
    └── views/                        # 视图层
        ├── view-home/                # 主页相关
        │   ├── Index.vue             # 主页容器（Tab 切换）
        │   ├── PreWindowFirst.vue    # 第一阶段：画册卡片墙
        │   ├── PreWindowSecond.vue   # 第二阶段：横向留言板
        │   ├── HomeHeader.vue        # 顶部导航栏
        │   └── PreFirendLinks.vue    # 友链弹窗
        ├── ViewScene.vue             # 场景背景（钟摆动画）
        ├── ViewPlayer.vue            # 音频播放器（Media Session 集成）
        ├── ViewParticle.vue          # 粒子画布
        ├── HomuraCorridor.vue        # 焰之回廊（静态时间线展示，独立页）
        ├── PreSelfMsgSlot.vue        # 欢迎信息插槽
        └── message-dialog/           # 留言对话框
            └── PreMessageDialog.vue   # 发送留言（contenteditable + 回复预览）
```

---

## 4. 核心功能模块

### 4.1 主题系统

**位置**：`src/hooks/useSetting.ts` + `src/components/project/pre-home-theme/`

主题通过 Pinia Store 管理，当前定义 2 个主题：

| 主题名 | 类型 | 实现 |
|--------|------|------|
| `kami` (神) | `customer` | Swiper 轮播背景图 + 逐字浮现文字动画 |
| 魔法少女小圆 OP【コネクト】 | `video` | GiteeVideoPlayer 播放 M3U8 视频 |

主题切换时自动切换对应背景音乐（`song` 字段映射到 `audioPlayer.playByName()`）。

**评价**：主题系统设计良好，`IThemeType` 接口支持 4 种类型（video/singleImg/imgList/customer），但目前仅实现了 2 种。扩展性强，但视频主题的 **Gitee API 请求数较多**（每个视频可能有几十个 .ts 分片请求）。

### 4.2 留言系统

**位置**：`src/views/view-home/PreWindowSecond.vue` + `src/api/MessageApi.ts`

- **多来源聚合**：`madokami`（本站）/ `madohomu.love` / `kami.im` — 通过 `origin` 字段区分
- **横向时间线滚动**：留言按时间轴水平排列，纵向滚动查看卡片内部内容
- **无限滚动**：通过 `IntersectionObserver` 检测滚动边界，自动加载更早/更新的消息
- **日期导航**：`MadokaTimeline` 组件提供年-月-日三级悬浮选择器，点击跳转到指定日期
- **回复嵌套**：支持多级回复（递归 `buildReplies` 渲染）
- **点赞**：即时 UI 反馈 + API 同步
- **用户资料卡**：点击头像/用户名弹出 `UserProfileDialog`（发言数/最近登录/曾用名/最近发言）
- **空闲返回**：5 分钟无操作自动返回照片墙首页

**评价**：留言系统是整个项目最复杂的业务模块，实现了完整的多来源聚合、嵌套回复、时间和日期导航。横向时间线设计在 Web 端非常独特。

### 4.3 音频系统

**位置**：`src/hooks/useAudioPlayer.ts` + `src/views/ViewPlayer.vue`

- **34 首内置歌曲**：涵盖 ClariS、Kalafina、梶浦由記 等魔法少女小圆相关曲目
- **纯音乐识别**：`isInstrumental` 字段标记纯音乐，歌词显示"纯音乐，请欣赏"
- **随机播放**：Fisher-Yates 洗牌算法生成随机播放列表
- **Media Session API**：支持浏览器媒体控制（播放/暂停/上一首/下一首）+ 键盘快捷键（Space/←/→）
- **桌面歌词**：`MadokaDeskLrc` 逐字渐变动画 + 星尘闪烁特效（CSS `background-clip: text` + `--p` CSS 变量驱动）
- **迷你播放器**：`madoka-mini-player-controls` 提供 Swiper 滑动切歌
- **完整播放器**：`pre-audio-player-ui` 提供歌单列表 + 进度条拖拽

**评价**：音频系统设计非常完善，从播放控制到歌词显示到 Media Session 集成都很专业。歌词系统使用了自定义的逐字时间戳格式（`[start,duration]` + `<word>(start,duration)`），配合 `requestAnimationFrame` 实现平滑渐变。

### 4.4 Live2D 角色系统

**位置**：`src/components/MadokaLive2d.vue`

- **引擎**：PixiJS 6.x + pixi-live2d-display
- **模型**：`kami`（神），包含 `model.moc3` + 物理/姿态/表情/动作 JSON
- **交互**：点击身体触发 `tap_body` 动作
- **透明度**：鼠标在右下角时角色自动半透明（避免遮挡内容）
- **定位**：固定在右下角，CSS v-bind 动态控制尺寸

**评价**：Live2D 集成简洁有效，交互响应良好。模型文件较大（约 7 个动作文件 + 2048 纹理），通过本地 `/dev-cdn/` 提供。

### 4.5 粒子系统

**位置**：`src/utils/ParticleUtils.ts` + `src/views/ViewParticle.vue`

- **全局 Canvas**：覆盖全屏的粒子画布（z-index: 9999999999）
- **物理模拟**：重力 + 速度 + 透明度衰减 + 旋转
- **粒子纹理**：心形（heart.png/heart_plain.png）、星形（star.png/star_plain.png）
- **自动回收**：超出屏幕或透明度过低的粒子自动标记删除

**评价**：经典的粒子特效实现，性能良好（`requestAnimationFrame` + 筛除过期粒子）。目前粒子生成触发方式不明显（`generateRact` 导出但仅在特定条件触发）。

### 4.6 视频系统（Gitee 管线）

**位置**：`src/utils/giteeApi.ts` + `src/utils/videoCache.ts` + `src/utils/indexedDB.ts` + `src/components/GiteeVideoPlayer.vue`

这是项目最**技术含量最高**的模块：

```
用户请求播放视频
    │
    ▼
┌─────────────────────────────────────────────────┐
│  GiteeVideoPlayer (薄封装)                       │
│  管理 <video> 生命周期 / emit 状态事件           │
└──────────────┬──────────────────────────────────┘
               │ loadGiteeVideo(src)
               ▼
┌─────────────────────────────────────────────────┐
│  videoCache.ts (核心管线)                        │
│                                                  │
│  ① L1 内存缓存 (Map) ─── 命中 → 直接返回        │
│  ② L2 IndexedDB ─── 命中 → 写入 L1 → 返回       │
│  ③ Gitee API v5 ─── 未命中 → fetch + 写缓存     │
│                                                  │
│  M3U8: fetchText → 解析分片名 → fetchBytes 逐片  │
│  → 构建 Blob Map → 重写 M3U8 → 返回 Blob URL     │
│                                                  │
│  分片加载: Promise.allSettled → 部分成功写缓存   │
│  → 失败分片最多重试 3 轮                          │
└──────────────┬──────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────┐
│  giteeApi.ts (Gitee API v5 客户端)               │
│  • fetchText(path) → base64 解码 → 文本          │
│  • fetchBytes(path) → base64 解码 → Uint8Array   │
│  • 指数退避重试 (max 3次, 1s/2s/4s)              │
│  • 4xx 非 429 立即失败                           │
└─────────────────────────────────────────────────┘
```

**评价**：这套管线设计非常精巧，是项目的技术亮点：
- 两级缓存（内存 + IndexedDB）有效减少 API 请求
- `allSettled` + 逐片落盘确保部分成功也受益
- 去重机制（`_pendingLoads` Map）防止并发重复加载

但存在**固有限制**：Gitee API 设计是为代码文件服务的，不是为视频流服务的。每个 .ts 分片都需要一次 base64 解码 + Blob 构造，对大视频而言性能开销较大。

---

## 5. 组件体系

### 5.1 组件总数

约 **40 个组件**，全部自研，无第三方 UI 库依赖。

### 5.2 组件分层

| 层级 | 组件 | 说明 |
|------|------|------|
| **基础组件** | MadokaBtn, MadokaInput, MadokaCheckbox, MadokaDialog, MadokaMask, MadokaSlidebar, MadokaProgressBar | 通用 UI 原子 |
| **业务组件** | MadokaMsgCard, MadokaTimeline, MadokaSideDrawer, MadokaPictureAlbumCard, MadokaAvatar, MadokaDeskLrc, MadokaMagicCard | 业务相关复合组件 |
| **特效组件** | MadokaLive2d, MadokaMeteorShower, MadokaRipple, ViewParticle | 视觉特效 |
| **媒体组件** | GiteeVideoPlayer, MadokaHlsPlayer, MadokaImg | 媒体播放/展示 |
| **功能组件** | Setting, Login, PreThemeSetting, PreAccountMgr, PreHomeTheme, PreAudioPlayerUI | 完整功能模块 |
| **工具组件** | useModal, message, useOnce | 命令式 API |

### 5.3 组件编码模式

项目统一使用 **reactive + IIFE** 模式组织组件逻辑：

```typescript
const ModuleName = (() => {
  const init = () => { /* ... */ }
  const s = reactive({
    // state + methods
  })
  init()
  onMounted(initOnMounted)
  return s
})()
```

这种模式的好处：
- 避免 `<script setup>` 中顶层变量过多导致的命名冲突
- 逻辑内聚，每个 IIFE 是一个独立的功能模块
- 与 Vue 响应式系统良好集成

潜在缺点：
- 所有逻辑在 setup 阶段立即执行（包括 IIFE 内的 `onMounted`）
- `reactive` 对象内混合 state 和 methods，类型推断不如 `ref` 精确

### 5.4 按钮系统

**位置**：`src/components/button/Index.vue`

使用 `import.meta.glob` 动态加载按钮变体：

```typescript
// type="1" → Index_1.vue
// type="2" → Index_2.vue
// type="3" → Index_3.vue
// type="Youmi" → Index_Youmi.vue
```

这是个巧妙的动态组件路由方案，但按钮变体之间共享 props/events 的方式不明确。

---

## 6. 数据流与状态管理

### 6.1 Pinia Stores (6 个)

| Store | 类型 | 持久化 | 职责 |
|-------|------|--------|------|
| `setting` | `defineStore` | `useLocalStorage('madokami_theme')` | 主题选择、设置弹窗 |
| `videoPreload` | `defineStore` | 无（内存） | 视频缓存状态追踪 |
| `madokaAudioPlayer` | `defineStore` | 无（内存） | 音频播放状态、歌单 |
| `user` (useToken) | `defineStore` | `useLocalStorage` (token/userInfo) | 用户认证 |
| `useCache` | `defineStore` | `useSessionStorage` (头像) | 用户头像缓存 |
| `useModalState` | `defineStore` | 无（内存） | 弹窗 z-index 管理 |

### 6.2 通信方式

- **父子组件**：Props + Emits（`defineModel` 双向绑定）
- **跨组件**：Pinia Store
- **全局事件**：mitt (`src/utils/emitter.ts`) — 当前仅定义未实际使用
- **命令式调用**：`useModal.confirm()` / `message.success()` 通过 `createVNode` + `render` 动态挂载

### 6.3 本地存储

| 存储方式 | 用途 |
|---------|------|
| IndexedDB (`madohomu-cache` v4) | M3U8 文本 + TS 分片二进制缓存 |
| localStorage | Token、用户信息、主题选择、用户名密码、"once" 标记 |
| sessionStorage | 用户头像缓存 |

---

## 7. API 与后端交互

### 7.1 API 代理架构

```
浏览器 → /madoka-api/*  → http://localhost:3000 (开发) / api.madohomu.madokami.cn (生产)
       → /oss-api/*     → VITE_OSS_URL (七牛签名服务)
       → /haojiezhe-api/* → https://haojiezhe12345.top:82 (第三方数据)
       → Gitee API v5   → https://gitee.com/api/v5/repos/... (视频文件)
```

### 7.2 API 模块

| 模块 | 端点 | 方法 |
|------|------|------|
| **AuthApi** | `/login`, `/avatar`, `/username`, `/password` | POST/PUT |
| **MessageApi** | `/message`, `/message/like`, `/message/random`, `/message/count` | GET/POST/PUT |
| **UserApi** | `/user/:id`, `/user/:id/messages` | GET |
| **GiteeApi** | `repos/{owner}/{repo}/contents/{path}` | GET (fetch) |

### 7.3 请求拦截

- **请求拦截器**：自动附加 `Bearer token`（除非 `tokenRequired: false`）
- **响应拦截器**：POST/PUT 成功自动 toast；错误自动 toast（GET 除外，除非 `showErrorMessage: false`）
- **扩展配置**：`MyAxiosRequestConfig` 支持 `showErrorMessage` / `showSuccessMessage` / `tokenRequired`

---

## 8. 视频/音频系统

### 8.1 视频

| 组件 | 用途 | 技术 |
|------|------|------|
| `GiteeVideoPlayer` | 主题视频背景播放 | Gitee API → 两级缓存 → Blob URL |
| `MadokaHlsPlayer` | HLS 流播放（备用） | hls.js |

**GiteeVideoPlayer 流程**：
1. 组件挂载 / src 变化时调用 `load()`
2. 防止过期结果（src 变更检测）
3. 委托 `videoCache.ts` 执行完整加载管线
4. 获得 M3U8 Blob URL → 赋给 `video.src`
5. 组件卸载时 `revoke()` 释放 Blob URL（**缓存保留**）

### 8.2 音频

- **格式**：WebM 音频（`audio/webm; codecs=opus`），自定义 `.weba` 扩展名
- **CDN**：通过 `getAudioUrl()` 拼接路径 → `/dev-cdn/music/{title}.weba`
- **自动播放**：`autoplay` + 点击事件兜底（浏览器策略）
- **媒体控制**：Media Session API + 键盘快捷键

---

## 9. UI/UX 设计

### 9.1 设计语言

项目采用统一的**魔法少女粉色系**设计语言：

- **主色调**：`#ffb7c5` / `#ff85a2` / `#ff8fab`（樱花粉）
- **辅助色**：`#b388eb` / `#a470d1`（晓美焰紫）
- **文字色**：`#6b444d` / `#665a5c`（柔和深褐灰）
- **玻璃效果**：大量 `backdrop-filter: blur()` + 半透明背景 + 发光边框
- **圆角体系**：大圆角（12-29px），部分使用 `corner-shape: superellipse(1.333)`
- **字体**：`PingFang SC` / `Helvetica Rounded` / 自定义 `cute` 字体 / `AaWoyoudianfangLite.ttf`
- **滚动条**：自定义粉色渐变滚动条

### 9.2 动画系统

| 动画类型 | 实现方式 | 示例 |
|---------|---------|------|
| CSS 动画 | `@keyframes` | 钟摆摆动、星星闪烁、文字浮现 |
| CSS Transition | `transition` | 玻璃面板滑入、弹窗弹出、卡片悬浮 |
| JS 动画 | `anime.js` | 画册卡片随机摆动 |
| Canvas 动画 | `requestAnimationFrame` | 粒子系统物理模拟 |
| 手势动画 | `@vueuse/gesture` | 留言板横向拖拽滚动 + 惯性 |

### 9.3 响应式设计

- **移动端检测**：`isMobile()` + `matchMedia('pointer: fine')`
- **移动端策略**：显示遮罩提示用户进入横屏模式 + 点击全屏 + 锁定横屏方向
- **CSS 单位**：大量使用 `clamp()` 实现流式尺寸
- **不足**：未针对移动端做完整的自适应布局，仅做全屏锁定处理

### 9.4 可访问性

- 头像有 `alt` 属性
- 部分交互元素有 `tabindex`
- **不足**：无 ARIA 标签、无键盘导航支持（除音频快捷键外）、无焦点管理

---

## 10. 工程质量评估

### 10.1 代码质量

| 维度 | 评级 | 说明 |
|------|------|------|
| **代码组织** | ⭐⭐⭐⭐ | 模块划分清晰，utils/hooks/components 职责明确 |
| **命名规范** | ⭐⭐⭐ | 部分中文注释与英文代码混用，组件前缀 `Madoka`/`Pre` 不统一 |
| **类型安全** | ⭐⭐⭐ | `noImplicitAny: false`，部分 `as any` 类型断言 |
| **注释质量** | ⭐⭐⭐⭐ | 关键模块有 `[Ethan]` 标记的结构化注释，原代码用注释保留 |
| **重复代码** | ⭐⭐⭐ | `reactive + IIFE` 模式高度统一，但部分逻辑（如滚动处理）在多个组件中重复 |
| **错误处理** | ⭐⭐⭐ | API 层有拦截器 + toast，但部分 catch 仅 `console.error` |

### 10.2 工程配置

| 配置项 | 状态 | 说明 |
|--------|------|------|
| TypeScript | ✅ 严格模式部分启用 | `noImplicitAny: false` 降低了类型安全 |
| Linter | ❌ 无 ESLint | 仅有 Prettier 格式化 |
| 测试 | ❌ 无 | 无任何单元测试或 E2E 测试 |
| Git Hooks | ❌ 无 | 无 pre-commit hook（如 lint-staged） |
| CI/CD | 未知 | ESA 部署配置存在但 CI 流水线未知 |
| 环境变量 | ✅ | .env.development / .env.production |
| 包管理器锁定 | ⚠️ | pnpm-lock.yaml + 残留 package-lock.json |

### 10.3 性能

| 方面 | 评估 |
|------|------|
| **首屏加载** | 中等 — Live2D 模型 + 多个脚本同步加载 |
| **视频优化** | 良好 — 两级缓存 + 预加载机制 |
| **内存管理** | 良好 — Blob URL 及时 revoke，粒子自动回收 |
| **渲染性能** | 良好 — Canvas 粒子 + Live2D 都做了性能优化 |
| **Bundle 大小** | 未分析 — 无 tree-shaking 配置检查 |
| **图片优化** | 部分 — WebP 转换，但无懒加载（除 v-lazy 指令外） |

---

## 11. 优点总结

1. **完整独立设计**：全部 40+ 组件自研，无第三方 UI 库依赖，设计语言高度统一
2. **技术深度突出**：Gitee API → 两级缓存 → Blob URL 视频管线设计精巧
3. **音频系统完善**：Media Session + 键盘快捷键 + 逐字歌词动画 + 纯音乐识别
4. **留言系统丰富**：多来源聚合、嵌套回复、时间线导航、无限滚动
5. **代码组织规范**：reactive + IIFE 模式统一，utils/hooks 三层架构清晰
6. **动画细节到位**：钟摆、粒子、流星、水波纹、逐字浮现等大量微交互
7. **缓存策略合理**：IndexedDB + 内存两级缓存，Promise 去重，allSettled 容错
8. **开发体验良好**：unplugin-auto-import、Vue DevTools、TypeScript

---

## 12. 问题与改进建议

### 12.1 代码层面

| 问题 | 严重程度 | 建议 |
|------|---------|------|
| **无路由** | 中 | 引入 Vue Router 支持 URL 分享和浏览器前进后退 |
| **`as any` 过多** | 中 | 完善 API 响应类型，消除 `as any` 断言 |
| **noImplicitAny: false** | 中 | 逐步启用，提升类型安全 |
| **滚动逻辑重复** | 低 | 抽离水平滚动惯性逻辑为 composable |
| **PreAbout.vue 空壳** | 低 | 补充内容或删除 |
| **LoginUserUtils.ts 已删除** | 低 | 确认无残留引用（git status 显示 D） |
| **FormDemo.vue 未使用** | 低 | 移除或标记为 Demo 页 |
| **HomuraCorridor.vue 硬编码数据** | 低 | 迁移到数据文件或 API |
| **videoDB.ts 标记删除** | 低 | 确认已完全迁移到 indexedDB.ts |

### 12.2 架构层面

| 问题 | 建议 |
|------|------|
| **无错误边界** | 添加 `onErrorCaptured` 或全局错误处理 |
| **无加载骨架屏** | 留言和视频加载时缺乏过渡 UI |
| **无性能监控** | 添加 Web Vitals 或自定义性能埋点 |
| **移动端体验** | 当前仅锁屏方案，建议做真正的响应式布局 |

### 12.3 工程层面

| 问题 | 建议 |
|------|------|
| **无测试** | 至少添加 API 层单元测试 + 核心组件测试 |
| **无 ESLint** | 引入 ESLint + @typescript-eslint |
| **无 Git Hooks** | 添加 pre-commit（lint + type-check）+ commitlint |
| **无 CHANGELOG** | 引入 changesets 或 standard-version |
| **README 未更新** | 替换 Vite 默认模板内容 |

---

## 13. 风险与债务

### 13.1 技术债务

1. **Gitee API 视频管线**：Gitee API 设计初衷是为代码托管而非视频流服务。每个 .ts 分片单独请求 + base64 解码 + Blob 构造对长视频/多分片场景性能压力大。建议长期考虑自建 CDN 或使用云存储。

2. **无路由**：随着页面增长（焰之回廊等独立页），单靠 Tab 切换将难以维护。

3. **LocalStorage 密码存储**：`Login.vue` 中将密码明文存储在 `useLocalStorage('password', '')`，存在安全风险。

4. **pixi.js 6.x**：PixiJS 已升级到 v8，API 变化较大，未来升级成本高。

5. **qiniu-js beta 版**：使用 `4.0.0-beta.6`，API 可能不稳定。

### 13.2 安全风险

| 风险 | 位置 | 说明 |
|------|------|------|
| **明文密码存储** | `Login.vue:72` | `useLocalStorage('password', '')` |
| **Token 存储** | `useToken.ts` | localStorage 存储 token（XSS 可读） |
| **无 CSP** | `index.html` | 无 Content-Security-Policy |
| **第三方脚本** | `index.html:85-86` | Live2D 脚本来自本地 CDN，但注释中有外部 CDN URL |

### 13.3 可扩展性

| 方面 | 评估 |
|------|------|
| 新增主题 | ✅ 简单：在 themeList 中添加配置即可 |
| 新增留言来源 | ✅ 简单：遵循 Message 接口规范 |
| 新增歌曲 | ✅ 简单：在 songList 中添加 + 上传 .weba 文件 |
| 新增页面 | ⚠️ 需引入路由或扩展 Tab 机制 |
| 多语言 | ❌ 当前所有文案硬编码中文 |

---

## 14. 改进路线图建议

### 短期（1-2 周）

- [ ] 替换 README.md 为项目实际说明
- [ ] 补充 `PreAbout.vue` 内容或移除
- [ ] 移除 FormDemo.vue / HomuraCorridor.vue 或整合到路由
- [ ] 清理 `as any` 类型断言，补充 API 响应类型
- [ ] 引入 ESLint 基础配置

### 中期（1-2 月）

- [ ] 引入 Vue Router（至少支持 3 个路由：主页/留言板/回廊）
- [ ] 移除 LocalStorage 密码存储（改用 httpOnly cookie 或仅内存）
- [ ] 添加核心模块单元测试（videoCache / giteeApi / useAudioPlayer）
- [ ] 视频主题错误状态 UI 完善（当前已有 Loading/Cached/Error，良好）
- [ ] 移动端自适应布局
- [ ] README + 开发文档

### 长期（3-6 月）

- [ ] 视频存储迁移至自有 CDN / OSS（减少 Gitee API 依赖）
- [ ] 性能监控 + 错误追踪（Sentry 等）
- [ ] CI/CD 流水线（GitHub Actions / 自动部署）
- [ ] 暗色模式支持
- [ ] 国际化框架
- [ ] E2E 测试（Playwright / Cypress）

---

## 附录

### A. 依赖清单

**运行时依赖 (18 个)**：vue, pinia, axios, vueuse/core, vueuse/gesture, animejs, crypto-js, dayjs, hls.js, idb, lodash-unified, lyric-parser, @mdi/font, mitt, pixi.js, pixi-live2d-display, qiniu-js, swiper

**开发依赖 (13 个)**：vite, typescript, vue-tsc, @vitejs/plugin-vue, @vitejs/plugin-vue-jsx, less, prettier, unplugin-auto-import, unplugin-vue-components, vite-plugin-vue-devtools, @types/crypto-js, @types/lyric-parser, @types/node, csstype, npm-run-all2

### B. API 端点汇总

| 前缀 | 目标 |
|------|------|
| `/madoka-api` | 主后端 API（认证/留言/用户） |
| `/oss-api` | OSS 签名服务 |
| `/haojiezhe-api` | 第三方数据（madohomu.love 图片/用户） |
| `https://gitee.com/api/v5` | Gitee 代码仓库（视频 M3U8/TS 文件） |

### C. 浏览器兼容性

- 依赖 `backdrop-filter`（Safari 需 `-webkit-` 前缀，已处理）
- 依赖 `corner-shape: superellipse()`（Chrome 实验性功能）
- 依赖 IndexedDB（所有现代浏览器支持）
- Media Session API（Chrome/Edge 支持，Firefox/Safari 部分支持）
- 建议目标浏览器：Chrome 90+, Edge 90+

---

> **总结**：圆焰之庭是一个**技术含量较高、设计用心的个人项目**。在视频缓存管线、音频系统、留言板时间线等方面展现了出色的工程能力。UI 设计高度统一，动画细节丰富。主要改进空间在于：工程规范化（测试/ESLint/CI）、类型安全、安全性（密码存储）、移动端适配和架构演进（引入路由）。整体而言，这是一个**高质量的粉丝向全栈展示项目**。

---
*报告由 Claude Code 生成，基于对全部 ~75 个源文件的完整审查*
