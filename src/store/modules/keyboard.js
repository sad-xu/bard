const state = {
  keyMap: {
    higher: 'shiftKey',
    lower: 'ctrlKey',
    common: { // 物理按键 -> 音符
      Digit1: '1',
      KeyZ: '1#',
      Digit2: '2',
      KeyX: '3b',
      Digit3: '3',
      Digit4: '4',
      KeyC: '4#',
      Digit5: '5',
      KeyV: '5#',
      Digit6: '6',
      KeyB: '7b',
      Digit7: '7',
      Digit8: 'i'
    }
  },
  showKeyboardMenu: false
}

const mutations = {
  SET_KEYMAP: (state, keyMap) => {
    state.keyMap = keyMap
  },
  SET_SHOW_KEYBOARD_MENU: (state, v) => {
    state.showKeyboardMenu = v
  }
}

const actions = {
  // 设置快捷键
  setKeyMap({ commit }, keyMap) {
    console.log(keyMap)
    commit('SET_KEYMAP', keyMap)
  },
  // 切换菜单
  toggleShowKeyboardMenu({ commit, state }) {
    commit('SET_SHOW_KEYBOARD_MENU', !state.showKeyboardMenu)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
