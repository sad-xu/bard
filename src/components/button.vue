<template>
  <button
    class="ff-button" type="button"
    @click="handelClick">
    <span>
      <slot></slot>
    </span>
  </button>
</template>

<script>
/**
 * 按钮
 *
 */

export default {
  name: 'FfButton',
  methods: {
    handelClick(e) {
      this.$emit('click', e)
    }
  }
}
</script>

<style lang="scss" scoped>
.ff-button {
  display: inline-block;
  line-height: 1;
  color: #fff;
  background-color: #403b3b;
  font-size: 14px;
  text-align: center;
  transition: 0.1s;
  padding: 12px 20px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  white-space: nowrap;
  outline: none;
  user-select: none;
  cursor: pointer;
  &:focus,
  &:hover {
    background-color: #6f6a6a;
  }
  &:active {
    background-color: #191818;
  }
}
</style>
