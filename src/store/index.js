import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import keyboard from './modules/keyboard'
import timbre from './modules/timbre'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    keyboard,
    timbre
  },
  getters
})

export default store
