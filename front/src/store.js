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
    modalType: null,
    groupsOptions: []
  },
  plugins: [createPersistedState()],
  mutations: {
    setModalActive(state, payload) {
      state.modalActive = !state.modalActive
      state.modalType = payload
    },
    setUser(state, user) {
      state.isAuthenticated = true
      state.user = user
    },
    setSession(state, session) {
      state.session = session
      state.user.Session = session
    },
    unSet(state) {
      state.isAuthenticated = false
      state.user = null
    },
    setGroupsOptions(state, payload) {
      state.groupsOptions = payload
    }
  },
  getters: {
    getGroupsOptions(state) {
      return state.groupsOptions
    },
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
    async addNewUser({state}, form) {
      try {
        console.log("The form in AddUser store: ", form)
        await axios.post('https://2cu6zhp8uk.execute-api.us-west-2.amazonaws.com/dev/addUser', 
            {
              userId: form.userId,
              email: form.email,
              username: form.username
            },
            { headers: { 'Authorization': `Bearer ${state.user.Session.accessToken.jwtToken}`}}
        )
      } catch(e) {
        console.log("Error in Adding New User", `${e.message}`)
        throw Error(e)
      }
    },

    async checkUser({state}){
      try {
        const userExists = await axios.get(`https://2cu6zhp8uk.execute-api.us-west-2.amazonaws.com/dev/checkUser/${state.user.attributes.sub}`,
          { headers: { 'Authorization': `Bearer ${state.user.Session.accessToken.jwtToken}`} 
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
          commit('setUser', user)
          const session = await Auth.currentSession()
          commit('setSession', session)
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

      async addGroup({state}, form) {
        try {
          await axios.post('https://2cu6zhp8uk.execute-api.us-west-2.amazonaws.com/dev/addGroup', 
          {
            groupId: form.groupId,
            description: form.description,
            groupUrl: "TEST_URL"
          },
          { headers: { 'Authorization': `Bearer ${state.user.Session.accessToken.jwtToken}`}}
      )
        } catch (e) {
          throw Error(e)
        }
      },

      async getUrl({state}) {
        try {
          let theUrl = await axios.post('https://2cu6zhp8uk.execute-api.us-west-2.amazonaws.com/dev/genUrl',
          { userId: state.user.sub},
          { headers: { 'Authorization': `Bearer ${state.user.Session.accessToken.jwtToken}`}}
          )
          return theUrl.data.uploadUrl
        } catch(e) {
          throw Error(e)
        }
      },

      async putImage({state}, form) {
        try {
          // const uploadUrl = await axios.post('https://2cu6zhp8uk.execute-api.us-west-2.amazonaws.com/dev/genUrl',
          //   { userId: state.user.sub},
          //   { headers: { 'Authorization': `Bearer ${state.user.Session.accessToken.jwtToken}`}}
          // )
          
          // const result = await axios.put(`${uploadUrl.data.uploadUrl}`, theImage, 
          // { headers: {'Content-Type': theImage.type}} 
          // )
          console.log("Sending Put Image req:", form)

          const result = await axios.post('https://2cu6zhp8uk.execute-api.us-west-2.amazonaws.com/dev/putImage',
            {
              userId: state.user.sub,
              theImage: form.theImage,
              groupId: form.groupId,
              imageDesc: form.imageDesc
            },
            { headers: { 'Authorization': `Bearer ${state.user.Session.accessToken.jwtToken}`, 'Content-Type': form.theImage.type}}
          )
          
          return result

        } catch(e) {
          console.log("error  uploading image")
          throw Error(e)
        }
      }
    
  }

}) // ends store
