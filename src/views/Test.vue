<template>
  <div class="test-wrapper">
    <div>
      <ff-button @click="handleClickButton">
        按钮
      </ff-button>
    </div>
    <div>
      <ff-select v-model="selectedValue" :options="selectOption" @change="handleSelectChange"></ff-select>
    </div>
    <div>
      <ff-checkbox v-model="checked">
        每小节敲响震铃
      </ff-checkbox>
    </div>
  </div>
</template>

<script>
import FfButton from '@/components/button.vue'
import FfSelect from '@/components/select.vue'
import FfCheckbox from '@/components/checkbox.vue'

export default {
  name: 'Test',
  components: {
    FfButton,
    FfSelect,
    FfCheckbox
  },
  data() {
    return {
      selectedValue: '',
      selectOption: [
        { label: 'Shift', value: 'ShiftKey' },
        { label: 'Alt', value: 'AltKey' },
        { label: 'Ctrl', value: 'CtrlKey' }
      ],
      checked: false
    }
  },
  created() {
    this.selectedValue = this.selectOption[0].value
  },
  methods: {
    handleClickButton() {
      console.log('button')
    },
    handleSelectChange(item) {
      console.log('select', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.test-wrapper {
  padding: 20px;
  > div {
    margin: 20px;
  }
}
</style>
