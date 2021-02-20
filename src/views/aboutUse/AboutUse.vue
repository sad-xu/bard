<template>
  <ff-dialog
    :visible="showAboutUse"
    title="使用须知" append-to-body
    default-top="5%" @close="handleClose">
    <div class="content">
      <section class="part">
        <h3>简介</h3>
        <p>咋写咋写咋写</p>
      </section>
      <section class="part">
        <h3>功能</h3>
        <p>和 FF14 一致的，基于 Web Audio 的演奏功能</p>
        <p>和 FF14 一致的，自定义键位映射</p>
        <p>解析 MIDI 文件为曲谱</p>
        <p>播放解析出的曲谱</p>
        <p>不断更新的曲库</p>
      </section>
      <section class="part">
        <h3>待做功能</h3>
        <p>乐谱高低音提示标注</p>
        <p>乐谱切换键位谱</p>
        <p>全键盘按键</p>
        <p>移动端适配 & 差异性功能</p>
        <p>音色/乐器选择</p>
        <p>本地配置存储</p>
        <p>音量调节</p>
        <p>场景音选择</p>
        <p>PWA功能</p>
        <p>倍速</p>
        <p>根据实时频谱丰富背景</p>
        <p>体验优化</p>
      </section>
      <section class="part">
        <h3>注意事项</h3>
        <p>本项目为纯前端工具类项目，可离线使用（midi曲谱需要提前缓存）</p>
        <p>由于浏览器及系统限制，以下组合键无法演奏</p>
        <p>[Shift] Ctrl (Q|N|W|T|Tab) 等</p>
        <p>本项目使用的一些新特性，在不同浏览器上可能会有差别，若出现问题，请升级浏览器到最新版本，推荐使用 Chrome 浏览器</p>
      </section>
      <!-- <section class="part">
        <h3>贡献人员</h3>
        <p>[截图] + 角色名@大区</p>
      </section> -->
      <section class="part">
        <h3>联系与反馈</h3>
        <p>xxx</p>
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
  height: 80vh;
  padding-top: 20px;
  margin-right: -10px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #686868 rgba(0, 0, 0, 0.2);
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #686868;
    border-radius: 4px;
    &:hover {
      background-color: rgba(144, 147, 153, 0.5);
    }
  }
  .part {
    margin-bottom: 40px;
    h3 {
      margin-bottom: 10px;
    }
    p {
      font-size: 16px;
      line-height: 22px;
      color: #e8e8e8;
    }
  }
}
</style>
