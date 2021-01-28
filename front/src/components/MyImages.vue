<template>
  <div class="my-images">
      <h2>Welcome Back: {{user['email']}}</h2>
  </div>
</template>

<script>
import { mapGetters } from 'vuex' 

export default {
    data() {
        return {
            user: ''
        }
    },
    computed: {
        ...mapGetters([
            'getUser'
        ])
    },
    mounted() {
    this.user = this.getUser;
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