<template>
  <div class="profile">
    <h2><center>Welcome Back: {{user['email']}}</center></h2>
    <ImageInput />
    <MyImages />
  </div>
</template>

<script>
import { mapGetters } from 'vuex' 
import ImageInput from '@/components/ImageInput';
import MyImages from '@/components/MyImages';

export default {
  name: 'profile',
  data() {
    return {
      user: ''
    }
  }, 
  components: {
      MyImages,
      ImageInput
  },
  computed: {
    ...mapGetters([
          'getUser'
      ])
  },
  mounted() {
    if(!this.$store.getters['isAuthenticated']){
      this.$router.push('/')
    } else {
      this.user = this.getUser;
    }
  }
}
</script>

<style lang="scss">
.profile {
  & h2 {
    margin-top: 1rem;
  }
}

</style>