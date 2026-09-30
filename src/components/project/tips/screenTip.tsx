import
// =========start========== i18n
import i18n from '@/i18n'
// ========end======== { useModal } from "@madoka520/vue-ui"
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
          <p>{i18n.global.t('tips.p1')}</p>
          <p>{i18n.global.t('tips.p2')}</p>
          <p>{i18n.global.t('tips.p3')}</p>
          <p>{i18n.global.t('tips.p4')}</p>
          <p>{i18n.global.t('tips.p5')}</p>
        </div>

        {/* 底部说明 */}
        <footer
          style={{
            fontSize: "12px",
            opacity: 0.65,
            lineHeight: "1.6",
          }}
        >
          <div>{i18n.global.t('tips.browser')}</div>
          <div>{i18n.global.t('tips.noIos')}</div>
        </footer>
      </div>
    ),
    onOk: () => {
      const player = useAudioPlayer()
      if (player.playing) return
      player.play()
    },
  })
