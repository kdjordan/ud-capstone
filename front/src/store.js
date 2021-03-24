import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { Auth } from 'aws-amplify'
import axios from 'axios'
import { formatDate } from './assets/utils.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isAuthenticated: false,
    user: null,
    modalActive: false,
    modalType: null,
    userImages: [],
    allImages: []
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
    setAllImages(state, payload) {
      state.allImages = payload
    },
    setUserImages(state, payload) {
      state.userImages = payload
    },
    setSession(state, session) {
      state.session = session
      state.user.Session = session
    },
    unSet(state) {
      state.isAuthenticated = false
      state.user = null
    },
    addImageToStore(state, payload) {
      const formatted = formatDate(payload)
      state.userImages.push(formatted)
      state.allImages.push(formatted)
    }
  },
  getters: {
    getModalActive(state) {
      return state.modalActive
    },
    getAllImages(state) {
      return state.allImages
    },
    getUserImages(state) {
      return state.userImages
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
    async addUser({ state }, form) {
      try {
        await axios.post('https://2cu6zhp8uk.execute-api.us-west-2.amazonaws.com/dev/addUser', 
            {
              userId: form.userId,
              email: form.email,
              username: form.username
            },
            { headers: { 'Authorization': `Bearer ${state.user.Session.accessToken.jwtToken}`}}
        )
      } catch(e) {
        throw Error(e.message)
      }
    },

    async register(__, form ) {
      try {
        let user = await Auth.signUp({
            username: form.email,
            password: form.password,
            attributes: {
              'custom:username': form.username
          }
        })
        return user
        } catch (e) {
          throw Error(e.message)
        }
      },

      async confirmRegistration(_, form) {
        try {
          await Auth.confirmSignUp(form.email, form.code) 
        } catch (e) {
          throw Error(e.message)
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
            throw Error(e.message)
        }
      },

      async resendCode(_,  email) {
          try {
            await Auth.resendSignUp(email)
          } catch (e) {
            throw Error(e.message)
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
          throw Error(e.message)
        }
      },

      async getUrl({ state }) {
        try {
          let theUrl = await axios.post('https://2cu6zhp8uk.execute-api.us-west-2.amazonaws.com/dev/genUrl',
          { userId: state.user.sub},
          { headers: { 'Authorization': `Bearer ${state.user.Session.accessToken.jwtToken}`}}
          )
          return theUrl.data
        } catch(e) {
          throw Error(e.message)
        }
      },

      async getUserImages({ state, commit }, userId) {
        try {
          const images = await axios.get(`https://2cu6zhp8uk.execute-api.us-west-2.amazonaws.com/dev/getUserImages/${userId}`,
          { headers: { 'Authorization': `Bearer ${state.user.Session.accessToken.jwtToken}`}}
          )
          const formatted = formatDate(images.data.images)
          commit('setUserImages', formatted)
          return formatted
        } catch(e) {
          throw Error(e.message)
        }
      },

      async getAllImages({ commit }) {
        try {
          const images = await axios.get('https://2cu6zhp8uk.execute-api.us-west-2.amazonaws.com/dev/getAllImages')
          const formatted = formatDate(images.data.images)
          commit('setAllImages', formatted)
          return formatted
        } catch(e) {
          throw Error(e.message)
        }
      },

      async putImage(_, imageObject) {
        try {
            await axios.put(`${imageObject.uploadUrl}`, imageObject.theImage, 
            { headers: {'Content-Type': imageObject.type, }} 
            )
        } catch(e) {
          console.log("error uploading image")
          throw Error(e.message)
        }
      },

      async createImageRecord({ state }, imageRecord) {
        try {
          const result = await axios.post('https://2cu6zhp8uk.execute-api.us-west-2.amazonaws.com/dev/createImageRecord',
            { description: imageRecord.description,
              imageId: imageRecord.imageId,
              userId: state.user.attributes.sub,
              owner: state.user.attributes['custom:username']
            },
            { headers: { 
             'Authorization': `Bearer ${state.user.Session.accessToken.jwtToken}`} 
            }
          )
          return result.data

        } catch(e) {
          throw Error(e.message)
        }
      }
  }

}) // ends store
