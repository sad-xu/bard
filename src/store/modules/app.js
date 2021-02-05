const state = {
  showMusicScore: false
}

const mutations = {
  SET_SHOW_MUSIC_SCORE: (state, v) => {
    state.showMusicScore = v
  }
}

const actions = {
  toggleMusicScore({ commit, state }) {
    commit('SET_SHOW_MUSIC_SCORE', !state.showMusicScore)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
