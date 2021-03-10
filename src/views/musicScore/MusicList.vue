<template>
  <div>
    <transition name="list-fade">
      <div v-show="showMusicScore" class="score-body" @scroll="handleScroll">
        <div v-for="i in 5" :key="`${i}-up`" class="space"></div>
        <div
          v-for="(item, i) in musicList" :key="i"
          class="song" :class="{ 'selected-song': selectedIndex === i }"
          @click="handleMusicSelect(item, i)">
          <span class="song-name">{{ item.name }}</span>
          <span class="song-auth">By: <span style="color: #3f51b5;">{{ item.auth }}</span></span>
        </div>
        <div v-for="i in 5" :key="`${i}-down`" class="space"></div>
      </div>
    </transition>
    <transition name="model-fade">
      <div v-show="showMusicScore" class="model" @click="toggleMusicScore"></div>
    </transition>
  </div>
</template>

<script>
let scrollBodyDom = null
let childrenDoms = []
const itemHeight = 64

// const SONG_LIST = require.context('../../../public/mids', false, /\.mid$/).keys().map(v => v.slice(2, -4))
const SONG_LIST = [
  { name: 'tomorrow and tomorrow', auth: 'QWQPOI' },
  { name: '勾指起誓', auth: 'QWQPOI' },
  { name: '陆行鸟之歌', auth: 'QWQPOI' },
  { name: '植物大战僵尸', auth: 'QWQPOI' },
  { name: 'il vento doro', auth: 'QWQPOI' },
  { name: '克罗地亚狂想曲', auth: '顾长歌' },
  { name: '喀秋莎', auth: '顾长歌' },
  { name: '希望之花', auth: '66189118' },
  { name: '青鸟', auth: '66189118' },
  { name: '千本樱', auth: 'yuancho' },
  { name: '5.0蛮神 妖灵王', auth: 'zhou364394799' },
  { name: 'Deja vu 头文字D', auth: '试作型红茶' },
  { name: 'dragon song', auth: 'gohiey' },
  { name: '悠久之风', auth: '蛙石' },
  { name: '斗地主', auth: 'freeizng影子' },
  { name: '热烈的决斗者', auth: '海边的吉卜力' },
  { name: '白金ディスコ', auth: 'unjason' },
  { name: '黑人抬棺', auth: '六芒_龙' },
  { name: '天晴大鲶音头', auth: '5uwu' },
  { name: '猪八戒背媳妇', auth: '北川上の樱子' }
]

export default {
  data() {
    return {
      selectedIndex: -1,
      musicList: SONG_LIST
      // Array.from({ length: 30 }).map((v, i) => {
      //   let name = ''
      //   const index = i % SONG_LIST.length
      //   name = SONG_LIST[index]
      //   return { name: `${name}-${i}`, source: name }
      // }),
    }
  },
  computed: {
    showMusicScore() {
      return this.$store.getters.showMusicScore
    },
    selectedMusicName() {
      return this.selectedIndex === -1 ? '' : this.musicList[this.selectedIndex].name
    }
  },
  watch: {
    showMusicScore() {
      this.$nextTick(() => {
        scrollBodyDom.scrollTo({
          top: this.selectedIndex === -1 ? 5 * itemHeight : (this.selectedIndex + 5) * itemHeight - scrollBodyDom.offsetHeight / 2,
          behavior: 'smooth'
        })
      })
    }
  },
  mounted() {
    scrollBodyDom = this.$el.querySelector('.score-body')
    childrenDoms = scrollBodyDom.children
  },
  methods: {
    toggleMusicScore() {
      this.$store.dispatch('app/toggleMusicScore')
    },
    handleMusicSelect(item, i) {
      this.toggleMusicScore()
      this.selectedIndex = i
      this.$emit('handleMusicSelect', item)
    },
    handleScroll() {
      const scrollTop = scrollBodyDom.scrollTop
      const offsetHeight = scrollBodyDom.offsetHeight
      const startIndex = Math.floor(scrollTop / itemHeight)
      const endIndex = Math.floor((scrollTop + offsetHeight) / itemHeight)
      for (let i = startIndex; i <= endIndex; i++) {
        const child = childrenDoms[i]
        if (child) {
          const n = 1 - Math.abs((child.offsetTop - scrollTop) / offsetHeight - 0.5) * 0.5
          // 不设置 scaleZ, 避免过多合成层
          child.style.transform = `scaleX(${n}) scaleY(${n})` // `scale3d(${n}, ${n}, 1)`
          child.style.opacity = n
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.model-fade-enter-active { transition: opacity 0.5s; }
.model-fade-leave-active { transition: opacity 0.2s; }
.model-fade-enter,
.model-fade-leave-to {
  opacity: 0;
}

.list-fade-enter-active { transition: transform 0.5s; }
.list-fade-leave-active { transition: transform 0.3s; }
.list-fade-enter,
.list-fade-leave-to {
  transform: translateX(-100%);
}

.score-body {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  min-width: 200px;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  transform-origin: left;
  // transform: translateZ(0);
  z-index: 99;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
  .space {
    height: 60px;
    flex-shrink: 0;
  }
  .song {
    position: relative;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    height: 65px;
    padding: 15px 10px 24px 10px;
    margin: 2px 0;
    background-color: #ecf0ff;
    border-bottom: 1px solid #eee;
    border-radius: 10px;
    transition: box-shadow 0.3s;
    cursor: pointer;
    &:hover {
      box-shadow: 0 0 20px 0 #03a9f4;
    }
    &:last-of-type {
      border-bottom: 0;
    }
    .song-name {
      color: #673ab7;
      font-weight: bold;
    }
    .song-auth {
      position: absolute;
      right: 5px;
      bottom: 5px;
      font-size: 14px;
    }
  }
  .selected-song {
    box-shadow: 0 0 20px 0 #03a9f4;
  }
}

.model {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 20px 0 #505050;
  z-index: 9;
}
</style>
