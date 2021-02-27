<template>
  <label class="ff-checkbox" :class="{ 'is-checked': value }">
    <div class="ff-checkbox-inner"></div>
    <input
      v-model="value"
      class="ff-checkbox__input" type="checkbox"
      @change="handleChange">
    <span class="ff-checkbox__label">
      <slot></slot>
    </span>
  </label>
</template>

<script>
/**
 * 单选框
 * v-model 绑定值
 *
 * @change 绑定值变化时触发
 *
 */

export default {
  name: 'FfCheckbox',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    handleChange() {
      this.$emit('change', this.value)
    }
  }
}
</script>

<style lang="scss" scoped>
.ff-checkbox {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  .ff-checkbox-inner {
    width: 14px;
    height: 14px;
    position: relative;
    border: 1px solid #777;
    border-radius: 2px;
    margin-right: 4px;
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
  .ff-checkbox__input {
    opacity: 0;
    position: absolute;
    margin: 0;
    width: 0;
    height: 0;
    z-index: -1;
  }
  .ff-checkbox__label {
    color: #dcd2ba;
    font-size: 14px;
  }
}

.is-checked {
  .ff-checkbox-inner {
    &::after {
      background-color: #ffcb48;
    }
  }
}
</style>
