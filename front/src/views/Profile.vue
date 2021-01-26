<template>
  <div class="profile">
    <MyImages />
    <ImageInput />
      <!-- <GroupsGrid /> -->
  </div>
</template>

<script>
import GroupsGrid from '@/components/GroupsGrid';
import ImageInput from '@/components/ImageInput';
import MyImages from '@/components/MyImages';

export default {
  name: 'profile',
  components: {
      MyImages,
      ImageInput
      // HelloWorld
  },
  mounted() {
    if(!this.$store.getters['isAuthenticated']){
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss">

</style>