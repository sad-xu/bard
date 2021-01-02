const state = {
  showTimbreMenu: false,
  timbreList: [
    {
      id: 1,
      name: '111',
      config: [
        { type: 'OscillatorNode', params: { type: 'square' } },
        {
          type: 'BiquadFilterNode',
          params: {
            type: 'lowshelf',
            frequency: 1000,
            gain: 25
          }
        }
      ]
    },
    {
      id: 2,
      name: '222',
      config: [
        { type: 'OscillatorNode', params: { type: 'sine' } }
      ]
    }
  ]
}

const mutations = {
  SET_SHOW_TIMBRE_MENU: (state, v) => {
    state.showTimbreMenu = v
  }
}

const actions = {
  // 切换菜单
  toggleShowTimbreMenu({ commit, state }) {
    commit('SET_SHOW_TIMBRE_MENU', !state.showTimbreMenu)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
