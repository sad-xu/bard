<template>
  <div>
    <div @click="play">
      1
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  created() {
  },
  methods: {
    play() {
      console.log('play')
    }
  }
}
</script>
