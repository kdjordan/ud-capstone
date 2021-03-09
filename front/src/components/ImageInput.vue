<template>
  <div class="image-input">
      <h3>Upload a New Image</h3>
      <form @submit.prevent="doUpload">
        <div>
            <label for="imageDesc">Image Description</label>
            <input type="text" name="imageDesc" v-model="imageDesc">
        </div>
        <div>
            <label for="group-select">Choose a group:</label>
                <select v-model="selectedGroup" @change="clearMssg">
                    <option v-for="(option, index) in getGroups" :key="index" >
                        {{option.description}}
                    </option>
                </select>
        </div>
        <div v-if="selectedGroup === '>--Add a New group--<'">
            <label for="groups">New Group</label>
            <input type="text" name="groups" v-model="newGroup" @change="clearMssg">
            <button @click="addGroup" class="add-button">ADD</button>
            <button class="add-button" @click="closeAddGroup">Cancel</button>
        </div>
        <input type="file" accept="image/*" @change="uploadImage($event)">
        <button class="add-button" type ="submit" :disabled="mssg !== ''">Upload</button>
        <div v-if="mssg !== ''">
            <center class="mssg">{{mssg}}</center>
        </div>
      </form>
      <!-- <div v-for="(group, index) in getGroups" :key="index" >
          {{group}}<br/>
      </div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
data() {
    return {
        mssg: '',
        selectedGroup: '',
        newGroup: '',
        theImage: null,
        imageDesc: ''
    }
},
methods: {
    clearMssg() {
        this.mssg = ''
    },
    async addGroup() {
        const cleanedGroup = this.newGroup.trim().charAt(0).toUpperCase()+ this.newGroup.slice(1)
       try {
            if(this.newGroup !== '') {
                const theGroup = {
                    description: `${cleanedGroup}`,
                    groupId: this.getGroups.length.toString(),
                    groupUrl: "none"
                }
                //add to dynamoDb Group table
                await this.$store.dispatch('addGroup', theGroup)
                
                this.selectedGroup = ''
                this.newGroup = ''
            } else {
                this.mssg = 'NEW GROUP CANNOT BE BLANK'
            }
        } catch(e) {
            this.mssg = e
        }
    },
    closeAddGroup() {
        this.selectedGroup = ''
        this.errorMssg = ''
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
        if(this.selectedGroup == ''){
            this.mssg = 'No Group Selected'
            return
        }
        try {
            //get signedUrl for upload to s3
            const data = await this.$store.dispatch('getUrl')

            const imageObject = {
                theImage: this.theImage,
                imageType: this.theImage.type,
                uploadUrl: data.uploadUrl,
            }
            await this.$store.dispatch('putImage', imageObject)

            const groupId = this.getGroupId(this.selectedGroup)
            console.log("GroupId ", groupId)

            //add record to Groups with url
            const result = await this.$store.dispatch('createImageRecord', {
                description: this.imageDesc,
                imageId: data.imageId,
                userId: this.getUser.sub,
                groupId: groupId
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
    ...mapGetters(['getGroups', 'getUser'])
},
// created() {
//     this.groups = this.getGroups
// }
}
</script>

<style lang="scss">
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