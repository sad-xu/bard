const state = {
  keyMap: {
    higher: 'shiftKey',
    lower: 'ctrlKey',
    common: {
      Digit1: 'C',
      Digit2: 'D',
      Digit3: 'E',
      Digit4: 'F',
      Digit5: 'G',
      Digit6: 'A',
      Digit7: 'B'
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
