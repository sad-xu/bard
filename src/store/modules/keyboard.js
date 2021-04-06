const state = {
  // 是否是全音阶
  isFullScale: Boolean(Number(localStorage.getItem('isFullScale'))), // false,
  keyMap: initKeyMap(),
  showKeyboardMenu: false
}

function initKeyMap() {
  const storageKeyMap = JSON.parse(localStorage.getItem('keyMap'))
  if (storageKeyMap) {
    if (!storageKeyMap.highSemitone) {
      storageKeyMap.highSemitone = { label: '', key: '' }
    }
    if (!storageKeyMap.lowSemitone) {
      storageKeyMap.lowSemitone = { label: '', key: '' }
    }
  }
  return storageKeyMap || {
    higher: 'shiftKey',
    lower: 'ctrlKey',
    highSemitone: { label: '', key: '' },
    lowSemitone: { label: '', key: '' },
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
  }
}

const mutations = {
  SET_FULL_SCALE: (state, status) => {
    state.isFullScale = status
  },
  SET_KEYMAP: (state, keyMap) => {
    state.keyMap = keyMap
  },
  SET_SHOW_KEYBOARD_MENU: (state, v) => {
    state.showKeyboardMenu = v
  }
}

const actions = {
  // 切换键盘 全音阶
  setFullScale({ commit }, status) {
    commit('SET_FULL_SCALE', status)
    localStorage.setItem('isFullScale', Number(status))
  },
  // 设置快捷键
  setKeyMap({ commit }, keyMap) {
    commit('SET_KEYMAP', keyMap)
    localStorage.setItem('keyMap', JSON.stringify(keyMap))
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
