<template>
  <div class="header">
      <nav class="nav">
          <div class="nav__logo-left"><h2>Simple Image Share</h2></div>
          <div class="nav__menu-right">
              <ul v-if="!isAuthenticated">
                <router-link to="/" class="nav__menu-right--link">See All Images</router-link>
                <router-link to="/" @click.native="doModal('signup')" class="nav__menu-right--link">Sign Up</router-link>  
                <router-link to="/" @click.native="doModal('signin')" class="nav__menu-right--link">Sign In</router-link>
              </ul>
              <ul v-else>
                <router-link to="/" class="nav__menu-right--link">See All Images</router-link>
                <router-link to="/" @click.native="signOut" class="nav__menu-right--link">Sign Out</router-link>
              </ul>
          </div>
      </nav>
  </div>
</template>

<script>
import { mapGetters } from 'vuex' 

export default {
methods :{
    doModal(type) {
        this.$store.commit('setModalActive', type)
    },
    signOut() {
        this.$store.dispatch('logout')
    }
},
computed: {
    ...mapGetters([
        'isAuthenticated'
    ])
}
}
</script>

<style lang="scss">
.header {
    background: var(--color-primary-blue);
    
}
.nav {
    color: var(--color-grey);
    // border: 1px solid red;
    display: flex;
    max-width: 1280px;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;

    &__logo-left {
        text-transform: uppercase;
    }

    &__menu-right {
        
        &--link {
            color: inherit;
            text-decoration: none;
            text-transform: uppercase;
            margin: 0 1rem;
            transition: all .3s;

            &:hover {
                color: var(--color-black);
            }
        }
    }
}
</style>