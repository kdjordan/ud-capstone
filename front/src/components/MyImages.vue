<template>
  <div class="my-images">
      <h2><center>Your Images</center></h2>
      <div class="my-images__container">
        <div v-for="(image, index) in images" :key="index" class="my-images__container--images">
                <img :src="`${image.imageUrl}`"  alt="">
                <div class="details">
                    <span>Description :</span> {{image.description.toUpperCase()}}
                </div>
                <div class="details">
                    <span>Uploaded On :</span> {{image.createdDate.toUpperCase()}}
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

        &--images {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            & img {
                max-width: 50%;
            }
        }

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