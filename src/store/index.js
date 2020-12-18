import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import keyboard from './modules/keyboard'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    keyboard
  },
  getters
})

export default store
