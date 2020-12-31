const state = {
  showTimbreMenu: false
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
