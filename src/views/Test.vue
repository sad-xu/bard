<template>
  <div class="test-wrapper">
    <div>
      <ff-button>
        button
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
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
        version="1.1" width="20" height="20">
        <circle
          id="svg-c" cx="10" cy="10"
          r="7"
          fill="green" />
      </svg>
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
  mounted() {
    this.initSvg()
  },
  methods: {
    initSvg() {
      const svgC = this.$el.querySelector('#svg-c')
      console.log(svgC)
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
  background-color: #eee;
  > div {
    margin: 20px;
  }
}

</style>
