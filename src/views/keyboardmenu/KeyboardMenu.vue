<template>
  <ff-dialog title="乐器演奏操作设置">
    <div>
      <input type="radio">
      <span>全音阶一同显示、设置按键</span>
    </div>
    <div class="panel-wrapper">
      <div class="panel">
        <div class="panel-item">
          <div v-for="item in keyConfig[0]" :key="item.note">
            {{ item.note }}
            <div class="input">
              {{ item.key }}
            </div>
          </div>
        </div>
        <div>
          <div class="panel-item">
            <div v-for="item in keyConfig[1]" :key="item.note">
              {{ item.note }}
              <div class="input">
                {{ item.key }}
              </div>
            </div>
          </div>
          <div class="panel-item">
            <div v-for="item in keyConfig[2]" :key="item.note">
              {{ item.note }}
              <div class="input">
                {{ item.key }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="panel">
      </div>
    </div>
  </ff-dialog>
</template>

<script>
export default {
  name: 'KeyboardMenu',
  data() {
    return {
      keyConfig: [
        [
          { note: '1', key: '' },
          { note: '2', key: '' },
          { note: '3', key: '' },
          { note: '4', key: '' },
          { note: '5', key: '' },
          { note: '6', key: '' },
          { note: '7', key: '' },
          { note: 'i', key: '' }
        ],
        [
          { note: '1#', key: '' },
          { note: '3b', key: '' }
        ],
        [
          { note: '4#', key: '' },
          { note: '5#', key: '' },
          { note: '6b', key: '' }
        ]
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-wrapper {
  display: flex;
}
.panel {
  display: flex;
  background-color: #2e302e;
  box-shadow: 1px 1px #000;
  padding: 18px;
  > div {
    width: 130px;
  }
  .panel-item {
    display: flex;
    flex-direction: column;
    > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}

.input {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 18px;
  background-color: #c7c7c7;
  color: #3a3a3a;
}
</style>
