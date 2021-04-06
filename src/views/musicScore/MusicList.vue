<template>
  <div>
    <transition name="list-fade">
      <div v-show="showMusicScore" class="song-wrapper" @click="toggleMusicScore">
        <div
          v-for="(item, i) in musicList" :key="i"
          class="song" :class="{ 'selected-song': selectedIndex === i, 'song__mobile': isMobile }"
          @click.stop="handleMusicSelect(item, i)">
          <span class="song-name">{{ item.name }}</span>
          <div class="song-footer">
            <div class="star-wrapper">
              <span v-for="(star, j) in item.star" :key="j">
                <svg
                  class="star-icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="200" height="200">
                  <path d="M918.016 478.208c16.896-18.432 22.528-43.52 14.848-67.584-7.68-24.064-27.136-40.96-51.712-45.568l-197.632-38.912c-5.632-1.024-10.752-4.608-13.824-10.24l-98.304-175.616c-12.288-22.016-34.304-34.816-59.392-34.816-25.088 0-47.104 12.8-59.392 34.816l-98.304 175.616c-3.072 5.12-8.192 8.704-13.824 10.24l-197.632 38.912c-24.576 5.12-44.032 22.016-51.712 46.08s-2.048 49.152 14.848 67.584l136.704 147.968c4.096 4.096 6.144 10.24 5.12 15.872l-24.064 200.192c-3.072 24.576 7.68 48.64 27.648 63.488 19.968 14.848 46.08 17.408 68.608 6.656l182.784-84.48c5.632-2.56 11.776-2.56 16.896 0l182.784 84.48c22.528 10.752 48.64 8.192 68.608-6.656 19.968-14.336 30.72-38.912 27.648-63.488l-24.064-199.68c-0.512-6.144 1.024-11.776 5.12-16.384l138.24-148.48z" />
                </svg>
              </span>
            </div>
            <span class="song-auth">By: <span style="color: #3f51b5;">{{ item.auth }}</span></span>
          </div>
        </div>
      </div>
      <!-- <div v-show="showMusicScore" class="score-body" @scroll="handleScroll">
        <div v-for="i in 5" :key="`${i}-up`" class="space"></div>
        <div
          v-for="(item, i) in musicList" :key="i"
          class="song" :class="{ 'selected-song': selectedIndex === i }"
          @click="handleMusicSelect(item, i)">
          <span class="song-name">{{ item.name }}</span>
          <div class="song-footer">
            <div class="star-wrapper">
              <span v-for="(star, j) in item.star" :key="j">
                <svg
                  class="star-icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="200" height="200">
                  <path d="M918.016 478.208c16.896-18.432 22.528-43.52 14.848-67.584-7.68-24.064-27.136-40.96-51.712-45.568l-197.632-38.912c-5.632-1.024-10.752-4.608-13.824-10.24l-98.304-175.616c-12.288-22.016-34.304-34.816-59.392-34.816-25.088 0-47.104 12.8-59.392 34.816l-98.304 175.616c-3.072 5.12-8.192 8.704-13.824 10.24l-197.632 38.912c-24.576 5.12-44.032 22.016-51.712 46.08s-2.048 49.152 14.848 67.584l136.704 147.968c4.096 4.096 6.144 10.24 5.12 15.872l-24.064 200.192c-3.072 24.576 7.68 48.64 27.648 63.488 19.968 14.848 46.08 17.408 68.608 6.656l182.784-84.48c5.632-2.56 11.776-2.56 16.896 0l182.784 84.48c22.528 10.752 48.64 8.192 68.608-6.656 19.968-14.336 30.72-38.912 27.648-63.488l-24.064-199.68c-0.512-6.144 1.024-11.776 5.12-16.384l138.24-148.48z" />
                </svg>
              </span>
            </div>
            <span class="song-auth">By: <span style="color: #3f51b5;">{{ item.auth }}</span></span>
          </div>
        </div>
        <div v-for="i in 5" :key="`${i}-down`" class="space"></div>
      </div> -->
    </transition>
    <transition name="model-fade">
      <div v-show="showMusicScore" class="model"></div>
    </transition>
  </div>
</template>

<script>
// let scrollBodyDom = null
// let childrenDoms = []
// const itemHeight = 64

