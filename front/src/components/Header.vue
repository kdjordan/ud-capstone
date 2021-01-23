<template>
  <div class="header">
      <nav class="nav">
          <div class="nav__logo-left"><h2>Simple Image Share</h2></div>
          <div class="nav__menu-right">
              <router-link to="/" class="nav__menu-right--link">See All Images</router-link>
              <router-link to="/" class="nav__menu-right--link">Sign Up</router-link>  
              <router-link to="/" class="nav__menu-right--link">Sign In</router-link>
          </div>
      </nav>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
.nav {
    color: var(--color-black);
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
                color: var(--color-grey);
            }
        }
    }
}
</style>