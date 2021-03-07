<template>
  <ff-dialog
    :visible="showKeyboardMenu"
    title="乐器演奏操作设置" append-to-body
    default-top="10%" @close="closeMenu">
    <!--  -->
    <ff-checkbox v-model="isFullScale" class="checkbox">
      全音阶一同显示、设置按键
    </ff-checkbox>
    <keep-alive>
      <component :is="comp" ref="KeyConfig"></component>
    </keep-alive>
    <!-- footer -->
    <div class="footer">
      <p class="footer-tip">
        请选择要设定的音阶，鼠标右键单击可解除设定
      </p>
      <div class="footer-buttons">
        <!-- <div></div> -->
        <!-- <ff-button @click="reset">
          恢复初期设置
        </ff-button> -->
        <!-- <div> -->
        <ff-button class="apply-button" @click="applySetting">
          应用
        </ff-button>
        <ff-button @click="closeMenu">
          关闭
        </ff-button>
        <!-- </div> -->
      </div>
    </div>
  </ff-dialog>
</template>

<script>
import FullScale from './components/FullScale'
import PartScale from './components/PartScale'

export default {
  name: 'KeyboardMenu',
  data() {
    return {
      isFullScale: this.$store.getters.isFullScale
    }
  },
  computed: {
    comp() {
      return this.isFullScale ? FullScale : PartScale
    },
    showKeyboardMenu() {
      return this.$store.getters.showKeyboardMenu
    }
  },
  watch: {
    showKeyboardMenu(v) {
      if (v) {
        this.$nextTick(() => {
          this.$refs.KeyConfig.init()
        })
      }
    },
    isFullScale(v) {
      this.$nextTick(() => {
        this.$refs.KeyConfig.init()
      })
    }
  },
  methods: {
    // 应用
    applySetting() {
      this.$refs.KeyConfig.applySetting()
      this.closeMenu()
    },
    // 关闭
    closeMenu() {
      // this.initKeyConfig()
      this.$store.dispatch('keyboard/toggleShowKeyboardMenu')
    }
    // 恢复默认
    // reset() {
    //   // TODO 默认设置
    //   this.higherKey = 'shiftKey'
    //   this.lowerKey = 'ctrlKey'
    //   // this.keyConfig =
    // }
  }
}
</script>

<style lang="scss" scoped>

.checkbox {
  margin-bottom: 10px;
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
    justify-content: flex-end;
    .apply-button {
      margin-right: 20px;
    }
  }
}
</style>
