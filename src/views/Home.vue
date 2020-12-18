<template>
  <div>
    <!-- <canvas id="bg-canvas"></canvas> -->
    <keyboard-menu></keyboard-menu>
    <keyboard @sing="sing"></keyboard>
  </div>
</template>

<script>
import sounder from '@/utils/Sound'
import Keyboard from './keyboard/Keyboard'
import KeyboardMenu from './keyboardmenu/KeyboardMenu'

export default {
  name: 'Home',
  components: {
    Keyboard,
    KeyboardMenu
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
