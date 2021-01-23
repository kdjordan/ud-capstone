<template>
  <div class="header">
      <nav class="nav">
          <div class="nav__logo-left"><h2>Simple Image Share</h2></div>
          <div class="nav__menu-right">
              <router-link to="/" class="nav__menu-right--link">See All Images</router-link>
              <router-link to="/" class="nav__menu-right--link">Sign Up</router-link>
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
    border: 1px solid red;
    display: flex;
    max-width: 1280px;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;

    &__menu-right {
        &--link {
            text-decoration: none;
            text-transform: uppercase;
            margin: 0 1rem;
        }
    }
}
</style>