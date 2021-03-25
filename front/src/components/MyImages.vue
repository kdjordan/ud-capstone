<template>
  <div class="image-grid">
      <h2><center>Your Images</center></h2>
      <div v-if="getUserImagesEmpty">
          <h3><center>Sorry No Images Uploaded yet 😧</center></h3>
      </div>
      <div class="image-grid__container">
        <div v-for="(image, index) in images" :key="index" class="image-card">
            <div class="image-card__img-wrap">
                <img :src="`${image.imageUrl}`"  alt="">
            </div> 
            <div class="image-card__wrap">
                <div class="image-card__details">
                    <span>Description :</span> <em>{{image.description.toUpperCase()}}</em>
                </div>
                <div class="image-card__details">
                    <span>Uploaded On :</span> {{image.createdDate.toUpperCase()}}
                </div> 
            </div>
        <div>
            <button class="image-grid__button image-grid__button--edit" @click="edit(index)">EDIT</button>
            <button class="image-grid__button image-grid__button--delete" @click="remove(index)">DELETE</button>
        </div>
        </div>
      </div>
  </div>
</template>

<script>


import { mapGetters } from 'vuex' 
export default {
    data() {
        return {
            images: []
        }
    },
    computed: {
        ...mapGetters([
            'getUserImagesEmpty'
        ])
    },
    methods: {
        async remove(el){
            const theImage = this.images[el];
            const imageRef = {
                PK: theImage.PK,
                SK: theImage.SK
            }
            await this.$store.dispatch('deleteImage', imageRef)
            //remove from images
            console.log(this.images)
            this.images = this.images.filter(image => {
                return image.SK != imageRef.SK
            })
            
        },
        edit(el) {
            console.log("remove", el)
        }
    },
     async created() {
         try {
             this.images = await this.$store.dispatch('getUserImages', this.$store.state.user.attributes.sub)
              if(this.images.length == 0) {
                this.noImageSad = true
            } else {
                this.noImageSad = false
            }
         } catch (e) {
             console.log(e)
         }

        }
  }
</script>

<style lang="scss">

.my-images {
    // display: flex;
    // justify-content: center;
    // align-items: center;

    & h2 {
        margin-bottom: 2rem;
    }

    &__container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

    }
}
.details {
    & span {
        font-size: .8rem;
        color: var(--color-primary-blue);
        text-transform: uppercase;
    }
}

</style>