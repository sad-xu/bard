<template>
  <div class="ff-select" @click.stop="toggleMenu">
    <div class="ff-select-label">
      <i class="iconfont icon-arrow-fill ff-arrow" :class="{ 'ff-arrow-rotate': visible }"></i>
      <div>{{ selectedLabel }}</div>
    </div>
    <transition name="ff-zoom-in-top">
      <ul v-show="visible" v-clickoutside="handleClickoutside" class="ff-select-dropdown__list">
        <li
          v-for="item in options"
          :key="item.value" class="ff-select-dropdown__item"
          @click="handleSelect(item)">
          {{ item.label }}
        </li>
      </ul>
    </transition>
  </div>
</template>

<script>
/**
 * 选择器
 *  v-model 绑定值
 *  options 备选项 [{ label, value }]
 *
 *  @change 选中值变化时触发
 *
 */

import Clickoutside from '@/directives/clickoutside'

export default {
  name: 'FfSelect',
  directives: { Clickoutside },
  model: {
    prop: 'value',
    event: 'select'
  },
  props: {
    value: {
      type: [String, Number],
      required: true
    },
    // [{ label, value }]
    options: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // clickoutside 标识
      isPopperElm: true,
      selectedLabel: '',
      visible: false
    }
  },
  watch: {
    value(newV) {
      const options = this.options
      for (let i = 0; i < options.length; i++) {
        if (options[i].value === newV) {
          this.selectedLabel = options[i].label
        }
      }
    }
  },
  created() {
    const selecteditem = this.options.find(item => item.value === this.value)
    if (selecteditem) {
      this.selectedLabel = selecteditem.label
    }
  },
  methods: {
    handleClickoutside() {
      this.visible = false
    },
    toggleMenu() {
      this.visible = !this.visible
    },
    handleSelect(item) {
      if (this.value !== item.value) {
        this.$emit('select', item.value)
        this.$emit('change', item)
        this.selectedLabel = item.label
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ff-select {
  position: relative;
  display: inline-block;
  width: 100px;
  font-size: 14px;
  border-radius: 5px;
  user-select: none;
}

.ff-select-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 10px;
  background-color: #6b6d6b;
  color: #fff;
  border-radius: 20px;
  cursor: pointer;
  .ff-arrow {
    font-size: 12px;
    transition: transform 0.3s;
  }
  .ff-arrow-rotate {
    transform: rotate(90deg);
  }
}

.ff-select-dropdown__list {
  position: absolute;
  top: 100%;
  width: 100%;
  margin-top: 4px;
  background-color: #6b6d6b;
  color: #fff;
  border-radius: 6px;
  overflow: hidden;
  z-index: 9;
  .ff-select-dropdown__item {
    font-size: 14px;
    padding: 4px 10px;
    border-bottom: 1px dashed #999;
    transition: background 0.3s;
    cursor: pointer;
    // height: 34px;
    // line-height: 34px;
    &:hover {
      background-color: #555;
    }
    &:last-of-type {
      border-bottom: 0;
    }
  }
}

.ff-zoom-in-top-enter-active,
.ff-zoom-in-top-leave-active {
  opacity: 1;
  transform: scaleY(1);
  transition: transform 300ms cubic-bezier(0.23, 1, 0.32, 1), opacity 300ms cubic-bezier(0.23, 1, 0.32, 1);
  transform-origin: center top;
}
.ff-zoom-in-top-enter,
.ff-zoom-in-top-leave-active {
  opacity: 0;
  transform: scaleY(0);
}
</style>
