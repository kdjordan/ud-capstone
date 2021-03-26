<template>
  <div class="image-input">
      <h3>Click Pencil to Upload a New Image</h3>
      <form @submit.prevent="doUpload">
        <div class="pencil" @click="togglePanel"></div>
            <div v-if="panelActive" class="image-input__panel">
                <div>
                    <label for="imageDesc">Image Description</label>
                    <input type="text" name="imageDesc" v-model="imageDesc">
                </div>
                
                <input type="file" accept="image/*" @change="uploadImage($event)">
                <button class="add-button" type ="submit" :disabled="mssg !== '' || buttonDisabled">Upload</button>
                <div v-if="mssg !== ''">
                    <center class="mssg">{{mssg}}</center>
                </div>
            </div>
      </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
data() {
    return {
        mssg: '',
        theImage: null,
        imageDesc: '',
        panelActive: false,
        buttonDisabled: false
    }
},
methods: {
    togglePanel() {
        this.panelActive = !this.panelActive
    },
    clearMssg() {
        this.mssg = ''
    },
    uploadImage(e) {
        this.clearMssg()
        this.theImage = e.target.files[0]
    },
    async doUpload() {
        this.buttonDisabled = true
        if(this.theImage == null) {
            this.mssg = 'No Image Selected'
            return
        }
        if(this.imageDesc == '') {
            this.mssg = 'No Image Description'
            return
        }
        try {
            //get signedUrl for upload to S3
            const data = await this.$store.dispatch('getUrl')

            const imageObject = {
                theImage: this.theImage,
                imageType: this.theImage.type,
                uploadUrl: data.uploadUrl,
            }
            //aadd image to S3 bucket
            await this.$store.dispatch('putImage', imageObject)

            //add record to images table with url
            const addedImage = await this.$store.dispatch('createImageRecord', {
                description: this.imageDesc,
                imageId: data.imageId,
            })
            await this.addImageToStore(addedImage)
            this.imageDesc = ''
            this.theImage = null
            this.panelActive = false
            this.buttonDisabled = false

        } catch(e) {
            throw Error(e)
        }
    },
    async addImageToStore(imageObj){
        try {
            this.$store.commit('addImageToStore', imageObj)
        } catch(e) {
            throw Error(e.message)
        }
    }
},
    computed: {
        ...mapGetters(['getUser', 'getUserImages'])
    },
}
</script>

<style lang="scss">
.pencil {
    cursor: pointer;
    width:50px;
    height:50px;
    background-image: url(../assets/pencil.svg);
    margin: 2rem auto;
    transform: rotate(0deg);
    transition: all .5s ease;

    &:hover {
        transform: rotate(360deg);
    }
}
.image-input {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
    border-bottom: 1px solid var(--color-black);

    & label {
        margin-right: .5rem;
    }

    & input {
        margin: 1rem 0;
    }

    &__panel {
        margin-bottom: 2rem;
    }
}

.add-button {
    margin-left: 1rem
}

.mssg {
    color: red;
    text-transform: uppercase;
    font-size: 1vw;
}
</style>