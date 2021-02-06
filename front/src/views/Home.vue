<template>
  <div class="home">
    <div class="home__inner">
        <h2>Welcome to the simple Image Sharing App</h2>
        <p><span @click="doModal('signup')">Sign Up</span> to join or <span @click="doModal('signin')">Sign</span> in if you're already a member !</p>
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
  },
  methods :{
    doModal(type) {
        this.$store.commit('setModalActive', type)
    }
},
}
</script>

<style lang="scss">
.home {
  &__inner {
    padding: 3rem 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    width: 40rem;
    margin: 0 auto;
    margin-top: 4rem;
    border: 1px solid var(--color-black);
    border-radius: 5px;

    & h2 {
      margin-bottom: 1rem;
    }

    & span {
      color: var(--color-primary-blue);
      border-bottom: 1px solid transparent;
      cursor: pointer;
      transition: all .4s ease;

      &:hover {
        border-bottom: 1px solid var(--color-primary-blue);
      }
    }

  }
}
</style>
