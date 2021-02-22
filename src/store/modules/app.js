const state = {
  isMobile: /Android|webOS|iPhone|iPod|BlackBerry/i.test(window.navigator.userAgent),
  showMusicScore: false,
  showAboutUse: false
}

const mutations = {
  SET_SHOW_MUSIC_SCORE: (state, v) => {
    state.showMusicScore = v
  },
  SET_SHOW_ABOUT_USE: (state, v) => {
    state.showAboutUse = v
  }
}

const actions = {
  toggleMusicScore({ commit, state }) {
    commit('SET_SHOW_MUSIC_SCORE', !state.showMusicScore)
  },
  toggleAboutUse({ commit, state }) {
    commit('SET_SHOW_ABOUT_USE', !state.showAboutUse)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
