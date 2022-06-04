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

const INSTRUMENT_LIST = [
  [
    { name: '竖琴', fileName: 'ff-harp', icon: require('@/assets/harp.png') },
    { name: '钢琴', fileName: 'ff-grandpiano', icon: require('@/assets/piano.png') },
    { name: '鲁特琴', fileName: 'ff-steelguitar', icon: require('@/assets/steelguitar.png') },
    { name: '拨弦提琴', fileName: 'ff-pizzicato', icon: require('@/assets/pizzicato.png') }
  ],
  [
    { name: '小提琴', fileName: 'ff-violin', icon: require('@/assets/violin.png') },
    { name: '中提琴', fileName: 'ff-viola', icon: require('@/assets/viola.png') },
    { name: '大提琴', fileName: 'ff-cello', icon: require('@/assets/cello.png') },
    { name: '低音提琴', fileName: 'ff-contrabass', icon: require('@/assets/contrabass.png') }
  ],
  [
    { name: '过载吉他', fileName: 'ff-ele-overdriven', icon: require('@/assets/overdriven-guitar.png') },
    { name: '清音吉他', fileName: 'ff-ele-clean', icon: require('@/assets/clean-guitar.png') },
    { name: '闷音吉他', fileName: 'ff-ele-mute', icon: require('@/assets/muted-guitar.png') },
    { name: '重力和弦', fileName: 'ff-ele-powerchord', icon: require('@/assets/powerchord-guitar.png') },
    { name: '特殊奏法', fileName: 'ff-ele-special', icon: require('@/assets/special-guitar.png') }
  ],
  [
    { name: '长笛', fileName: 'ff-flute', icon: require('@/assets/flute.png') },
    { name: '双簧管', fileName: 'ff-oboe', icon: require('@/assets/oboe.png') },
    { name: '单簧管', fileName: 'ff-clarinet', icon: require('@/assets/clarinet.png') },
    { name: '横笛', fileName: 'ff-piccolo', icon: require('@/assets/piccolo.png') },
    { name: '排箫', fileName: 'ff-panflute', icon: require('@/assets/panflute.png') }
  ],
  [
    { name: '小号', fileName: 'ff-trumpet', icon: require('@/assets/trumpet.png') },
    { name: '长号', fileName: 'ff-trombone', icon: require('@/assets/trombone.png') },
    { name: '大号', fileName: 'ff-tuba', icon: require('@/assets/tuba.png') },
    { name: '圆号', fileName: 'ff-horn', icon: require('@/assets/horn.png') },
    { name: '萨克斯', fileName: 'ff-altosax', icon: require('@/assets/altosax.png') }
  ],
  [
    { name: '定音鼓', fileName: 'ff-timpani', icon: require('@/assets/timpani.png') },
    { name: '邦戈鼓', fileName: 'ff-bongo', icon: require('@/assets/bongo.png') },
    { name: '低音鼓', fileName: 'ff-bd', icon: require('@/assets/bd.png') },
    { name: '小军鼓', fileName: 'ff-snare', icon: require('@/assets/snare.png') },
    { name: '镲', fileName: 'ff-cymbal', icon: require('@/assets/cymbal.png') }
  ]
]

// 乐器名 兜底
const INSTRUMENT_MAP = {}
INSTRUMENT_LIST.forEach((arr) => {
  arr.forEach((item) => {
    INSTRUMENT_MAP[item.fileName] = item.fileName
  })
})
const localInstrument = localStorage.getItem('instrument')
let defaultInstrument = localInstrument || 'ff-grandpiano'
if (localInstrument && !INSTRUMENT_MAP[localInstrument]) {
  // 不存在的乐器
  window.localStorage.setItem('instrument', 'ff-grandpiano')
  defaultInstrument = 'ff-grandpiano'
}

Music.setZone(defaultInstrument)

export default {
  name: 'InstrumentMenu',
  data() {
    return {
      // 音量
      volume: (localStorage.getItem('volume') || 0.3) * 100,
      // 持续时间 0.5 - 3
      duration: localStorage.getItem('duration') || 0.6,
      // 乐器
      selectedName: defaultInstrument,
      // 乐器库
      instrumentList: INSTRUMENT_LIST
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
