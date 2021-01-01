<template>
  <ff-dialog
    append-to-body
    default-right="-60%" default-top="30%"
    width="200px" @close="$emit('close')">
    调音器 {{ timbreId }}
    <ff-button @click="changeTimbre"></ff-button>
  </ff-dialog>
</template>

<script>
import sounder from '@/utils/Sound'

export default {
  name: 'Timbre',
  props: {
    timbreId: {
      type: String,
      required: true
    }
  },
  data() {
    return {

    }
  },
  watch: {
    timbreId: {
      handler(id) {

      },
      immediate: true
    }
  },
  methods: {
    init(id) {
      console.log(id)
    },
    changeTimbre() {
      console.log('设置过滤器')
      sounder.setTimbre()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
