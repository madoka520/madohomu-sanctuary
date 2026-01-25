import useModal from "@/components/useModal.tsx"
import useAudioPlayer from "@/hooks/useAudioPlayer.ts"

export default () =>
  useModal.info({
    content: (
      <div
        style={{
          width: "520px",
          minHeight: "420px",
          padding: "32px 36px 24px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          userSelect: "none",
        }}
      >
        {/* 主文案 */}
        <div
          style={{
            lineHeight: "1.8",
            fontSize: "15px",
          }}
        >
          <p>喜欢魔圆的小伙伴们，很高兴认识大家。</p>
          <p>这里是「圆焰之庭」。</p>
          <p>一个为&lt;圆焰圆&gt;厨准备的小小角落。</p>
          <p>可以在这里分享心情，</p>
          <p>也可以认识彼此。</p>
        </div>

        {/* 底部说明 */}
        <footer
          style={{
            fontSize: "12px",
            opacity: 0.65,
            lineHeight: "1.6",
          }}
        >
          <div>推荐使用 Chrome 浏览器访问</div>
          <div>当前暂不支持移动端</div>
        </footer>
      </div>
    ),
    onOk: () => {
      const player = useAudioPlayer()
      if (player.playing) return
      player.play()
    },
  })
