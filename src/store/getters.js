const getters = {
  isFullScale: state => state.keyboard.isFullScale,
  keyMap: state => state.keyboard.keyMap,
  showKeyboardMenu: state => state.keyboard.showKeyboardMenu,

  showTimbreMenu: state => state.timbre.showTimbreMenu,
  timbreList: state => state.timbre.timbreList,

  isMobile: state => state.app.isMobile,
  showMusicScore: state => state.app.showMusicScore,
  showAboutUse: state => state.app.showAboutUse
}

export default getters
