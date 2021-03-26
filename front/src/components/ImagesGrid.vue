<template>
  <div class="image-grid">
      <h2><center>Here are our user Images</center></h2>
      <div v-if="getAllImagesEmpty">
          <h3><center>Sorry No Images Uploaded yet 😧</center></h3>
      </div>
      <div class="image-grid__container">
        <div v-for="(image, index) in images" :key="index" class="image-card">
            <div class="image-card__img-wrap">
                <img :src="`${image.imageUrl}`"  alt="">
            </div>
            <div class="image-card__wrap">
                <div class="image-card__details">
                    <span>Description :</span> {{image.description.toUpperCase()}}
                </div>
                <div class="image-card__details">
                    <span>Uploaded By :</span> {{image.owner.toUpperCase()}}
                </div> 
            </div>
        </div> 
      </div>
  </div>
</template>

<script>
import Header from './Header.vue'
import { mapGetters } from 'vuex' 

export default {
  components: { Header },
    data() {
        return{
            images: []
        }
    },
    computed: {
        ...mapGetters([
            'getAllImages',
            'getAllImagesEmpty'
        ])
    },
    async created() {
        try {
            this.images = []
            this.images = await this.$store.dispatch('getAllImages')
            
        } catch(e) {
            throw Error(e)
        }
    }
}
</script>