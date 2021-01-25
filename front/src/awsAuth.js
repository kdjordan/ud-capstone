import { Auth } from 'aws-amplify'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


export const state = () => ({
    isAuthenticated: false,
    user: null
})

export const mutations = {
    set(state, user) {
        // state.isAuthenticated = !!user
        state.isAuthenticated = true
        state.user = user
    }
}

export const getters = {
    getUser(state) {
        if(state.isAuthenticated) {
            return state.user.attributes.sub
        }
    },
    isAuthenticated(state) {
        if(state.isAuthenticated) {
            return state.isAuthenticated
        }
    },
    getShopName(state) {
        if(state.isAuthenticated) {
            return state.user.attributes['custom:shopName']
        }
    }
}

export const actions = {
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

    async register(__, { email, password, shopname } ) {
        const user = await Auth.signUp({
            username: email,
            password,
            attributes: {
                'custom:shopName': shopname
            }
        })
        return user
    },

    async confirmRegistration(_, { email, code}) {
        //confirm signUp and then add user profile to dynamoDb
        return await Auth.confirmSignUp(email, code) 
    },

    async login({ commit }, { email, password}) {
        const user = await Auth.signIn(email, password)
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
        commit('set', null)
    },
    
}