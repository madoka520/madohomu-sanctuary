<template>
  <div class="mini-player" style="">
    <Swiper
      :slides-per-view="1"
      :initial-slide="audioPlayer.randomList[audioPlayer.current]"
      @slideChange="onSlideChange"
      prevent-clicks
      prevent-clicks-propagation
      @click="Dialog.open('preAudioPlayerUi')"
      @swiper="onSwiper"
    >
      <!-- 歌单 -->
      <!--    <span class="mdi mdi-playlist-play control-btn"></span>-->
      <madoka-dialog
        v-model="Dialog.preAudioPlayerUi.opened"
        title=""
        height="400px"
        width="600px"
        :footer="false"
      >
        <pre-audio-player-ui />
      </madoka-dialog>
      <SwiperSlide
        v-for="(randomIndex, index) in audioPlayer.randomList"
        :key="index"
      >
        <div class="mini-slide">
          <img
            :src="
              getImgUrl(
                `/covers/${audioPlayer.songList[randomIndex].title}.webp`,
              )
            "
            class="cover"
            alt=""
          />
          <div class="info">
            <div class="title">
              {{ audioPlayer.songList[randomIndex].title }}
            </div>
            <div class="artist">
              {{ audioPlayer.songList[randomIndex].artist }}
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
    <!-- 播放 / 暂停 -->
    <span
      class="mdi control-btn play-btn"
      :class="audioPlayer.playing ? 'mdi-pause-circle' : 'mdi-play-circle'"
      @click.stop="onToggle"
    ></span>
  </div>
</template>

<script setup lang="ts">
import useAudioPlayer from '@/hooks/useAudioPlayer.ts'
import { getImgUrl } from '@/utils/resource.ts'
import MadokaDialog from '@/components/MadokaDialog.vue'
import PreAudioPlayerUi from '@/components/project/pre-audio-player-ui/Index.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
const swiperRef = ref<any>(null)

const onSwiper = (swiper: any) => {
  swiperRef.value = swiper
}
defineOptions({
  name: 'MadokaMiniPlayer',
})
const audioPlayer = useAudioPlayer()
const onSlideChange = (swiper: any) => {
  const currentSlideIndex = audioPlayer.randomList.indexOf(audioPlayer.current)
  if (swiper.activeIndex === currentSlideIndex) return
  audioPlayer[swiper.swipeDirection]?.()
}

const Dialog = (() => {
  const open = (name: string, e?: Event) => {
    switch (name) {
      case 'preAudioPlayerUi': {
      }
    }
    s[name].opened = true
  }
  const s = reactive({
    preAudioPlayerUi: {
      opened: false,
    },
    open,
  })
  return s
})()
/* 点击 */
const onToggle = () => {
  if (audioPlayer.playing) {
    audioPlayer.pause()
    return
  }
  audioPlayer.resume()
}

const Root = (() => {
  const setWatcher = () => {
    watch(
      () => audioPlayer.current,
      (v) => {
        const index = audioPlayer.randomList.indexOf(v)
        swiperRef.value.slideTo(index, 0)
      },
      { immediate: true },
    )
  }
  const s = reactive({})

  onMounted(() => {
    setWatcher()
  })
  return s
})()
</script>

<style scoped lang="less">
.mini-player {
  padding-right: 50px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 24px; // LR_小さな狐の妖精: 统一大圆角设计
  position: relative;
  width: 300px;
  margin-left: auto;
  /* LR_小さな狐の妖精: 添加上下间距 */
  margin-top: 6px;
  margin-bottom: 6px;
  display: flex; // 使用 Flex 布局
  align-items: center; // 垂直居中
  overflow: hidden; // 确保内部滑动不会超出圆角
}
.swiper {
  flex: 1; // 自动占据除去按钮以外的所有空间
  min-width: 0; // 必须加这个，否则 flex 容器内的文字截断会失效
  height: 48px;
}
.mini-slide {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 10px;
  height: 48px;
  user-select: none;
  cursor: default;
  transition: transform 0.3s ease;
}

/* 封面 */
.cover {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

/* 歌曲信息 */
.info {
  flex: 1;
  overflow: hidden;
}

.title {
  font-size: 14px;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.artist {
  font-size: 14px;
  opacity: 0.7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 按钮 */
.control-btn {
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
  user-select: none;
  color: pink;

  transition:
    transform 0.15s ease,
    opacity 0.15s ease;
}

.control-btn:hover {
  transform: scale(1.1);
  opacity: 0.85;
}

.play-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  font-size: 32px;
  color: pink;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    opacity 0.15s ease;

  &:hover {
    transform: translateY(-50%) scale(1.1);
    opacity: 0.85;
  }
}
</style>
