import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

import app from './modules/app'
import keyboard from './modules/keyboard'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    keyboard
  },
  getters
})

export default store
