<template>
  <div id="app">
    <Header />
    <Modal v-if="getModalActive"/>
    <ImageInput />
    <GroupsGrid />
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/> -->
  </div>
</template>

<script>
import Header from './components/Header';
import GroupsGrid from './components/GroupsGrid';
import ImageInput from './components/ImageInput';
import Modal from './components/Modal';
import { mapGetters } from 'vuex' 

export default {
  components: {
    Header,
    GroupsGrid,
    ImageInput,
    Modal
  },
  data() {
    return {
      modalActive:true
    }
  },
  computed: {
    ...mapGetters([
        'getModalActive'
    ])
}
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
  font-family: Montserrat, sans-serif;
}

body {
  --color-primary-blue: #377BA6;
  --color-secondary-blue: #80A7BF;
  --color-tertiary-blue: #99B4BF;
  --color-white: #F2EDE4;
  --color-grey: #D7D8D9;
  --color-black: #011C26;
}
</style>
