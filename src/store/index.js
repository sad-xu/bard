import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

import app from './modules/app'
import keyboard from './modules/keyboard'
import timbre from './modules/timbre'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    keyboard,
    timbre
  },
  getters
})

export default store
