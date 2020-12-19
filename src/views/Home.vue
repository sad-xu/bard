<template>
  <div>
    <!-- <canvas id="bg-canvas"></canvas> -->
    <keyboard-menu v-if="showKeyboardMenu"></keyboard-menu>
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
  computed: {
    showKeyboardMenu() {
      return this.$store.getters.showKeyboardMenu
    }
  },
  methods: {
    sing({ note, pitch }) {
      sounder.sing(note, pitch)
    }
  }
}
</script>
