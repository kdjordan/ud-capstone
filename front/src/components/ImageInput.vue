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
                        <!-- {{option}} -->
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
      <br />
      <br />
      <br />
      <br />
      {{selectedGroup}}:
      <br />
      {{newGroup}}:
      <br />
      <br />
      <br />
      the{{getGroups}}:::
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
       try {
            if(this.newGroup !== '') {
                const newGroup = {
                    description: `${this.newGroup}`,
                    groupId: this.groups.length.toString(),
                    groupUrl: "none"
                }
                
                //add to dynamoDb Group table
                await this.$store.dispatch('addGroup', newGroup)
                this.groups.push(newGroup)
                
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
        // if(this.theImage == null) {
        //     this.mssg = 'No Image Selected'
        //     return
        // }
        // if(this.imageDesc == '') {
        //     this.mssg = 'No Image Description'
        //     return
        // }
        // if(this.selectedGroup == ''){
        //     this.mssg = 'No Group Selected'
        //     return
        // }
        try {
            //check if group exists -  if not function will add
            console.log("Selected group:", this.selectedGroup)

            // const uploadUrl = await this.$store.dispatch('getUrl')
            // console.log('uploadUrl is: ', uploadUrl)

            // const result = await this.$store.dispatch('putImage', imageObject)

            // const imageObject = {
            //     groupId: this.getGroupsOptions.length-1,
            //     imageDesc: this.imageDesc,
            // }

            // console.log("The imageObject result IS: ", result)
            // await this.$store.dispatch('putImage', imageObject)
        } catch(e) {
            console.log("Error uploading Image", `${e.message}`)
            throw Error(e)
        }
    }
},
computed: {
    ...mapGetters(['getGroups'])
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