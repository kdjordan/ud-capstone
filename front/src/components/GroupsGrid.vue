<template>
  <div class="group-grid">
      <div v-for="(image, index) in images" :key="index" class="group-grid__images">
          <img :src="`${image.url}`" class="group-grid__images--img" alt="">
          {{image.description}}
          
          
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

    &__images {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 2rem 0;
        &--img {
            width: 10rem;
        }
    }
}
</style>