<template>
  <div class="modal" @click.stop="closeModal($event)">
      <div v-if="getModalType == 'signup' && theFunction == 'register'" class="modal__inner">
          <h2>Sign Up !</h2>
          <p>{{message}}</p>
          <form @submit.prevent="register">
            <div class="modal__inner--row">
                    <label for="name">Name</label>
                    <input v-model="registerForm.username" type="text" name="name">
            </div>
            <div class="modal__inner--row">
                    <label for="eamil">Email</label>
                    <input v-model="registerForm.email" type="email" name="email">
            </div>
                <div class="modal__inner--row">
                    <label for="name">Password</label>
                    <input v-model="registerForm.password" type="password" name="password">
                </div>
                <div class="modal__inner--row">
                    <button type="submit" class="modal__button">SUBMIT</button>
                </div>
            </form>
      </div>
      <div v-if="theFunction == 'confirm'" class="modal__inner"> 
          <h2>Confirm Your Identity</h2>
          <p>{{message}}</p>
          <form @submit.prevent="confirm">
            <div class="modal__inner--row">
                    <label for="name">Email</label>
                    <input v-model="confirmForm.email" type="email" name="name">
            </div>
            <div class="modal__inner--row">
                    <label for="name">Code</label>
                    <input v-model="confirmForm.code" type="text" name="code">
                </div>
                <div class="modal__inner--row">
                    <button type="submit" class="modal__button">VERIFY</button>
                </div>
            </form>
      </div>
      <div v-if="getModalType == 'signin' || theFunction == 'login'" class="modal__inner"> 
          <h2>Sign In !</h2>
          <p>{{message}}</p>
          <form @submit.prevent="login">
            <div class="modal__inner--row">
                    <label for="email">Email</label>
                    <input v-model="loginForm.email" type="text" name="email" id="">
            </div>
            <div class="modal__inner--row">
                    <label for="name">Password</label>
                    <input v-model="loginForm.password" type="password" name="password" id="">
                </div>
                <div class="modal__inner--row">
                    <button type="submit" class="modal__button">LOGIN</button>
                </div>
            </form>
      </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex' 
import { Auth } from 'aws-amplify'

export default {
data() {
    return {
        theFunction: 'register',
        message: '',
        registerForm: {
            username: '',
            password: '',
            email: ''
        },
        confirmForm: {
            email: '',
            code: ''
        },
        loginForm: {
            email: '',
            password: ''
        }

    }
},
    methods: {
        closeModal(el) {
            if(el.target.className == "modal") {
                this.$store.commit('setModalActive', null)
            }
        },
        async register() {
            try {
                const user = await this.$store.dispatch('register', this.registerForm)                
                this.confirmForm.email = this.registerForm.email
                this.theFunction = 'confirm'
                this.message = `Success ! Your CODE was emailed to you.`
            } catch (e) {
                this.message = `Error: ${e.message}`
                console.log("ERROR in register", e) 
            }
        },
        async confirm() {
            try {
                await this.$store.dispatch('confirmRegistration', this.confirmForm)
                this.theFunction = 'login'
                this.loginForm.email = this.registerForm.email
                this.message = `You are verified. Login to continue`
                //add user to DB
                await this.$store.dispatch('addNewUser', this.registerForm)
            } catch (e){
                this.message = `Error: ${e.message}`
                console.log("ERROR in confirm", e) 
            }    
        },
         async login() {
            try {
                console.log('logging in', this.loginForm)
                await this.$store.dispatch('login', this.loginForm)
                //get current session and user information
                const session = await Auth.currentSession()
                const authUser = await Auth.currentAuthenticatedUser()
                console.log('authUser', authUser)
                //check to see if dealer exists in Profile DB
                // console.log("the user is ", authUser)
                // let userExists = await this.$axios.get(`https://pz39j5z4eg.execute-api.us-west-2.amazonaws.com/dev/checkDealer/${authUser.username}`, 
                //         { headers: { 'Authorization': `Bearer ${session.accessToken.jwtToken}`} 
                //     })        
                //if userExists is true we can forward them to their admin page
                //if userExists is false - we first need to populate the Profile DB with their info
                // if(userExists.data.data) {
                //   this.message = 'Success ! Redirecting...'
                //   setTimeout(() => {
                //     this.$store.commit('modal/setModalActive')
                //     this.message = ''
                //     this.$router.push(`/auth/${authUser.attributes['custom:shopName']}`)
                //   }, 2000)
                // } else {
                //get dealer info from vuex
                // let user = this.$store.getters['awsAuth/getUser']
                //add user to DB
                // let addedDealer = await this.$axios.post(`https://pz39j5z4eg.execute-api.us-west-2.amazonaws.com/dev/signup`,
                //         { 
                //         adminID: authUser.attributes.sub,
                //         shopName: authUser.attributes['custom:shopName']
                //         },
                //         { headers: { 'Authorization': `Bearer ${session.accessToken.jwtToken}`} 
                //     })
                //     console.log('added Dealer', addedDealer)
                    this.message = 'Success - Redirecting to your profile page'
                    this.theFunction = 'none'
                    setTimeout(() => {
                        this.$store.commit('setModalActive', null)
                        this.message = ''
                        
                        this.$router.push(`/profile/`)
                }, 2000)
                // }
            } catch (e) {
                this.message = `Error: ${e.message}`
                console.log("ERROR loggin in ", e) 
            }   
         } 
    },
    computed: {
        ...mapGetters([
            'getModalType'
        ]),
    }

}
</script>

<style lang="scss">
.modal {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 100vw;
    background-color: rgba(205, 205, 205, 0.8);
    backdrop-filter: blur(3px);
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;

    &__inner {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 5px 5px 25px 4px #8B9B90;
        height: auto;
       

        &--row {
            margin: 1rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
        }
    }
}
</style>