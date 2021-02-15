const getters = {
  keyMap: state => state.keyboard.keyMap,
  showKeyboardMenu: state => state.keyboard.showKeyboardMenu,
  showTimbreMenu: state => state.timbre.showTimbreMenu,
  timbreList: state => state.timbre.timbreList,
  showMusicScore: state => state.app.showMusicScore,
  showAboutUse: state => state.app.showAboutUse
}

export default getters
