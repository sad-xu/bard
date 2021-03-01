<template>
  <ff-dialog
    :visible="showTimbreMenu"
    title="音色设置 - 调试版" append-to-body
    default-left="-30%" default-top="5%"
    max-height="70vh" @close="closeTimbreMenu">
    <!--  -->
    <div class="config">
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
        <div class="silder-wrapper">
          <input
            v-for="i in 16" :key="i" v-model.number="periodicWave.real[i - 1]"
            class="silder" :style="{ left: `${6.25 * (i - 1)}%` }" type="range"
            :max="1" :min="-1" :step="0.001">
        </div>
        <table class="number-table">
          <tr v-for="i in 4" :key="i">
            <td v-for="j in 4" :key="j">
              {{ periodicWave.real[(i - 1) * 4 + j - 1] }}
            </td>
          </tr>
        </table>
        <button class="reset-buttom" @click="resetWave('real')">
          重置
        </button>
      </div>
      <div class="diy">
        <div class="silder-wrapper">
          <input
            v-for="i in 16" :key="i" v-model.number="periodicWave.imag[i - 1]"
            class="silder" :style="{ left: `${6.25 * (i - 1)}%` }" type="range"
            :max="1" :min="-1" :step="0.001">
        </div>
        <table class="number-table">
          <tr v-for="i in 4" :key="i">
            <td v-for="j in 4" :key="j">
              {{ periodicWave.imag[(i - 1) * 4 + j - 1] }}
            </td>
          </tr>
        </table>
        <button class="reset-buttom" @click="resetWave('imag')">
          重置
        </button>
      </div>
    </div>
    <!--  -->
    <div class="config">
      <p class="config-title">
        音量
      </p>
      <ff-silder
        v-model="volume"
        @change="handleChangeVolumn">
      </ff-silder>
    </div>
    <!--  -->
    <div class="config">
      <p class="config-title">
        持续时间
      </p>
      <ff-silder
        v-model="duration"
        :min="0.5" :max="3" :step="0.1"
        @change="handleChangeDuration">
      </ff-silder>
    </div>
    <!--  -->
    <div class="config">
      <p class="config-title">
        滤波器
      </p>
      <div class="filter-wrapper">
        <div v-for="(filter, i) in filterList" :key="i" class="filter">
          <input v-model="filter.checked" type="checkbox">
          <ff-select v-model="filter.type" :options="filterOption"></ff-select>
          <div>
            <span>Freq</span>
            <ff-silder v-model="filter.freq" :min="250" :max="2000"></ff-silder>
          </div>
          <div v-if="filterParamsMap[filter.type].haveQ">
            <span>Q</span>
            <ff-silder
              v-model="filter.Q"
              :min="0.1" :max="100" :step="0.1">
            </ff-silder>
          </div>
          <div v-if="filterParamsMap[filter.type].haveGain">
            <span>Gain</span>
            <ff-silder v-model="filter.gain" :min="-40" :max="40"></ff-silder>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="timbre-wrapper">
      <div
        v-for="(item, index) in timbreList" :key="item.id"
        :class="selectedIndex === index ? 'selected-timbre' : ''"
        class="timbre" @click="handleSelectTimber(index)">
        {{ item.name }}
      </div>
      <div class="timbre">
        +
      </div>
    </div> -->
    <!-- <div class="tuner" @click="showTunerMenu = !showTunerMenu">
      打开调音器
    </div> -->
    <!--  -->
    <!-- <timbre
      ref="Timbre"
      :visible="showTunerMenu"
      @close="showTunerMenu = false">
    </timbre> -->
  </ff-dialog>
</template>

<script>
// import Timbre from './Timbre'
import { debounce } from '@/utils'
import Sound from '@/utils/Sound'

export default {
  name: 'TimbreMenu',
  // components: {
  //   Timbre
  // },
  data() {
    return {
      // 音量
      volume: 50,
      // 持续时间 0.5 - 3
      duration: 1.5,
      // 波形
      selectedWave: 'sine',
      waveList: [
        { label: '正弦波', value: 'sine' },
        { label: '方波', value: 'square' },
        { label: '锯齿波', value: 'sawtooth' },
        { label: '三角波', value: 'triangle' },
        { label: 'testA', value: 'testA' },
        { label: 'testB', value: 'testB' },
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
        real: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        imag: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }
      // selectedIndex: -1,
      // showTunerMenu: false
    }
  },
  computed: {
    showTimbreMenu() {
      return this.$store.getters.showTimbreMenu
    }
    // timbreList() {
    //   return this.$store.getters.timbreList
    // }
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
    // handleSelectTimber(index) {
    //   this.selectedIndex = index
    //   this.$refs.Timbre.setTimbre(this.timbreList[index])
    // },
    closeTimbreMenu() {
      // this.showTunerMenu = false
      this.$store.dispatch('timbre/toggleShowTimbreMenu')
    }
  }
}
</script>

<style lang="scss" scoped>
.config {
  margin-bottom: 15px;
  padding-left: 20px;
  .config-title {
    margin-left: -20px;
    margin-bottom: 10px;
  }
}

.wave-wrapper {
  display: flex;
  .wave {
    margin-right: 20px;
    label {
      cursor: pointer;
      margin-left: 4px;
    }
  }
}
.filter-wrapper {
  display: flex;
  .filter {
    width: 100%;
  }
}

.diy {
  position: relative;
  display: flex;
  .silder-wrapper {
    position: relative;
    height: 120px;
    width: 350px;
    .silder {
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
    margin-top: 10px;
    td {
      width: 25%;
      text-align: center;
      border: 1px solid #696969;
    }
  }
  .reset-buttom {
    position: absolute;
    right: 0;
    bottom: 8px;
    font-size: 14px;
    padding: 0 10px;
  }
}

// .timbre-wrapper {
//   display: flex;
//   flex-wrap: wrap;
//   .timbre {
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     width: 80px;
//     height: 80px;
//     margin: 15px;
//     background-color: pink;
//     border-radius: 10px;
//     cursor: pointer;
//   }
//   .selected-timbre {
//     box-shadow: 0 0 6px 6px #dc5c5c;
//   }
// }

// .tuner {
//   position: absolute;
//   bottom: 0;
//   right: 0;
// }
</style>
