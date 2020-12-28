<template>
  <div class="ff-slider">
    <input
      v-model.number="value" type="range"
      class="ff-slider__runway"
      :max="max" :min="min" :step="step">
    <span>{{ value }}</span>
    <ff-button @click="stepBack">
      left
    </ff-button>
    <ff-button @click="stepForward">
      right
    </ff-button>
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
  props: {
    value: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      default: 100,
      required: true
    },
    min: {
      type: Number,
      default: 0,
      required: true
    },
    step: {
      type: Number,
      default: 1
    }
  },
  watch: {
    value: debounce(function(v) {
      this.$emit('change', v)
    }, 300)
  },
  methods: {
    stepForward() {
      this.value = Math.min(this.value + this.step, this.max)
    },
    stepBack() {
      this.value = Math.max(this.value - this.step, this.min)
    }
  }
}
</script>

<style lang="scss" scoped>
.ff-slider {

}

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
