<template>
  <div class="home">
    <div
      class="content"
      :class="{
        'filter': showMusicScore || hasDialogOpended,
        'transform-scale': showMusicScore
      }">
      <!-- menu -->
      <div class="menu-wrapper">
        <i
          v-if="isMobile && isSupportWakeLock" class="iconfont icon-changlliang"
          :class="{ 'is-wake-lock' :isWakeLock }"
          title="常亮模式" @click="toggleLightMode">
        </i>
        <i v-if="!isMobile && isSupportImmersionMode" title="沉浸模式（不会有按键冲突）" class="iconfont icon-chenjin" @click="toggleImmersionMode"></i>
        <i class="iconfont icon-keyboard" title="按键设置" @click="openKeyboardMenu"></i>
        <!-- <i v-show="!isMobile" class="iconfont icon-yinxiao" title="音色设置" @click="openTimbreMenu"></i> -->
        <i class="iconfont icon-yinxiao" title="乐器设置" @click="openInstrumentMenu"></i>
        <i class="iconfont icon-question" title="使用须知" @click="openAboutUse"></i>
      </div>
      <!-- bg -->
      <div class="bg-img" :class="{ 'bg-img__mobile': isMobile }"></div>
      <!-- video -->
      <video
        class="video-box" :class="{ 'video-box__mobile': isMobile }"
        autoplay loop muted>
        <source src="https://static.web.sdo.com/jijiamobile/pic/ff14/ffweb850/20210401vid.mp4?123" type="video/mp4">
      </video>
      <!-- 键盘 -->
      <keyboard v-show="!isMobile" @sing="sing" @silent="silent" @silentAll="silentAll"></keyboard>
      <!-- 页脚 -->
      <footer class="footer">
        <p>
          Produced by <span style="color: #c7a2e8;">妙蛤种子@琥珀原</span>
        </p>
        <span
          v-if="!isMobile" style="color: #cfcfcf; cursor: pointer;" :style="{ opacity: showTip ? '1' : '0' }"
          @click="showTip = !showTip">
          可以选择乐器辣，如果出现Bug记得告诉我哦(๑•̀ㅂ•́)و✧
        </span>
        <p>
          Made with <span style="color: #e91e63;">❤</span>
        </p>
      </footer>
    </div>
    <!-- 按键设置 -->
    <keyboard-menu></keyboard-menu>
    <!-- 音色设置 -->
    <!-- <timbre-menu></timbre-menu> -->
    <!-- 乐器选择 -->
    <instrument-menu></instrument-menu>
    <!-- 使用须知 -->
    <about-use></about-use>
    <!-- 乐谱选择 -->
    <music-score :filter="hasDialogOpended"></music-score>
  </div>
</template>

<script>
import Music from '@/utils/Music'
import Keyboard from './keyboard/Keyboard'
import KeyboardMenu from './keyboardmenu/KeyboardMenu'
// import TimbreMenu from './timbreMenu/TimbreMenu'
import InstrumentMenu from './instrumentMenu/InstrumentMenu'
import MusicScore from './musicScore/MusicScore'
import AboutUse from './aboutUse/AboutUse'

const musician = new Music()

let wakeLock = null

export default {
  name: 'Home',
  components: {
    Keyboard,
    KeyboardMenu,
    // TimbreMenu,
    InstrumentMenu,
    MusicScore,
    AboutUse
  },
  data() {
    return {
      showTip: true,
      // 常亮模式
      isSupportWakeLock: false,
      isWakeLock: false,
      // 沉浸模式
      isSupportImmersionMode: false,
      isImmersionMode: false
    }
  },
  computed: {
    isMobile() {
      return this.$store.getters.isMobile
    },
    showMusicScore() {
      return this.$store.getters.showMusicScore
    },
    hasDialogOpended() {
      return this.$store.getters.showKeyboardMenu ||
        this.$store.getters.showInstrumentMenu ||
        this.$store.getters.showAboutUse
    }
  },
  created() {
    if ('wakeLock' in navigator) {
      this.isSupportWakeLock = true
    }
    if ('keyboard' in navigator) {
      this.isSupportImmersionMode = true
    }
    document.addEventListener('fullscreenchange', e => {
      if (!document.fullscreenElement) {
        this.isImmersionMode = false
      }
    })
  },
  methods: {
    sing(note) {
      musician.sing(note)
    },
    silent(note) {
      musician.silent(note)
    },
    silentAll() {
      musician.silentAll()
    },
    openKeyboardMenu() {
      this.$store.dispatch('keyboard/toggleShowKeyboardMenu')
    },
    // openTimbreMenu() {
    //   this.$store.dispatch('timbre/toggleShowTimbreMenu')
    // },
    openInstrumentMenu() {
      this.$store.dispatch('app/toggleInstrumentMenu')
    },
    openAboutUse() {
      this.$store.dispatch('app/toggleAboutUse')
    },
    toggleLightMode() {
      if (this.isWakeLock) {
        wakeLock.release()
        this.isWakeLock = false
      } else {
        navigator.wakeLock.request('screen').then(res => {
          wakeLock = res
          this.isWakeLock = true
        })
      }
    },
    async toggleImmersionMode() {
      if (this.isImmersionMode) {
        this.isImmersionMode = false
      } else {
        try {
          await document.documentElement.requestFullscreen()
          await navigator.keyboard.lock()
          this.isImmersionMode = true
        } catch (err) {
          console.log(err)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
  .content {
    height: 100%;
    transition: transform 0.3s 0.1s, filter 0.1s, ease 0.25s;
    will-change: filter;
    // -webkit-backface-visibility: hidden;
  }
  .filter {
    filter: blur(5px);
    pointer-events: none;
  }
  .transform-scale {
    transform: scale(0.9, 0.9);
  }
}

.menu-wrapper {
  position: absolute;
  right: 2%;
  top: 4%;
  display: flex;
  align-items: center;
  z-index: 9;
  .iconfont {
    font-size: 24px;
    color: #ccc;
    margin-left: 10px;
    transition: all 0.3s;
    cursor: pointer;
    &:hover {
      color: #fff;
      transform: scale(1.2);
    }
  }
  .icon-changlliang {
    color: #555;
    &:hover {
      color: #555;
      transform: scale(1);
    }
  }
  .icon-chenjin {
    font-size: 22px;
  }
  .is-wake-lock {
    color: #ffc107 !important;
  }
}

.bg-img {
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 180px;
  background-size: auto 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(https://static.web.sdo.com/jijiamobile/pic/ff14/191010shismages/M3aprHHlg5_hV72kWPhGQLv4eM.png);
  opacity: 0.7;
}

.video-box {
  position: absolute;
  width: 100%;
  top: 0;
  max-height: 50vw;
  min-height: calc(100% - 180px);
  object-fit: cover;
}

.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  font-size: 12px;
  line-height: 12px;
  color: #ccc;
}

/* mobile */
// .bg-img__mobile {
//   bottom: 0;
//   background-size: 100% auto;
// }
.version-tip__mobile {
  position: absolute;
  bottom: 100%;
  right: 10px;
}
.video-box__mobile {
  min-height: 100%;
}
</style>
