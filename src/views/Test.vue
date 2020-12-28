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
    <div>
      <ff-silder v-model="silderNum" @change="handleSilderChange"></ff-silder>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Test',
  data() {
    return {
      selectedValue: '',
      selectOption: [
        { label: 'Shift', value: 'ShiftKey' },
        { label: 'Alt', value: 'AltKey' },
        { label: 'Ctrl', value: 'CtrlKey' }
      ],
      checked: false,
      silderNum: 9
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
    },
    handleSilderChange(value) {
      console.log('silder', value)
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
