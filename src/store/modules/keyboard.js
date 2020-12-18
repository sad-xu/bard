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
  }
}

const mutations = {
  SET_KEYMAP: (state, keyMap) => {
    state.keyMap = keyMap
  }
}

const actions = {
  setKeyMap({ commit }, keyMap) {
    commit('SET_KEYMAP', keyMap)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
