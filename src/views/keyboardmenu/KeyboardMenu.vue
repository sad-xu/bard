<template>
  <ff-dialog title="乐器演奏操作设置">
    <ff-checkbox v-model="showFullScale">
      全音阶一同显示、设置按键
    </ff-checkbox>
    <!--  -->
    <div class="panel-wrapper">
      <div class="left-panel">
        <div class="panel-item">
          <key-bind
            v-for="item in keyConfig[0]" :key="item.note"
            :note="item.note" :label="item.label"
            @changeBind="changeBind(item, $event)">
          </key-bind>
        </div>
        <div>
          <div class="panel-item">
            <key-bind
              v-for="item in keyConfig[1]" :key="item.note"
              :note="item.note" :label="item.label">
            </key-bind>
          </div>
          <div class="panel-item">
            <key-bind
              v-for="item in keyConfig[2]" :key="item.note"
              :note="item.note" :label="item.label">
            </key-bind>
          </div>
        </div>
      </div>
      <div class="right-panel">
        <div class="panel-item">
          <div>
            <span>高八度</span>
            <ff-select v-model="higherKey" :options="compositeOption"></ff-select>
          </div>
          <div>
            <span>低八度</span>
            <ff-select v-model="lowerKey" :options="compositeOption"></ff-select>
          </div>
        </div>
        <div class="panel-item">
          <div>
            <span>高半音</span>
            <div class="input"></div>
          </div>
          <div>
            <span>低半音</span>
            <div class="input"></div>
          </div>
        </div>
      </div>
    </div>
  </ff-dialog>
</template>

<script>
import KeyBind from './KeyBind'

export default {
  name: 'KeyboardMenu',
  components: {
    KeyBind
  },
  data() {
    return {
      showFullScale: false,
      // note 音符 label 显示按键 key 物理按键
      keyConfig: [
        [
          { note: '1', label: '', key: '' },
          { note: '2', label: '', key: '' },
          { note: '3', label: '', key: '' },
          { note: '4', label: '', key: '' },
          { note: '5', label: '', key: '' },
          { note: '6', label: '', key: '' },
          { note: '7', label: '', key: '' },
          { note: 'i', label: '', key: '' }
        ],
        [
          { note: '1#', label: '', key: '' },
          { note: '3b', label: '', key: '' }
        ],
        [
          { note: '4#', label: '', key: '' },
          { note: '5#', label: '', key: '' },
          { note: '6b', label: '', key: '' }
        ]
      ],
      higherKey: 'shiftKey',
      lowerKey: 'ctrlKey',
      compositeOption: [
        { label: 'Shift', value: 'shiftKey' },
        { label: 'Alt', value: 'altKey' },
        { label: 'Ctrl', value: 'ctrlKey' }
      ]
    }
  },
  created() {
    const { higher, lower, common } = this.$store.getters.keyMap
    this.higherKey = higher
    this.lowerKey = lower
    const obj = {}
    const regExp = /Digit|Key/
    for (const code in common) {
      obj[common[code]] = code
    }
    this.keyConfig.forEach(panel => {
      panel.forEach(item => {
        const code = obj[item.note] || ''
        item.label = regExp.test(code) ? code.slice(-1) : code
        item.key = code
      })
    })
  },
  methods: {
    changeBind(item, code) {
      console.log(item, code)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-wrapper {
  display: flex;
  margin-top: 10px;
  color: #eee2c8;
  font-size: 14px;
}

.panel-item {
  display: flex;
  flex-direction: column;
}

.left-panel,
.right-panel {
  background-color: #2e302e;
  box-shadow: 1px 1px #000;
  padding: 18px;
}

.left-panel {
  display: flex;
  margin-right: 20px;
  width: 350px;
  justify-content: space-between;
  > div {
    width: 130px;
  }
}

.right-panel {
  display: flex;
  flex-direction: column;
  .panel-item {
    width: 200px;
  }
}

</style>
