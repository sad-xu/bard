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
        <p>。。。</p>
      </section>
      <section class="part">
        <h3>待做功能</h3>
        <p>。。。</p>
      </section>
      <section class="part">
        <h3>贡献人员</h3>
        <p>[截图] + 角色名@大区</p>
      </section>
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
    height: 200px;
  }
}
</style>
