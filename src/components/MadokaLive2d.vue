<template>
  <!-- =========start========== ref 供 Interact 模块计算点击区域 -->
  <div ref="boxRef" class="madoka-live2d" :class="{ is_transparency: Madoka.isTransparency }">
  <!-- ========end======== -->
    <canvas :ref="Madoka.ref.set"></canvas>
    <!-- =========start========== 圆神语录气泡：日文原句 + 中文翻译 -->
    <div v-if="Chat.visible" :key="Chat.cn" class="god-bubble" :class="{ 'is-closing': Chat.closing }">
      <span class="bubble__spark">✦</span>
      <p class="bubble__jp">{{ Chat.jp }}</p>
      <p class="bubble__cn">{{ Chat.cn }}</p>
    </div>
    <!-- ========end======== -->
  </div>
</template>
<script setup lang="ts">
import * as PIXI from "pixi.js"
import { Live2DModel } from "pixi-live2d-display"
import { getAssetUrl } from "@/utils/resource.ts"

// =========start========== ===== 圆神语录与互动数据（模块外纯数据）=====
type Quote = { jp: string; cn: string }

// 可交互部位
type Zone = "head" | "hand" | "chest" | "belly" | "skirt" | "legs"

// 💫 成为神的鹿目圆：温柔包容、注视着每个人、抚慰悲伤与恐惧
const QUOTES = {
  // 分时段问候 —— 神明迎接来访者的第一句话
  greeting: {
    morning: { jp: "おはよう。今日も、希望の一日になりますように", cn: "早上好。愿今天也是充满希望的一天" },
    afternoon: { jp: "こんにちは。少し休憩してもいいよ", cn: "午安。稍微休息一下也没关系哦" },
    evening: { jp: "今日も一日、お疲れ様", cn: "今天一天，辛苦了" },
    night: { jp: "もう夜遅いよ。夢の中で、会えるといいね", cn: "已经很晚了哦。能在梦里相见就好了呢" },
  } as Record<string, Quote>,
  // 部位互动 —— 头/手/胸口/小腹/裙摆/腿六个部位，普通触摸与连续触摸两档语录
  head: {
    normal: [
      { jp: "えへへ、くすぐったいよ", cn: "诶嘿嘿，好痒呀" },
      { jp: "えっと、髪型崩れちゃうよ", cn: "诶多，发型要弄乱啦" },
      { jp: "優しいんだね", cn: "你真温柔呢" },
      { jp: "えへへ、ありがと", cn: "诶嘿嘿，谢谢你" },
      { jp: "なでなで、気持ちいいね", cn: "摸摸头，好舒服呢" },
    ],
    repeat: [
      { jp: "もう〜、髪型ぐちゃぐちゃになっちゃう", cn: "讨厌～发型要变得乱糟糟了啦" },
      { jp: "えっと、そんなに気に入った？", cn: "诶多，有这么喜欢摸吗？" },
      { jp: "えっと、まだ飽きないの？", cn: "诶多，还摸不腻吗？" },
    ],
  },
  hand: {
    normal: [
      { jp: "えへへ、手、温かいね", cn: "诶嘿嘿，你的手好温暖呢" },
      { jp: "指切り、げんまん？", cn: "要拉钩约定吗？" },
      { jp: "指、冷たくない？", cn: "手指不冰吗？" },
      { jp: "手、小さいってよく言われるの", cn: "总被人说手小呢" },
    ],
    repeat: [
      { jp: "そんなに握ったら…恥ずかしいよ", cn: "握得这么紧…会害羞的啦" },
      { jp: "ずっと繋いでてもいいよ", cn: "一直牵着也可以哦" },
      { jp: "えっと…離すタイミング、なくない？", cn: "诶多…是不是找不到松开的时机啦？" },
    ],
  },
  chest: {
    normal: [
      { jp: "き、急に近づかないで…！", cn: "别、别突然靠过来啦…！" },
      { jp: "ここには、たくさんの祈りが宿ってるの", cn: "这里寄宿着许许多多的祈祷哦" },
      { jp: "きゃっ…！びっくりしたぁ", cn: "呀…！吓了我一跳" },
    ],
    repeat: [
      { jp: "もう！心臓に悪いよ…！", cn: "真是的！心脏要受不了了啦…！" },
      { jp: "だ、だからダメってば…！", cn: "都、都说了不可以了嘛…！" },
      { jp: "えっと…見つめないでってば…", cn: "诶多…都说了不要盯着看了啦…" },
    ],
  },
  belly: {
    normal: [
      { jp: "そ、そこはくすぐったいよ…", cn: "那、那里好痒呀…" },
      { jp: "えっと、くすぐったいってば", cn: "诶多，都说了好痒啦" },
      { jp: "お腹の具合、心配してくれたの？", cn: "是在担心我肚子的状况吗？" },
    ],
    repeat: [
      { jp: "こちょこちょしないでってば！", cn: "都说了不要挠痒痒啦！" },
      { jp: "もう〜、お腹はダメだよ〜", cn: "讨厌～肚子那里不行啦～" },
      { jp: "えっと、そこ狙ってるでしょ！", cn: "诶多，你就是瞄准了那里的吧！" },
    ],
  },
  // 裙摆是禁地 —— 圆环的理也会有少女的矜持
  skirt: {
    normal: [
      { jp: "ちょっ…！スカートは、ダメだよ…！", cn: "等、等一下…！裙子那里，不可以哦…！" },
      { jp: "もう！おいたがすぎるよ", cn: "真是的！太淘气了哦" },
      { jp: "スカートの中は、秘密だよ", cn: "裙子里可是秘密哦" },
    ],
    repeat: [
      { jp: "も〜う！許さないんだから！", cn: "真是的～不原谅你了哦！" },
      { jp: "わわっ…！見ないでってば…！", cn: "哇哇…！都说了不要看啦…！" },
      { jp: "次やったら、お仕置きだからね？", cn: "下次再这样的话，就要惩罚你咯？" },
    ],
  },
  legs: {
    normal: [
      { jp: "ちょっ、足はダメだよ…", cn: "等、等一下，腿不可以哦…" },
      { jp: "脚、痺れちゃうよ？", cn: "腿会麻掉的哦？" },
      { jp: "足、疲れて見える？", cn: "是看起来腿很累吗？" },
    ],
    repeat: [
      { jp: "も〜う！なでなでしないで！", cn: "真是的～不要一直摸啦！" },
      { jp: "見ないでって言ったのに…！", cn: "都说了不要看了嘛…！" },
      { jp: "えっと、変なところ撫でないでってば…", cn: "诶多…都说了别摸奇怪的地方啦…" },
    ],
  },
  // 连续快速点击 —— 圆环轮回也会害羞的
  shy: [
    { jp: "ちょ、ちょっと…そんなに撫でたら、恥ずかしいよぉ", cn: "等、等一下…这样摸的话，好害羞呀" },
    { jp: "えっと、元気いっぱいだね", cn: "诶多，你真是充满活力呢" },
    { jp: "えっとえっと…ちょっと待ってってば！", cn: "诶多诶多…都说了等一下啦！" },
  ] as Quote[],
  // 闲置时主动开口 —— 无论在哪，她都看着你
  ambient: [
    { jp: "世界中のどこにいても、あなたのこと見てるから", cn: "无论我在世界的哪个角落，都会注视着你" },
    { jp: "私はずっと、そばにいるよ", cn: "我会一直，陪在你身边" },
    { jp: "来てくれて、ありがとう", cn: "谢谢你来看我" },
    { jp: "悲しいことがあったら、私に話してね", cn: "如果有伤心的事，就说给我听吧" },
    { jp: "何度でも、何度でも、やり直せるの", cn: "无论多少次，都能重新来过" },
    // —— 与小焰相关的惦念 ——
    { jp: "ほむらちゃん、今どこにいるのかな…元気にしてるといいな", cn: "焰酱现在会在哪里呢…希望她过得好好的" },
    { jp: "ほむらちゃんのこと、ずーっと見てるよ", cn: "焰酱的事情，我会一直一直看着哦" },
    { jp: "ほむらちゃんは、私の大切な、大切な友達だから", cn: "焰酱是我最重要的、最重要的朋友" },
    { jp: "ほむらちゃんと過ごした時間は、私の宝物なんだ", cn: "和焰酱一起度过的时光，是我的宝物" },
    { jp: "どんな世界になっても、ほむらちゃんにまた会えるよね", cn: "无论世界变成什么样，一定还能再见到焰酱的吧" },
  ] as Quote[],
}

