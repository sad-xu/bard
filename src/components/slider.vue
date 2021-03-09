<template>
  <div class="ff-slider">
    <input
      v-model.number="value" type="range"
      class="ff-slider__runway"
      :max="max" :min="min" :step="step"
      @change="handleChange">
    <span class="ff-slider__val">{{ value }}{{ unit }}</span>
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
  name: 'FfSlider',
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
    },
    // 单位
    unit: {
      type: String,
      default: ''
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

.ff-slider {
  display: flex;
  align-items: center;
}
.ff-slider__runway {
  margin-right: 10px;
  width: 30%;
}
.ff-slider__val {
  font-size: 14px;
}
</style>
