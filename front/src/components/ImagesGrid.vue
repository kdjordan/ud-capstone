<template>
  <div class="image-grid">
      <h2><center>Here are our user Images</center></h2>
      <div class="image-grid__container">
        <div v-for="(image, index) in images" :key="index" class="image-grid__images">
            <img :src="`${image.imageUrl}`"  alt="">
            {{image.description.toUpperCase()}}
        </div>
      </div>
  </div>
</template>

<script>

export default {
    data() {
        return{
            images: [],
        }
    },
    async created() {
        try{
            const theImages = await this.$store.dispatch('getAllImages')
            this.images = theImages.images
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
        margin-bottom: 4rem;
    }

    &__container {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    &__images {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        // border: 1px solid red;
        
        & img {
            // border: 1px solid red;
            margin-bottom: .5rem;
            width: 100%;
            max-width: 50%;
        }
    }
}
</style>