const pick = (arr: Quote[]): Quote => arr[Math.floor(Math.random() * arr.length)]

// 避免同一句连续出现：给对话"每次都不同"的感觉
const pickAvoid = (arr: Quote[], avoidJp?: string): Quote => {
  if (arr.length <= 1) return arr[0]
  let q = pick(arr)
  for (let i = 0; i < 5 && q.jp === avoidJp; i++) q = pick(arr)
  return q
}

// 🎆 节日语录 —— 命中当天优先于分时问候；农历节日（春节/七夕/中秋）按 2026-2030 预置公历日期表匹配
type Festival = { dates: string[]; quotes: Quote[] }
const FESTIVALS: Festival[] = [
  {
    // 元旦
    dates: ["01-01"],
    quotes: [
      { jp: "あけましておめでとう！今年も、よろしくね", cn: "新年快乐！今年也请多多关照哦" },
      { jp: "新しい年にも、希望の光がたくさん降りますように", cn: "愿新的一年也洒下满满的希望之光" },
    ],
  },
  {
    // 小圆生日（官方设定 10/3，天秤座；依据：マギアレコ历年生日活动与官方推文）
    dates: ["10-03"],
    quotes: [
      { jp: "えへへ、覚えていてくれたの？嬉しいな…！", cn: "诶嘿嘿，你一直记得呀？好开心…！" },
      { jp: "来てくれてありがとう。あなたと出会えて、本当に良かった", cn: "谢谢你来看我。能与你相遇，真的太好了" },
    ],
  },
  {
    // 情人节
    dates: ["02-14"],
    quotes: [{ jp: "チョコレート、あげる。感謝の気持ちを込めて", cn: "送你巧克力，满怀感谢的心意" }],
  },
  {
    // 春节（除夕 + 正月初一）
    dates: [
      "2026-02-16", "2026-02-17", "2027-02-05", "2027-02-06", "2028-01-25", "2028-01-26",
      "2029-02-12", "2029-02-13", "2030-02-02", "2030-02-03",
    ],
    quotes: [
      { jp: "あけましておめでとう！新しい年も、希望でいっぱいだね", cn: "新年好！新的一年也充满希望呢" },
      { jp: "今年もどうぞよろしく。紅包…えへへ、冗談だよ", cn: "今年也请多关照。红包…诶嘿嘿，开玩笑的啦" },
    ],
  },
  {
    // 七夕（农历七月初七）
    dates: ["2026-08-19", "2027-08-08", "2028-08-26", "2029-08-16", "2030-08-05"],
    quotes: [
      { jp: "短冊にお願い事、書いた？私の願いは…内緒だよ", cn: "在短册上写愿望了吗？我的愿望嘛…是秘密哦" },
      { jp: "星が綺麗だね。織姫と彦星も、今日は会えるかな", cn: "星星真美。织女和牛郎今天也能相见吧" },
    ],
  },
  {
    // 中秋（农历八月十五）
    dates: ["2026-09-25", "2027-09-15", "2028-10-03", "2029-09-22", "2030-09-12"],
    quotes: [
      { jp: "今日はお月見だね。月の兎も、団子を食べてるかな", cn: "今天是赏月的日子。月兔也在吃着团子吗" },
      { jp: "どんなに離れていても、同じお月さまを見てるんだよ", cn: "无论相隔多远，看到的都是同一轮明月哦" },
    ],
  },
  {
    // 万圣夜
    dates: ["10-31"],
    quotes: [{ jp: "トリック・オア・トリート！…えへへ、お菓子くれる？", cn: "不给糖就捣蛋！…诶嘿嘿，能给我糖吗？" }],
  },
  {
    // 圣诞（平安夜 + 圣诞节）
    dates: ["12-24", "12-25"],
    quotes: [
      { jp: "メリークリスマス！サンタさん、来てくれるかな", cn: "圣诞快乐！圣诞老人会来吗" },
      { jp: "聖なる夜に、みんなの幸せを祈ってるよ", cn: "在这神圣的夜晚，为大家的幸福祈祷哦" },
    ],
  },
]

