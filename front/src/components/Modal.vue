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
                    <button type="submit" class="modal__button" :disabled='buttonDisabled'>SUBMIT</button>
                </div>
            </form>
      </div>
      <div v-if="theFunction == 'confirm'" class="modal__inner"> 
          <h2>Confirm Your Identity</h2>
          <p>{{message}}</p>
          <p>
            Click <span @click.prevent="resendCode" class="under">here</span> to resend the code
          </p>
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
                    <button type="submit" class="modal__button" :disabled='buttonDisabled'>VERIFY</button>
                </div>
            </form>
      </div>
      <div v-if="getModalType == 'signin' || theFunction == 'login'" class="modal__inner"> 
          <h2>Sign In !</h2>
          <p>{{message}}</p>
          <form @submit.prevent="login">
            <div class="modal__inner--row">
                    <label for="email">Email</label>
                    <input v-model="loginForm.email" type="text" name="email">
            </div>
            <div class="modal__inner--row">
                    <label for="name">Password</label>
                    <input v-model="loginForm.password" type="password" name="password">
                </div>
                <div class="modal__inner--row">
                    <button type="submit" class="modal__button" :disabled='buttonDisabled'>LOGIN</button>
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
        buttonDisabled: false,
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
        },
        registeredUser: {
            userId: '',
            email: '',
            username: ''
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
                this.buttonDisabled = true
                const regUser = await this.$store.dispatch('register', this.registerForm)
                this.registeredUser.userId = regUser.userSub    
                this.registeredUser.email = regUser.user['username']    
                this.registeredUser.username = this.registerForm.username
                this.confirmForm.email = this.registerForm.email
                this.theFunction = 'confirm'
                this.message = `Success ! Your CODE was emailed to you.`
                this.buttonDisabled = false
            } catch (e) {
                this.message = `Error: ${e.message}`
                console.log("ERROR in register", e) 
            }
        },
        async confirm() {
            try {
                if(this.confirmForm.code !== '') {
                    this.buttonDisabled = true
                }
                await this.$store.dispatch('confirmRegistration', this.confirmForm)
                this.theFunction = 'login'
                this.loginForm.email = this.registerForm.email
                this.message = `You are verified. Login to continue`
                this.buttonDisabled = false
            } catch (e){
                this.message = `Error: ${e.message}`
                console.log("ERROR in confirm", e) 
            }    
        },
         async login() {
            try {
                this.buttonDisabled = true
                await this.$store.dispatch('login', this.loginForm)
                this.registeredUser.userId = this.getUser.sub
                //add user to DynamoDB = will not add id user already exists
                await this.$store.dispatch('addUser', {...this.registeredUser})
                this.message = 'Success - Redirecting to your profile page'
                this.theFunction = 'none'
                setTimeout(() => {
                    this.$store.commit('setModalActive', null)
                    this.message = ''
                    this.buttonDisabled = false
                    this.$router.push(`/profile`)
                }, 2000)
                // }
            } catch (e) {
                this.message = `Error: ${e.message}`
                console.log("ERROR loggin in ", e) 
            }   
         },
         async resendCode() {
             try {
                 await this.$store.dispatch('resendCode', this.confirmForm.email)
             } catch(e) {
                this.message = `Error: ${e.message}`
                console.log("ERROR resending Code", e) 
             }

         }
    },
    computed: {
        ...mapGetters([
            'getModalType',
            'getUser'
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

.under {
    cursor: pointer;
    border-bottom: 1px solid var(--color-black);
    transition: all .4s ease;

    &:hover {
        color: var(--color-secondary-blue);
        border-bottom: 1px solid var(--color-secondary-blue);
    }
}
</style>