const getters = {
  isFullScale: state => state.keyboard.isFullScale,
  keyMap: state => state.keyboard.keyMap,
  showKeyboardMenu: state => state.keyboard.showKeyboardMenu,

  isMobile: state => state.app.isMobile,
  showMusicScore: state => state.app.showMusicScore,
  showAboutUse: state => state.app.showAboutUse,
  showInstrumentMenu: state => state.app.showInstrumentMenu,
  showNotice: state => state.app.showNotice
}

export default getters
