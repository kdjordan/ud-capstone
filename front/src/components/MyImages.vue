<template>
  <div class="my-images">
      <h2>Images</h2>
      <div v-for="(image, index) in images" :key="index" class="my-images__container">
            <img :src="`${image.imageUrl}`"  alt="">
            {{image.description.toUpperCase()}}
        </div>
      <!-- {{images}} -->
  </div>
</template>

<script>


export default {
    data() {
        return {
            images: ''
        }
    },
     async created() {
         try {
             this.images = await this.$store.dispatch('getUserImages', this.$store.state.user.attributes.sub)
         } catch (e) {
             console.log(e)
         }

        }
  }
</script>

<style lang="scss">

.my-images {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    & h2 {
        margin-bottom: 2rem;
    }

    &__container {
        display: flex;
        justify-content: center;
        align-items: center;

        & img {
            max-width: 50%;
        }
    }
}

</style>