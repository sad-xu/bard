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
  font-size: 14px;
  padding: 6px 50px;
  text-align: center;
  line-height: 1;
  color: #fff;
  background-color: #403b3b;
  // linear-gradient(to top, #353434, #6f6f6f)
  border-radius: 50px;
  box-shadow: 1px 1px 2px 0 #202020;
  border: 1px solid #212121;
  border-top-color: #767676;
  border-left-color: #767676;
  transition: background-color 0.3s;
  white-space: nowrap;
  outline: none;
  user-select: none;
  cursor: pointer;
  &:focus,
  &:hover {
    background-color: #4d4b4b;
  }
  &:active {
    background-color: #191818;
  }
}
</style>
