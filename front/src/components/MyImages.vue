<template>
  <div class="image-grid">
      <div v-if="modalActive" class="overlay" @click.stop="closeModal($event)">
        <div class="overlay-title">
            <img :src="`${this.currentImage.imageUrl}`" class="thumbnail">
            <h3>Enter New Description</h3>
            <input type="text" class="desc-input" :placeholder="`${this.currentImage.description}`" v-model="newDesc">
            <button class="image-grid__button image-grid__button--edit small" @click="updateDesc">SUBMIT</button>
            <button class="image-grid__button image-grid__button--delete small" @click="modalActive = false">CANCEL</button>
        </div>
      </div>
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
            images: [],
            newDescription: '',
            modalActive: false,
            oldDesc: '',
            newDesc: '',
            currentImage: ''
        }
    },
    computed: {
        ...mapGetters([
            'getUserImagesEmpty'
        ])
    },
    methods: {
        async remove(el){
            try {
                const theImage = this.images[el];
                const imageRef = {
                    PK: theImage.PK,
                    SK: theImage.SK,
                }
                await this.$store.dispatch('deleteImage', imageRef)
                //remove from local images
                this.images = this.images.filter(image => {return image.SK != imageRef.SK})
                //update vuex
                this.$store.commit('setUserImages', this.images)

            } catch (e) {
                throw Error(e)
            }
            
        },
        updateDesc() {
            this.modalActive = false
            if(this.newDesc == '') {
                this.oldDesc = 'Cannot be blank !'
                return
            } else {
                this.images.forEach(image => {
                    if(image.description == this.currentImage.description) {
                        image.description = this.newDesc
                    }
                })
                //update vuex
                this.$store.commit('setUserImages', this.images)
                //update images table
                this.$store.dispatch('updateImage', {PK: this.currentImage.PK, SK: this.currentImage.SK, description: this.currentImage.description})
                
            }
        },
        edit(el) {
            this.currentImage = this.images[el];
            this.modalActive = true
        },
        closeModal(el) {
            if(el.target.className == "overlay") {
                this.modalActive = false
            }
        }
    },
     async created() {
         try {
             this.images = []
             if(this.$store.state.user.attributes.sub) {
                 this.images = await this.$store.dispatch('getUserImages', this.$store.state.user.attributes.sub)
             }
         } catch (e) {
             console.log(e)
         }

        }
  }
</script>

<style lang="scss">
.overlay {
    height: 100vh;
    width: 100vw;
    background-color: var(--color-grey);
    filter: opacity(.98);
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    &-title {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

    }

    & input[type=text]{
        width: 100%;
        padding: 1rem 2rem;
        margin: 8px 0;
        border: none;
        background: transparent;
        border-bottom: 1px solid black;
    } 

    & .thumbnail {
        max-width: 130px;
        margin-bottom: 1rem;
    }

}
.small {
    width: 50%;
}
</style>
