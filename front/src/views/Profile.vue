<template>
  <div class="profile">
    <h2><center>Welcome Back: {{user['custom:username']}}</center></h2>
    <ImageInput />
    <MyImages />
    <button @click="userDump">DUMP</button>
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
  methods: {
    async userDump() {
      console.log(this.$store.state)
    }
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