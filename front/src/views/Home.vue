<template>
  <div class="home">
    <div class="home__inner">
      <h2>Welcocme to the simple Image Sharing App</h2>
      <p>Sign Up to join or Sign in if you're already a member !</p>
    </div>
    <GroupsGrid />
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import Header from '@/components/Header';
import GroupsGrid from '@/components/GroupsGrid'

export default {
  name: 'home',
  components: {
    Header,
    GroupsGrid
    // HelloWorld
  }
}
</script>

<style lang="scss">
.home {
  &__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 40rem;
    margin: 0 auto;
    margin-top: 4rem;
    border: 1px solid var(--color-black);
    border-radius: 5px;
  }
}
</style>
