<template>
  <div class="my-images">
      <h2>Welcome Back: {{getUser['email']}}</h2>
  </div>
</template>

<script>
import { mapGetters } from 'vuex' 

export default {
    data() {
        return {
            user: null
        }
    },
    computed: {
        ...mapGetters([
            'getUser'
        ])
    }
}
</script>

<style lang="scss">
.my-images {
    display: flex;
    justify-content: center;
    align-items: center;
}

</style>