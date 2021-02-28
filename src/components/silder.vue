<template>
  <div class="ff-slider">
    <input
      v-model.number="value" type="range"
      class="ff-slider__runway"
      :max="max" :min="min" :step="step"
      @change="handleChange">
    <span>{{ value }}</span>
    <!-- <ff-button class="silder-button" @click="stepBack">
      ◀
    </ff-button>
    <ff-button class="silder-button" @click="stepForward">
      ▶
    </ff-button> -->
  </div>
</template>

<script>
/**
 * 滑块
 * v-model 绑定值
 * min 最小值
 * max 最大值
 *
 * @change 绑定值改变时触发
 *
 */
import { debounce } from '@/utils'

export default {
  name: 'FfSilder',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      default: 100
    },
    min: {
      type: Number,
      default: 0
    },
    step: {
      type: Number,
      default: 1
    }
  },
  methods: {
    handleChange: debounce(function(v) {
      this.$emit('change', this.value)
    }, 300)
  }
  // methods: {
  //   stepForward() {
  //     this.value = Math.min(this.value + this.step, this.max)
  //   },
  //   stepBack() {
  //     this.value = Math.max(this.value - this.step, this.min)
  //   }
  // }
}
</script>

<style lang="scss" scoped>
// .silder-button {
//   padding: 2px 6px;
//   font-size: 12px;
// }

.ff-slider__runway {
  outline: none;
  appearance: none;
  width: 30%;
  height: 10px;
  background: orange;
  &::-webkit-slider-thumb {
    appearance: none;
    box-shadow: 0 0 2px;
    width: 20px;
    height: 20px;
    border-radius: 100%;
    background: linear-gradient(red, green);
    cursor: pointer;
  }
}
</style>
