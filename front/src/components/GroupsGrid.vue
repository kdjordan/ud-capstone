<template>
  <div class="group-grid">
      <h2><center>Here are our current image Groups</center></h2>
      <div class="group-grid__container">
        <div v-for="(image, index) in images" :key="index" class="group-grid__images">
            <img :src="`${image.url}`" class="group-grid__images--img" alt="">
            {{image.description}}
        </div>
      </div>
  </div>
</template>

<script>
import images from "@/data/images.js";

export default {
    data() {
        return{
            images
        }
    },
    methods: {
        showImage() {
            console.log(this.images.images)
        }
    }
}
</script>

<style lang="scss">
.group-grid  {
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
            // width: 10rem;
            height: 20rem;
        }
    }
}
</style>