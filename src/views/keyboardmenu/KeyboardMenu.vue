<template>
  <ff-dialog title="乐器演奏操作设置" append-to-body @close="closeMenu">
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
              :note="item.note" :label="item.label"
              @changeBind="changeBind(item, $event)">
            </key-bind>
          </div>
          <div class="panel-item">
            <key-bind
              v-for="item in keyConfig[2]" :key="item.note"
              :note="item.note" :label="item.label"
              @changeBind="changeBind(item, $event)">
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
            <div></div>
          </div>
          <div>
            <span>低半音</span>
            <div></div>
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
          <ff-button @click="applySetting">
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
  methods: {
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
    margin-bottom: 15px;
  }
}

.footer {
  margin-top: 40px;
  border-top: 2px solid #4e4a4e;
  .footer-tip {
    font-size: 13px;
    margin: 6px 0 6px 10px;
  }
  .footer-buttons {
    display: flex;
    justify-content: space-between;
  }
}

</style>
