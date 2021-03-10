<template>
  <div class="part-scale">
    <div class="left-panel">
      <div class="panel-item" style="margin-right: 20px;">
        <key-bind
          v-for="item in keyConfig[0]" :key="item.note"
          :note="item.note" :label="item.label"
          @changeBind="changeBind(item, $event)">
        </key-bind>
      </div>
      <div>
        <div class="panel-item" style="margin-bottom: 28px;">
          <key-bind
            v-for="item in keyConfig[1]" :key="item.note"
            :note="item.truthNote" :label="item.label"
            @changeBind="changeBind(item, $event)">
          </key-bind>
        </div>
        <div class="panel-item">
          <key-bind
            v-for="item in keyConfig[2]" :key="item.note"
            :note="item.truthNote" :label="item.label"
            @changeBind="changeBind(item, $event)">
          </key-bind>
        </div>
      </div>
    </div>
    <div class="right-panel">
      <div class="panel-item">
        <div class="composite">
          <span>高八度</span>
          <ff-select v-model="higherKey" :options="compositeOption"></ff-select>
        </div>
        <div class="composite">
          <span>低八度</span>
          <ff-select v-model="lowerKey" :options="compositeOption"></ff-select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import KeyBind from './KeyBind'

export default {
  components: {
    KeyBind
  },
  data() {
    return {
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
          { note: '1#', truthNote: '1 ♯', label: '', key: '' },
          { note: '3b', truthNote: '3 ♭', label: '', key: '' }
        ],
        [
          { note: '4#', truthNote: '4 ♯', label: '', key: '' },
          { note: '5#', truthNote: '5 ♯', label: '', key: '' },
          { note: '7b', truthNote: '7 ♭', label: '', key: '' }
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
  methods: {
    init() {
      const { higher, lower, common } = this.$store.getters.keyMap
      this.higherKey = higher
      this.lowerKey = lower
      const obj = {}
      for (const code in common) {
        obj[common[code]] = code
      }
      this.keyConfig.forEach(panel => {
        panel.forEach(item => {
          const code = obj[item.note] || ''
          item.label = this.toggleKeycode(code)
          item.key = code
        })
      })
    },
    // 绑定按键
    changeBind(bindItem, bindCode) {
      bindItem.label = this.toggleKeycode(bindCode)
      bindItem.key = bindCode
      // 重复处理
      this.keyConfig.forEach(panel => {
        panel.forEach(item => {
          if (item !== bindItem && item.key === bindCode) {
            item.label = ''
            item.key = ''
          }
        })
      })
    },
    // 应用
    applySetting() {
      const common = {}
      this.keyConfig.forEach(panel => {
        panel.forEach(item => {
          if (item.key) {
            common[item.key] = item.note
          }
        })
      })
      this.$store.dispatch('keyboard/setFullScale', false)
      this.$store.dispatch('keyboard/setKeyMap', {
        higher: this.higherKey,
        lower: this.lowerKey,
        common
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.part-scale {
  display: flex;
  font-size: 14px;
}

.panel-item {
  display: flex;
  flex-direction: column;
}

.left-panel,
.right-panel {
  background-color: #2e302e;
  border-radius: 6px;
  box-shadow: 0 1px 5px 0 #151414;
  padding: 16px;
}

.left-panel {
  display: flex;
  margin-right: 20px;
  width: 340px;
  justify-content: space-between;
  > div {
    width: 120px;
  }
}

.right-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  .panel-item {
    width: 200px;
  }
  .composite {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    &:last-of-type {
      margin-bottom: 0;
    }
  }
}
</style>
