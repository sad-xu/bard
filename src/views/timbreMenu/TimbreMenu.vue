<template>
  <ff-dialog
    :visible="showTimbreMenu"
    title="音色设置 - 测试版" append-to-body
    default-left="-20%" default-top="5%"
    max-height="70vh" @close="closeTimbreMenu">
    <!--  -->
    <div class="config wave-config">
      <p class="config-title">
        音源波形
      </p>
      <div class="wave-wrapper">
        <div v-for="wave in waveList" :key="wave.value" class="wave">
          <input
            :id="wave.value" v-model="selectedWave"
            :value="wave.value" type="radio">
          <label :for="wave.value">{{ wave.label }}</label>
        </div>
      </div>
    </div>
    <!--  -->
    <div v-show="selectedWave === 'diy'" class="config">
      <p class="config-title">
        自定义波形
      </p>
      <div class="diy">
        <div class="slider-wrapper">
          <input
            v-for="i in 15" :key="i" v-model.number="periodicWave.real[i]"
            class="slider" :style="{ left: `${6.25 * (i - 1)}%` }" type="range"
            :max="1" :min="-1" :step="0.001">
        </div>
        <table class="number-table">
          <tr v-for="i in 4" :key="i">
            <td v-for="j in 4" :key="j">
              {{ periodicWave.real[(i - 1) * 4 + j - 1] }}
            </td>
          </tr>
        </table>
        <ff-button class="reset-buttom" @click="resetWave('real')">
          重置
        </ff-button>
      </div>
      <div class="diy">
        <div class="slider-wrapper">
          <input
            v-for="i in 15" :key="i" v-model.number="periodicWave.imag[i]"
            class="slider" :style="{ left: `${6.25 * (i - 1)}%` }" type="range"
            :max="1" :min="-1" :step="0.001">
        </div>
        <table class="number-table">
          <tr v-for="i in 4" :key="i">
            <td v-for="j in 4" :key="j">
              {{ periodicWave.imag[(i - 1) * 4 + j - 1] }}
            </td>
          </tr>
        </table>
        <ff-button class="reset-buttom" @click="resetWave('imag')">
          重置
        </ff-button>
      </div>
    </div>
    <!--  -->
    <div class="config">
      <p class="config-title">
        音量
      </p>
      <ff-slider
        v-model="volume"
        @change="handleChangeVolumn">
      </ff-slider>
    </div>
    <!--  -->
    <div class="config">
      <p class="config-title">
        持续时间
      </p>
      <ff-slider
        v-model="duration"
        :min="0.5" :max="3" :step="0.1"
        @change="handleChangeDuration">
      </ff-slider>
    </div>
    <!--  -->
    <div class="config">
      <p class="config-title">
        滤波器（最多可叠加三层）
      </p>
      <div class="filter-wrapper">
        <div v-for="(filter, i) in filterList" :key="i" class="filter">
          <div class="filter-header">
            <input v-model="filter.checked" class="checkbox" type="checkbox">
            <ff-select v-model="filter.type" :options="filterOption"></ff-select>
          </div>
          <div class="filter-item">
            <span>Freq</span>
            <ff-slider v-model="filter.freq" :min="250" :max="2000"></ff-slider>
          </div>
          <div v-if="filterParamsMap[filter.type].haveQ" class="filter-item">
            <span>Q</span>
            <ff-slider
              v-model="filter.Q"
              :min="0.1" :max="100" :step="0.1">
            </ff-slider>
          </div>
          <div v-if="filterParamsMap[filter.type].haveGain" class="filter-item">
            <span>Gain</span>
            <ff-slider v-model="filter.gain" :min="-40" :max="40"></ff-slider>
          </div>
        </div>
      </div>
    </div>
  </ff-dialog>
</template>

<script>
import { debounce } from '@/utils'
import Sound from '@/utils/Sound'

