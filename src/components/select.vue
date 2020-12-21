<template>
  <div class="ff-select" @click.stop="toggleMenu">
    <div class="ff-select-label">
      <span class="ff-arrow" :class="{ 'ff-arrow-rotate': visible }">▶</span>
      <div>{{ selectedLabel }}</div>
    </div>
    <transition name="ff-zome-in-top">
      <ul v-show="visible" class="ff-select-dropdown__list">
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

export default {
  name: 'FfSelect',
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
      selectedLabel: '',
      visible: false
    }
  },
  created() {
    const selecteditem = this.options.find(item => item.value === this.value)
    if (selecteditem) {
      this.selectedLabel = selecteditem.label
    }
  },
  methods: {
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
  border: 1px solid #403b3b;
  border-radius: 5px;
  user-select: none;
}

.ff-select-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  background-color: #6b6d6b;
  color: #fff;
  cursor: pointer;
  .ff-arrow {
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
  .ff-select-dropdown__item {
    font-size: 14px;
    padding: 0 10px;
    // height: 34px;
    // line-height: 34px;
    cursor: pointer;
    &:hover {
      background-color: #f5f7fa;
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
