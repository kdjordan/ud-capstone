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
                <button class="add-button" type ="submit" :disabled="mssg !== ''">Upload</button>
                <div v-if="mssg !== ''">
                    <center class="mssg">{{mssg}}</center>
                </div>
            </div>
      </form>
      <!-- {{panelActive}} -->
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
        panelActive: false
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
            console.log("url is ", data)
            //aadd image to S3
            await this.$store.dispatch('putImage', imageObject)

            //add record to Groups with url
            const result = await this.$store.dispatch('createImageRecord', {
                description: this.imageDesc,
                imageId: data.imageId,
            })

            console.log("The result IS: ", result)
        } catch(e) {
            console.log("Error uploading Image", `${e.message}`)
            throw Error(e)
        }
    },
    getGroupId(groupDesc) {
        const group = this.getGroups.filter(group => groupDesc == group.description)
        return group[0].groupId
    }
},
    computed: {
        ...mapGetters(['getUser'])
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
    // margin-top: 2rem;
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