// const SONG_LIST = require.context('../../../public/mids', false, /\.mid$/).keys().map(v => v.slice(2, -4))
const SONG_LIST = [
  { name: '世上只有妈妈好', auth: '甜国夜鹰 & QWQPOI', star: 1 },
  { name: '数码宝贝主题曲', auth: '北川上の樱子', star: 1 },
  { name: '水手', auth: '顾长歌', star: 1 },
  { name: '送别', auth: 'zhtgood', star: 1 },
  { name: '天空之城', auth: 'natya', star: 1 },
  { name: '大悲咒', auth: '秋郁', star: 1 },
  { name: '帝国进行曲 - 星球大战', auth: '萝莉D白丝', star: 1 },
  { name: '海绵宝宝 片尾曲', auth: '北川上の樱子', star: 1 },

  { name: '斗地主', auth: 'freeizng影子', star: 1 },
  { name: '猪八戒背媳妇', auth: '北川上の樱子', star: 1 },
  { name: '天晴大鲶音头', auth: '5uwu', star: 1 },
  { name: 'tomorrow and tomorrow', auth: 'QWQPOI', star: 1 },
  { name: '黑人抬棺', auth: '六芒_龙', star: 1 },
  { name: '陆行鸟之歌', auth: 'QWQPOI', star: 1 },

  { name: '勾指起誓', auth: 'QWQPOI', star: 2 },
  { name: '植物大战僵尸', auth: 'QWQPOI', star: 2 },
  { name: '希望之花', auth: '66189118', star: 2 },
  { name: 'dragon song', auth: 'gohiey', star: 2 },
  { name: '热烈的决斗者', auth: '海边的吉卜力', star: 2 },
  { name: '喀秋莎', auth: '顾长歌', star: 2 },
  { name: 'cant help falling in love', auth: 'QWQPOI', star: 2 },
  { name: '处处吻', auth: '北川上の樱子', star: 2 },
  { name: '红色高跟鞋', auth: '北川上の樱子', star: 2 },
  { name: '牵丝戏', auth: '顾长歌', star: 2 },
  { name: '霞光 - 精灵世纪ED', auth: '圆圈2501', star: 2 },
  { name: '萤之光', auth: 'zhou364394799', star: 2 },

  { name: 'il vento doro', auth: 'QWQPOI', star: 3 },
  { name: '克罗地亚狂想曲', auth: '顾长歌', star: 3 },
  { name: '青鸟', auth: '66189118', star: 3 },
  { name: '5.0蛮神 妖灵王', auth: 'zhou364394799', star: 3 },
  { name: 'Deja vu 头文字D', auth: '试作型红茶', star: 3 },
  { name: '悠久之风', auth: '蛙石', star: 3 },
  { name: '白金ディスコ', auth: 'unjason', star: 3 },
  { name: '千本樱', auth: 'yuancho', star: 3 },

  { name: 'Brave Heart', auth: 'QWQPOI', star: 3 },
  { name: 'Flower Dance', auth: 'natya', star: 3 },
  { name: 'lemon', auth: '试作型红茶', star: 3 },
  { name: '加勒比海盗', auth: 'Chayseeee', star: 3 },
  { name: '金蛇狂舞', auth: '秋郁', star: 3 },
  { name: '千年龙诗', auth: '顾长歌', star: 3 }
  // { name: '打上花火', auth: 'ymb1998', star: 3 }
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
    },
    isMobile() {
      return this.$store.getters.isMobile
    }
  },
  // watch: {
  //   showMusicScore() {
  //     this.$nextTick(() => {
  //       scrollBodyDom.scrollTo({
  //         top: this.selectedIndex === -1 ? 5 * itemHeight : (this.selectedIndex + 5) * itemHeight - scrollBodyDom.offsetHeight / 2,
  //         behavior: 'smooth'
  //       })
  //     })
  //   }
  // },
  mounted() {
    // scrollBodyDom = this.$el.querySelector('.score-body')
    // childrenDoms = scrollBodyDom.children
  },
  methods: {
    toggleMusicScore() {
      this.$store.dispatch('app/toggleMusicScore')
    },
    handleMusicSelect(item, i) {
      this.toggleMusicScore()
      this.selectedIndex = i
      this.$emit('handleMusicSelect', item)
    }
    // handleScroll() {
    //   const scrollTop = scrollBodyDom.scrollTop
    //   const offsetHeight = scrollBodyDom.offsetHeight
    //   const startIndex = Math.floor(scrollTop / itemHeight)
    //   const endIndex = Math.floor((scrollTop + offsetHeight) / itemHeight)
    //   for (let i = startIndex; i <= endIndex; i++) {
    //     const child = childrenDoms[i]
    //     if (child) {
    //       const n = 1 - Math.abs((child.offsetTop - scrollTop) / offsetHeight - 0.5) * 0.5
    //       // 不设置 scaleZ, 避免过多合成层
    //       child.style.transform = `scaleX(${n}) scaleY(${n})` // `scale3d(${n}, ${n}, 1)`
    //       child.style.opacity = n
    //     }
    //   }
    // }
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
  transform: translateY(100%);
}

.song-wrapper {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-wrap: wrap;
  z-index: 10;
  overflow: auto;
  padding: 0 5%;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
  .song {
    position: relative;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    min-height: 65px;
    min-width: 30%;
    padding: 15px 10px 10px 10px;
    margin: 10px 10px;
    background-color: rgba(255, 255, 255, 0.7);
    border-bottom: 1px solid #eee;
    border-radius: 10px;
    transition: box-shadow 0.3s;
    cursor: pointer;
    &:hover {
      box-shadow: 0 0 20px 0 #fafafa;
    }
    &:last-of-type {
      border-bottom: 0;
    }
    .song-name {
      color: #673ab7;
      font-weight: bold;
    }
    .song-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
      .star-wrapper {
        display: flex;
        margin-right: 20px;
        .star-icon {
          width: 18px;
          height: 18px;
          fill: #ff5722;
        }
      }
      .song-auth {
        font-size: 14px;
      }
    }
  }
  .selected-song {
    box-shadow: 0 0 20px 0 #fafafa;
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

.song__mobile {
  width: 100%;
  margin: 10px 0 !important;
}
</style>
