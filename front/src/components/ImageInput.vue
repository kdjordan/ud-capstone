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
                <select v-model="selectedGroup">
                    <option v-for="(option, index) in getGroupsOptions" :key="index" :value="option['value']">
                        {{option['text']}}
                    </option>
                </select>
        </div>
        <div v-if="selectedGroup == 'new'">
            <label for="groups">New Group</label>
            <input type="text" name="groups" v-model="newGroup" :placeholder="errorMssg">
            <button @click="addGroup" class="add-button">ADD</button>
            <button class="add-button" @click="closeAddGroup">Cancel</button>
        </div>
        <input type="file" accept="image/*" @change="uploadImage($event)">
        <button class="add-button" type ="submit">Upload</button>
      </form>
      <!-- {{getGroupsOptions}}: -->
      <!-- {{selectedGroup}}: -->
      <!-- {{imageDesc}}: -->
  </div>
</template>

<script>
import { Auth } from 'aws-amplify'
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
data() {
    return {
        selectedGroup: {'value': '', 'text': ''},
        newGroup: '',
        theImage: null,
        imageDesc: '',
        errorMssg: ''
    }
},
methods: {
    addGroup() {
        if(this.newGroup !== '') {
            this.optionsArr.push({'value': this.newGroup.toLowerCase(), text: this.newGroup})
            this.selectedGroup = ''
        } else {
            this.errorMssg = 'CANNOT BE BLANK'
        }
    },
    closeAddGroup() {
        this.selectedGroup = {'value': '', 'text': ''}
        this.errorMssg = ''
    },
    uploadImage(e) {
        this.theImage = e.target.files[0]
    },
    async doUpload() {
        try {
            const session = await Auth.currentSession()
            const groupUpload = {
                groupId: this.getGroupsOptions.length,
                options : {text: this.selectedGroup, value: this.selectedGroup},
                theImage: this.theImage,
                imgeDesc: this.imageDesc,
                token: session.accessToken.jwtToken
            }
            console.log('UPLOAD', groupUpload)
            // await this.$store.dispatch('addGroup', )
        } catch(e) {
            console.log("Error uploading Image", `${e.message}`)
            throw Error(e)
        }
    }
},
computed: {
    ...mapGetters(['getGroupsOptions', 'getUser'])
}
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

input::placeholder {
    color: red;
}
</style>