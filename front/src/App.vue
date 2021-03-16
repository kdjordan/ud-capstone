<template>
  <div id="app">
    <Header />
    <Modal v-if="getModalActive"/>
    <router-view/>
  </div>
</template>

<script>
import Header from './components/Header'
import ImageInput from './components/ImageInput'
import Modal from './components/Modal'
import { mapGetters } from 'vuex' 

export default {
  components: {
    Header,
    ImageInput,
    Modal
  },
  computed: {
    ...mapGetters([
        'getModalActive'
    ])
}
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  --color-primary-blue: #377BA6;
  --color-secondary-blue: #80A7BF;
  --color-tertiary-blue: #99B4BF;
  --color-white: #F2EDE4;
  --color-grey: #D7D8D9;
  --color-black: #011C26;

  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
  font-family: Montserrat, sans-serif;
}
</style>
