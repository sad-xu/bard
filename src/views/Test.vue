<template>
  <div class="test-wrapper">
    <ff-button @click="handleClickButton">
      按钮
    </ff-button>
    <ff-select v-model="selectedValue" :options="selectOption"></ff-select>
  </div>
</template>

<script>
import FfButton from '@/components/button.vue'
import FfSelect from '@/components/select.vue'

export default {
  name: 'Test',
  components: {
    FfButton,
    FfSelect
  },
  data() {
    return {
      selectedValue: '',
      selectOption: [
        { label: 'Shift', value: 'ShiftKey' },
        { label: 'Alt', value: 'AltKey' },
        { label: 'Ctrl', value: 'CtrlKey' }
      ]
    }
  },
  methods: {
    handleClickButton() {
      console.log('button')
    }
  }
}
</script>

<style lang="scss" scoped>
.test-wrapper {
  padding: 20px;
}
</style>
