<template>
  <ff-dialog
    :visible="showInstrumentMenu"
    title="声音设置" append-to-body
    default-top="5%"
    max-height="70vh" @close="handleCloseInstrumentMenu">
    <!--  -->
    <div class="config">
      <p class="config-title">
        音量
      </p>
      <ff-slider
        v-model="volume" unit="%"
        @change="handleChangeVolumn">
      </ff-slider>
    </div>
    <!--  -->
    <div class="config">
      <p class="config-title">
        持续时间
      </p>
      <ff-slider
        v-model="duration" unit="s"
        :min="0.1" :max="2" :step="0.1"
        @change="handleChangeDuration">
      </ff-slider>
    </div>
    <!--  -->
    <div class="config">
      <p class="config-title">
        乐器选择
      </p>
      <div>
        <div v-for="(list, i) in instrumentList" :key="i" class="instrument-wrapper">
          <div
            v-for="item in list" :key="item.name"
            :class="{ 'selected-instrument': item.fileName === selectedName }"
            class="instrument" @click="selectInstrument(item)">
            <div class="icon-wrapper">
              <img class="icon" :src="item.icon">
              <div class="mask"></div>
            </div>
            <span class="name">{{ item.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </ff-dialog>
</template>

<script>
import Music from '@/utils/Music'

export default {
  name: 'InstrumentMenu',
  data() {
    return {
      // 音量
      volume: (localStorage.getItem('volume') || 0.3) * 100,
      // 持续时间 0.5 - 3
      duration: localStorage.getItem('duration') || 0.6,
      // 乐器
      selectedName: localStorage.getItem('instrument'),
      // 使用 FluidR3_GM 音色库
      // 竖琴 钢琴 鲁特琴 拨弦提琴
      // 长笛 双簧管 单簧管 横笛 排箫 小号 长号 大号 圆号 萨克斯
      // 定音鼓 邦戈鼓 低音鼓 小军鼓 镲
      instrumentList: [
        [
          { name: '尼龙弦吉他', fileName: 'nylon-guitar', icon: require('@/assets/guitar.png') },
          { name: '电吉他(清音)', fileName: 'clean-guitar', icon: require('@/assets/guitar.png') },
          { name: '电吉他(驱动)', fileName: 'overdriven-guitar', icon: require('@/assets/guitar.png') },
          { name: '贝司', fileName: 'bass', icon: require('@/assets/guitar.png') }
        ],
        [
          { name: '竖琴', fileName: 'harp', icon: require('@/assets/harp.png') },
          { name: '钢琴', fileName: 'piano', icon: require('@/assets/piano.png') },
          { name: '小提琴', fileName: 'violin', icon: require('@/assets/harp.png') }
          // { name: '鲁特琴', fileName: '', icon: require('@/assets/lute.png') },
        ],
        [
          { name: '长笛', fileName: 'flute', icon: require('@/assets/flute.png') },
          { name: '双簧管', fileName: 'oboe', icon: require('@/assets/oboe.png') },
          { name: '单簧管', fileName: 'clarinet', icon: require('@/assets/clarinet.png') },
          { name: '小号', fileName: 'trumpet', icon: require('@/assets/trumpet.png') },
          { name: '长号', fileName: 'trombone', icon: require('@/assets/trombone.png') },
          { name: '大号', fileName: 'tuba', icon: require('@/assets/tuba.png') },
          { name: '圆号', fileName: 'horn', icon: require('@/assets/horn.png') }
        ],
        [
          { name: '定音鼓', fileName: 'timpani', icon: require('@/assets/timpani.png') },
          { name: '镲', fileName: 'cymbal', icon: require('@/assets/cymbal.png') }
        ],
        [
          { name: '天使低语', fileName: 'ahas', icon: require('@/assets/ahas.png') }
        ]
      ]
    }
  },
  computed: {
    showInstrumentMenu() {
      return this.$store.getters.showInstrumentMenu
    }
  },
  methods: {
    handleChangeVolumn(v) {
      Music.setAllVolume(v / 100)
    },
    handleChangeDuration(v) {
      Music.setAllDuration(v)
    },
    handleCloseInstrumentMenu() {
      this.$store.dispatch('app/toggleInstrumentMenu')
    },
    selectInstrument({ fileName }) {
      if (this.selectedName !== fileName) {
        this.selectedName = fileName
        Music.setZone(fileName)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.config {
  margin-bottom: 15px;
  padding-left: 20px;
  padding-top: 10px;
  .config-title {
    margin-left: -20px;
    margin-bottom: 10px;
  }
}

.instrument-wrapper {
  display: flex;
  flex-wrap: wrap;
  .instrument {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 5px;
    margin: 5px;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.2s;
    &:hover {
      background-color: #303030;
    }
    .icon-wrapper {
      position: relative;
      width: 40px;
      height: 40px;
      margin: 0 10px;
      .icon {
        width: 100%;
        height: 100%;
      }
      .mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 5px;
        box-shadow: 0 1px 2px 1px #000, 0 1px 3px #141414, 0 15px 10px -14px #fff inset, 0 1px 2px #fff inset;
      }
    }
    .name {
      margin-top: 6px;
      font-size: 14px;
    }
  }
  .selected-instrument {
    box-shadow: inset 0 1px 9px 2px #b1b1b1, 2px 3px 5px 0 #151515;
  }
}
</style>