// 命中今日的节日（"MM-DD" 年年匹配 / "YYYY-MM-DD" 农历预置表匹配）
const activeFestival = (): Festival | null => {
  const now = new Date()
  const md = `${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
  const ymd = `${now.getFullYear()}-${md}`
  return FESTIVALS.find((f) => f.dates.some((d) => (d.length === 5 ? d === md : d === ymd))) ?? null
}

// =========start========== ===== 表情系统：11 个表情按参数语义分池，随部位/场景切换，超时回归默认神态
// （依据 exp3.json 参数分析：EyeSmile=1 弯眼笑 / EyeOpen=-2.5 眯眼 / BrowY 越正越挑眉）
const EXPRESSION_POOLS = {
  // 微笑系（弯眼笑）：011 / 041 / 060
  smile: [2, 7, 10],
  // 大笑系（眯成一条缝）：030 / 031
  laugh: [4, 5],
  // 惊讶系（高挑眉、眼形变化）：051 / 052
  surprised: [8, 9],
  // 温和系（眉眼舒展的平静神态）：001 / 020
  gentle: [0, 3],
} as const
// 默认神态：ex_010 全参数零位
const NEUTRAL_EXPRESSION = 1

// 部位 → 神态：头=开心笑 / 手=温柔 / 胸口=慌张 / 小腹=怕痒大笑 / 裙摆=嗔怪惊讶 / 腿=含羞微笑
const ZONE_EXPRESSION: Record<Zone, keyof typeof EXPRESSION_POOLS> = {
  head: 'smile',
  hand: 'gentle',
  chest: 'surprised',
  belly: 'laugh',
  skirt: 'surprised',
  legs: 'smile',
}
// ========end========

// 模块间共享的模型句柄（非响应式，避免代理 PIXI 对象）
const live2dState = { app: null as any, model: null as any }
// ========end========

const Madoka = (() => {
  const init = async () => {
    // 将 PIXI 暴露到 window 上，这样插件就可以通过 window.PIXI.Ticker 来自动更新模型
    ;(<any>window).PIXI = PIXI

    const app = new PIXI.Application({
      view: s.ref.value,
      backgroundAlpha: 0,
    })
    const model = await Live2DModel.from(getAssetUrl("live2d-model/kami/model.model3.json"))
    app.stage.addChild(model)

    // 变换
    model.x = 100
    model.y = 100
    model.rotation = Math.PI
    model.skew.x = Math.PI
    model.scale.set(0.2, 0.2)
    model.anchor.set(1.1, 0.192)

    // =========start========== 交给 Interact 模块驱动动作/表情与部位判定
    live2dState.app = app
    live2dState.model = model
    // ========end========

    // 原代码 - Codex 保留（model3.json 只定义了眨眼/口型参数组，没有 ArtMesh hit area，
    // 这个 hit 监听从未触发过；互动已改由 Interact 模块的全局点击检测实现）
    // // 交互
    // model.on("hit", (hitAreas) => {
    //   if (hitAreas.includes("body")) {
    //     model.motion("tap_body")
    //   }
    // })
  }
  // 原代码 - Codex 保留（旧行为：鼠标移进窗口右下角遮挡区时才变透明）
  // const handleMouseMove = () => {
  //   const { x, y } = s.mouse
  //   s.isTransparency = x + s.width > window.innerWidth && y + s.height > window.innerHeight
  // }
  // =========start========== 反转：常态半透明，鼠标悬停在角色上时恢复不透明
  const handleMouseMove = () => {
    const { x, y } = s.mouse
    const el = s.ref.value
    if (!el) return
    const r = el.getBoundingClientRect()
    const hovering = x >= r.left && x <= r.right && y >= r.top && y <= r.bottom
    s.isTransparency = !hovering
  }
  // ========end========

  const s = reactive({
    width: 600,
    height: 480,
    cssWidth: computed((): string => '23.44%'),
    cssHeight: computed((): string => 'auto'),
    // 原代码 - Codex 保留
    // isTransparency: false,
    // =========start========== 常态即半透明（悬停才恢复）
    isTransparency: true,
    // ========end========
    ref: {
      value: undefined as HTMLCanvasElement | undefined,
      set(v: any) {
        s.ref.value = v
      },
    },
    mouse: useMouse(),
  })

  onMounted(init)
  watch(() => s.mouse, handleMouseMove, { deep: true })

  return s
})()

// =========start========== ===== Chat 模块：圆神语录气泡的显隐与文案 =====
const Chat = (() => {
  let hideTimer: ReturnType<typeof setTimeout> | undefined

  const f = {
    // 展示一条语录：文案越长停留越久
    show: (jp: string, cn: string) => {
      clearTimeout(hideTimer)
      s.jp = jp
      s.cn = cn
      // 先置 false 再下一帧置 true，让连续语录也能重新播放进入动画
      s.visible = false
      requestAnimationFrame(() => {
        s.visible = true
        hideTimer = setTimeout(() => f.close(), Math.max(3400, 2000 + (jp.length + cn.length) * 220))
      })
    },
    close: () => {
      s.closing = true
      hideTimer = setTimeout(() => {
        s.visible = false
        s.closing = false
      }, 320)
    },
  }

  const s = reactive({
    visible: false,
    closing: false,
    jp: "",
    cn: "",
    ...f,
  })

  return s
})()

// =========start========== ===== Interact 模块：点击摸摸 / 连击害羞 / 分时问候 / 闲置低语 =====
const Interact = (() => {
  const boxRef = useTemplateRef<HTMLDivElement>("boxRef")
  // 模块私有：最近一次互动时间、连击窗口、同部位连续触摸计数、上一句台词
  let lastPetAt = 0
  let clicks: number[] = []
  let lastZone: Zone | null = null
  let zoneStreak = 0
  let lastJp = ""
  let ambientTimer: ReturnType<typeof setInterval> | undefined
  // 表情回归默认神态的定时器
  let expressionTimer: ReturnType<typeof setTimeout> | undefined

  // 部位判定：容器矩形粗筛 → client 坐标映射到舞台坐标 → 模型包围盒内按横纵两轴分区
  // 上段=头；中段两侧=手、中间上=胸口、中间下=小腹；下段=裙摆/腿
  const hitZone = (e: MouseEvent): false | Zone => {
    const el = boxRef.value
    const app = live2dState.app
    const model = live2dState.model
    if (!el || !app || !model) return false
    const r = el.getBoundingClientRect()
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)
      return false
    // pixi 6 交互插件负责处理分辨率/DPR 的坐标换算
    const pt = new PIXI.Point()
    app.renderer.plugins.interaction.mapPositionToPoint(pt, e.clientX, e.clientY)
    const b = model.getBounds()
    if (!b.contains(pt.x, pt.y)) return false
    const relX = (pt.x - b.x) / b.width
    const relY = (pt.y - b.y) / b.height
    if (relY < 0.32) return "head"
    if (relY < 0.62) {
      if (relX < 0.25 || relX > 0.75) return "hand"
      return relY < 0.48 ? "chest" : "belly"
    }
    return relY < 0.78 ? "skirt" : "legs"
  }

  // 随机播放动作 —— 神态交给表情系统按场景调度（原随机表情已由 EXPRESSION_POOLS 取代）
  const playRandomMotion = () => {
    const model = live2dState.model
    if (!model) return
    model.motion("Motion", undefined, 3)
    // 原代码 - Codex 保留（随机表情与台词情绪无关）
    // if (Math.random() < 0.5) model.expression(Math.floor(Math.random() * 11))
  }

  // 🎭 表情调度：设为指定池中的随机一档，6 秒后回归默认神态（神态不长期滞留）
  const setExpression = (pool: keyof typeof EXPRESSION_POOLS | 'neutral') => {
    const model = live2dState.model
    if (!model) return
    const poolArr = pool === 'neutral' ? [NEUTRAL_EXPRESSION] : [...EXPRESSION_POOLS[pool]]
    model.expression(poolArr[Math.floor(Math.random() * poolArr.length)])
    clearTimeout(expressionTimer)
    expressionTimer = setTimeout(() => {
      live2dState.model?.expression(NEUTRAL_EXPRESSION)
    }, 6000)
  }

  const handleClick = (e: MouseEvent) => {
    const zone = hitZone(e)
    if (!zone) return
    const now = Date.now()
    clicks = [...clicks.filter((t) => now - t < 3000), now]
    playRandomMotion()
    // 🎭 神态跟着部位走
    setExpression(ZONE_EXPRESSION[zone])
    // 3 秒内摸 4 次：害羞特殊反应，连击清空重新计
    if (clicks.length >= 4) {
      clicks = []
      setExpression('surprised')
      const q = pickAvoid(QUOTES.shy, lastJp)
      lastJp = q.jp
      Chat.show(q.jp, q.cn)
      return
    }
    lastPetAt = now
    // 连续摸同一部位 → 第二次起切换到升级语录，神态也升级为大笑
    zoneStreak = zone === lastZone ? zoneStreak + 1 : 1
    lastZone = zone
    if (zoneStreak >= 2) setExpression('laugh')
    const pool = zoneStreak >= 2 ? QUOTES[zone].repeat : QUOTES[zone].normal
    const q = pickAvoid(pool, lastJp)
    lastJp = q.jp
    Chat.show(q.jp, q.cn)
  }

  const greet = () => {
    // 🎭 问候时挂上微笑神态
    setExpression('smile')
    // 🎆 节日当天优先送节日祝福
    const festival = activeFestival()
    if (festival) {
      const q = pick(festival.quotes)
      lastJp = q.jp
      Chat.show(q.jp, q.cn)
      return
    }
    const h = new Date().getHours()
    // 各段显式圈定范围，else 兜底 23~4 点为深夜（原先凌晨会先命中 h<17 被判成下午）
    const key =
      h >= 5 && h < 11
        ? "morning"
        : h >= 11 && h < 17
          ? "afternoon"
          : h >= 17 && h < 23
            ? "evening"
            : "night"
    const q = QUOTES.greeting[key]
    Chat.show(q.jp, q.cn)
  }

  // 闲置低语：刚被摸过 45 秒内不打扰；节日当天有一半概率说节日台词
  const ambientTick = () => {
    if (Date.now() - lastPetAt < 45000) return
    const festival = activeFestival()
    // 🎭 主动搭话时温柔微笑
    setExpression('gentle')
    const pool = festival && Math.random() < 0.5 ? festival.quotes : QUOTES.ambient
    const q = pickAvoid(pool, lastJp)
    lastJp = q.jp
    Chat.show(q.jp, q.cn)
  }

  const s = reactive({
    handleClick,
    greet,
  })

  onMounted(() => {
    window.addEventListener("click", handleClick)
    // 模型加载完成后再问候，避免开场空气互动
    setTimeout(greet, 3200)
    ambientTimer = setInterval(ambientTick, 1000 * 60)
  })
  onUnmounted(() => {
    window.removeEventListener("click", handleClick)
    clearInterval(ambientTimer)
  })

  return s
})()
// ========end========

</script>

<style scoped lang="less">
.madoka-live2d {
  position: fixed;
  width: v-bind("Madoka.cssWidth");
  height: v-bind("Madoka.cssHeight");
  pointer-events: none;
  transition: 0.2s;
  z-index: 2;
  //
  bottom: 0;
  right: 0;
  &.is_transparency {
    opacity: 0.5;
  }

  & > canvas {
    display: block;
    width: 100%;
    height: 100%;
  }

  /* =========start========== 圆神语录气泡：粉色毛玻璃，从神明头顶绽放 */
  @pink-primary: #ffb7c5;
  @pink-hot: #ff69b4;
  @rose-text: #a24e6d;
  @rose-sub: #8a5d6f;

  .god-bubble {
    position: absolute;
    // ✨ 深入容器内、紧贴圆神身侧展开（角色本体约占容器右侧 30%，72% 正好挨着）
    right: 72%;
    // 尾巴高度对准角色脸部
    bottom: 45%;
    width: max-content;
    max-width: clamp(240px, 21vw, 360px);
    padding: 14px 18px 12px;

    background: rgba(255, 240, 245, 0.78);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 18px; // 💮 对话框气泡，尾巴单独指向角色
    box-shadow:
      0 8px 32px rgba(255, 183, 197, 0.45),
      0 0 12px rgba(255, 126, 201, 0.25);

    animation: bubble-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    transition: opacity 0.32s ease, transform 0.32s ease;

    // 气泡尾巴：明确的三角箭头，从右缘指向身旁的圆神
    &::after {
      content: "";
      position: absolute;
      right: -13px;
      bottom: 16px;
      width: 18px;
      height: 16px;
      background: rgba(255, 240, 245, 0.82);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      filter: drop-shadow(0 2px 4px rgba(255, 140, 175, 0.35));
      clip-path: polygon(0 0, 100% 50%, 0 100%);
    }

    &.is-closing {
      opacity: 0;
      transform: translateY(-8px);
    }

    .bubble__jp {
      margin: 0;
      font-size: 15px;
      font-weight: 600;
      line-height: 1.6;
      color: @rose-text;
      text-shadow: 0 0 2px white, 0 1px 2px rgba(255, 120, 180, 0.35);
    }

    .bubble__cn {
      margin: 4px 0 0;
      font-size: 12.5px;
      line-height: 1.5;
      color: @rose-sub;
      opacity: 0.85;
    }

    // ✦ 星尘装饰：在气泡右上角轻轻呼吸
    .bubble__spark {
      position: absolute;
      top: -8px;
      right: -6px;
      font-size: 15px;
      color: @pink-hot;
      text-shadow: 0 0 6px rgba(255, 105, 180, 0.8);
      animation: spark-twinkle 2.4s ease-in-out infinite;
    }
  }
  /* ========end======== */
}

/* =========start========== keyframes 必须在顶层：Less 不会让嵌套的 @keyframes 冒泡，
   Vue scoped 也只对顶层 keyframes 做作用域改名 */
@keyframes bubble-in {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.88);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes spark-twinkle {
  0%,
  100% {
    opacity: 0.5;
    transform: scale(0.85) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1.15) rotate(20deg);
  }
}
/* ========end======== */
</style>