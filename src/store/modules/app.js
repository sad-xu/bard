const state = {
  isMobile: /Android|webOS|iPhone|iPod|BlackBerry/i.test(window.navigator.userAgent),
  showMusicScore: false,
  showAboutUse: false,
  showInstrumentMenu: false,
  showNotice: false
}

const mutations = {
  SET_SHOW_MUSIC_SCORE: (state, v) => {
    state.showMusicScore = v
  },
  SET_SHOW_ABOUT_USE: (state, v) => {
    state.showAboutUse = v
  },
  SET_SHOW_INSTRUMENT_MENU: (state, v) => {
    state.showInstrumentMenu = v
  },
  SET_SHOW_NOTICE: (state, v) => {
    state.showNotice = v
  }
}

const actions = {
  toggleMusicScore({ commit, state }) {
    commit('SET_SHOW_MUSIC_SCORE', !state.showMusicScore)
  },
  toggleAboutUse({ commit, state }) {
    commit('SET_SHOW_ABOUT_USE', !state.showAboutUse)
  },
  toggleInstrumentMenu({ commit, state }) {
    commit('SET_SHOW_INSTRUMENT_MENU', !state.showInstrumentMenu)
  },
  toggleNotice({ commit, state }) {
    commit('SET_SHOW_NOTICE', !state.showNotice)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
