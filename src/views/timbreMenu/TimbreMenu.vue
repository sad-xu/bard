<template>
  <ff-dialog
    :visible="showTimbreMenu"
    title="音色设置" append-to-body
    default-left="-30%" default-top="5%" @close="closeTimbreMenu">
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
        { label: '三角波', value: 'triangle' }
      ],
      //
      // 滤波器 type
      // frequency 250 ~ 2000
      // Q 0.001 ~ 1000  0.1 ~ 100
      // gain -40 ~ 40
      filterList: [{
        checked: true,
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
      Sound.setAllWave(wave)
    },
    filterList: {
      handler(list) {
        Sound.setAllFilters(list)
      },
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

.timbre-wrapper {
  display: flex;
  flex-wrap: wrap;
  .timbre {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 80px;
    margin: 15px;
    background-color: pink;
    border-radius: 10px;
    cursor: pointer;
  }
  .selected-timbre {
    box-shadow: 0 0 6px 6px #dc5c5c;
  }
}

.tuner {
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>
