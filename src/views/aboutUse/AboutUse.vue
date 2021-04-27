<template>
  <ff-dialog
    :visible="showAboutUse"
    title="使用须知" append-to-body
    default-top="5%" default-bottom="5%"
    @close="handleClose">
    <div class="content">
      <section class="part">
        <h3>简介</h3>
        <p>
          <span style="font-weight: bold; color: #4db6ac; font-size: 18px;">光之演奏家</span>
          ，为 FF14 量身打造的演奏工具
        </p>
      </section>
      <section class="part">
        <h3>功能</h3>
        <p>和 FF14 一致的，基于 Web Audio 的演奏功能</p>
        <p>和 FF14 一致的，两种键盘 & 自定义键位</p>
        <p>和 FF14 一致的，乐器选择 🎸🎻🎹🎺🥁</p>
        <p>解析 MIDI 文件为曲谱</p>
        <p>播放解析出的曲谱</p>
        <p>不断更新的曲库</p>
        <p>PWA功能，可添加到桌面或手机主屏幕作为 App 使用✌</p>
        <p>移动端适配</p>
        <p>常亮模式 - 移动端不熄屏功能（部分浏览器有效）</p>
        <p>沉浸模式 - PC端不会按键冲突（部分浏览器有效）</p>
        <p>可上传、解析本地 .mid 文件</p>
      </section>
      <section class="part">
        <h3>待做功能</h3>
        <p>演奏/音游模式</p>
        <p>体验优化</p>
      </section>
      <section class="part">
        <h3>注意事项</h3>
        <p>本项目为纯前端工具类项目，可离线使用（midi曲谱需要提前缓存）</p>
        <p>由于浏览器及系统限制，非 沉浸模式 下，以下组合键无法演奏</p>
        <p>[Shift] Ctrl (Q|N|W|T|Tab) 等</p>
        <p>本项目使用的一些新特性，在不同浏览器上可能会有差别</p>
        <p>若出现问题，请升级浏览器到最新版本，推荐使用 Chrome 浏览器</p>
      </section>
      <section class="part">
        <h3>曲谱提供</h3>
        <p>大部分曲谱均来自 midishow.com, 感谢所有作者 <span style="color: #f44336;">❤</span></p>
        <p>感谢 <span style="color: #f06292;">QWQPOI@midishow</span> 的协助</p>
      </section>
      <section class="part">
        <h3>联系与反馈</h3>
        <p>若有任何问题，请联系我</p>
        <p>QQ: <span style="color: #42a5f5;">1031568754</span></p>
        <p style="color: #c7a2e8;">
          妙蛤种子@琥珀原
        </p>
      </section>
    </div>
  </ff-dialog>
</template>

<script>
export default {
  name: 'AboutUse',
  data() {
    return {

    }
  },
  computed: {
    showAboutUse() {
      return this.$store.getters.showAboutUse
    }
  },
  methods: {
    handleClose() {
      this.$store.dispatch('app/toggleAboutUse')
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  // height: 80vh;
  padding-top: 20px;
  margin-right: -10px;
  user-select: text;
  ::selection {
    background-color: #eee;
    color: #383838;
  }
  // overflow-y: auto;
  // scrollbar-width: thin;
  // scrollbar-color: #686868 rgba(0, 0, 0, 0.2);
  // &::-webkit-scrollbar {
  //   width: 6px;
  //   height: 6px;
  // }
  // &::-webkit-scrollbar-track {
  //   background: rgba(0, 0, 0, 0.2);
  //   border-radius: 4px;
  // }
  // &::-webkit-scrollbar-thumb {
  //   background-color: #686868;
  //   border-radius: 4px;
  //   &:hover {
  //     background-color: rgba(144, 147, 153, 0.5);
  //   }
  // }
  .part {
    margin-bottom: 40px;
    h3 {
      margin-bottom: 10px;
      color: #bbb;
    }
    p {
      font-size: 16px;
      line-height: 22px;
      margin: 10px 0;
      color: #f0f0f0;
    }
  }
}
</style>
