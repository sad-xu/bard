<template>
  <div class="test-wrapper">
    <div>
      <ff-button @click="handleClick">
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
  </div>
</template>

<script>
import Music from '@/utils/Music'

// Music.setZone()
const musician = new Music()

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
    // https://github.com/surikov/webaudiofont/blob/1e4779b58f05d54223573eef69b7730503fb106d/npm/src/player.js#L78
    // https://surikov.github.io/webaudiofont/examples/midiplayer.html
    this.selectedValue = this.selectOption[0].value
  },
  methods: {
    handleClick() {
      musician.sing('', '', '')
      setTimeout(() => {
        musician.sing('', '', 'high')
        setTimeout(() => {
          musician.sing('', '', 'low')
        }, 1500)
      }, 1500)
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
