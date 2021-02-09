import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { Auth } from 'aws-amplify'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isAuthenticated: false,
    user: null,
    modalActive: false,
    modalType: null
  },
  plugins: [createPersistedState()],
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
  },
  actions: {
    async addNewUser(_, form) {
      try {
        console.log("The form in AddUser store: ", form)
        await axios.post('https://2cu6zhp8uk.execute-api.us-west-2.amazonaws.com/dev/addUser', 
            {
              userId: form.userId,
              email: form.email,
              username: form.username
            },
            { headers: { 'Authorization': `Bearer ${form.token}`}}
        )
      } catch(e) {
        console.log("Error in Adding New User", `${e.message}`)
        throw Error(e)
      }
    },
    async checkUser(_, userDetails){
      try {
        const userExists = await axios.get(`https://2cu6zhp8uk.execute-api.us-west-2.amazonaws.com/dev/checkUser/${userDetails.userId}`,
          { headers: { 'Authorization': `Bearer ${userDetails.token}`} 
        })
        if(!userExists.data['user']) {
          return false
        } else { return true}
      } catch(e) {
        console.log("Error in Checking user in store", `${e.message}`)
        throw Error(e)
      }
    },
    async register(__, form ) {
        const user = await Auth.signUp({
            username: form.email,
            password: form.password,
            attributes: {
              'custom:username': form.username
          }
        })
        return user
      },
      async confirmRegistration(_, form) {
        try {
          await Auth.confirmSignUp(form.email, form.code) 
        } catch (e) {
          console.log("ERROR Confirming Registration", `${e.message}`) 
          throw Error(e)
        }
      },

      async login({ commit }, form) {
        try {
          const user = await Auth.signIn(form.email, form.password)
          commit('set', user)
          return user
        } catch(e) {
            console.log("ERROR Loggin in User", `${e.message}`) 
            throw Error(e)
        }
      },

      async resendCode(_,  email) {
          try {
            await Auth.resendSignUp(email)
          } catch (e) {
              console.log("Error resending code", e)
              throw Error(e)
          }

      },

      async logout({ commit }) {
        try {
          await Auth.signOut()
          if(process.client) {
              localStorage.clear()
          }
          commit('unSet', null)

        } catch(e) {
          throw Error(e)
        }
      },

      async addGroup(_, newGroup) {
        try {
          await axios.post('https://2cu6zhp8uk.execute-api.us-west-2.amazonaws.com/dev/addGroup', 
          {
            groupId: form.groupId,
            description: form.description,
            groupUrl: "TEST_URL"
          },
          { headers: { 'Authorization': `Bearer ${form.token}`}}
      )
        } catch (e) {
          throw Error(e)
        }
      }
    
  }

}) // ends store
