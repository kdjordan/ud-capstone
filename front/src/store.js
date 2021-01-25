import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    modalActive: false,
    modalType: null
  },
  mutations: {
    setModalActive(state, payload) {
      console.log('clicked in store', payload)
      state.modalActive = !state.modalActive
      state.modalType = payload
    }
  },
  getters: {
    getModalActive(state) {
      return state.modalActive
    },
    getModalType(state) {
      return state.modalType
    }
  },
  actions: {

  }
})
