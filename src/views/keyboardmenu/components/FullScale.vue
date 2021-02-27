<template>
  <div class="full-scale">
    <div class="full-panel">
      <table class="key-table">
        <tr>
          <th></th>
          <th>1</th>
          <th>2</th>
          <th>3</th>
          <th>4</th>
          <th>5</th>
          <th>6</th>
          <th>7</th>
          <th>i</th>
        </tr>
        <tr v-for="(key, i) in tonesList" :key="key">
          <td>
            <div class="indicator">
              <div v-for="k in 3" :key="k" :class="i + k == 3 ? 'light' : ''"></div>
            </div>
          </td>
          <td v-for="j in 7" :key="j">
            <key-bind
              :label="keyConfig[0][key][j - 1].label"
              @changeBind="changeBind(keyConfig[0][key][j - 1], $event)">
            </key-bind>
          </td>
          <td v-if="key === 'high'">
            <key-bind
              :label="keyConfig[0][key][7].label"
              @changeBind="changeBind(keyConfig[0][key][7], $event)">
            </key-bind>
          </td>
        </tr>
      </table>
    </div>
    <div style="display: flex; justify-content: space-between;">
      <div class="half-panel">
        <table class="key-table">
          <tr class="key-header">
            <th></th>
            <th>1 ♯</th>
            <th>3 ♭</th>
            <th>4 ♯</th>
            <th>5 ♯</th>
            <th>7 ♭</th>
          </tr>
          <tr v-for="(key, i) in tonesList" :key="key">
            <td>
              <div class="indicator">
                <div v-for="k in 3" :key="k" :class="i + k == 3 ? 'light' : ''"></div>
              </div>
            </td>
            <td v-for="j in 5" :key="j">
              <key-bind
                :label="keyConfig[1][key][j - 1].label"
                @changeBind="changeBind(keyConfig[1][key][j - 1], $event)">
              </key-bind>
            </td>
          </tr>
        </table>
      </div>
      <div class="composite-panel">
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
      tonesList: ['high', 'medium', 'low'],
      keyConfig: [{
        high: [
          { note: '1-h', label: '', key: '' },
          { note: '2-h', label: '', key: '' },
          { note: '3-h', label: '', key: '' },
          { note: '4-h', label: '', key: '' },
          { note: '5-h', label: '', key: '' },
          { note: '6-h', label: '', key: '' },
          { note: '7-h', label: '', key: '' },
          { note: 'i', label: '', key: '' }
        ],
        medium: [
          { note: '1', label: '', key: '' },
          { note: '2', label: '', key: '' },
          { note: '3', label: '', key: '' },
          { note: '4', label: '', key: '' },
          { note: '5', label: '', key: '' },
          { note: '6', label: '', key: '' },
          { note: '7', label: '', key: '' }
        ],
        low: [
          { note: '1-l', label: '', key: '' },
          { note: '2-l', label: '', key: '' },
          { note: '3-l', label: '', key: '' },
          { note: '4-l', label: '', key: '' },
          { note: '5-l', label: '', key: '' },
          { note: '6-l', label: '', key: '' },
          { note: '7-l', label: '', key: '' }
        ]
      }, {
        high: [
          { note: '1#-h', truthNote: '1 ♯', label: '', key: '' },
          { note: '3b-h', truthNote: '3 ♭', label: '', key: '' },
          { note: '4#-h', truthNote: '4 ♯', label: '', key: '' },
          { note: '5#-h', truthNote: '5 ♯', label: '', key: '' },
          { note: '7b-h', truthNote: '7 ♭', label: '', key: '' }
        ],
        medium: [
          { note: '1#', truthNote: '1 ♯', label: '', key: '' },
          { note: '3b', truthNote: '3 ♭', label: '', key: '' },
          { note: '4#', truthNote: '4 ♯', label: '', key: '' },
          { note: '5#', truthNote: '5 ♯', label: '', key: '' },
          { note: '7b', truthNote: '7 ♭', label: '', key: '' }
        ],
        low: [
          { note: '1#-l', truthNote: '1 ♯', label: '', key: '' },
          { note: '3b-l', truthNote: '3 ♭', label: '', key: '' },
          { note: '4#-l', truthNote: '4 ♯', label: '', key: '' },
          { note: '5#-l', truthNote: '5 ♯', label: '', key: '' },
          { note: '7b-l', truthNote: '7 ♭', label: '', key: '' }
        ]
      }],
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
      this.handleConfigItem(item => {
        const code = obj[item.note] || ''
        item.label = this.toggleKeycode(code)
        item.key = code
      })
    },
    // 绑定按键
    changeBind(bindItem, bindCode) {
      // this.$set(bindItem, 'label', this.toggleKeycode(bindCode))
      bindItem.label = this.toggleKeycode(bindCode)
      bindItem.key = bindCode
      // 重复处理
      this.handleConfigItem(item => {
        if (item !== bindItem && item.key === bindCode) {
          item.label = ''
          item.key = ''
        }
      })
    },
    applySetting() {
      const common = {}
      this.handleConfigItem(item => {
        if (item.key) {
          common[item.key] = item.note
        }
      })
      this.$store.dispatch('keyboard/setFullScale', true)
      this.$store.dispatch('keyboard/setKeyMap', {
        higher: this.higherKey,
        lower: this.lowerKey,
        common
      })
    },
    // 遍历并操作每一项
    handleConfigItem(fn) {
      this.keyConfig.forEach(panel => {
        this.tonesList.forEach(key => {
          panel[key].forEach(item => {
            fn(item)
          })
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.full-scale {
  font-size: 14px;
  .full-panel,
  .half-panel,
  .composite-panel {
    background-color: #2e302e;
    border-radius: 6px;
    box-shadow: 0 1px 5px 0 #151414;
    padding: 16px;
  }
  .full-panel {
    display: inline-block;
    margin-bottom: 15px;
  }
  .composite-panel {
    width: 230px;
    color: #d9ceb6;
    .composite {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
      &:last-of-type {
        margin-bottom: 0;
      }
    }
  }
}

.key-table {
  tr {
    text-align: center;
    th {
      color: #dfd4bb;
      font-weight: normal;
      padding: 2px 4px;
    }
    td {
      padding: 2px 4px;
    }
  }
}

.indicator {
  display: flex;
  border-radius: 50px;
  box-shadow: inset 0 0 0 1px #79715c;
  overflow: hidden;
  > div {
    width: 16px;
    height: 16px;
    flex-grow: 1;
    border-right: 1px solid #79715c;
    &:first-child {
      border-top-left-radius: 50px;
      border-bottom-left-radius: 50px;
    }
    &:last-child {
      border-top-right-radius: 50px;
      border-bottom-right-radius: 50px;
      border-right: 0;
    }
  }
  .light {
    background-color: #d9c2a2;
    border-color: #d9c2a2;
    &::after {
      content: '♪';
      display: inline-block;
      color: #333;
    }
  }
}
</style>
