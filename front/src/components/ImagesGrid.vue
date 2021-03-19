<template>
  <div class="image-grid">
      <h2><center>Here are our user Images</center></h2>
      <div class="image-grid__container">
        <!-- <div v-for="(image, index) in groups" :key="index" class="image-grid__images">
            <img :src="`${group.groupUrl}`" class="images-grid__images--img" alt="">
            {{group.description.toUpperCase()}}
        </div> -->
      </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return{
            images: [],
        }
    },
    async created() {
        try{
            // const theImages = await axios.get('https://2cu6zhp8uk.execute-api.us-west-2.amazonaws.com/dev/getAllImages')
            const theImages = await this.$store.dispatch('getAllImages')

            this.images = theImages
        } catch(e) {
            throw Error(e)
        }
    }
}
</script>

<style lang="scss">
.image-grid  {
    margin-top: 7rem;

    & h2 {
        text-transform: uppercase;
    }

    &__container {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
    }
    &__images {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 2rem 0;
        
        &--img {
            margin-bottom: .5rem;
            height: 20rem;
        }
    }
}
</style>