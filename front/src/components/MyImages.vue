<template>
  <div class="image-grid">
      <h2><center>Your Images</center></h2>
      <div class="image-grid__container">
        <div v-for="(image, index) in images" :key="index" class="image-card">
                <img :src="`${image.imageUrl}`"  alt="">
                <div class="image-card__wrap">
                    <div class="image-card__details">
                        <span>Description :</span> <em>{{image.description.toUpperCase()}}</em>
                    </div>
                    <div class="image-card__details">
                        <span>Uploaded On :</span> {{image.createdDate.toUpperCase()}}
                    </div> 
                </div>
            </div>
      </div>
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