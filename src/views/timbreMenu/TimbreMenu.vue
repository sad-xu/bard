<template>
  <ff-dialog
    :visible="showTimbreMenu"
    title="音色设置" append-to-body
    default-left="-30%" default-top="5%" @close="closeTimbreMenu">
    <div class="timbre-wrapper">
      <div
        v-for="(item, index) in timbreList" :key="item.id"
        :class="selectedIndex === index ? 'selected-timbre' : ''"
        class="timbre" @click="handleSelectTimber(index)">
        {{ item.name }}
      </div>
      <div class="timbre">
        +
      </div>
    </div>
    <div class="tuner" @click="showTunerMenu = !showTunerMenu">
      打开调音器
    </div>
    <!--  -->
    <timbre
      v-show="showTunerMenu"
      ref="Timbre"
      @close="showTunerMenu = false">
    </timbre>
  </ff-dialog>
</template>

<script>
import Timbre from './Timbre'

export default {
  name: 'TimbreMenu',
  components: {
    Timbre
  },
  data() {
    return {
      selectedIndex: -1,
      //
      showTunerMenu: false
    }
  },
  computed: {
    showTimbreMenu() {
      return this.$store.getters.showTimbreMenu
    },
    timbreList() {
      return this.$store.getters.timbreList
    }
  },
  methods: {
    handleSelectTimber(index) {
      this.selectedIndex = index
      this.$refs.Timbre.setTimbre(this.timbreList[index])
    },
    closeTimbreMenu() {
      this.showTunerMenu = false
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
