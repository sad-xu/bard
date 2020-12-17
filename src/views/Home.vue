<template>
  <div>
    <!-- <canvas id="bg-canvas"></canvas> -->
    <menu-board></menu-board>
    <key-board @sing="sing"></key-board>
  </div>
</template>

<script>
import Sound from '@/utils/Sound'
import KeyBoard from './keyboard/KeyBoard'
import MenuBoard from './menuboard/MenuBoard'

const sounder = new Sound()

export default {
  name: 'Home',
  components: {
    MenuBoard,
    KeyBoard
  },
  data() {
    return {

    }
  },
  methods: {
    sing({ note, pitch }) {
      sounder.sing(note, pitch)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
