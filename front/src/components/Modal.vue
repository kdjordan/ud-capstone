<template>
  <div class="modal" @click.stop="closeModal($event)">
      <div v-if="getModalType == 'signup'" class="modal__inner">
          <h2>Sign Up !</h2>
          <div class="modal__inner--row">
                <label for="name">Name</label>
                <input type="text" name="name" id="">
          </div>
          <div class="modal__inner--row">
                <label for="name">Email</label>
                <input type="email" name="email" id="">
          </div>
            <div class="modal__inner--row">
                <label for="name">Password</label>
                <input type="password" name="password" id="">
            </div>
      </div>
      <div v-else class="modal__inner"> 
          <div class="modal__inner--row">
                <label for="name">Name</label>
                <input type="text" name="name" id="">
          </div>
          <div class="modal__inner--row">
                <label for="name">Password</label>
                <input type="password" name="password" id="">
            </div>
      </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex' 
export default {
    methods: {
        closeModal(el) {
            if(el.target.className == "modal") {
                this.$store.commit('setModalActive', null)
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
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 5px 5px 25px 4px #8B9B90;
        height: auto;
       

        &--row {
            margin: 1rem 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
        }
    }
}
</style>