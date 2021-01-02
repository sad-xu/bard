<template>
  <ff-dialog
    append-to-body
    default-right="-60%" default-top="30%"
    width="200px" @close="$emit('close')">
    调音器 {{ timbreName }}
  </ff-dialog>
</template>

<script>
import sounder from '@/utils/Sound'

export default {
  name: 'Timbre',
  data() {
    return {
      timbreName: ''
    }
  },
  methods: {
    setTimbre({ id, name, config }) {
      console.log('设置过滤器')
      this.timbreName = name
      sounder.setTimbre(config)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
