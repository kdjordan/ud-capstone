import Vue from 'vue'
import Vuex from 'vuex'
import { Auth } from 'aws-amplify'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isAuthenticated: false,
    user: null,
    modalActive: false,
    modalType: null
  },
  mutations: {
    setModalActive(state, payload) {
      state.modalActive = !state.modalActive
      state.modalType = payload
    },
    set(state, user) {
      state.isAuthenticated = true
      state.user = user
    },
    unSet(state) {
      state.isAuthenticated = false
      state.user = null
    }
  },
  getters: {
    getModalActive(state) {
      return state.modalActive
    },
    getModalType(state) {
      return state.modalType
    },
    getUser(state) {
      if(state.isAuthenticated) {
          return state.user.attributes
      }
    },
    isAuthenticated(state) {
        return state.isAuthenticated
    },
    getShopName(state) {
        if(state.isAuthenticated) {
            return state.user.attributes['custom:shopName']
        }
    }
  },
  actions: {
    async load({ commit }){
      try {
          console.log('loading in LOAD')
          const test = await Auth.updateUserAttributes()
          const user = await Auth.currentAuthenticatedUser({bypassCache: true})
          // const {attributes} = user
          console.log("test", test)
          console.log("user", user.attributes)
          commit('set', user)
          return user
      } catch (e) {
          commit('set', null)

      } 
  },

  async register(__, form ) {
      console.log('registering')
      console.log(form)
      
      const user = await Auth.signUp({
          username: form.email,
          password: form.password,  
          attributes: {
            email: form.email
          }       
      })
      return user
    },
    async confirmRegistration(_, form) {
        //confirm signUp and then add user profile to dynamoDb
        return await Auth.confirmSignUp(form.email, form.code) 
    },

    async login({ commit }, form) {
      console.log('loggin in', form)
        const user = await Auth.signIn(form.email, form.password)
        commit('set', user)
        return user
    },

    async resendCode(_,  email) {
        try {
            await Auth.resendSignUp(email)
        } catch (e) {
            console.log("Error resending code", e)
        }

    },

    async logout({ commit }) {
        console.log('logging out')
        await Auth.signOut()
        if(process.client) {
            localStorage.clear()
        }
        commit('unSet', null)
    },
  
  }
})
