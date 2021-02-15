<template>
  <ff-dialog
    :visible="showKeyboardMenu"
    title="乐器演奏操作设置" append-to-body
    default-top="10%" @close="closeMenu">
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
          <div class="panel-item" style="margin-bottom: 28px;">
            <key-bind
              v-for="item in keyConfig[1]" :key="item.note"
              :note="item.note" :truth-note="item.truthNote" :label="item.label"
              @changeBind="changeBind(item, $event)">
            </key-bind>
          </div>
          <div class="panel-item">
            <key-bind
              v-for="item in keyConfig[2]" :key="item.note"
              :note="item.note" :truth-note="item.truthNote" :label="item.label"
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
    <!-- footer -->
    <div class="footer">
      <p class="footer-tip">
        请选择要设定的音阶，鼠标右键单击可解除设定
      </p>
      <div class="footer-buttons">
        <ff-button @click="reset">
          恢复初期设置
        </ff-button>
        <div>
          <ff-button class="apply-button" @click="applySetting">
            应用
          </ff-button>
          <ff-button @click="closeMenu">
            关闭
          </ff-button>
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
  computed: {
    showKeyboardMenu() {
      return this.$store.getters.showKeyboardMenu
    }
  },
  created() {
    this.initKeyConfig()
  },
  methods: {
    initKeyConfig() {
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
      this.$store.dispatch('keyboard/setKeyMap', {
        higher: this.higherKey,
        lower: this.lowerKey,
        common
      })
      this.closeMenu()
    },
    // 关闭
    closeMenu() {
      this.initKeyConfig()
      this.$store.dispatch('keyboard/toggleShowKeyboardMenu')
    },
    // 恢复默认
    reset() {
      // TODO 默认设置
      this.higherKey = 'shiftKey'
      this.lowerKey = 'ctrlKey'
      // this.keyConfig =
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
  border-radius: 6px;
  box-shadow: 0 1px 5px 0 #151414;
  padding: 20px;
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
  .panel-item {
    width: 200px;
    margin-bottom: 15px;
  }
  .composite {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
  }
}

.footer {
  margin-top: 25px;
  border-top: 2px solid #4e4a4e;
  .footer-tip {
    font-size: 13px;
    margin: 10px 0 10px 10px;
  }
  .footer-buttons {
    display: flex;
    justify-content: space-between;
    .apply-button {
      margin-right: 20px;
    }
  }
}

</style>
