<template>
  <ff-dialog
    title="音色设置" append-to-body
    default-left="-30%" default-top="5%" @close="closeTimbreMenu">
    <div class="timbre-wrapper">
      <div
        v-for="(item, index) in timbreList" :key="item.id"
        :class="selectedIndex === index ? 'selected-timbre' : ''"
        class="timbre" @click="selectedIndex = index">
        {{ item.name }}
      </div>
      <div class="timbre">
        +
      </div>
    </div>
    <div class="tuner" @click="showTunerMenu = true">
      打开调音器
    </div>
    <ff-dialog
      v-if="showTunerMenu" append-to-body
      default-right="-60%" default-top="30%"
      width="200px" @close="showTunerMenu = false">
      调音器
    </ff-dialog>
  </ff-dialog>
</template>

<script>
export default {
  name: 'TimbreMenu',
  data() {
    return {
      selectedIndex: 0,
      timbreList: [
        { name: 'xxxx', id: 'piano' },
        { name: 'aaaa', id: '1' },
        { name: 'bbbb', id: '2' },
        { name: 'cccc', id: '3' },
        { name: 'dddd', id: '4' },
        { name: 'eeee', id: '5' },
        { name: 'ffff', id: '6' },
        { name: 'gggg', id: '7' },
        { name: 'hhhh', id: '8' }
      ],
      //
      showTunerMenu: false
    }
  },
  methods: {
    closeTimbreMenu() {
      this.$store.dispatch('timbre/toggleShowTimbreMenu')
    }
  }
}
</script>

<style lang="scss" scoped>
.timbre-wrapper {
  display: flex;
  flex-wrap: wrap;
  .timbre {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 80px;
    margin: 15px;
    background-color: pink;
    border-radius: 10px;
    cursor: pointer;
  }
  .selected-timbre {
    box-shadow: 0 0 6px 6px #dc5c5c;
  }
}

.tuner {
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>
