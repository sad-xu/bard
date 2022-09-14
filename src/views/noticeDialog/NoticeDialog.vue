<template>
  <ff-dialog
    :visible="showNotice"
    title="最后的话"
    append-to-body
    default-top="10%"
    @close="handleClose">
    <div class="content">
      <p>在2022.9.14收到了腾讯云的停服通知。</p>
      <p>光之演奏家1和2都是用的腾讯云的云服务，不过是不同的环境，单独计费，原本的开销极低。</p>
      <p>不过最近腾讯云更新了计费规则，算下来每个月的费用提高了十几到几十倍吧😅。</p>
      <p>所以我打算在 <span style="color:#f44336;font-weight:bold;">2022.10.14</span> 停止对 光之演奏家1.0 也就是这个网站的服务。</p>
      <p style="margin-top:30px">
        原本1.0是我的一个实验性项目，初期有不少问题，没想到还有人用，经历了断断续续的更新后，这才有了后续的2.0
      </p>
      <p>2.0出来后1.0我也就很少更新了</p>
      <p>1.0的定位是极简、纯粹的演奏练习工具，是一个静态页面，不包含后端服务。2.0的功能是包含1.0的，完全可以替代1.0的功能，这也是我打算停服的原因之一</p>
      <p style="margin-top:30px">
        我看了一下网站的访问统计，每天还是有一些人在用1.0的，在这里告知一下，大家去用2.0吧
      </p>
      <p style="margin-top:30px">
        最近两个月因为一些原因2.0也没有怎么更新，不过在接下来的日子里我会勤快起来的，有一个比较大的改动已经在做了，请大家拭目以待吧！
      </p>
    </div>
  </ff-dialog>
</template>

<script>
export default {
  name: 'NoticeDialog',
  computed: {
    showNotice() {
      return this.$store.getters.showNotice
    }
  },
  mounted() {
    setTimeout(() => {
      this.$store.dispatch('app/toggleNotice')
    }, 500)
  },
  methods: {
    handleClose() {
      this.$store.dispatch('app/toggleNotice')
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  font-size: 15px;
  p {
    margin: 12px 0;
  }
}
</style>
