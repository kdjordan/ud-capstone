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
  --color-red: #ffcccb;

  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
  font-family: Montserrat, sans-serif;
}

.image-grid  {
    margin-top: 7rem;

    & h2 {
        text-transform: uppercase;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--color-black);
        width: 50%;
        margin: 0 auto;
        margin-bottom: 4rem;
    }

    &__container {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        max-width: 1200px;
        margin: 0 auto;
    }

    &__button {
      border: 1px solid var(--color-grey);
      color: var(--color-white);
      padding: .2rem .4rem;
      letter-spacing: 1px;
      margin: .8rem .3rem;
      cursor: pointer;
      border-radius: 10px;
      transition: all .2s ease-in;

      &--edit {
        background-color: var(--color-secondary-blue);
        color: var(--color-white);

        &:hover {
          color: var(--color-secondary-blue);
          background-color: var(--color-white);
        }
      }

      &--delete {
        background-color: var(--color-red);
        color: var(--color-black);

        &:hover {
          color: var(--color-red);
          background-color: var(--color-white);
        }
      }
    }
}

.image-card {
    border: 1px solid var(--color-black);
    border-radius: 5px;
    display: flex;
    flex-wrap: nowrap;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 25%;
    overflow: hidden;
    margin: 1rem;

    &__wrap {
      border-top: 1px solid var(--color-black);
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0 .2rem;
    }

    &__img-wrap {
      padding: 1rem;
    }
    
    &__details {
      margin: .3rem 0;
      & span {
          font-size: .8rem;
          color: var(--color-primary-blue);
          text-transform: uppercase;
      }
    }

    & img {
      height: 10rem;
    }
}
</style>