export default {
  name: 'TimbreMenu',
  data() {
    return {
      // 音量
      volume: 30,
      // 持续时间 0.5 - 3
      duration: 1.5,
      // 波形
      selectedWave: 'sine',
      waveList: [
        { label: '正弦波', value: 'sine' },
        { label: '方波', value: 'square' },
        { label: '锯齿波', value: 'sawtooth' },
        { label: '三角波', value: 'triangle' },
        { label: 'bass', value: 'bass' },
        { label: 'brass', value: 'brass' },
        { label: 'chiptune', value: 'chiptune' },
        { label: 'organ', value: 'organ' },
        { label: 'organ2', value: 'organ2' },
        { label: 'aah', value: 'aah' },
        { label: 'celeste', value: 'celeste' },
        { label: 'wurlitzer', value: 'wurlitzer' },
        { label: '自定义', value: 'diy' }
      ],
      //
      // 滤波器 type
      // frequency 250 ~ 2000
      // Q 0.001 ~ 1000  0.1 ~ 100
      // gain -40 ~ 40
      filterList: [{
        checked: false,
        type: 'lowpass',
        freq: 1000,
        Q: 1,
        gain: 5
      }, {
        checked: false,
        type: 'lowpass',
        freq: 1000,
        Q: 1,
        gain: 5
      }, {
        checked: false,
        type: 'lowpass',
        freq: 1000,
        Q: 1,
        gain: 5
      }],
      filterOption: [
        { label: '低通', value: 'lowpass' },
        { label: '高通', value: 'highpass' },
        { label: '带通', value: 'bandpass' },
        { label: '低架', value: 'lowshelf' },
        { label: '高架', value: 'highshelf' },
        { label: '峰值', value: 'peaking' },
        { label: '陷波', value: 'notch' },
        { label: '全通', value: 'allpass' }
      ],
      filterParamsMap: {
        lowpass: { haveQ: true },
        highpass: { haveQ: true },
        bandpass: { haveQ: true },
        lowshelf: { haveGain: true },
        highshelf: { haveGain: true },
        peaking: { haveQ: true, haveGain: true },
        notch: { haveQ: true },
        allpass: { haveQ: true }
      },
      // custom
      periodicWave: {
        real: [0, 0.1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        imag: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }
    }
  },
  computed: {
    showTimbreMenu() {
      return this.$store.getters.showTimbreMenu
    }
  },
  watch: {
    selectedWave(wave) {
      if (wave !== 'diy') {
        Sound.setAllWave(wave)
      } else {
        Sound.setAllWave('diy', this.periodicWave)
      }
    },
    filterList: {
      handler(list) {
        Sound.setAllFilters(list)
      },
      deep: true
    },
    periodicWave: {
      handler: debounce(function(wave) {
        Sound.setAllWave('diy', wave)
      }, 100),
      deep: true
    }
  },
  methods: {
    handleChangeVolumn(v) {
      Sound.setAllVolume(v / 100)
    },
    handleChangeDuration(v) {
      Sound.setAllDuration(v)
    },
    resetWave(key) {
      this.periodicWave[key] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    closeTimbreMenu() {
      this.$store.dispatch('timbre/toggleShowTimbreMenu')
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

.wave-config {
  margin-bottom: 5px;
}
.wave-wrapper {
  display: flex;
  flex-wrap: wrap;
  font-size: 15px;
  .wave {
    margin: 10px 20px 10px 0;
    label {
      cursor: pointer;
      margin-left: 4px;
    }
  }
}
.filter-wrapper {
  display: flex;
  .filter {
    display: flex;
    flex-direction: column;
    width: 100%;
    .filter-header {
      display: flex;
      align-items: center;
      margin-bottom: 4px;
      .checkbox {
        margin-right: 6px;
      }
    }
    .filter-item {
      font-size: 14px;
      /deep/ .ff-slider__runway {
        width: 60%;
      }
    }
  }
}

.diy {
  position: relative;
  display: flex;
  margin-bottom: 6px;
  &:last-of-type {
    margin-bottom: 0;
  }
  .slider-wrapper {
    position: relative;
    height: 120px;
    width: 350px;
    .slider {
      width: 100px;
      height: 5px;
      position: absolute;
      transform-origin: right;
      transform: translateX(-100%) rotate(-90deg);
    }
  }
  .number-table {
    flex-grow: 1;
    border-collapse: collapse;
    font-size: 12px;
    td {
      width: 25%;
      padding: 4px 0;
      text-align: center;
      border: 1px solid #696969;
    }
  }
  .reset-buttom {
    position: absolute;
    right: 0;
    bottom: 6px;
    font-size: 12px;
    padding: 3px 14px;
  }
}
</style>
